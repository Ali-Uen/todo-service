import { Todo, TodoRequest, TodoResponse, TodoStatistics } from '../types/Todo';

/**
 * Mobile API Service for Todo operations
 * Connects to Spring Boot backend
 */

// WICHTIG: Ihre lokale IP-Adresse hier eintragen!
// Finden Sie mit: ipconfig (Windows) -> IPv4-Adresse
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.178.40:8080/api/v1/todos'  // ← IHRE IP HIER!
  : 'https://your-domain.com/api/v1/todos';   // Production URL

export class TodoApiService {
  private static async request<T>(
    endpoint: string = '',
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Handle empty responses (like DELETE)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`✅ API Success:`, data);
        return data;
      } else {
        console.log(`✅ API Success: Non-JSON response`);
        return {} as T;
      }
    } catch (error) {
      console.error('🚨 API Request failed:', error);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing connection to:', API_BASE_URL);
      
      // Simple fetch test without JSON parsing
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend connection successful');
        return true;
      } else {
        console.error(`❌ Backend returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      console.error('📍 Make sure Spring Boot is running on http://192.168.178.40:8080');
      return false;
    }
  }

  /**
   * Get all todos
   */
  static async getAllTodos(): Promise<Todo[]> {
    const response = await TodoApiService.request<TodoResponse[]>('');
    return response.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
      priority: todo.priority,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  }

  /**
   * Create new todo
   */
  static async createTodo(todo: TodoRequest): Promise<Todo> {
    const response = await TodoApiService.request<TodoResponse>('', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
    
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      done: response.done,
      priority: response.priority,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Update existing todo
   */
  static async updateTodo(id: number, updates: Partial<TodoRequest>): Promise<Todo> {
    const response = await TodoApiService.request<TodoResponse>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      done: response.done,
      priority: response.priority,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Delete todo
   */
  static async deleteTodo(id: number): Promise<void> {
    await TodoApiService.request<void>(`/${id}`, {
      method: 'DELETE',
    });
  }
}