import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo
  } = useTodos();

  const completedCount = todos.filter(todo => todo.done).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Todo-App</h1>
          <p className="subtitle">
            Verwalte deine Aufgaben effizient
          </p>
          {totalCount > 0 && (
            <div className="stats">
              {completedCount} von {totalCount} Todos erledigt
            </div>
          )}
        </header>

        <main className="app-main">
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
          />
        </main>

        <footer className="app-footer">
          <p>React Todo App mit Spring Boot Backend</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
