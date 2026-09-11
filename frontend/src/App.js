import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    const newTodo = {
      id: Date.now(),
      title: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <div className="overlay"></div>

      <div className="container">
        <header className="header">
          <div>
            <p className="eyebrow">PERSONAL PRODUCTIVITY</p>

            <h1>
              Task<span>Flow</span>
            </h1>

            <p className="subtitle">
              Turn your plans into progress.
            </p>
          </div>

          <div className="date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="stats">
          <div className="stat-card">
            <h2>{todos.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h2>
              {todos.filter((todo) => !todo.completed).length}
            </h2>
            <p>In Progress</p>
          </div>

          <div className="stat-card">
            <h2>
              {todos.filter((todo) => todo.completed).length}
            </h2>
            <p>Completed</p>
          </div>
        </div>

        <section className="todo-card">
          <h2>Create a task</h2>

          <form onSubmit={addTodo}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <button type="submit">+ Add Task</button>
          </form>

          <h2 className="task-heading">Your Tasks</h2>

          {todos.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <p>No tasks yet.</p>
              <span>Add something great to get started.</span>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                className={`task ${todo.completed ? "completed" : ""
                  }`}
                key={todo.id}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />

                <span>{todo.title}</span>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>

        <footer>
          Built with React.js • Stay productive
        </footer>
      </div>
    </div>
  );
}

export default App;