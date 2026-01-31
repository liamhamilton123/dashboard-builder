import Editor from '@monaco-editor/react';
import { useCode } from '../../context/CodeContext';

export function CodeEditor() {
  const { code, setCode, settings } = useCode();

  const handleEditorMount = (_editor: any, monaco: any) => {
    // Configure TypeScript to understand JSX
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: false,
    });

    // Disable semantic validation to avoid module resolution errors
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="typescriptreact"
      value={code}
      onChange={(value) => setCode(value || '')}
      onMount={handleEditorMount}
      theme={settings.theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        fontSize: settings.fontSize,
        wordWrap: settings.wordWrap,
        minimap: { enabled: settings.minimap },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}
