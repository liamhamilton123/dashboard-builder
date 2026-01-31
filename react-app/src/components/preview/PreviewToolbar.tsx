import { useCode } from '../../context/CodeContext';

export function PreviewToolbar() {
  const { compile, runtimeError } = useCode();

  const handleRefresh = () => {
    compile();
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
        {runtimeError && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            Error
          </span>
        )}
      </div>

      <button
        onClick={handleRefresh}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
      >
        Refresh
      </button>
    </div>
  );
}
