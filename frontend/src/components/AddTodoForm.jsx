import { useState } from 'react';
import './AddTodoForm.css';
import { useToast } from '../hooks/useToast';

export function AddTodoForm({ onAdd, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Bitte geben Sie einen Titel ein');
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || null,
        priority: priority,
        done: false
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      toast.success('Todo erfolgreich erstellt!');
    } catch (error) {
      console.error('Failed to add todo:', error);
      toast.error('Fehler beim Erstellen des Todos');
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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={submitting || loading}
          className="priority-select"
        >
          <option value="LOW">Niedrig</option>
          <option value="MEDIUM">Mittel</option>
          <option value="HIGH">Hoch</option>
        </select>
        <button
          type="submit"
          disabled={!title.trim() || submitting || loading}
          className="add-button"
        >
          <span>{submitting ? 'Hinzufügen...' : 'Todo hinzufügen'}</span>
        </button>
      </div>
    </form>
  );
}