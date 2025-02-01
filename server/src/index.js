const express = require("express");
const sequelize = require("./database");
const Todo = require("./models/todo");
const cron = require("cron");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync().then(() => {
  console.log("Database synced");
});

// Cron job to reset daily todos
const resetDailyTodos = new cron.CronJob("1 0 * * *", async () => {
  try {
    await Todo.update({ isDone: false }, { where: { type: "daily" } });
    console.log("Daily todos reset to not done");
  } catch (error) {
    console.error("Error resetting daily todos:", error);
  }
});

resetDailyTodos.start();

// Routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { name, description, priority, deadline, type } = req.body;
  try {
    const todo = await Todo.create({
      name,
      description,
      priority,
      deadline,
      type,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, priority, deadline, type } = req.body;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.update({ name, description, priority, deadline, type });
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch("/todos/:id/done", async (req, res) => {
  const { id } = req.params;
  const { isDone } = req.body;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.update({ isDone });
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
