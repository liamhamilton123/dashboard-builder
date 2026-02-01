# Dashboard Builder - Architecture & Implementation Plan

## Project Overview

An enterprise dashboard prototyping tool that allows users to upload data (CSV/Excel), generate React visualizations through code or natural language, and preview them in real-time.

**Core Concept**: A "React app within a React app" - users edit a single component file that gets compiled and rendered in an isolated preview environment.

## MVP Scope & Simplifications

### What's Included in MVP
✅ **Phase 1**: Data upload (CSV/Excel) with preview - COMPLETED
✅ **Phase 2**: Monaco code editor with live preview - COMPLETED
🔲 **Phase 3**: Advanced visualizations (Recharts, dashboard templates)
🔲 **Phase 4**: AI chat interface powered by Claude Agent SDK
🔲 **Phase 4**: Real-time streaming responses from Claude
🔲 **Phase 4**: User's own Claude API key (stored securely)
🔲 **Phase 4**: File synchronization between editor and Claude

### What's NOT Included in MVP (Future Enhancements)
❌ Rate limiting (rely on Claude API's built-in limits)
❌ Multiple AI providers (Claude only)
❌ User analytics/telemetry
❌ Code version history (beyond Claude's session history)
❌ Collaborative editing
❌ Custom theming beyond basic dark/light
❌ Advanced permissions (using `acceptEdits` mode)
❌ Production deployment (focus on local development)

### Key Simplifications
- **Single AI provider**: Claude via Agent SDK (no OpenAI, Gemini, etc.)
- **No backend rate limiting**: Trust Claude API's limits
- **No complex permissions**: Auto-approve file edits in MVP
- **Ephemeral workspaces**: `/tmp` storage, cleaned up after timeout
- **Simple auth**: Firebase email/password (no OAuth, SSO)
- **Client-side data processing**: No database for uploaded data

---

## Phased Implementation Plan

### Phase 1: Foundation & Data Pipeline ✅ COMPLETED

**Goal**: Establish project structure, file upload, and data processing

- [x] Set up routing structure (React Router)
- [x] Create file upload interface (drag-and-drop + file picker)
- [x] Implement CSV/Excel parsing (PapaParse, xlsx)
- [x] Build data preview table component
- [x] Create data context/store for app-wide state
- [x] Add basic data type inference and validation

**Key Deliverable**: Users can upload a file and see their data in a table ✅

**Implementation Notes**:
- Built with React Context for state management (no Zustand needed yet)
- File upload supports CSV and Excel (XLS, XLSX) with drag-and-drop via react-dropzone
- Automatic column type inference (number, string, date, boolean, unknown)
- Data table with sorting and pagination (TanStack Table)
- Comprehensive data statistics display (file metadata, column details, min/max/avg)
- Type-safe imports using `import type` syntax for proper Vite compilation
- Enforced limits: 10MB file size, 50,000 rows, 100 columns
- PapaParse configured with Web Worker for performance

---

### Phase 2: Code Editor & Live Preview ✅ COMPLETED

**Goal**: Enable manual code editing with live preview

- [x] Integrate Monaco Editor (VS Code editor)
- [x] Set up code compilation pipeline (Sucrase)
- [x] Build iframe-based preview sandbox
- [x] Implement live reload for code changes (debounced 500ms)
- [x] Add error boundary and error display
- [x] Add TypeScript/JSX support in editor
- [x] Implement compilation error handling

**Key Deliverable**: Users can edit React code and see live preview ✅

**Implementation Notes**:
- Monaco Editor configured for TypeScript + JSX with `typescriptreact` language mode
- Sucrase compiler for fast TypeScript/JSX → JavaScript transformation (~100KB)
- Import/export statements stripped from compiled code (React loaded via CDN)
- Sandboxed iframe with `allow-scripts allow-same-origin` for preview
- React 18 loaded from unpkg CDN (React 19 UMD builds not available)
- Real-time compilation with 500ms debounce for optimal performance
- Two-way data flow: DataContext (uploaded data) → Preview iframe
- Split-pane layout with resizable divider (30-70% constraints)
- Comprehensive error handling:
  - Compilation errors displayed below editor with line/column numbers
  - Runtime errors caught via Error Boundary with postMessage
  - Stack traces available (collapsible display)
- Editor features:
  - Auto-compile toggle (default: on)
  - Manual "Run" button for on-demand compilation
  - Theme switcher (light/dark)
  - Font size selector (12-18px)
  - Reset to starter template
- Starter template includes:
  - Data summary cards (row/column counts)
  - Sample data table (first 10 rows, 5 columns)
  - Tailwind CSS styling
  - Helpful tips for users
- Monaco configuration:
  - Semantic validation disabled (no module resolution errors)
  - Syntax validation enabled (catch actual code errors)
  - JSX compiler options properly configured
  - No type-checking for imports (React from CDN)

**Files Created**:
- `src/types/code.ts` - Type definitions for editor, compilation, errors
- `src/templates/starter.ts` - Default React component template
- `src/context/CodeContext.tsx` - Code state management
- `src/services/codeCompiler.ts` - Sucrase compilation + HTML generation
- `src/hooks/useCodeCompiler.ts` - Debounced auto-compilation
- `src/components/data/DataPreview.tsx` - Combined stats + table with Continue button
- `src/components/editor/CodeEditor.tsx` - Monaco wrapper
- `src/components/editor/EditorNavigation.tsx` - Tab navigation between views
- `src/components/editor/EditorToolbar.tsx` - Editor controls
- `src/components/editor/ErrorDisplay.tsx` - Compilation error display
- `src/components/preview/PreviewFrame.tsx` - Sandboxed iframe
- `src/components/preview/PreviewToolbar.tsx` - Preview controls
- `src/components/preview/RuntimeErrorDisplay.tsx` - Runtime error display
- `src/components/layout/SplitPane.tsx` - Resizable two-panel layout

**Files Modified**:
- `src/App.tsx` - Added CodeProvider wrapper
- `src/pages/Editor.tsx` - Replaced data display with editor/preview layout
- `src/context/DataContext.tsx` - Fixed type-only imports
- `src/types/data.ts` - Converted enum to const for compatibility

**Dependencies Added**:
- `@monaco-editor/react` (^4.x) - Code editor component
- `sucrase` (^3.x) - Fast TypeScript/JSX compiler

---

### Phase 3: Advanced Visualizations

**Goal**: Rich visualization library and tooling

- [x] Integrate charting libraries (Recharts primarily)
- [ ] Create responsive layout system
- [ ] Add accessibility features (ARIA labels, keyboard nav)

**Key Deliverable**: Professional-quality dashboard generation

---

### Phase 4: AI-Powered Generation

**Goal**: Natural language to code generation

**Backend Setup:**
- [ ] Set up Node.js/Express backend server
- [ ] Integrate Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
- [ ] Configure Firebase Admin SDK for user session management
- [ ] Set up API key storage (Firebase Firestore with encryption)
- [ ] Create ephemeral file system for user workspaces (`/tmp/sessions/{userId}/{sessionId}`)
- [ ] Build WebSocket or SSE endpoint for streaming responses
- [ ] Implement session persistence and resumption

**Frontend Integration:**
- [ ] Build chat interface UI
- [ ] Implement streaming response display (real-time text updates)
- [ ] Add file sync between Monaco editor and backend workspace
- [ ] Build message history UI
- [ ] Add loading states and tool execution indicators
- [ ] Implement code diff viewer for AI suggestions
- [ ] Add "apply suggestion" and "iterate" functionality

**Agent SDK Features:**
- [ ] Configure `query()` function with file tools (Read, Edit, Write, Glob, Grep)
- [ ] Set permission mode to `acceptEdits` for automatic file updates
- [ ] Enable `includePartialMessages: true` for streaming
- [ ] Implement session resumption via `resume` parameter
- [ ] Add file checkpointing for undo/rewind functionality
- [ ] Build context builder (data schema + user intent)
- [ ] Add dashboard template examples for few-shot prompting

**Key Deliverable**: Users can describe what they want and get generated code

---

### Phase 5: Export & Sharing (Week 9-10)

**Goal**: Share and export dashboards

- [ ] Screenshot functionality (capture preview as PNG/JPG)
- [ ] PDF export for dashboards
- [ ] Share via URL (encode project in URL hash or backend storage)
- [ ] Add version history/snapshots
- [ ] Implement save/load projects (local storage)
- [ ] Copy shareable link with preview

**Key Deliverable**: Users can share and export their dashboards

---

## Proposed File Architecture

```
project-root/
├── backend/                        # Node.js backend (NEW)
│   ├── src/
│   │   ├── server.ts              # Express server setup
│   │   ├── middleware/
│   │   │   ├── auth.ts           # Firebase auth verification
│   │   │   └── errorHandler.ts   # Global error handling
│   │   │
│   │   ├── routes/
│   │   │   ├── chat.ts           # Claude Agent SDK integration
│   │   │   ├── files.ts          # File operations (read/write)
│   │   │   └── sessions.ts       # Session management
│   │   │
│   │   ├── services/
│   │   │   ├── claudeAgent.ts    # Claude Agent SDK wrapper
│   │   │   ├── sessionManager.ts # User session handling
│   │   │   ├── workspaceManager.ts # Ephemeral file system per user
│   │   │   └── firebaseAdmin.ts  # Firebase Admin SDK setup
│   │   │
│   │   └── utils/
│   │       ├── encryption.ts     # API key encryption/decryption
│   │       └── fileSync.ts       # Sync files between editor and workspace
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                       # Backend environment variables
│
├── react-app/
├── public/
│   └── sandbox-worker.js          # Web worker for code compilation
│
├── src/
│   ├── main.tsx                   # Entry point
│   ├── App.tsx                    # Root component with routing
│   │
│   ├── pages/                     # Top-level views
│   │   ├── Landing.tsx           # Landing page ✅
│   │   └── Editor.tsx            # Main editor view ✅
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx       ✅ # App header with navigation
│   │   │   ├── Sidebar.tsx       # Phase 3+
│   │   │   └── SplitPane.tsx    ✅ # Resizable editor/preview split
│   │   │
│   │   ├── data/                 # Data handling UI
│   │   │   ├── FileUpload.tsx   ✅ # Drag-and-drop uploader
│   │   │   ├── DataPreview.tsx  ✅ # Combined stats + table view
│   │   │   ├── DataTable.tsx    ✅ # Data preview table with sorting/pagination
│   │   │   ├── DataStats.tsx    ✅ # Summary statistics
│   │   │   └── DataTransform.tsx # Phase 3+ - Filter/sort/aggregate UI
│   │   │
│   │   ├── editor/               # Code editing
│   │   │   ├── CodeEditor.tsx   ✅ # Monaco editor wrapper with TS/JSX
│   │   │   ├── EditorNavigation.tsx ✅ # Tab navigation (Data Preview / Code Editor)
│   │   │   ├── EditorToolbar.tsx ✅ # Run, auto-compile, theme, font size
│   │   │   ├── ErrorDisplay.tsx ✅ # Compilation error display
│   │   │   └── QuickActions.tsx # Format, run, save buttons (Phase 3+)
│   │   │
│   │   ├── preview/              # Live preview
│   │   │   ├── PreviewFrame.tsx ✅ # Sandboxed iframe with postMessage
│   │   │   ├── PreviewToolbar.tsx ✅ # Refresh button and error indicator
│   │   │   ├── RuntimeErrorDisplay.tsx ✅ # Runtime error display
│   │   │   └── DeviceFrame.tsx  # Mobile/tablet/desktop views (Phase 3+)
│   │   │
│   │   ├── chat/                  # AI Chat Interface (Phase 4)
│   │   │   ├── ChatPanel.tsx     # Main chat UI with streaming
│   │   │   ├── ChatMessage.tsx   # Individual message component
│   │   │   ├── StreamingText.tsx # Real-time text streaming display
│   │   │   ├── ToolIndicator.tsx # Shows when Claude is using tools
│   │   │   └── MessageHistory.tsx # Chat history display
│   │   │
│   │   └── common/               # Shared components
│   │       ├── Button.tsx       ✅ # Reusable button with variants
│   │       ├── LoadingSpinner.tsx ✅ # Loading indicator
│   │       ├── Modal.tsx         # Phase 2+
│   │       └── Tabs.tsx          # Phase 2+
│   │
│   ├── services/
│   │   ├── fileParser.ts        ✅ # CSV/Excel parsing with PapaParse & xlsx
│   │   ├── codeCompiler.ts      ✅ # Sucrase compiler + iframe HTML generation
│   │   ├── codeRunner.ts         # Execute user code safely (Phase 3+)
│   │   ├── chatService.ts        # WebSocket/SSE client for Claude Agent SDK backend (Phase 4)
│   │   ├── fileSync.ts           # Sync files between Monaco and backend (Phase 4)
│   │   ├── templateGenerator.ts  # Pre-built dashboard templates for Claude (Phase 3)
│   │   └── exportService.ts      # PDF/screenshot export, URL sharing (Phase 5)
│   │
│   ├── templates/                # Starter templates
│   │   ├── starter.ts           ✅ # Default dashboard template
│   │   ├── index.ts             # Template registry (Phase 3+)
│   │   ├── barChart.tsx         # Pre-built examples (Phase 3+)
│   │   ├── lineChart.tsx
│   │   ├── pieChart.tsx
│   │   ├── dataTable.tsx
│   │   └── dashboard.tsx        # Multi-chart layout
│   │
│   ├── prompts/                  # System prompts for Claude (Phase 4)
│   │   ├── systemContext.ts     # Base context about dashboard app
│   │   ├── chartExamples.ts     # Example dashboard components
│   │   └── dataContext.ts       # Data schema formatting for prompts
│   │
│   ├── context/                  # State management
│   │   ├── DataContext.tsx      ✅ # Uploaded data with loading/error states
│   │   ├── CodeContext.tsx      ✅ # Code, compilation, errors, settings
│   │   ├── EditorContext.tsx     # Phase 3+ - Editor settings (merged into CodeContext)
│   │   └── ProjectContext.tsx    # Phase 5 - Project metadata
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useFileUpload.ts     ✅ # File validation and parsing hook
│   │   ├── useCodeCompiler.ts   ✅ # Debounced auto-compilation
│   │   ├── useClaudeChat.ts      # Phase 4 - Manage chat sessions with Claude
│   │   ├── useStreamingResponse.ts # Phase 4 - Handle SSE/WebSocket streaming
│   │   ├── useDataTransform.ts   # Phase 2
│   │   └── useLocalStorage.ts    # Phase 5
│   │
│   ├── types/
│   │   ├── data.ts              ✅ # Data structure types (RawData, ParsedData, ColumnDef, etc.)
│   │   ├── code.ts              ✅ # Code, compilation, and error types
│   │   ├── template.ts           # Phase 3 - Template types
│   │   ├── chat.ts               # Phase 4 - Chat message types (user, assistant, tool calls)
│   │   └── stream.ts             # Phase 4 - Streaming event types from Claude SDK
│   │
│   └── utils/
│       ├── dataInference.ts     ✅ # Infer data types/schema with statistics
│       ├── dataTransform.ts      # Phase 2 - Data manipulation
│       ├── codeValidation.ts    # Validate user code
│       ├── errorFormatter.ts    # Format errors nicely
│       └── exportHelpers.ts     # PDF/screenshot/URL utilities
│
├── .env.example                  # LLM API keys, etc.
└── package.json
```

---

## Key Technical Decisions

### 1. **AI Backend Architecture**
- **Claude Agent SDK** running on Node.js backend
- User's own Claude API key stored encrypted in Firebase Firestore
- Ephemeral file system per user session (`/tmp/sessions/{userId}/{sessionId}`)
- **Permission mode**: `acceptEdits` (auto-approve file changes for MVP)
- **Tools enabled**: Read, Edit, Write, Glob, Grep (no Bash for security)
- **Streaming**: `includePartialMessages: true` for real-time responses
- **Session management**: Resume conversations via session ID

### 2. **Backend-Frontend Communication**
- **WebSocket** or **Server-Sent Events (SSE)** for streaming
- Backend-for-Frontend (BFF) pattern to protect API keys
- File synchronization between Monaco Editor and backend workspace
- Real-time updates for code changes from Claude

### 3. **Code Editor**
- **Monaco Editor** (same as VS Code)
- Configure with TypeScript, JSX syntax highlighting
- Two-way sync with backend file system
- Display file changes from Claude in real-time

### 4. **Code Compilation Strategy** ✅
- **Chosen**: Sucrase (lighter, faster, ~100KB)
- Transforms TypeScript + JSX to JavaScript in browser
- Import/export statements stripped (React loaded from CDN)
- Production mode for optimized output
- ~500ms compilation time for typical components

### 5. **Preview Isolation** ✅
- iframe with `sandbox="allow-scripts allow-same-origin"`
- Communication via `postMessage` API for error handling
- Data injected as component props in generated HTML
- Uses `srcDoc` attribute for HTML injection
- React 18 loaded from unpkg CDN
- Tailwind CSS loaded from CDN
- Key-based iframe reset on code changes

### 6. **State Management**
- React Context for global state (data, code, chat sessions)
- Local state for UI interactions
- Consider Zustand if Context becomes complex

### 7. **Data Libraries**
- **CSV/Excel**: PapaParse + xlsx ✅
- **Charts**: Recharts (React-native, good DX)
- **Tables**: TanStack Table (powerful, headless) ✅

---

## Claude Agent SDK Integration Architecture

### Backend Implementation Pattern

```typescript
// backend/src/services/claudeAgent.ts
import { query } from '@anthropic-ai/claude-agent-sdk';

export async function* chatWithClaude(
  userId: string,
  sessionId: string,
  message: string,
  workspaceFiles: Record<string, string>
) {
  // 1. Setup user workspace
  const workspacePath = `/tmp/sessions/${userId}/${sessionId}`;
  await setupWorkspace(workspacePath, workspaceFiles);

  // 2. Run Claude Agent SDK with streaming
  for await (const msg of query({
    prompt: message,
    options: {
      cwd: workspacePath,                    // Claude works in this directory
      resume: sessionId,                     // Continue previous conversation
      allowedTools: ["Read", "Edit", "Write", "Glob", "Grep"],
      disallowedTools: ["Bash"],             // Security: no shell access
      permissionMode: "acceptEdits",         // Auto-approve file edits
      includePartialMessages: true,          // Enable streaming
      additionalDirectories: []              // Only access workspace
    }
  })) {
    // 3. Stream events to frontend
    if (msg.type === 'stream_event') {
      yield { type: 'stream', event: msg.event };
    } else if (msg.type === 'result') {
      // 4. Return final result with modified files
      const modifiedFiles = await syncFilesFromWorkspace(workspacePath);
      yield { type: 'complete', result: msg.result, files: modifiedFiles };
    }
  }
}
```

### Frontend Communication Pattern

```typescript
// react-app/src/hooks/useClaudeChat.ts
export function useClaudeChat(sessionId: string) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);

  async function sendMessage(userMessage: string, editorFiles: Record<string, string>) {
    setStreaming(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message: userMessage, files: editorFiles })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const events = text.split('\n').filter(Boolean);

      for (const event of events) {
        const data = JSON.parse(event);

        if (data.type === 'stream') {
          // Real-time text updates
          if (data.event.delta?.type === 'text_delta') {
            currentResponse += data.event.delta.text;
            setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: currentResponse }]);
          }
        } else if (data.type === 'complete') {
          // Final result: update editor files
          onFilesUpdated(data.files);
        }
      }
    }

    setStreaming(false);
  }

  return { messages, streaming, sendMessage };
}
```

### Permission & Security Model

```typescript
// For MVP: acceptEdits mode (simple, auto-approve)
permissionMode: "acceptEdits"

// Future: Custom callbacks for fine-grained control
canUseTool: async (toolName, input) => {
  // Validate file access
  if (toolName === "Read" || toolName === "Edit" || toolName === "Write") {
    const filePath = input.file_path || input.new_file_path;
    if (!filePath.startsWith(workspacePath)) {
      return { behavior: 'deny', message: 'Access denied: outside workspace' };
    }
  }

  // Block bash commands
  if (toolName === "Bash") {
    return { behavior: 'deny', message: 'Command execution not allowed' };
  }

  return { behavior: 'allow', updatedInput: input };
}
```

### Session Persistence

```typescript
// Store session metadata in Firebase
await db.collection('sessions').doc(sessionId).set({
  userId,
  createdAt: Timestamp.now(),
  lastActive: Timestamp.now(),
  messageCount: 0,
  files: ['dashboard.tsx', 'utils.ts'],
  dataSchema: { columns: [...] }
});

// Resume conversation
for await (const msg of query({
  prompt: "Add error handling",
  options: {
    resume: sessionId  // Claude remembers entire conversation history!
  }
})) {
  // Continue previous conversation with full context
}
```

### File Checkpointing (Undo/Rewind)

```typescript
// Enable checkpointing
const result = await query({
  prompt: "Refactor the dashboard component",
  options: {
    enableFileCheckpointing: true,
    cwd: workspacePath
  }
});

// User doesn't like changes - rewind to previous state
await result.rewindFiles(previousMessageUUID);
// All file changes reverted!
```

---

## Backend API Endpoints

### Authentication (All endpoints require Firebase ID token)
```typescript
// Middleware verifies token on every request
headers: {
  'Authorization': 'Bearer <firebase-id-token>'
}
```

### POST /api/auth/setup-api-key
Store user's Claude API key (encrypted)

**Request:**
```json
{
  "apiKey": "sk-ant-..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key stored securely"
}
```

### WebSocket /ws/chat
Real-time chat with Claude Agent SDK

**Client → Server (Initial Connection):**
```json
{
  "type": "init",
  "sessionId": "uuid-v4",
  "files": {
    "dashboard.tsx": "import React...",
    "utils.ts": "export function..."
  }
}
```

**Client → Server (Chat Message):**
```json
{
  "type": "message",
  "sessionId": "uuid-v4",
  "content": "Add a bar chart showing sales by month",
  "files": {
    "dashboard.tsx": "current code..."
  }
}
```

**Server → Client (Streaming Events):**
```json
// Text delta (real-time)
{
  "type": "stream",
  "event": {
    "type": "content_block_delta",
    "delta": {
      "type": "text_delta",
      "text": "I'll add a bar chart..."
    }
  }
}

// Tool use indicator
{
  "type": "tool_start",
  "toolName": "Edit",
  "input": {
    "file_path": "dashboard.tsx"
  }
}

// Tool result
{
  "type": "tool_result",
  "toolName": "Edit",
  "result": "File updated successfully"
}

// Complete (final)
{
  "type": "complete",
  "result": {
    "content": "I've added a bar chart...",
    "files": {
      "dashboard.tsx": "updated code..."
    },
    "sessionId": "uuid-v4",
    "cost": 0.023
  }
}

// Error
{
  "type": "error",
  "message": "Error message",
  "code": "TOOL_ERROR"
}
```

### POST /api/sessions/list
Get user's recent sessions

**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "uuid-v4",
      "createdAt": "2026-01-31T10:00:00Z",
      "lastActive": "2026-01-31T10:30:00Z",
      "messageCount": 5,
      "files": ["dashboard.tsx", "utils.ts"]
    }
  ]
}
```

### POST /api/sessions/{sessionId}/files
Get files from a session workspace

**Response:**
```json
{
  "files": {
    "dashboard.tsx": "import React...",
    "utils.ts": "export function..."
  }
}
```

### DELETE /api/sessions/{sessionId}
Delete a session and cleanup workspace

**Response:**
```json
{
  "success": true,
  "message": "Session deleted"
}
```

---

## Data Flow

```
1. Upload File (CSV/Excel)
   ↓
