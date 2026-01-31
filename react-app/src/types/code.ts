export interface EditorSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
}

export interface CompilationError {
  message: string;
  line?: number;
  column?: number;
  stack?: string;
}

export interface RuntimeError {
  message: string;
  stack?: string;
  componentStack?: string;
}

export interface CodeContextValue {
  code: string;
  setCode: (code: string) => void;
  compiledCode: string;
  compilationError: CompilationError | null;
  runtimeError: RuntimeError | null;
  setRuntimeError: (error: RuntimeError | null) => void;
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  autoCompile: boolean;
  setAutoCompile: (enabled: boolean) => void;
  compile: () => void;
  resetToTemplate: () => void;
}
