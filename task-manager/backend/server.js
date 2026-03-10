const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send("Task Manager API Running");
});

app.use('/tasks', taskRoutes);

module.exports = app;
