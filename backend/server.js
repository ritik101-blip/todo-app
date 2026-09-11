const express = require("express");
const cors = require("cors");
const pool = require("./db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Todo API is running");
});

// Get all todos
app.get("/api/todos", async (req, res) => {
    try {
        const [todos] = await pool.query(
            "SELECT * FROM todos ORDER BY id DESC"
        );

        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch todos",
            error: error.message,
        });
    }
});

// Create a todo
app.post("/api/todos", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const [result] = await pool.query(
            "INSERT INTO todos (title, description) VALUES (?, ?)",
            [title.trim(), description || null]
        );

        const [newTodo] = await pool.query(
            "SELECT * FROM todos WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(newTodo[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create todo",
            error: error.message,
        });
    }
});

// Update todo completion status
app.put("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        await pool.query(
            "UPDATE todos SET completed = ? WHERE id = ?",
            [completed, id]
        );

        const [updatedTodo] = await pool.query(
            "SELECT * FROM todos WHERE id = ?",
            [id]
        );

        if (updatedTodo.length === 0) {
            return res.status(404).json({
                message: "Todo not found",
            });
        }

        res.json(updatedTodo[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update todo",
            error: error.message,
        });
    }
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM todos WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Todo not found",
            });
        }

        res.json({
            message: "Todo deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete todo",
            error: error.message,
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});