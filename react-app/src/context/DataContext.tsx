import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ParsedData } from '../types/data';

interface DataContextValue {
  data: ParsedData | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: ParsedData) => void;
  clearData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setDataState] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setData = (newData: ParsedData) => {
    setDataState(newData);
    setError(null);
  };

  const clearData = () => {
    setDataState(null);
    setError(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value: DataContextValue = {
    data,
    isLoading,
    error,
    setData,
    clearData,
    setLoading,
    setError
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
