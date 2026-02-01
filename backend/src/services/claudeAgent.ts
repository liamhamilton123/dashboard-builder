import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { syncFilesFromWorkspace } from '../utils/fileSync.js';

export interface StreamEvent {
  type: 'stream' | 'tool_start' | 'tool_result' | 'complete' | 'error';
  delta?: string;
  tool?: string;
  input?: unknown;
  result?: unknown;
  message?: string;
  files?: Record<string, string>;
  error?: string;
}

// Track conversation history per session
const sessionHistory = new Map<string, Anthropic.MessageParam[]>();

/**
 * Build system prompt for the dashboard builder context
 */
function buildSystemPrompt(): string {
  return `You are an AI assistant helping users build React dashboards with data visualization.

**Context:**
- You are working in a React + TypeScript environment
- The user has uploaded CSV/Excel data that they want to visualize
- Available libraries: React 18, Recharts (for charts)
- The code runs in a sandboxed iframe with client-side compilation (Sucrase)
- The primary file is Dashboard.tsx which contains the dashboard component

**Your role:**
- Help users create visualizations based on their data
- Provide complete, working React code
- Use Recharts components (BarChart, LineChart, PieChart, AreaChart, ScatterChart, etc.)
- Write clean, functional React code with TypeScript
- Keep the code simple and focused on the visualization
- Always export a default Dashboard component

**Guidelines:**
- Provide complete code that can be directly rendered
- Use appropriate TypeScript types
- Make the dashboard responsive and visually appealing
- Use proper Recharts components with appropriate props
- Include proper data formatting for charts
- Keep code concise and readable`;
}

/**
 * Chat with Claude and stream responses
 * This is an async generator that yields events as they arrive
 */
export async function* chatWithClaude(
  sessionId: string,
  message: string,
  workspacePath: string
): AsyncGenerator<StreamEvent> {
  try {
    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: env.anthropicApiKey,
    });

    // Get or initialize conversation history
    let history = sessionHistory.get(sessionId);
    if (!history) {
      history = [];
      sessionHistory.set(sessionId, history);
    }

    // Read current files from workspace for context
    let filesContext = '';
    try {
      const files = await syncFilesFromWorkspace(workspacePath);
      if (Object.keys(files).length > 0) {
        filesContext = '\n\n**Current files:**\n';
        for (const [filename, content] of Object.entries(files)) {
          filesContext += `\n### ${filename}\n\`\`\`typescript\n${content}\n\`\`\`\n`;
        }
      }
    } catch (err) {
      console.warn('[Claude] Could not read workspace files:', err);
    }

    // Add user message to history with file context
    const userMessage = filesContext
      ? `${message}${filesContext}`
      : message;

    history.push({
      role: 'user',
      content: userMessage,
    });

    // Stream response from Claude
    let fullResponse = '';

    const stream = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      system: buildSystemPrompt(),
      messages: history,
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          const text = event.delta.text;
          fullResponse += text;

          yield {
            type: 'stream',
            delta: text,
          };
        }
      } else if (event.type === 'message_stop') {
        // Message completed
        break;
      }
    }

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: fullResponse,
    });

    // Extract code blocks from response and write to workspace
    await updateWorkspaceFromResponse(fullResponse, workspacePath);

    // Read updated files
    const updatedFiles = await syncFilesFromWorkspace(workspacePath);

    // Send complete event
    yield {
      type: 'complete',
      message: fullResponse,
      files: updatedFiles,
    };
  } catch (error) {
    console.error('[Claude] Chat error:', error);
    yield {
      type: 'error',
      error: (error as Error).message || 'Failed to process message',
    };
  }
}

/**
 * Extract code from Claude's response and update workspace files
 */
async function updateWorkspaceFromResponse(
  response: string,
  workspacePath: string
): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  // Find TypeScript/TSX code blocks
  const codeBlockRegex = /```(?:typescript|tsx|ts)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const code = match[1];

    // If the code looks like a complete Dashboard component, write it
    if (code.includes('export default') || code.includes('function Dashboard') || code.includes('const Dashboard')) {
      const filePath = path.join(workspacePath, 'Dashboard.tsx');

      try {
        await fs.writeFile(filePath, code, 'utf-8');
        console.log('[Claude] Updated Dashboard.tsx from response');
      } catch (error) {
        console.error('[Claude] Failed to write Dashboard.tsx:', error);
      }
    }
  }
}

/**
 * Clear session history
 */
export function clearSessionHistory(sessionId: string): void {
  sessionHistory.delete(sessionId);
  console.log(`[Claude] Cleared history for session ${sessionId}`);
}
