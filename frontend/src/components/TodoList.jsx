import { TodoItem } from './TodoItem';
import './TodoList.css';

export function TodoList({ todos, loading, error, onToggle, onDelete }) {
  if (loading) {
    return <div className="loading">Todos werden geladen...</div>;
  }

  if (error) {
    return <div className="error">Fehler beim Laden der Todos: {error}</div>;
  }

  if (todos.length === 0) {
    return <div className="empty">Keine Todos vorhanden. Erstelle dein erstes Todo!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}