2. Parse & Infer Schema → Store in DataContext ✅
   ↓
3. Review Data (stats + table) → Continue to Editor ✅
   ↓
4. User edits code in Monaco or sends natural language request in ChatPanel
   ↓
4. Frontend → WebSocket/SSE → Backend
   ↓
5. Backend creates/resumes session
   - Sync current files from Monaco to workspace
   - Initialize Claude Agent SDK with query()
   ↓
6. Claude Agent SDK processes request
   - Uses Read/Edit/Write tools on workspace files
   - Streams responses back to frontend
   ↓
7. Frontend receives streaming updates
   - Display Claude's text responses in chat
   - Show tool usage indicators (e.g., "Editing dashboard.tsx...")
   - Sync file changes back to Monaco Editor
   ↓
8. Code compiled in browser (Babel/Sucrase) [Phase 3]
   ↓
9. Injected into Preview iframe with data [Phase 3]
   ↓
10. User sees rendered dashboard
   ↓
11. Iterate (continue conversation, refine with Claude)
   ↓
12. Export final result [Phase 5]
```

---

## Security Considerations

### 1. **API Key Management** (Critical for MVP)
- **NEVER** expose Claude API keys to frontend
- Store user's API key **encrypted** in Firebase Firestore
- Use Firebase Admin SDK on backend to decrypt and use keys
- Set API key as environment variable only for duration of request
- Clear API key from memory after each request

### 2. **File System Isolation**
- Each user gets ephemeral workspace: `/tmp/sessions/{userId}/{sessionId}`
- Claude Agent SDK restricted to user's workspace only
- No access to system files or other users' data
- Workspace cleaned up after session timeout

### 3. **Tool Restrictions**
- **Allowed tools**: Read, Edit, Write, Glob, Grep (file operations only)
- **Disallowed tools**: Bash (prevent arbitrary command execution)
- Use `permissionMode: "acceptEdits"` for MVP (auto-approve file edits)
- Consider custom `canUseTool` callbacks for stricter control later

### 4. **Code Sandbox** (Phase 3)
- Use iframe with `sandbox` attribute for preview
- Communication via `postMessage` API
- Inject data via window object (not eval)

### 5. **Data Privacy**
- Process uploaded data client-side only (no server uploads to backend)
- Data only sent to Claude API via user's own API key
- No data persistence on backend (only in browser memory)

### 6. **Authentication**
- Firebase Authentication for user sessions
- Verify Firebase ID tokens on backend for all API requests
- Rate limiting per user (future enhancement, not MVP)

### 7. **Input Validation**
- Sanitize user messages before sending to Claude
- Validate file paths to prevent directory traversal
- Lint and validate generated code before execution

### 8. **XSS Prevention**
- Sanitize any user-generated HTML in preview
- Use React's built-in XSS protection
- CSP headers for iframe sandbox

---

## Performance Optimization

1. **Lazy Loading**: Code-split editor and preview
2. **Debounced Compilation**: Don't recompile on every keystroke
3. **Virtual Scrolling**: For large datasets in table
4. **Web Workers**: Offload compilation to worker thread
5. **Caching**: Cache compiled code and parsed data

---

## Success Metrics

### Phase 1 (Data Upload) ✅
- File upload and parsing: < 3 seconds
- Data table rendering: < 1 second
- Type inference accuracy: > 95%

### Phase 2 (Code Editor & Live Preview) ✅
- Code editor lag: < 100ms ✅
- Preview update latency after code change: < 500ms ✅ (debounced)
- Code compilation time: < 500ms ✅ (Sucrase performance)

### Phase 3 (Visualizations)
- Chart rendering time: < 500ms
- Template variety: 5+ dashboard patterns

### Phase 4 (AI-Powered Generation)
- Time from chat message to first response: < 2 seconds
- Streaming text latency: < 200ms per chunk
- File sync to editor: < 500ms
- Session resumption: < 1 second
- Dashboard generation success rate: > 80%
- Time from prompt to working dashboard: < 30 seconds

### Overall
- User satisfaction with AI-generated code: High
- System uptime: > 99%
- API cost per session: < $0.50 (user's own key)

---

## Next Steps

### Completed (Phase 2) ✅
1. ✅ Review and approve updated architecture
2. ✅ Set up Phase 2 dependencies
   - ✅ Install Monaco Editor (`@monaco-editor/react`)
   - ✅ Install Sucrase
3. ✅ Implement Monaco Editor integration
   - ✅ Add Monaco component to Editor page
   - ✅ Implement file state management (CodeContext)
   - ✅ Add TypeScript/JSX syntax highlighting
4. ✅ Build live preview system
   - ✅ Create iframe-based preview sandbox
   - ✅ Implement code compilation pipeline (Sucrase)
   - ✅ Add live reload on code changes (500ms debounce)
   - ✅ Build error boundary and display (compilation + runtime)

### Phase 2 Vertical Slice ✅
Upload data → Edit code manually in Monaco → See live preview in iframe

### Immediate (Phase 3 Setup)

### Phase 3: Advanced Visualizations
- Integrate Recharts
- Build dashboard component templates
- Add data filtering UI

### Phase 4: AI Integration
- Set up backend (Node.js/Express)
- Integrate Claude Agent SDK
- Configure Firebase
- Build chat interface
- Implement streaming responses

### Phase 5: Export & Sharing

---

## Recommended Dependencies

### Frontend (react-app/)
```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x",
    "papaparse": "^5.x",            // CSV parsing ✅
    "xlsx": "^0.18.x",              // Excel parsing ✅
    "@monaco-editor/react": "^4.x", // Code editor (Phase 2)
    "recharts": "^2.x",             // Charts (Phase 4)
    "@tanstack/react-table": "^8.x", // Data tables ✅
    "sucrase": "^3.x",              // Code compilation (Phase 3)
    "react-dropzone": "^14.x",      // File upload ✅
    "firebase": "^11.x"             // Firebase client SDK (Phase 2)
  },
  "devDependencies": {
    "@types/papaparse": "^5.x",
    "typescript": "^5.x",
    "vite": "^7.x"
  }
}
```

### Backend (backend/)
```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "latest", // Claude Agent SDK (Phase 2)
    "express": "^4.x",                          // Web server (Phase 2)
    "firebase-admin": "^13.x",                  // Firebase Admin SDK (Phase 2)
    "ws": "^8.x",                               // WebSocket server (Phase 2)
    "cors": "^2.x",                             // CORS middleware (Phase 2)
    "dotenv": "^16.x"                           // Environment variables (Phase 2)
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "@types/ws": "^8.x",
    "@types/cors": "^2.x",
    "typescript": "^5.x",
    "tsx": "^4.x",                              // TypeScript execution
    "nodemon": "^3.x"                           // Development auto-reload
  }
}
```

---

## Architectural Decisions

### 1. **AI Provider**
- **Claude API only** via Claude Agent SDK
- User provides their own API key (stored encrypted in Firebase)
- No rate limiting for MVP (rely on Claude API's built-in limits)
- No fallback to other AI providers (simplifies MVP)

### 2. **Backend Architecture**
- **Node.js/Express** server with TypeScript
- **Claude Agent SDK** running server-side (cannot run in browser)
- **WebSocket** or **SSE** for real-time streaming
- **Firebase Admin SDK** for authentication and API key storage
- **Ephemeral file system**: `/tmp/sessions/{userId}/{sessionId}` (auto-cleanup)

### 3. **Data Limits**
- Max file size: **10MB** (prevents browser memory issues)
- Max row count: **50,000 rows** (optimal for client-side processing and visualizations)
- Max column count: **100 columns** (reasonable limit for dashboard use cases)

### 4. **Session Management**
- **Firebase Firestore** for session metadata (session ID, timestamps, file list)
- **Claude Agent SDK sessions** for conversation continuity
- Session resumption via `resume` parameter in `query()` function
- File checkpointing for undo/rewind functionality

### 5. **Authentication**
- **Firebase Authentication** for user sign-in
- Verify ID tokens on backend for all API requests
- User must be authenticated to use chat (to associate with their API key)

### 6. **Multi-file Support**
- Start with single component file (simpler UX)
- Claude can create multiple files via Write tool if needed
- All files managed in user's workspace directory

### 7. **Deployment** (Future)
- Backend: Cloud Run, Railway, or Render
- Frontend: Vercel, Netlify, or Firebase Hosting
- Separate deployments for frontend and backend

## Environment Variables & Configuration

### Backend (.env)
```bash
# Claude API (not used directly - users provide their own keys)
# ANTHROPIC_API_KEY is set per-request from user's encrypted key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Server Configuration
PORT=2000
NODE_ENV=development
CORS_ORIGIN=http://localhost:2500

# Encryption (for API key storage)
ENCRYPTION_KEY=your-32-byte-encryption-key
ENCRYPTION_IV=your-16-byte-iv

# Session Configuration
SESSION_TIMEOUT_MINUTES=60
WORKSPACE_CLEANUP_HOURS=24
```

### Frontend (.env)
```bash
# Firebase Client SDK
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend API
VITE_BACKEND_URL=http://localhost:2000
VITE_BACKEND_WS_URL=ws://localhost:2000
```

### Security Notes
- **Never commit .env files** to version control
- Use `.env.example` files with placeholder values
- Rotate encryption keys regularly
- Use Firebase Secret Manager in production
- API keys stored encrypted at rest in Firestore

---

## Data Limits Rationale

**File Size (10MB)**:
- Most CSV/Excel files for dashboards are under 5MB
- 10MB provides headroom without risking browser crashes
- Large files should use server-side processing (future enhancement)

**Row Count (50,000)**:
- Recharts and most visualization libraries handle 50k points well
- Table virtualization keeps UI responsive
- Aggregation/sampling can reduce data for charts if needed

**Column Count (100)**:
- Typical dashboards use 5-20 columns
- 100 provides plenty of headroom for wide datasets
- Prevents unwieldy UI with too many column selectors

