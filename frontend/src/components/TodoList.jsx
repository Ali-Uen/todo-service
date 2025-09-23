import { TodoItem } from './TodoItem';
import './TodoList.css';
import './LoadingStates.css';

export function TodoList({ todos, loading, error, onToggle, onDelete, onUpdate }) {
  if (loading) {
    return (
      <div className="todo-list">
        <div className="loading-text">
          <div className="loading-spinner"></div>
          <span>Todos werden geladen...</span>
        </div>
        {/* Skeleton Loading */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="loading-skeleton loading-todo"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>⚠️ Fehler beim Laden</h3>
        <p>Die Todos konnten nicht geladen werden: {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>Noch keine Todos</h3>
        <p>Erstelle dein erstes Todo und starte durch!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}