import { useCallback } from 'react';
import { useData } from '../context/DataContext';
import { parseFile } from '../services/fileParser';
import { inferSchema } from '../utils/dataInference';
import { MAX_FILE_SIZE, MAX_ROWS, MAX_COLUMNS, ALLOWED_FILE_TYPES } from '../types/data';
import type { ParsedData } from '../types/data';

export const useFileUpload = () => {
  const { setData, setLoading, setError } = useData();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type) ||
      fileName.endsWith('.csv') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls');

    if (!isValidType) {
      return 'Invalid file type. Please upload a CSV or Excel file.';
    }

    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Parse file
      const rawData = await parseFile(file);

      // Validate data constraints
      if (rawData.length === 0) {
        throw new Error('File is empty or has no valid data');
      }

      if (rawData.length > MAX_ROWS) {
        throw new Error(`File has too many rows. Maximum allowed: ${MAX_ROWS.toLocaleString()}`);
      }

      const columnCount = Object.keys(rawData[0]).length;
      if (columnCount > MAX_COLUMNS) {
        throw new Error(`File has too many columns. Maximum allowed: ${MAX_COLUMNS}`);
      }

      // Infer schema
      const columns = inferSchema(rawData);

      // Create parsed data object
      const parsedData: ParsedData = {
        rows: rawData,
        columns,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          rowCount: rawData.length,
          columnCount,
          uploadedAt: new Date()
        }
      };

      setData(parsedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  return { uploadFile };
};
