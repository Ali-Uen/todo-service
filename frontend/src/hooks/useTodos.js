import { useState, useEffect } from 'react';
import { todoApi } from '../services/todoApi';
import { useAuth } from '../contexts/AuthContext.jsx';

export function useTodos() {
  const { isAuthenticated, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTodos = async () => {
    if (!isAuthenticated) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      // If authentication error, logout user
      if (err.message.includes('authentication') || err.message.includes('401')) {
        await logout();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const newTodo = await todoApi.create(todoData);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoApi.update(id, todoData);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTodo = async (todo) => {
    return updateTodo(todo.id, {
      ...todo,
      done: !todo.done
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos: loadTodos
  };
}