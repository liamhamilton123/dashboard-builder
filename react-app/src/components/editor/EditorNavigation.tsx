import React from 'react';
import { useData } from '../../context/DataContext';

interface EditorNavigationProps {
  currentView: 'preview' | 'editor';
  onViewChange: (view: 'preview' | 'editor') => void;
}

export const EditorNavigation: React.FC<EditorNavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  const { clearData } = useData();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex gap-1">
          <button
            onClick={() => onViewChange('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              currentView === 'preview'
                ? 'bg-gray-50 text-gray-900 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Data Preview
          </button>
          <button
            onClick={() => onViewChange('editor')}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              currentView === 'editor'
                ? 'bg-gray-50 text-gray-900 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Code Editor
          </button>
        </div>
        <button
          onClick={clearData}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
};
