import { create } from 'zustand';
import type { DataSource, CreateDataSourceRequest } from '@/types';

interface DataSourceState {
  dataSources: DataSource[];
  currentDataSource: DataSource | null;
  selectedDataSourceIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDataSources: () => Promise<void>;
  fetchDataSource: (id: string) => Promise<void>;
  createDataSource: (data: CreateDataSourceRequest) => Promise<DataSource>;
  deleteDataSource: (id: string) => Promise<void>;
  setCurrentDataSource: (dataSource: DataSource | null) => void;
  toggleDataSourceSelection: (id: string) => void;
  setSelectedDataSourceIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useDataSourceStore = create<DataSourceState>((set, get) => ({
  dataSources: [],
  currentDataSource: null,
  selectedDataSourceIds: [],
  isLoading: false,
  error: null,

  fetchDataSources: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/data-sources');
      const data = await response.json();
      if (data.success) {
        set({ dataSources: data.data.items, isLoading: false });
      } else {
        set({ error: data.error?.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch data sources', isLoading: false });
    }
  },

  fetchDataSource: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/data-sources/${id}`);
      const data = await response.json();
      if (data.success) {
        set({ currentDataSource: data.data, isLoading: false });
      } else {
        set({ error: data.error?.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch data source', isLoading: false });
    }
  },

  createDataSource: async (requestData: CreateDataSourceRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          dataSources: [data.data, ...state.dataSources],
          isLoading: false,
        }));
        return data.data;
      } else {
        set({ error: data.error?.message, isLoading: false });
        throw new Error(data.error?.message);
      }
    } catch (error) {
      set({ error: 'Failed to create data source', isLoading: false });
      throw error;
    }
  },

  deleteDataSource: async (id: string) => {
    try {
      const response = await fetch(`/api/data-sources/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          dataSources: state.dataSources.filter((ds) => ds.id !== id),
          currentDataSource: state.currentDataSource?.id === id ? null : state.currentDataSource,
          selectedDataSourceIds: state.selectedDataSourceIds.filter((i) => i !== id),
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete data source' });
    }
  },

  setCurrentDataSource: (dataSource: DataSource | null) => {
    set({ currentDataSource: dataSource });
  },

  toggleDataSourceSelection: (id: string) => {
    set((state) => ({
      selectedDataSourceIds: state.selectedDataSourceIds.includes(id)
        ? state.selectedDataSourceIds.filter((i) => i !== id)
        : [...state.selectedDataSourceIds, id],
    }));
  },

  setSelectedDataSourceIds: (ids: string[]) => {
    set({ selectedDataSourceIds: ids });
  },

  clearSelection: () => {
    set({ selectedDataSourceIds: [] });
  },
}));
