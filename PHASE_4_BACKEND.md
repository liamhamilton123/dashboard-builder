# Phase 4 Backend Implementation Plan - Simplified MVP

## Overview

This document outlines the step-by-step implementation plan for the **backend portion** of Phase 4: AI-Powered Code Generation using Claude Agent SDK.

**Goal**: Build a lightweight Node.js/Express backend that enables real-time AI-powered dashboard code generation through Claude Agent SDK, with streaming responses.

**Simplified MVP Approach**:
- ✅ Single shared Claude API key (no user-provided keys)
- ✅ No authentication required initially
- ✅ Focus on core Claude SDK integration
- ✅ Add auth/multi-user support later if needed

---

## Prerequisites

- Phase 1 & 2 completed (data upload + Monaco editor working)
- Claude API key for the application
- Node.js 18+ installed
- Basic understanding of WebSockets

---

## Quick Start (Minimum Viable Backend)

The absolute minimum to get started:

1. **Install dependencies**:
   ```bash
   npm install express cors dotenv ws @anthropic-ai/claude-agent-sdk
   npm install -D typescript tsx nodemon @types/express @types/ws @types/node
   ```

2. **Create `.env`**:
   ```bash
   PORT=3000
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   CORS_ORIGIN=http://localhost:2500
   ```

3. **Build core files** (see phases below):
   - `src/server.ts` - Express + WebSocket server
   - `src/services/claudeAgent.ts` - Claude SDK wrapper
   - `src/services/workspaceManager.ts` - File workspace management
   - `src/utils/fileSync.ts` - Sync files between frontend and workspace

4. **Start server**: `npm run dev`

5. **Connect frontend** via WebSocket to `ws://localhost:3000/ws/chat`

That's it! Follow the detailed phases below for full implementation.

---

## Implementation Timeline

**Estimated Duration**: ~2 weeks

**Core Phases** (Required for MVP):
- 4.1: Backend Foundation (2 days)
- 4.2: Workspace Management (2 days)
- 4.3: Claude Agent SDK Integration (3 days)
- 4.4: WebSocket Server (3 days)

**Optional Phases** (Can add later):
- 4.5: Error Handling & Logging (2 days)
- 4.6: Testing & Validation (2 days)
- 4.7: Documentation (as needed)

**Total Core Implementation**: ~10 days

---

## Implementation Phases

### Phase 4.1: Backend Foundation (Week 1, Days 1-2)

**Goal**: Set up basic Node.js/Express server with TypeScript

#### Steps

1. **Initialize Backend Project**
   - [ ] Create `/backend` directory in project root
   - [ ] Run `npm init -y` to create package.json
   - [ ] Install core dependencies:
     ```bash
     npm install express cors dotenv ws
     npm install -D typescript @types/express @types/cors @types/ws @types/node tsx nodemon
     ```
   - [ ] Create `tsconfig.json` for backend
   - [ ] Set up npm scripts in `package.json`:
     - `dev`: nodemon with tsx for hot reload
     - `build`: TypeScript compilation
     - `start`: Run compiled JavaScript

2. **Create Basic Server Structure**
   - [ ] Create `src/server.ts` with Express app initialization
   - [ ] Add CORS middleware (allow frontend origin: `http://localhost:2500`)
   - [ ] Add JSON body parser middleware
   - [ ] Create health check endpoint: `GET /health`
   - [ ] Add basic error handling middleware
   - [ ] Test server starts on port 3000

3. **Environment Configuration**
   - [ ] Create `.env.example` with required variables
   - [ ] Create `.env` (gitignored) with actual values
   - [ ] Create `src/config/env.ts` to load and validate environment variables
   - [ ] Add variables:
     - `PORT=3000`
     - `NODE_ENV=development`
     - `CORS_ORIGIN=http://localhost:2500`
     - `ANTHROPIC_API_KEY=sk-ant-...` (your Claude API key)

4. **Project Structure Setup**
   - [ ] Create directory structure:
     ```
     backend/
     ├── src/
     │   ├── server.ts
     │   ├── config/
     │   │   └── env.ts
     │   ├── middleware/
     │   ├── routes/
     │   ├── services/
     │   └── utils/
     ├── .env
     ├── .env.example
     ├── .gitignore
     ├── package.json
     └── tsconfig.json
     ```

**Deliverable**: Working Express server with health check endpoint

---

### Phase 4.2: Workspace Management (Week 1, Days 3-4)

