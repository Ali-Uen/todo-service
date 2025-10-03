/**
 * Todo types for Expo Mobile App
 * Matches Spring Boot backend API
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
  done?: boolean;
}

export interface TodoResponse extends Todo {}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface TodoStatistics {
  total: number;
  completed: number;
  pending: number;
}