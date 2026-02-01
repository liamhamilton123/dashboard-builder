# Dashboard Builder Backend

Backend server for AI-powered dashboard builder with Claude Agent SDK integration.

## Overview

This Node.js/Express backend provides:
- Real-time WebSocket communication for streaming AI responses
- Claude Agent SDK integration for AI-powered code generation
- Session-based ephemeral workspaces for file management
- Automatic file synchronization between Monaco editor and AI workspace

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **WebSocket**: ws library
- **AI**: Claude Agent SDK (@anthropic-ai/claude-agent-sdk)
- **Development**: tsx + nodemon for hot reload

## Setup

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Add your Anthropic API key to .env
# Edit .env and set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Environment Variables

```bash
PORT=2000                           # Server port
NODE_ENV=development               # Environment (development/production)
CORS_ORIGIN=http://localhost:2500  # Frontend URL
ANTHROPIC_API_KEY=sk-ant-...       # Your Claude API key (required)
WORKSPACE_BASE_PATH=/tmp/sessions  # Where to store session workspaces
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Type check without building
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

The server will start on http://localhost:2000 with WebSocket endpoint at ws://localhost:2000/ws/chat

## API Endpoints

### HTTP Endpoints

- `GET /health` - Health check endpoint

### WebSocket Endpoint

- `ws://localhost:2000/ws/chat` - Real-time chat with Claude

## WebSocket Protocol

### Client → Server Messages

**Initialize Session:**
```json
{
  "type": "init",
  "sessionId": "unique-session-id",
  "files": {
    "Dashboard.tsx": "// code here..."
  }
}
```

**Send Chat Message:**
```json
{
  "type": "message",
  "sessionId": "unique-session-id",
  "message": "Add a bar chart showing sales data",
  "files": {
    "Dashboard.tsx": "// updated code..."
  }
}
```

**Stop Generation (optional):**
```json
{
  "type": "stop",
  "sessionId": "unique-session-id"
}
```

### Server → Client Events

**Connected:**
```json
{
  "type": "connected",
  "message": "Connected to dashboard builder backend"
}
```

**Streaming Text:**
```json
{
  "type": "stream",
  "sessionId": "unique-session-id",
  "delta": "I'll add a bar chart..."
}
```

**Tool Execution Start:**
```json
{
  "type": "tool_start",
  "sessionId": "unique-session-id",
  "tool": "Edit",
  "input": { "file": "Dashboard.tsx", ... }
}
```

**Tool Execution Result:**
```json
{
  "type": "tool_result",
  "sessionId": "unique-session-id",
  "tool": "Edit",
  "result": "..."
}
```

**Completion:**
```json
{
  "type": "complete",
  "sessionId": "unique-session-id",
  "message": "I've added the bar chart...",
  "files": {
    "Dashboard.tsx": "// updated code with bar chart..."
  }
}
```

**Error:**
```json
{
  "type": "error",
  "sessionId": "unique-session-id",
  "error": "ClaudeAPIError",
  "message": "Rate limit exceeded"
}
```

## Architecture

### Directory Structure

```
backend/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── config/
│   │   └── env.ts            # Environment configuration
│   ├── middleware/
│   │   ├── cors.ts           # CORS configuration
│   │   └── errorHandler.ts  # Global error handling
│   ├── routes/
│   │   └── health.ts         # Health check endpoint
│   ├── websocket/
│   │   ├── server.ts         # WebSocket server setup
│   │   ├── handlers.ts       # Message routing and handlers
│   │   └── types.ts          # WebSocket message types
│   ├── services/
│   │   ├── claudeAgent.ts    # Claude SDK integration
│   │   ├── workspaceManager.ts  # Workspace lifecycle
│   │   └── sessionManager.ts    # Session tracking
│   └── utils/
│       ├── fileSync.ts       # File synchronization
│       ├── validators.ts     # Security validation
│       └── logger.ts         # Logging utility
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Key Components

**Workspace Manager** (`services/workspaceManager.ts`)
- Creates ephemeral directories in `/tmp/sessions/{sessionId}`
- Manages workspace lifecycle
- Cleanup of old workspaces (24 hour TTL)

**Claude Agent** (`services/claudeAgent.ts`)
- Wraps Claude Agent SDK with streaming support
- Configures allowed tools (Read, Edit, Write, Glob, Grep)
- Auto-approves file edits (`acceptEdits` mode)
- Streams events as async generator

**WebSocket Server** (`websocket/server.ts`)
- Manages client connections
- Heartbeat/ping-pong for connection health
- Routes messages to handlers

**Message Handlers** (`websocket/handlers.ts`)
- Validates and routes client messages
- Coordinates file sync, workspace, and Claude interactions
- Streams AI responses to clients

## Security

**Implemented Security Measures:**
- Session ID validation (alphanumeric + dash/underscore only)
- Path validation to prevent directory traversal
- File size limits (1MB per file, 10,000 char messages)
- Workspace isolation (each session gets its own directory)
- Bash tool disabled (only safe file tools allowed)
- No sensitive data in logs (API keys redacted)

**Production Considerations:**
- Add rate limiting
- Add authentication/authorization
- Use persistent storage instead of /tmp
- Implement session cleanup cron job
- Add metrics and monitoring
- Use WSS (WebSocket Secure) with TLS

## Testing

### Manual Testing

**1. Start the server:**
```bash
npm run dev
```

**2. Test health endpoint:**
```bash
curl http://localhost:2000/health
```

**3. Test WebSocket (in browser console):**
```javascript
const ws = new WebSocket('ws://localhost:2000/ws/chat');

ws.onopen = () => {
  console.log('Connected');

  // Initialize session
  ws.send(JSON.stringify({
    type: 'init',
    sessionId: 'test123',
    files: {
      'Dashboard.tsx': 'const Dashboard = () => <div>Hello</div>;'
    }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('Received:', data);
};

// Send a chat message
ws.send(JSON.stringify({
  type: 'message',
  sessionId: 'test123',
  message: 'Add a comment to the code'
}));
```

## Troubleshooting

**Server won't start:**
- Check that port 2000 is available
- Verify ANTHROPIC_API_KEY is set in .env
- Run `npm install` to ensure dependencies are installed

**WebSocket connection fails:**
- Check CORS_ORIGIN matches your frontend URL
- Verify the WebSocket path is `/ws/chat`
- Check browser console for errors

**Claude API errors:**
- Verify your API key is valid
- Check for rate limits (see Anthropic console)
- Ensure API key has sufficient credits

**Files not syncing:**
- Check session ID matches between init and message
- Verify file paths don't contain invalid characters
- Check workspace directory has write permissions

## Development Notes

- The server uses TypeScript with strict mode enabled
- Hot reload is enabled via nodemon + tsx
- Sessions are ephemeral and stored in `/tmp/sessions`
- Claude conversations maintain context via `resume: sessionId`
- File edits are auto-approved (`acceptEdits` mode)

## License

ISC
