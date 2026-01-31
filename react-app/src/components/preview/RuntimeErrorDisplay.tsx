import { useState } from 'react';
import { useCode } from '../../context/CodeContext';

export function RuntimeErrorDisplay() {
  const { runtimeError } = useCode();
  const [showStack, setShowStack] = useState(false);

  if (!runtimeError) return null;

  return (
    <div className="bg-red-50 border border-red-400 p-4 m-4 rounded">
      <div className="flex items-start gap-2">
        <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Runtime Error</h3>
          <p className="text-sm text-red-700 font-mono mb-2">
            {runtimeError.message}
          </p>

          {runtimeError.stack && (
            <div>
              <button
                onClick={() => setShowStack(!showStack)}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                {showStack ? 'Hide' : 'Show'} stack trace
              </button>
              {showStack && (
                <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-x-auto">
                  {runtimeError.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
