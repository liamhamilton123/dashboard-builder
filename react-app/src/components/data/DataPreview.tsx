import React from 'react';
import { DataStats } from './DataStats';
import { DataTable } from './DataTable';
import { Button } from '../common/Button';

interface DataPreviewProps {
  onContinue: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ onContinue }) => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Data Preview
            </h1>
            <p className="text-gray-600 mt-2">
              Review your data before building your dashboard
            </p>
          </div>
          <Button variant="primary" onClick={onContinue}>
            Continue to Editor →
          </Button>
        </div>

        <DataStats />
        <DataTable />
      </div>
    </div>
  );
};
