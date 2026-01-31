import { transform } from 'sucrase';
import type { CompilationError } from '../types/code';
import type { ParsedData } from '../types/data';

export function compileCode(sourceCode: string): { code: string; error: CompilationError | null } {
  try {
    const result = transform(sourceCode, {
      transforms: ['typescript', 'jsx'],
      production: true,
    });

    // Remove import/export statements since we load React from CDN
    // and need the code to work in a non-module script context
    let code = result.code;

    // Remove import statements
    code = code.replace(/import\s+.*?from\s+['"]react['"];?\s*/g, '');
    code = code.replace(/import\s+.*?from\s+['"]react-dom['"];?\s*/g, '');
    code = code.replace(/import\s+React\s*,?\s*\{[^}]*\}\s*from\s+['"]react['"];?\s*/g, '');

    // Remove export statements
    code = code.replace(/export\s+default\s+/g, '');
    code = code.replace(/export\s+\{[^}]*\};?\s*/g, '');
    code = code.replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');

    return {
      code: code,
      error: null,
    };
  } catch (error: any) {
    return {
      code: '',
      error: {
        message: error.message || 'Compilation failed',
        line: error.loc?.line,
        column: error.loc?.column,
        stack: error.stack,
      },
    };
  }
}

export function generatePreviewHTML(compiledCode: string, data: ParsedData): string {
  const { rows, columns } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    // Import dependencies from esm.sh
    const ReactModule = await import("https://esm.sh/react@18?target=es2022");
    const ReactDOMModule = await import("https://esm.sh/react-dom@18?target=es2022&deps=react@18");
    const Recharts = await import("https://esm.sh/recharts@2?target=es2022&deps=react@18,react-dom@18");

    // Set globals for compiled code - use the actual exports
    window.React = ReactModule.default || ReactModule;
    window.ReactDOM = ReactDOMModule.default || ReactDOMModule;

    // Create a local reference to the React we'll use
    const React = window.React;
    const ReactDOM = window.ReactDOM;

    const {
      BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
      XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
    } = Recharts;

    // Error boundary
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        window.parent.postMessage({
          type: 'runtime-error',
          error: {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
          },
        }, '*');
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', {
            style: {
              padding: '20px',
              backgroundColor: '#fee',
              border: '1px solid #c00',
              borderRadius: '4px',
              margin: '20px',
            }
          }, [
            React.createElement('h2', { key: 'title' }, 'Runtime Error'),
            React.createElement('pre', {
              key: 'message',
              style: { whiteSpace: 'pre-wrap', fontSize: '14px' }
            }, this.state.error.message),
          ]);
        }

        return this.props.children;
      }
    }

    // Clear any previous errors
    window.parent.postMessage({ type: 'clear-error' }, '*');

    try {
      // User's compiled code
      ${compiledCode}

      // Data props
      const dataProps = {
        data: ${JSON.stringify(rows)},
        columns: ${JSON.stringify(columns.map(c => c.name))},
      };

      // Render
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        React.createElement(ErrorBoundary, null,
          React.createElement(Dashboard, dataProps)
        )
      );
    } catch (error) {
      window.parent.postMessage({
        type: 'runtime-error',
        error: {
          message: error.message,
          stack: error.stack,
        },
      }, '*');

      document.getElementById('root').innerHTML =
        '<div style="padding: 20px; background-color: #fee; border: 1px solid #c00; border-radius: 4px; margin: 20px;">' +
        '<h2>Runtime Error</h2>' +
        '<pre style="white-space: pre-wrap; font-size: 14px;">' + error.message + '</pre>' +
        '</div>';
    }
  </script>
</body>
</html>`;
}
