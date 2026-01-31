# Dashboard Builder - Architecture & Implementation Plan

## Project Overview

An enterprise dashboard prototyping tool that allows users to upload data (CSV/Excel), generate React visualizations through code or natural language, and preview them in real-time.

**Core Concept**: A "React app within a React app" - users edit a single component file that gets compiled and rendered in an isolated preview environment.

---

## Phased Implementation Plan

### Phase 1: Foundation & Data Pipeline (Week 1-2)

**Goal**: Establish project structure, file upload, and data processing

- [ ] Set up routing structure (React Router)
- [ ] Create file upload interface (drag-and-drop + file picker)
- [ ] Implement CSV/Excel parsing (PapaParse, xlsx)
- [ ] Build data preview table component
- [ ] Create data context/store for app-wide state
- [ ] Add basic data type inference and validation
- [ ] Implement data transformation utilities (filter, sort, aggregate)

**Key Deliverable**: Users can upload a file and see their data in a table

---

### Phase 2: Code Editor & Live Preview (Week 3-4)

**Goal**: Enable manual code editing with live preview

- [ ] Integrate Monaco Editor (VS Code editor)
- [ ] Set up code compilation pipeline (Babel standalone or Sucrase)
- [ ] Build iframe-based preview sandbox
- [ ] Implement hot reload for code changes
- [ ] Add error boundary and error display
- [ ] Create starter templates (bar chart, line chart, table, etc.)
- [ ] Add TypeScript support in editor
- [ ] Implement code validation and linting

**Key Deliverable**: Users can edit React code and see live preview

---

### Phase 3: Advanced Visualizations (Week 5-6)

**Goal**: Rich visualization library and tooling

- [ ] Integrate charting libraries (Recharts, D3, or Chart.js)
- [ ] Pre-build common dashboard patterns
- [ ] Add component gallery/library
- [ ] Implement chart type switcher
- [ ] Add interactive data filtering UI
- [ ] Build color theme customizer
- [ ] Create responsive layout system
- [ ] Add accessibility features (ARIA labels, keyboard nav)

**Key Deliverable**: Professional-quality dashboard generation

---

### Phase 4: AI-Powered Generation (Week 7-8)

**Goal**: Natural language to code generation

- [ ] Set up LLM integration (Claude API, OpenAI, or local)
- [ ] Build chat interface for natural language input
- [ ] Create prompt engineering system for chart generation
- [ ] Implement code diff viewer for AI suggestions
- [ ] Add "apply suggestion" and "iterate" functionality
- [ ] Build context builder (data schema + user intent)
- [ ] Add example library for few-shot prompting
- [ ] Implement streaming responses for better UX

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
react-app/
├── public/
│   └── sandbox-worker.js          # Web worker for code compilation
│
├── src/
│   ├── main.tsx                   # Entry point
│   ├── App.tsx                    # Root component with routing
│   │
│   ├── pages/                     # Top-level views
│   │   ├── Home.tsx              # Landing page
│   │   ├── Editor.tsx            # Main editor view
│   │   └── Gallery.tsx           # Template gallery
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── SplitPane.tsx    # Resizable editor/preview split
│   │   │
│   │   ├── data/                 # Data handling UI
│   │   │   ├── FileUpload.tsx   # Drag-and-drop uploader
│   │   │   ├── DataTable.tsx    # Data preview table
│   │   │   ├── DataStats.tsx    # Summary statistics
│   │   │   └── DataTransform.tsx # Filter/sort/aggregate UI
│   │   │
│   │   ├── editor/               # Code editing
│   │   │   ├── CodeEditor.tsx   # Monaco editor wrapper
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   └── QuickActions.tsx # Format, run, save buttons
│   │   │
│   │   ├── preview/              # Live preview
│   │   │   ├── PreviewFrame.tsx # Iframe sandbox
│   │   │   ├── PreviewToolbar.tsx
│   │   │   ├── DeviceFrame.tsx  # Mobile/tablet/desktop views
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── ai/                   # AI features
│   │   │   ├── ChatPanel.tsx    # Natural language input
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── DiffViewer.tsx   # Show code changes
│   │   │   └── PromptLibrary.tsx
│   │   │
│   │   └── common/               # Shared components
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Tabs.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── services/
│   │   ├── fileParser.ts         # CSV/Excel parsing
│   │   ├── codeCompiler.ts       # Babel/Sucrase integration
│   │   ├── codeRunner.ts         # Execute user code safely
│   │   ├── llmClient.ts          # LLM API integration
│   │   ├── templateGenerator.ts  # Code generation from data
│   │   └── exportService.ts      # PDF/screenshot export, URL sharing
│   │
│   ├── templates/                # Starter templates
│   │   ├── index.ts             # Template registry
│   │   ├── barChart.tsx         # Pre-built examples
│   │   ├── lineChart.tsx
│   │   ├── pieChart.tsx
│   │   ├── dataTable.tsx
│   │   └── dashboard.tsx        # Multi-chart layout
│   │
│   ├── prompts/                  # AI prompt engineering
│   │   ├── systemPrompts.ts     # Base instructions for LLM
│   │   ├── chartPrompts.ts      # Chart-specific prompts
│   │   └── dataAnalysis.ts      # Data insight prompts
│   │
│   ├── context/                  # State management
│   │   ├── DataContext.tsx      # Uploaded data
│   │   ├── CodeContext.tsx      # Current code state
│   │   ├── EditorContext.tsx    # Editor settings
│   │   └── ProjectContext.tsx   # Project metadata
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useFileUpload.ts
│   │   ├── useCodeCompiler.ts
│   │   ├── useLLM.ts
│   │   ├── useDataTransform.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── types/
│   │   ├── data.ts              # Data structure types
│   │   ├── code.ts              # Code/AST types
│   │   ├── template.ts          # Template types
│   │   └── llm.ts               # AI types
│   │
│   └── utils/
│       ├── dataInference.ts     # Infer data types/schema
│       ├── dataTransform.ts     # Data manipulation
│       ├── codeValidation.ts    # Validate user code
│       ├── errorFormatter.ts    # Format errors nicely
│       └── exportHelpers.ts     # PDF/screenshot/URL utilities
│
├── .env.example                  # LLM API keys, etc.
└── package.json
```

---

## Key Technical Decisions

### 1. **Code Compilation Strategy**
- **Option A**: Babel Standalone (browser-based, full featured, ~300KB)
- **Option B**: Sucrase (lighter, faster, ~100KB)
- **Recommendation**: Start with Sucrase, fallback to Babel if needed

### 2. **Preview Isolation**
- Use iframe with `sandbox` attribute
- Communication via `postMessage` API
- Inject data via window object or props
- Reset iframe on each code change (or implement HMR)

### 3. **State Management**
- React Context for global state (data, code, settings)
- Local state for UI interactions
- Consider Zustand if Context becomes complex

### 4. **Data Libraries**
- **CSV/Excel**: PapaParse + xlsx
- **Charts**: Recharts (React-native, good DX) or Apache ECharts (more features)
- **Tables**: TanStack Table (powerful, headless)

### 5. **Editor**
- Monaco Editor (same as VS Code)
- Configure with TypeScript, JSX syntax highlighting
- Add IntelliSense with data types

### 6. **LLM Integration**
- Support multiple providers (Claude, OpenAI, local)
- Stream responses for better UX
- Include data schema in context
- Use few-shot examples for better output

---

## Data Flow

```
1. Upload File
   ↓
