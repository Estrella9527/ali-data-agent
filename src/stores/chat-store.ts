import { create } from 'zustand';
import type { StreamChunk } from '@/types';

interface ChatState {
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;

  // Actions
  sendMessage: (sessionId: string, message: string, dataSourceIds?: string[]) => Promise<void>;
  sendMessageStream: (
    sessionId: string,
    message: string,
    dataSourceIds?: string[],
    onChunk?: (chunk: StreamChunk) => void
  ) => Promise<void>;
  clearStreamingContent: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isStreaming: false,
  streamingContent: '',
  error: null,

  sendMessage: async (sessionId: string, message: string, dataSourceIds?: string[]) => {
    set({ error: null });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, dataSourceIds }),
      });
      const data = await response.json();
      if (!data.success) {
        set({ error: data.error?.message });
        throw new Error(data.error?.message);
      }
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      set({ error: message });
      throw error;
    }
  },

  sendMessageStream: async (
    sessionId: string,
    message: string,
    dataSourceIds?: string[],
    onChunk?: (chunk: StreamChunk) => void
  ) => {
    set({ isStreaming: true, streamingContent: '', error: null });

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, dataSourceIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to stream');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              set({ isStreaming: false });
              return;
            }
            try {
              const chunk: StreamChunk = JSON.parse(data);
              if (chunk.type === 'text' && chunk.content) {
                set((state) => ({
                  streamingContent: state.streamingContent + chunk.content,
                }));
              }
              onChunk?.(chunk);
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      set({ isStreaming: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Stream failed';
      set({ isStreaming: false, error: message });
      throw error;
    }
  },

  clearStreamingContent: () => {
    set({ streamingContent: '' });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
