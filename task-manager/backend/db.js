const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'data', 'tasks.json');

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    }
}

function readTasks() {
    ensureDataDir();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeTasks(tasks) {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
}

// Generate a unique ID (similar to MongoDB ObjectId style)
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

module.exports = { readTasks, writeTasks, generateId };