**Goal**: Create ephemeral file system for sessions

#### Steps

1. **Create Workspace Manager Service**
   - [ ] Create `src/services/workspaceManager.ts`
   - [ ] Implement workspace path generation:
     ```typescript
     getWorkspacePath(sessionId: string): string {
       return `/tmp/sessions/${sessionId}`
     }
     ```
   - [ ] Implement `createWorkspace(sessionId): Promise<string>`
     - Create directory structure
     - Set appropriate permissions
     - Return workspace path

2. **Implement File Synchronization**
   - [ ] Create `src/utils/fileSync.ts`
   - [ ] Implement `syncFilesToWorkspace(workspacePath, files)`:
     - Write files from frontend to workspace
     - Create subdirectories if needed
     - Handle special characters in filenames
   - [ ] Implement `syncFilesFromWorkspace(workspacePath)`:
     - Read all files from workspace
     - Return as object: `{ 'file.tsx': 'content', ... }`
     - Filter out system files (.DS_Store, etc.)

3. **Workspace Cleanup**
   - [ ] Implement `deleteWorkspace(workspacePath): Promise<void>`
   - [ ] Create cleanup cron job (optional for MVP):
     - Run every hour
     - Delete workspaces older than 24 hours
     - Track last modified time of workspace files

4. **File Path Security**
   - [ ] Implement `validateFilePath(filePath, workspacePath): boolean`
   - [ ] Prevent directory traversal attacks (../../../etc/passwd)
   - [ ] Ensure all file operations stay within workspace
   - [ ] Test security with malicious paths

**Deliverable**: Isolated file system workspace per session

---

### Phase 4.3: Claude Agent SDK Integration (Week 1, Days 5-7)

**Goal**: Integrate Claude Agent SDK with streaming support

#### Steps

1. **Install Claude Agent SDK**
   - [ ] Install package: `npm install @anthropic-ai/claude-agent-sdk`
   - [ ] Review SDK documentation
   - [ ] Test basic SDK functionality with sample code

2. **Create Claude Agent Service**
   - [ ] Create `src/services/claudeAgent.ts`
   - [ ] Import `query` from SDK
   - [ ] Implement base configuration:
     ```typescript
     {
       cwd: workspacePath,
       allowedTools: ["Read", "Edit", "Write", "Glob", "Grep"],
       disallowedTools: ["Bash"],
       permissionMode: "acceptEdits",
       includePartialMessages: true
     }
     ```

3. **Implement Streaming Chat Function**
   - [ ] Create async generator function:
     ```typescript
     async function* chatWithClaude(
       sessionId: string,
       message: string,
       files: Record<string, string>
     )
     ```
   - [ ] Set up workspace and sync files
   - [ ] Use `ANTHROPIC_API_KEY` from environment (already set globally)
   - [ ] Call `query()` with user message
   - [ ] Yield streaming events as they arrive
   - [ ] Return final result with modified files

4. **Handle Different Event Types**
   - [ ] Process `content_block_delta` events (text streaming)
   - [ ] Process `tool_use` events (show tool usage)
   - [ ] Process `tool_result` events
   - [ ] Handle errors and exceptions
   - [ ] Track message count per session

5. **Implement Session Resumption**
   - [ ] Add `resume: sessionId` to query options
   - [ ] Test conversation continuity across multiple messages
   - [ ] Verify Claude remembers context from previous messages

6. **Add File Checkpointing (Optional for MVP)**
   - [ ] Enable `enableFileCheckpointing: true`
   - [ ] Store checkpoint UUIDs in session metadata
   - [ ] Implement rewind functionality for undo

**Deliverable**: Working Claude Agent SDK integration with streaming

---

### Phase 4.4: WebSocket Server for Real-Time Communication (Week 2, Days 1-3)

**Goal**: Build WebSocket endpoint for streaming chat

#### Steps

1. **Set Up WebSocket Server**
   - [ ] Create `src/routes/websocket.ts`
   - [ ] Initialize WebSocket server with Express
   - [ ] Handle connection upgrades
   - [ ] Add connection logging

2. **Implement Connection Handler**
   - [ ] Store sessionId in WebSocket connection metadata
   - [ ] Handle connection errors
   - [ ] Implement heartbeat/ping-pong for connection health
   - [ ] Log connections/disconnections

3. **Handle Incoming Messages**
   - [ ] Create message type handlers:
     - `init`: Initialize session with files
     - `message`: Send chat message to Claude
     - `stop`: Stop ongoing generation
   - [ ] Validate message format
   - [ ] Add error handling for malformed messages

