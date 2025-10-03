/**
 * Shared Todo types for Web and Mobile apps
 */

export interface Todo {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TodoResponse extends Todo {}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}