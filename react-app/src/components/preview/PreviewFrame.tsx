import { useEffect, useState, useMemo } from 'react';
import { useCode } from '../../context/CodeContext';
import { useData } from '../../context/DataContext';
import { generatePreviewHTML } from '../../services/codeCompiler';

export function PreviewFrame() {
  const { compiledCode, setRuntimeError } = useCode();
  const { data } = useData();
  const [key, setKey] = useState(0);

  const html = useMemo(() => {
    if (!compiledCode || !data) return '';
    return generatePreviewHTML(compiledCode, data);
  }, [compiledCode, data]);

  useEffect(() => {
    // Force iframe reload when HTML changes
    setKey(prev => prev + 1);
  }, [html]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'runtime-error') {
        setRuntimeError(event.data.error);
      } else if (event.data.type === 'clear-error') {
        setRuntimeError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setRuntimeError]);

  return (
    <iframe
      key={key}
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0"
      title="Dashboard Preview"
    />
  );
}
