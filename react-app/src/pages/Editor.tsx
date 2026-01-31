import React from 'react';
import { useData } from '../context/DataContext';
import { FileUpload } from '../components/data/FileUpload';
import { DataStats } from '../components/data/DataStats';
import { DataTable } from '../components/data/DataTable';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Editor: React.FC = () => {
  const { data, isLoading, clearData } = useData();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Processing your file...</p>
          </div>
        ) : !data ? (
          <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Upload Your Data
            </h1>
            <FileUpload />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Data
              </h1>
              <Button variant="secondary" onClick={clearData}>
                Clear Data
              </Button>
            </div>

            <DataStats />
            <DataTable />
          </div>
        )}
      </div>
    </div>
  );
};
