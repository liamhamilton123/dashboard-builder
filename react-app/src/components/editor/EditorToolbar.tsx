import { useCode } from '../../context/CodeContext';

export function EditorToolbar() {
  const { autoCompile, setAutoCompile, compile, resetToTemplate, settings, updateSettings } = useCode();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
      <div className="flex items-center gap-2">
        <button
          onClick={compile}
          disabled={autoCompile}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
        >
          Run
        </button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoCompile}
            onChange={(e) => setAutoCompile(e.target.checked)}
            className="rounded"
          />
          Auto-compile
        </label>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span>Theme:</span>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span>Font Size:</span>
          <select
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
          </select>
        </label>

        <button
          onClick={resetToTemplate}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
