import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { useCode } from '../context/CodeContext';
import { useCodeCompiler } from '../hooks/useCodeCompiler';
import { FileUpload } from '../components/data/FileUpload';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DataPreview } from '../components/data/DataPreview';
import { EditorNavigation } from '../components/editor/EditorNavigation';
import { SplitPane } from '../components/layout/SplitPane';
import { CodeEditor } from '../components/editor/CodeEditor';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { ErrorDisplay } from '../components/editor/ErrorDisplay';
import { PreviewFrame } from '../components/preview/PreviewFrame';
import { PreviewToolbar } from '../components/preview/PreviewToolbar';
import { RuntimeErrorDisplay } from '../components/preview/RuntimeErrorDisplay';

export const Editor: React.FC = () => {
  const { data, isLoading } = useData();
  const { compile } = useCode();
  const [currentView, setCurrentView] = useState<'preview' | 'editor'>('preview');

  // Enable auto-compilation
  useCodeCompiler();

  // Compile starter template on mount when data is available
  useEffect(() => {
    if (data) {
      compile();
    }
  }, [data, compile]);

  // Reset to preview view when data changes
  useEffect(() => {
    if (data) {
      setCurrentView('preview');
    }
  }, [data]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Processing your file...</p>
        </div>
      ) : !data ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Upload Your Data
          </h1>
          <FileUpload />
        </div>
      ) : (
        <>
          <EditorNavigation
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <div className="flex-1 overflow-hidden">
            {currentView === 'preview' ? (
              <DataPreview onContinue={() => setCurrentView('editor')} />
            ) : (
              <SplitPane
                left={
                  <div className="flex flex-col h-full">
                    <EditorToolbar />
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor />
                    </div>
                    <ErrorDisplay />
                  </div>
                }
                right={
                  <div className="flex flex-col h-full">
                    <PreviewToolbar />
                    <div className="flex-1 overflow-hidden">
                      <PreviewFrame />
                    </div>
                    <RuntimeErrorDisplay />
                  </div>
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
