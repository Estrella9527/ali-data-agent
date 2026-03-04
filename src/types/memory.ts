// Memory types

export type MemorySource = 'auto' | 'user_confirmed' | 'manual';
export type MemoryStatus = 'active' | 'disabled';

export interface Memory {
  id: string;
  content: string;
  source: MemorySource;
  heat: number;
  status: MemoryStatus;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemoryRequest {
  content: string;
  source?: MemorySource;
}

export interface UpdateMemoryRequest {
  content?: string;
  status?: MemoryStatus;
}

export interface MemorySearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
}

export interface MemorySearchResult {
  memory: Memory;
  similarity: number;
}

export interface MemorySettings {
  generateMemory: boolean;
  useMemory: boolean;
}
