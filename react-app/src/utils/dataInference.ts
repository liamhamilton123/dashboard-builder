import { ColumnType } from '../types/data';
import type { ColumnDef, RawData } from '../types/data';

export const inferColumnType = (values: unknown[]): ColumnType => {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) {
    return ColumnType.UNKNOWN;
  }

  let numberCount = 0;
  let booleanCount = 0;
  let dateCount = 0;

  for (const value of nonNullValues) {
    if (typeof value === 'number' && !isNaN(value)) {
      numberCount++;
    } else if (typeof value === 'boolean') {
      booleanCount++;
    } else if (value instanceof Date || !isNaN(Date.parse(String(value)))) {
      dateCount++;
    }
  }

  const total = nonNullValues.length;
  const threshold = 0.8; // 80% of values must match type

  if (numberCount / total >= threshold) return ColumnType.NUMBER;
  if (booleanCount / total >= threshold) return ColumnType.BOOLEAN;
  if (dateCount / total >= threshold) return ColumnType.DATE;

  return ColumnType.STRING;
};

export const inferSchema = (data: RawData): ColumnDef[] => {
  if (data.length === 0) return [];

  const columns = Object.keys(data[0]);
  const columnDefs: ColumnDef[] = [];

  for (const columnName of columns) {
    const values = data.map(row => row[columnName]);
    const type = inferColumnType(values);

    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const uniqueValues = new Set(nonNullValues);

    const columnDef: ColumnDef = {
      name: columnName,
      type,
      uniqueCount: uniqueValues.size,
      nullCount: values.length - nonNullValues.length
    };

    // Calculate statistics for numeric columns
    if (type === ColumnType.NUMBER) {
      const numericValues = nonNullValues
        .map(v => Number(v))
        .filter(v => !isNaN(v));

      if (numericValues.length > 0) {
        columnDef.min = Math.min(...numericValues);
        columnDef.max = Math.max(...numericValues);
        columnDef.avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      }
    }

    // Calculate statistics for date columns
    if (type === ColumnType.DATE) {
      const dateValues = nonNullValues
        .map(v => new Date(String(v)))
        .filter(d => !isNaN(d.getTime()));

      if (dateValues.length > 0) {
        columnDef.min = new Date(Math.min(...dateValues.map(d => d.getTime())));
        columnDef.max = new Date(Math.max(...dateValues.map(d => d.getTime())));
      }
    }

    columnDefs.push(columnDef);
  }

  return columnDefs;
};
