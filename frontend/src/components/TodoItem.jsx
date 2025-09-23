import './TodoItem.css';

export function TodoItem({ todo, onToggle, onDelete }) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('de-DE');
    } catch (error) {
      return '';
    }
  };

  const handleToggle = () => {
    onToggle(todo);
  };

  const handleDelete = () => {
    if (window.confirm(`Todo "${todo.title}" löschen?`)) {
      onDelete(todo.id);
    }
  };

  return (
    <div className={`todo-item ${todo.done ? 'done' : ''}`}>
      <div className="todo-left">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <div className="todo-content">
          <div className={`todo-title ${todo.done ? 'done' : ''}`}>
            {todo.title}
          </div>
          <div className="todo-meta">
            {todo.description && (
              <span className="todo-description">{todo.description} • </span>
            )}
            <span className="todo-date">
              {formatDate(todo.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={handleDelete}
          className="delete-button"
          type="button"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}