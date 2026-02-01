/**
 * WebSocket Message Types
 */

// Client → Server messages
export interface InitMessage {
  type: 'init';
  sessionId: string;
  files: Record<string, string>;
}

export interface ChatMessage {
  type: 'message';
  sessionId: string;
  message: string;
  files?: Record<string, string>;
}

export interface StopMessage {
  type: 'stop';
  sessionId: string;
}

export type ClientMessage = InitMessage | ChatMessage | StopMessage;

// Server → Client events
export interface StreamEvent {
  type: 'stream';
  sessionId: string;
  delta: string;
}

export interface ToolStartEvent {
  type: 'tool_start';
  sessionId: string;
  tool: string;
  input: unknown;
}

export interface ToolResultEvent {
  type: 'tool_result';
  sessionId: string;
  tool: string;
  result: unknown;
}

export interface CompleteEvent {
  type: 'complete';
  sessionId: string;
  message: string;
  files: Record<string, string>;
}

export interface ErrorEvent {
  type: 'error';
  sessionId: string;
  error: string;
  message: string;
}

export interface ConnectedEvent {
  type: 'connected';
  message: string;
}

export type ServerEvent =
  | StreamEvent
  | ToolStartEvent
  | ToolResultEvent
  | CompleteEvent
  | ErrorEvent
  | ConnectedEvent;

/**
 * Type guards
 */
export function isInitMessage(msg: unknown): msg is InitMessage {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (msg as InitMessage).type === 'init' &&
    typeof (msg as InitMessage).sessionId === 'string' &&
    typeof (msg as InitMessage).files === 'object'
  );
}

export function isChatMessage(msg: unknown): msg is ChatMessage {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (msg as ChatMessage).type === 'message' &&
    typeof (msg as ChatMessage).sessionId === 'string' &&
    typeof (msg as ChatMessage).message === 'string'
  );
}

export function isStopMessage(msg: unknown): msg is StopMessage {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (msg as StopMessage).type === 'stop' &&
    typeof (msg as StopMessage).sessionId === 'string'
  );
}
