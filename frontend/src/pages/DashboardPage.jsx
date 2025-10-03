// DashboardPage - Protected todo dashboard
import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { UserProfile } from '../components/UserProfile.jsx';
import { AddTodoForm } from '../components/AddTodoForm.jsx';
import { TodoList } from '../components/TodoList.jsx';
import { ToastContainer } from '../components/ToastContainer.jsx';
import { useTodos } from '../hooks/useTodos.js';
import './DashboardPage.css';

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  } = useTodos();

  const completedCount = todos.filter(todo => todo.done).length;
  const totalCount = todos.length;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Todo Dashboard</h1>
              <p className="subtitle">
                Manage your tasks efficiently
              </p>
              {totalCount > 0 && (
                <div className="stats">
                  {completedCount} von {totalCount} Todos erledigt
                </div>
              )}
            </div>
            <div className="header-right">
              <UserProfile />
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <AddTodoForm 
            onAdd={addTodo} 
            loading={loading} 
          />
          
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </main>

        <ToastContainer />
      </div>
    </div>
  );
}