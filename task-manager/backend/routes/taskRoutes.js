const express = require('express');
const { readTasks, writeTasks, generateId } = require('../db');
const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  try {
    const tasks = readTasks();
    // Sort by createdAt descending (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a task
router.post('/', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const tasks = readTasks();
    const now = new Date().toISOString();
    const task = {
      _id: generateId(),
      title,
      description,
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };

    tasks.push(task);
    writeTasks(tasks);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t._id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (status !== undefined) tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(tasks);
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t._id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
