import React from 'react';
import { useData } from '../../context/DataContext';
import { ColumnType } from '../../types/data';

export const DataStats: React.FC = () => {
  const { data } = useData();

  if (!data) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const groupColumnsByType = () => {
    const typeCounts: Record<string, number> = {};
    data.columns.forEach((col) => {
      typeCounts[col.type] = (typeCounts[col.type] || 0) + 1;
    });
    return typeCounts;
  };

  const typeCounts = groupColumnsByType();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">File Name</p>
          <p className="text-lg font-medium text-gray-900 truncate" title={data.metadata.fileName}>
            {data.metadata.fileName}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">File Size</p>
          <p className="text-lg font-medium text-gray-900">
            {formatFileSize(data.metadata.fileSize)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Rows</p>
          <p className="text-lg font-medium text-gray-900">
            {data.metadata.rowCount.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Columns</p>
          <p className="text-lg font-medium text-gray-900">
            {data.metadata.columnCount}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-2">Column Types</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeCounts).map(([type, count]) => (
            <span
              key={type}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {count} {type}
              {count !== 1 ? 's' : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <p className="text-sm text-gray-600 mb-3">Column Details</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Name</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Unique</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Nulls</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Min</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Max</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Avg</th>
              </tr>
            </thead>
            <tbody>
              {data.columns.map((col) => (
                <tr key={col.name} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium text-gray-900">{col.name}</td>
                  <td className="py-2 px-3 text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">{col.uniqueCount}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{col.nullCount}</td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {col.min !== undefined
                      ? col.type === ColumnType.DATE
                        ? new Date(col.min).toLocaleDateString()
                        : typeof col.min === 'number'
                        ? col.min.toFixed(2)
                        : '—'
                      : '—'}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {col.max !== undefined
                      ? col.type === ColumnType.DATE
                        ? new Date(col.max).toLocaleDateString()
                        : typeof col.max === 'number'
                        ? col.max.toFixed(2)
                        : '—'
                      : '—'}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {col.avg !== undefined ? col.avg.toFixed(2) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Uploaded {formatDate(data.metadata.uploadedAt)}
      </div>
    </div>
  );
};
