import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Database se tasks fetch karna
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Page load hote hi tasks lana
  useEffect(() => {
    fetchTodos();
  }, []);

  // New task add karna
  const addTodo = async (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTodo = await response.json();

      setTodos((previousTodos) => [...previousTodos, newTodo]);
      setTask("");
    } catch (error) {
      console.error("Add error:", error);
      alert("Task add nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  // Task complete/uncomplete karna
  const toggleTodo = async (id) => {
    const selectedTodo = todos.find((todo) => todo.id === id);

    if (!selectedTodo) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !selectedTodo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTodo = await response.json();

      setTodos((previousTodos) =>
        previousTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Update error:", error);
      alert("Task update nahi ho paya");
    }
  };

  // Task delete karna
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Task delete nahi ho paya");
    }
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

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "+ Add Task"}
            </button>
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
                  checked={Boolean(todo.completed)}
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