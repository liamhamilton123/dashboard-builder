import { WebSocket } from 'ws';
import { WebSocketConnection, sendMessage } from './server.js';
import {
  ClientMessage,
  InitMessage,
  ChatMessage,
  StopMessage,
  isInitMessage,
  isChatMessage,
  isStopMessage,
  ErrorEvent,
} from './types.js';
import { validateSessionId, validateMessage, validateFilesObject } from '../utils/validators.js';
import { syncFilesToWorkspace } from '../utils/fileSync.js';
import { workspaceManager } from '../services/workspaceManager.js';
import { sessionManager } from '../services/sessionManager.js';
import { chatWithClaude } from '../services/claudeAgent.js';

/**
 * Handle incoming client messages
 */
export async function handleClientMessage(
  ws: WebSocket,
  message: unknown,
  connection: WebSocketConnection
): Promise<void> {
  // Validate message structure
  if (!message || typeof message !== 'object') {
    sendErrorMessage(ws, 'unknown', 'InvalidMessage', 'Invalid message format');
    return;
  }

  const clientMessage = message as ClientMessage;

  // Route to appropriate handler
  switch (clientMessage.type) {
    case 'init':
      if (isInitMessage(clientMessage)) {
        await handleInit(ws, clientMessage, connection);
      } else {
        sendErrorMessage(ws, 'unknown', 'InvalidInitMessage', 'Invalid init message');
      }
      break;

    case 'message':
      if (isChatMessage(clientMessage)) {
        await handleChatMessage(ws, clientMessage, connection);
      } else {
        sendErrorMessage(ws, 'unknown', 'InvalidChatMessage', 'Invalid chat message');
      }
      break;

    case 'stop':
      if (isStopMessage(clientMessage)) {
        await handleStop(ws, clientMessage, connection);
      } else {
        sendErrorMessage(ws, 'unknown', 'InvalidStopMessage', 'Invalid stop message');
      }
      break;

    default:
      sendErrorMessage(
        ws,
        connection.sessionId || 'unknown',
        'UnknownMessageType',
        `Unknown message type: ${(clientMessage as any).type}`
      );
  }
}

/**
 * Handle session initialization
 */
async function handleInit(
  ws: WebSocket,
  message: InitMessage,
  connection: WebSocketConnection
): Promise<void> {
  const { sessionId, files } = message;

  // Validate session ID
  if (!validateSessionId(sessionId)) {
    sendErrorMessage(ws, sessionId, 'InvalidSessionId', 'Session ID contains invalid characters');
    return;
  }

  // Validate files
  if (!validateFilesObject(files)) {
    sendErrorMessage(ws, sessionId, 'InvalidFiles', 'Invalid files object');
    return;
  }

  try {
    // Create or get workspace
    const workspacePath = await workspaceManager.getOrCreateWorkspace(sessionId);

    // Sync files to workspace
    await syncFilesToWorkspace(workspacePath, files);

    // Create or update session
    if (!sessionManager.hasSession(sessionId)) {
      sessionManager.createSession(sessionId, workspacePath);
    } else {
      sessionManager.updateActivity(sessionId);
    }

    // Update connection
    connection.sessionId = sessionId;

    console.log(`[Handler] Initialized session ${sessionId} with ${Object.keys(files).length} files`);

    // Send confirmation (optional - client can just start sending messages)
    sendMessage(ws, {
      type: 'complete',
      sessionId,
      message: 'Session initialized',
      files,
    });

  } catch (error) {
    console.error('[Handler] Init error:', error);
    sendErrorMessage(
      ws,
      sessionId,
      'InitError',
      `Failed to initialize session: ${(error as Error).message}`
    );
  }
}

/**
 * Handle chat message
 */
async function handleChatMessage(
  ws: WebSocket,
  message: ChatMessage,
  connection: WebSocketConnection
): Promise<void> {
  const { sessionId, message: userMessage, files } = message;

  // Validate session ID
  if (!validateSessionId(sessionId)) {
    sendErrorMessage(ws, sessionId, 'InvalidSessionId', 'Session ID contains invalid characters');
    return;
  }

  // Validate message
  if (!validateMessage(userMessage)) {
    sendErrorMessage(ws, sessionId, 'InvalidMessage', 'Message is empty or too long');
    return;
  }

  // Validate files if provided
  if (files && !validateFilesObject(files)) {
    sendErrorMessage(ws, sessionId, 'InvalidFiles', 'Invalid files object');
    return;
  }

  try {
    // Get or create workspace
    const workspacePath = await workspaceManager.getOrCreateWorkspace(sessionId);

    // Sync files if provided
    if (files && Object.keys(files).length > 0) {
      await syncFilesToWorkspace(workspacePath, files);
    }

    // Update session activity
    if (!sessionManager.hasSession(sessionId)) {
      sessionManager.createSession(sessionId, workspacePath);
    } else {
      sessionManager.updateActivity(sessionId);
    }

    // Update connection
    connection.sessionId = sessionId;

    console.log(`[Handler] Processing chat message for session ${sessionId}`);

    // Stream response from Claude
    for await (const event of chatWithClaude(sessionId, userMessage, workspacePath)) {
      // Map event to WebSocket message format
      switch (event.type) {
        case 'stream':
          sendMessage(ws, {
            type: 'stream',
            sessionId,
            delta: event.delta,
          });
          break;

        case 'tool_start':
          sendMessage(ws, {
            type: 'tool_start',
            sessionId,
            tool: event.tool,
            input: event.input,
          });
          break;

        case 'tool_result':
          sendMessage(ws, {
            type: 'tool_result',
            sessionId,
            tool: event.tool,
            result: event.result,
          });
          break;

        case 'complete':
          sendMessage(ws, {
            type: 'complete',
            sessionId,
            message: event.message || '',
            files: event.files || {},
          });
          break;

        case 'error':
          sendErrorMessage(ws, sessionId, 'ClaudeError', event.error || 'Unknown error');
          break;
      }
    }

  } catch (error) {
    console.error('[Handler] Chat error:', error);
    sendErrorMessage(
      ws,
      sessionId,
      'ChatError',
      `Failed to process message: ${(error as Error).message}`
    );
  }
}

/**
 * Handle stop message (for future implementation)
 */
async function handleStop(
  ws: WebSocket,
  message: StopMessage,
  connection: WebSocketConnection
): Promise<void> {
  const { sessionId } = message;

  console.log(`[Handler] Stop requested for session ${sessionId}`);

  // For MVP, this is a no-op since we can't easily stop the Claude SDK mid-stream
  // In production, you'd want to implement cancellation tokens
  sendMessage(ws, {
    type: 'complete',
    sessionId,
    message: 'Stop requested (not implemented yet)',
    files: {},
  });
}

/**
 * Send error message to client
 */
function sendErrorMessage(
  ws: WebSocket,
  sessionId: string,
  error: string,
  message: string
): void {
  const errorEvent: ErrorEvent = {
    type: 'error',
    sessionId,
    error,
    message,
  };

  sendMessage(ws, errorEvent);
}
