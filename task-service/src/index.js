const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const Task = require('../models/task');
const amqp = require('amqplib/callback_api');


const app = express();
app.use(bodyParser.json());

sequelize.sync();

//create task

app.post('/tasks', async (req, res) => {
  const { userId, title, description, status, dueDate } = req.body;
  try {
    const task = await Task.create({ user_id: userId, title, description, due_date: dueDate, status: 'pending' });
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


function notifyCompletion(userId, taskTitle) {
  amqp.connect('amqp://rabbitmq', (error0, connection) => {
      if (error0) {
          throw error0;
      }
      connection.createChannel((error1, channel) => {
          if (error1) {
              throw error1;
          }

          const queue = 'task_notifications';
          const msg = JSON.stringify({
              userId: userId,
              message: `Task "${taskTitle}" has been completed!`
          });

          channel.assertQueue(queue, {
              durable: false
          });

          channel.sendToQueue(queue);
      });
  });
}

//mark task as completed


app.put('/tasks/:id/complete', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.body.userId;
    const taskTitle = req.body.title;

    const task = await Task.findByPk(taskId);

    if (task) {
      task.status = 'completed';
      await task.save();

      // notifyCompletion(userId, taskTitle);

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
