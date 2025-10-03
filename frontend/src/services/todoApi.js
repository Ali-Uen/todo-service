// API service for todo operations with authentication
import { authApi } from './authApi.js';

const API_BASE = '/api/v1/todos';

export const todoApi = {
  // Get all todos for authenticated user
  async getAll() {
    const authHeaders = await authApi.getAuthHeader();
    const response = await fetch(API_BASE, {
      headers: {
        ...authHeaders
      }
    });
    
    if (response.status === 401) {
      // Token expired, try to refresh and retry
      await authApi.refreshToken();
      const newAuthHeaders = await authApi.getAuthHeader();
      const retryResponse = await fetch(API_BASE, {
        headers: {
          ...newAuthHeaders
        }
      });
      if (!retryResponse.ok) throw new Error(`Failed to fetch todos: ${retryResponse.statusText}`);
      return retryResponse.json();
    }
    
    if (!response.ok) throw new Error(`Failed to fetch todos: ${response.statusText}`);
    return response.json();
  },

  // Create new todo for authenticated user
  async create(todo) {
    const authHeaders = await authApi.getAuthHeader();
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(todo)
    });
    
    if (response.status === 401) {
      await authApi.refreshToken();
      const newAuthHeaders = await authApi.getAuthHeader();
      const retryResponse = await fetch(API_BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...newAuthHeaders
        },
        body: JSON.stringify(todo)
      });
      if (!retryResponse.ok) throw new Error(`Failed to create todo: ${retryResponse.statusText}`);
      return retryResponse.json();
    }
    
    if (!response.ok) throw new Error(`Failed to create todo: ${response.statusText}`);
    return response.json();
  },

  // Update existing todo
  async update(id, todo) {
    const authHeaders = await authApi.getAuthHeader();
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(todo)
    });
    
    if (response.status === 401) {
      await authApi.refreshToken();
      const newAuthHeaders = await authApi.getAuthHeader();
      const retryResponse = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...newAuthHeaders
        },
        body: JSON.stringify(todo)
      });
      if (!retryResponse.ok) throw new Error(`Failed to update todo: ${retryResponse.statusText}`);
      return retryResponse.json();
    }
    
    if (!response.ok) throw new Error(`Failed to update todo: ${response.statusText}`);
    return response.json();
  },

  // Delete todo
  async delete(id) {
    const authHeaders = await authApi.getAuthHeader();
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders
      }
    });
    
    if (response.status === 401) {
      await authApi.refreshToken();
      const newAuthHeaders = await authApi.getAuthHeader();
      const retryResponse = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          ...newAuthHeaders
        }
      });
      if (!retryResponse.ok) throw new Error(`Failed to delete todo: ${retryResponse.statusText}`);
      return;
    }
    
    if (!response.ok) throw new Error(`Failed to delete todo: ${response.statusText}`);
  },

  // Toggle todo completion
  async toggle(id) {
    const authHeaders = await authApi.getAuthHeader();
    const response = await fetch(`${API_BASE}/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        ...authHeaders
      }
    });
    
    if (response.status === 401) {
      await authApi.refreshToken();
      const newAuthHeaders = await authApi.getAuthHeader();
      const retryResponse = await fetch(`${API_BASE}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          ...newAuthHeaders
        }
      });
      if (!retryResponse.ok) throw new Error(`Failed to toggle todo: ${retryResponse.statusText}`);
      return retryResponse.json();
    }
    
    if (!response.ok) throw new Error(`Failed to toggle todo: ${response.statusText}`);
    return response.json();
  }
};