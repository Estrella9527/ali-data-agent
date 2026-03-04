// Session and Message types

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
  createdAt: Date;
}

export interface MessageMetadata {
  toolCalls?: ToolCall[];
  tokenUsage?: TokenUsage;
  modelId?: string;
  finishReason?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Session {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  messages?: Message[];
  dataContexts?: SessionDataContext[];
}

export interface SessionDataContext {
  id: string;
  sessionId: string;
  dataSourceId: string;
}

export interface CreateSessionRequest {
  title?: string;
  dataSourceIds?: string[];
}

export interface CreateMessageRequest {
  content: string;
  role?: MessageRole;
  metadata?: MessageMetadata;
}
