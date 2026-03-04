// API Response types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams, SortParams {
  query?: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  status: 'processing' | 'ready' | 'error';
  metadata?: FileMetadata;
  createdAt: Date;
}

export interface FileMetadata {
  rowCount?: number;
  columnCount?: number;
  columns?: string[];
  previewData?: Record<string, unknown>[];
}

// Streaming types
export interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: string;
  };
  toolResult?: {
    toolCallId: string;
    result: unknown;
  };
  error?: string;
}
