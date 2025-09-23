// API service for todo operations
const API_BASE = '/api/v1/todos';

export const todoApi = {
  async getAll() {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error(`Failed to fetch todos: ${response.statusText}`);
    return response.json();
  },

  async create(todo) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!response.ok) throw new Error(`Failed to create todo: ${response.statusText}`);
    return response.json();
  },

  async update(id, todo) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!response.ok) throw new Error(`Failed to update todo: ${response.statusText}`);
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete todo: ${response.statusText}`);
  }
};