4. **Implement Streaming Response Flow**
   - [ ] On `message` event:
     - Create/resume session
     - Call `chatWithClaude()` generator
     - Stream events to client via WebSocket
   - [ ] Send different event types:
     - `stream`: Real-time text deltas
     - `tool_start`: Tool usage indicator
     - `tool_result`: Tool completion
     - `complete`: Final response with updated files
     - `error`: Error messages

5. **Handle File Synchronization**
   - [ ] After Claude completes:
     - Read modified files from workspace
     - Send updated file contents to client
     - Keep track of files in memory (optional)

6. **Connection Cleanup**
   - [ ] Handle WebSocket close events
   - [ ] Clean up any in-progress operations
   - [ ] Log disconnections
   - [ ] Optionally clean up workspace files

**Deliverable**: Real-time WebSocket chat with Claude

---

### Phase 4.5: Error Handling & Logging (Week 2, Days 4-5)

**Goal**: Robust error handling and logging system

#### Steps

1. **Create Error Handler Middleware**
   - [ ] Create `src/middleware/errorHandler.ts`
   - [ ] Implement global error handler
   - [ ] Format errors consistently:
     ```typescript
     {
       error: string,
       message: string,
       code: string,
       details?: object
     }
     ```
   - [ ] Map error types to HTTP status codes
   - [ ] Never expose sensitive info in errors

2. **Add Logging System**
   - [ ] Install logger: `npm install winston`
   - [ ] Create `src/utils/logger.ts`
   - [ ] Configure log levels (debug, info, warn, error)
   - [ ] Add request logging middleware
   - [ ] Log to file in production, console in dev

3. **Implement Custom Error Classes**
   - [ ] Create `src/utils/errors.ts`
   - [ ] Define error types:
     - `SessionNotFoundError`
     - `WorkspaceError`
     - `ClaudeAPIError`
     - `InvalidRequestError`
   - [ ] Include error codes for frontend handling

4. **Add Error Recovery**
   - [ ] Retry logic for transient failures
   - [ ] Graceful degradation for API errors
   - [ ] Fallback responses when Claude is unavailable

5. **Security Logging**
   - [ ] Log WebSocket connection attempts
   - [ ] Never log API keys or sensitive data
   - [ ] Log Claude API errors
   - [ ] Log workspace access attempts

**Deliverable**: Production-ready error handling and logging

---

### Phase 4.6: Testing & Validation (Week 2, Days 6-7)

**Goal**: Comprehensive testing of backend functionality

#### Steps

1. **Unit Tests**
   - [ ] Install testing framework: `npm install -D jest @types/jest ts-jest`
   - [ ] Test file sync functions
   - [ ] Test workspace path validation
   - [ ] Test error formatters
   - [ ] Test workspace manager functions

2. **Integration Tests**
   - [ ] Test WebSocket connection lifecycle
   - [ ] Test workspace creation and cleanup
   - [ ] Test file synchronization flow

3. **E2E Tests with Claude SDK**
   - [ ] Test streaming chat flow end-to-end
   - [ ] Test session resumption
   - [ ] Test file synchronization
   - [ ] Test tool usage (Read, Edit, Write)
   - [ ] Test error scenarios (network errors, Claude API errors)

4. **Load Testing (Optional for MVP)**
   - [ ] Test concurrent WebSocket connections
   - [ ] Test multiple sessions simultaneously
   - [ ] Monitor memory usage during long sessions
   - [ ] Test workspace cleanup under load

5. **Security Testing**
   - [ ] Test directory traversal prevention
   - [ ] Verify API key is never exposed in responses
   - [ ] Test CORS configuration
   - [ ] Test malicious file paths

**Deliverable**: Well-tested backend

---

### Phase 4.7: Documentation (Optional)

**Goal**: Basic documentation for the backend

#### Steps

1. **API Documentation**
   - [ ] Document WebSocket message formats
   - [ ] Create API usage examples
   - [ ] Document error codes and responses

2. **Environment Setup Documentation**
   - [ ] Document all environment variables
   - [ ] Create setup guide for local development
   - [ ] Document Claude API key configuration

3. **Basic Security** (Optional for MVP)
   - [ ] Add rate limiting middleware (optional)
   - [ ] Configure helmet.js for security headers
   - [ ] Review CORS settings
   - [ ] Add request size limits

