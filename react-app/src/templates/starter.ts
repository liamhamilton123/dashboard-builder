export const starterTemplate = `import React from 'react';

interface DashboardProps {
  data: any[];
  columns: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, columns }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard Preview
        </h1>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-blue-600">{data.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Columns</p>
              <p className="text-2xl font-bold text-green-600">{columns.length}</p>
            </div>
          </div>
        </div>

        {/* Sample Data Table */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sample Data (First 10 Rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.slice(0, 5).map((col, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                  {columns.length > 5 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ... {columns.length - 5} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 10).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.slice(0, 5).map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[col]?.toString() || '-'}
                      </td>
                    ))}
                    {columns.length > 5 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        ...
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Your data is available via the <code className="bg-blue-100 px-1 rounded">data</code> and <code className="bg-blue-100 px-1 rounded">columns</code> props. Edit this component to build your custom dashboard!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`;
