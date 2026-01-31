import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Dashboard Builder
            </Link>
          </div>
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Landing
            </Link>
            <Link
              to="/editor"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Editor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
