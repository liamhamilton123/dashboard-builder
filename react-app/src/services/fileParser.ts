import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { RawData } from '../types/data';

export const parseCSV = (file: File): Promise<RawData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors[0].message}`));
        } else {
          resolve(results.data as RawData);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};

export const parseExcel = (file: File): Promise<RawData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as RawData;

        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

export const parseFile = async (file: File): Promise<RawData> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
    return parseCSV(file);
  } else if (
    fileType === 'application/vnd.ms-excel' ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileName.endsWith('.xlsx') ||
    fileName.endsWith('.xls')
  ) {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
  }
};