2. Parse & Infer Schema → Store in DataContext
   ↓
3a. User writes code manually (CodeEditor)
   OR
3b. User describes intent (ChatPanel) → LLM generates code
   ↓
4. Code compiled (Babel/Sucrase)
   ↓
5. Injected into Preview iframe with data
   ↓
6. User sees rendered dashboard
   ↓
7. Iterate (edit code or refine with AI)
   ↓
8. Export final result
```

---

## Security Considerations

1. **Code Sandbox**: Use iframe with restricted permissions
2. **Data Privacy**: Process data client-side only (no server uploads)
3. **LLM Prompts**: Sanitize user input before sending to LLM
4. **Code Validation**: Lint and validate before execution
5. **XSS Prevention**: Sanitize any user-generated HTML

---

## Performance Optimization

1. **Lazy Loading**: Code-split editor and preview
2. **Debounced Compilation**: Don't recompile on every keystroke
3. **Virtual Scrolling**: For large datasets in table
4. **Web Workers**: Offload compilation to worker thread
5. **Caching**: Cache compiled code and parsed data

---

## Success Metrics

- Time from upload to first visualization: < 30 seconds
- Code editor lag: < 100ms
- Preview update latency: < 500ms
- AI generation success rate: > 80%
- User satisfaction with generated code: High

---

## Next Steps

1. Review and approve this architecture
2. Set up dependencies (see package recommendations below)
3. Implement Phase 1 (Foundation & Data Pipeline)
4. Build vertical slice (upload → manual edit → preview)
5. Iterate based on feedback

---

## Recommended Dependencies

```json
{
  "dependencies": {
    "react-router-dom": "^7.x",
    "papaparse": "^5.x",          // CSV parsing
    "xlsx": "^0.18.x",            // Excel parsing
    "@monaco-editor/react": "^4.x", // Code editor
    "recharts": "^2.x",           // Charts
    "@tanstack/react-table": "^8.x", // Data tables
    "sucrase": "^3.x",            // Code compilation
    "zustand": "^5.x",            // State (if needed)
    "react-dropzone": "^14.x"     // File upload
  },
  "devDependencies": {
    "@types/papaparse": "^5.x"
  }
}
```

---

## Architectural Decisions

1. **LLM Provider**: API-based (Claude/OpenAI) - configure via environment variables
2. **Data Limits**:
   - Max file size: **10MB** (prevents browser memory issues)
   - Max row count: **50,000 rows** (optimal for client-side processing and visualizations)
   - Max column count: **100 columns** (reasonable limit for dashboard use cases)
3. **Persistence**: LocalStorage (no backend needed initially)
4. **Auth**: Not implemented yet (Phase 5+ feature)
5. **Multi-file**: Single component file only (simpler UX, easier sandboxing)

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
