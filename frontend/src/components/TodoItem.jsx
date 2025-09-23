import { useState } from 'react';
import './TodoItem.css';
import { useToast } from '../hooks/useToast';

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'MEDIUM');
  const toast = useToast();

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('de-DE');
    } catch (error) {
      return '';
    }
  };

  const handleToggle = async () => {
    try {
      await onToggle(todo);
      toast.success(todo.done ? 'Todo marked as pending!' : 'Todo completed!');
    } catch (error) {
      toast.error('Failed to update todo status.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Todo "${todo.title}" löschen?`)) {
      try {
        await onDelete(todo.id);
        toast.success('Todo deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete todo.');
      }
    }
  };

  const handleDoubleClick = () => {
    if (!todo.done) { // Nur bearbeitbar wenn nicht abgeschlossen
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editTitle.trim() && onUpdate) {
      try {
        await onUpdate(todo.id, {
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          priority: editPriority,
          done: todo.done
        });
        setIsEditing(false);
        toast.success('Todo updated successfully!');
      } catch (error) {
        toast.error('Failed to update todo. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority || 'MEDIUM');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
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
        <div className="todo-content" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <div className="todo-edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="edit-title-input"
                placeholder="Todo Titel"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="edit-description-input"
                placeholder="Beschreibung (optional)"
                rows="2"
              />
              <div className="edit-priority-field">
                <label htmlFor={`priority-${todo.id}`}>Priorität:</label>
                <select
                  id={`priority-${todo.id}`}
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="edit-priority-select"
                >
                  <option value="LOW">Niedrig</option>
                  <option value="MEDIUM">Mittel</option>
                  <option value="HIGH">Hoch</option>
                </select>
              </div>
              <div className="edit-actions">
                <button onClick={handleSave} className="save-button">
                  Speichern
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <div className="todo-display">
              <div className="todo-header">
                <div className={`todo-title ${todo.done ? 'done' : ''}`} title="Doppelklick zum Bearbeiten">
                  {todo.title}
                </div>
                <div className={`priority-badge priority-${(todo.priority || 'MEDIUM').toLowerCase()}`}>
                  {todo.priority === 'HIGH' ? 'Hoch' : 
                   todo.priority === 'LOW' ? 'Niedrig' : 'Mittel'}
                </div>
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
          )}
        </div>
      </div>
      <div className="todo-actions">
        {!isEditing && (
          <button
            onClick={handleDelete}
            className="delete-button"
            type="button"
          >
            Löschen
          </button>
        )}
      </div>
    </div>
  );
}