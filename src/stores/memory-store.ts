import { create } from 'zustand';
import type { Memory, CreateMemoryRequest, MemorySettings } from '@/types';

interface MemoryState {
  memories: Memory[];
  settings: MemorySettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMemories: () => Promise<void>;
  createMemory: (data: CreateMemoryRequest) => Promise<Memory>;
  updateMemory: (id: string, data: Partial<Memory>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<MemorySettings>) => void;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  settings: {
    generateMemory: true,
    useMemory: true,
  },
  isLoading: false,
  error: null,

  fetchMemories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      if (data.success) {
        set({ memories: data.data.items, isLoading: false });
      } else {
        set({ error: data.error?.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch memories', isLoading: false });
    }
  },

  createMemory: async (requestData: CreateMemoryRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          memories: [data.data, ...state.memories],
          isLoading: false,
        }));
        return data.data;
      } else {
        set({ error: data.error?.message, isLoading: false });
        throw new Error(data.error?.message);
      }
    } catch (error) {
      set({ error: 'Failed to create memory', isLoading: false });
      throw error;
    }
  },

  updateMemory: async (id: string, updateData: Partial<Memory>) => {
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          memories: state.memories.map((m) => (m.id === id ? { ...m, ...data.data } : m)),
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update memory' });
    }
  },

  deleteMemory: async (id: string) => {
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete memory' });
    }
  },

  updateSettings: (newSettings: Partial<MemorySettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
}));
