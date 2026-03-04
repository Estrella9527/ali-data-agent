import { create } from 'zustand';
import type { Session, Message, CreateSessionRequest } from '@/types';

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: () => Promise<void>;
  fetchSession: (id: string) => Promise<void>;
  createSession: (data: CreateSessionRequest) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  setCurrentSession: (session: Session | null) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateSessionTitle: (id: string, title: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      if (data.success) {
        set({ sessions: data.data.items, isLoading: false });
      } else {
        set({ error: data.error?.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch sessions', isLoading: false });
    }
  },

  fetchSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/sessions/${id}`);
      const data = await response.json();
      if (data.success) {
        set({ currentSession: data.data, isLoading: false });
      } else {
        set({ error: data.error?.message, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch session', isLoading: false });
    }
  },

  createSession: async (requestData: CreateSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          sessions: [data.data, ...state.sessions],
          currentSession: data.data,
          isLoading: false,
        }));
        return data.data;
      } else {
        set({ error: data.error?.message, isLoading: false });
        throw new Error(data.error?.message);
      }
    } catch (error) {
      set({ error: 'Failed to create session', isLoading: false });
      throw error;
    }
  },

  deleteSession: async (id: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSession: state.currentSession?.id === id ? null : state.currentSession,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete session' });
    }
  },

  setCurrentSession: (session: Session | null) => {
    set({ currentSession: session });
  },

  addMessage: (sessionId: string, message: Message) => {
    set((state) => {
      if (state.currentSession?.id === sessionId) {
        return {
          currentSession: {
            ...state.currentSession,
            messages: [...(state.currentSession.messages || []), message],
          },
        };
      }
      return state;
    });
  },

  updateSessionTitle: async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, title } : s)),
          currentSession:
            state.currentSession?.id === id
              ? { ...state.currentSession, title }
              : state.currentSession,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update session title' });
    }
  },
}));
