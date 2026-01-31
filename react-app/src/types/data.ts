// Core data types for the dashboard builder

export type RawDataRow = Record<string, unknown>;
export type RawData = RawDataRow[];

export const ColumnType = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  UNKNOWN: 'unknown'
} as const;

export type ColumnType = typeof ColumnType[keyof typeof ColumnType];

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  rowCount: number;
  columnCount: number;
  uploadedAt: Date;
}

export interface ColumnDef {
  name: string;
  type: ColumnType;
  uniqueCount: number;
  nullCount: number;
  min?: number | Date;
  max?: number | Date;
  avg?: number;
}

export interface ParsedData {
  rows: RawData;
  columns: ColumnDef[];
  metadata: FileMetadata;
}

// Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ROWS = 50000;
export const MAX_COLUMNS = 100;
export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
