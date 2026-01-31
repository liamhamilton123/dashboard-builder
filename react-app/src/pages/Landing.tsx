import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Aperture
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Upload your data and create interactive dashboards with ease.
          No coding required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/editor">
            <Button variant="primary" className="text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-blue-600 text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Data
            </h3>
            <p className="text-gray-600">
              Import CSV or Excel files with up to 50,000 rows
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-blue-600 text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Customize
            </h3>
            <p className="text-gray-600">
              Design beautiful charts and dashboards visually
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-blue-600 text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export
            </h3>
            <p className="text-gray-600">
              Share or embed your interactive dashboards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
