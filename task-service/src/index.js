const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const Task = require('../models/task');

const app = express();
app.use(bodyParser.json());

sequelize.sync();

//create task

app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const task = await Task.create({ title, description, dueDate });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//get all tasks

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get task with particular id
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update task with id
app.put('/tasks/:id', async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.send('Task deleted');
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//mark task as completed

app.put('/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      task.status = 'completed';
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Task service running on port 3001');
});
