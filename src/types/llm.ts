// LLM and Agent types

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionRequest {
  messages: LLMMessage[];
  tools?: LLMTool[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  toolCalls?: LLMToolCall[];
}

export interface LLMTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface LLMToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface LLMResponse {
  id: string;
  choices: LLMChoice[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMChoice {
  index: number;
  message: LLMMessage;
  finishReason: 'stop' | 'tool_calls' | 'length' | 'content_filter';
}

// Agent Service types
export interface AgentRequest {
  sessionId: string;
  message: string;
  dataSourceIds?: string[];
  memories?: Memory[];
  customInstructions?: string;
}

export interface AgentResponse {
  sessionId: string;
  message: string;
  toolCalls?: LLMToolCall[];
  sqlQueries?: SQLQuery[];
  metadata?: {
    tokensUsed: number;
    modelId: string;
    duration: number;
  };
}

export interface SQLQuery {
  sql: string;
  dataSourceId: string;
  result?: QueryResult;
  error?: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
}

// Import Memory type for AgentRequest
import type { Memory } from './memory';
