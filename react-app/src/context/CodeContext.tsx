import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CodeContextValue, EditorSettings, CompilationError, RuntimeError } from '../types/code';
import { compileCode } from '../services/codeCompiler';
import { starterTemplate } from '../templates/starter';

const CodeContext = createContext<CodeContextValue | undefined>(undefined);

const defaultSettings: EditorSettings = {
  theme: 'light',
  fontSize: 14,
  wordWrap: 'on',
  minimap: false,
};

export function CodeProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(starterTemplate);
  const [compiledCode, setCompiledCode] = useState('');
  const [compilationError, setCompilationError] = useState<CompilationError | null>(null);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [autoCompile, setAutoCompile] = useState(true);

  const compile = useCallback(() => {
    const result = compileCode(code);

    if (result.error) {
      setCompilationError(result.error);
      setCompiledCode('');
    } else {
      setCompilationError(null);
      setCompiledCode(result.code);
      // Clear runtime error when successfully compiling new code
      setRuntimeError(null);
    }
  }, [code]);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetToTemplate = useCallback(() => {
    setCode(starterTemplate);
    setCompilationError(null);
    setRuntimeError(null);
    // Trigger compilation of starter template
    setTimeout(() => {
      const result = compileCode(starterTemplate);
      if (!result.error) {
        setCompiledCode(result.code);
      }
    }, 0);
  }, []);

  const value: CodeContextValue = {
    code,
    setCode,
    compiledCode,
    compilationError,
    runtimeError,
    setRuntimeError,
    settings,
    updateSettings,
    autoCompile,
    setAutoCompile,
    compile,
    resetToTemplate,
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
}

export function useCode() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within CodeProvider');
  }
  return context;
}
