import { useEffect, useRef } from 'react';
import { useCode } from '../context/CodeContext';

export function useCodeCompiler() {
  const { code, autoCompile, compile } = useCode();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoCompile) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce compilation (500ms)
    timeoutRef.current = setTimeout(() => {
      compile();
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, autoCompile, compile]);

  return { compile };
}
