import { useState } from 'react';
import './AddTodoForm.css';

export function AddTodoForm({ onAdd, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || null,
        done: false
      });
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Neues Todo"
          required
          disabled={submitting || loading}
          className="title-input"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung (optional)"
          disabled={submitting || loading}
          className="description-input"
        />
        <button
          type="submit"
          disabled={!title.trim() || submitting || loading}
          className="add-button"
        >
          {submitting ? 'Hinzufügen...' : 'Hinzufügen'}
        </button>
      </div>
    </form>
  );
}