**Deliverable**: Documented backend ready for frontend integration

---

## File Structure Reference

```
backend/
├── src/
│   ├── server.ts                      # Express app initialization
│   │
│   ├── config/
│   │   └── env.ts                    # Environment variable validation
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts           # Global error handling
│   │   └── requestLogger.ts          # Request logging (optional)
│   │
│   ├── routes/
│   │   ├── health.ts                 # Health check endpoint
│   │   └── websocket.ts              # WebSocket chat endpoint
│   │
│   ├── services/
│   │   ├── claudeAgent.ts            # Claude Agent SDK wrapper
│   │   └── workspaceManager.ts       # File workspace operations
│   │
│   └── utils/
│       ├── fileSync.ts               # Editor-workspace sync
│       ├── logger.ts                 # Winston logger (optional)
│       └── errors.ts                 # Custom error classes
│
├── tests/                             # Optional for MVP
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints Summary

### WebSocket
- `WS /ws/chat` - WebSocket endpoint for streaming chat with Claude
  - Accepts: `{ type: 'init' | 'message' | 'stop', sessionId, message?, files? }`
  - Sends: Stream events, tool indicators, final results, errors

### Health
- `GET /health` - Server health check

---

## Dependencies Checklist

### Production Dependencies (Required)
- [ ] `express` - Web server framework
- [ ] `cors` - CORS middleware
- [ ] `dotenv` - Environment variables
- [ ] `ws` - WebSocket server
- [ ] `@anthropic-ai/claude-agent-sdk` - Claude integration

### Production Dependencies (Optional)
- [ ] `winston` - Logging (can use console.log initially)
- [ ] `helmet` - Security headers

### Development Dependencies
- [ ] `typescript` - Type safety
- [ ] `@types/express` - Express types
- [ ] `@types/cors` - CORS types
- [ ] `@types/ws` - WebSocket types
- [ ] `@types/node` - Node.js types
- [ ] `tsx` - TypeScript execution
- [ ] `nodemon` - Development auto-reload

---

## Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:2500

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Workspace Configuration (Optional)
WORKSPACE_CLEANUP_HOURS=24
```

---

## Success Metrics

### Performance
- [ ] WebSocket connection establishment: < 500ms
- [ ] First streaming response from Claude: < 2 seconds
- [ ] File sync to workspace: < 500ms
- [ ] Session resumption: < 1 second

### Reliability
- [ ] Server starts successfully
- [ ] WebSocket connection stability: > 95%
- [ ] Claude SDK integration works end-to-end

### Security
- [ ] API key never exposed in logs or responses
- [ ] Directory traversal attempts blocked: 100%
- [ ] CORS properly configured

---

## Next Steps After Backend Completion

Once the core backend is working (Phases 4.1-4.4), proceed to:

1. **Frontend Integration**:
   - Build chat UI components (`ChatPanel`, `ChatMessage`, `StreamingText`)
   - Implement WebSocket client (`src/services/chatService.ts`)
   - Add streaming text display with real-time updates
   - Sync file changes from Claude back to Monaco editor
   - Add tool usage indicators (show when Claude is editing files)

2. **End-to-End Testing**:
   - Test full flow: upload data → chat with Claude → see code update → preview works
   - Test Claude code generation quality with various prompts
   - Test session resumption (conversation continuity)

3. **Future Enhancements** (Optional):
   - Add authentication (Firebase or other)
   - Multi-user support with per-user workspaces
   - Rate limiting
   - Production deployment
   - Monitoring and analytics

---

## Notes

- **Simplified MVP**: No authentication, single shared Claude API key
- Use `acceptEdits` permission mode for automatic file approval
- WebSocket for real-time streaming from Claude
- All file operations stay within session workspace (`/tmp/sessions/{sessionId}`)
- API key stays on server, never sent to frontend
- Add authentication later when needed for multi-user support

---

## Risk Mitigation

### Risk: Claude API downtime
**Mitigation**: Show clear error messages, implement basic retry logic

### Risk: WebSocket connection drops
**Mitigation**: Frontend automatic reconnection, session resumption via Claude SDK

### Risk: Disk space from workspaces
**Mitigation**: Optional cleanup cron job for old workspaces (24+ hours)

### Risk: API key leakage
**Mitigation**: Store in .env (never in code), never log it, never send to frontend

### Risk: Malicious file operations
**Mitigation**: Path validation, workspace isolation, no Bash tool access in Claude SDK
