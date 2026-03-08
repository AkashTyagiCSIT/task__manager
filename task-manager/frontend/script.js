const API_URL = "https://task-manager-bi134t900-attyagi2002-1021s-projects.vercel.app";

let editingTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  
  document.getElementById('taskForm').addEventListener('submit', handleAddTask);
});

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    
    displayTasks(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

function displayTasks(tasks) {
  const tasksList = document.getElementById('tasksList');
  
  if (tasks.length === 0) {
    tasksList.innerHTML = '<div class="no-tasks">No tasks yet. Add your first task!</div>';
    return;
  }
  
  tasksList.innerHTML = tasks.map(task => `
    <div class="task-card ${task.status.toLowerCase()}">
      <div class="task-header">
        <h3 class="task-title">${task.title}</h3>
        <span class="task-status ${task.status.toLowerCase()}">${task.status}</span>
      </div>
      <p class="task-description">${task.description}</p>
      <div class="task-actions">
        <button class="edit-btn" onclick="startEdit('${task._id}', '${task.title}', '${task.description}')">Edit</button>
        <button class="toggle-btn" onclick="toggleStatus('${task._id}', '${task.status}')">${task.status === 'Pending' ? 'Mark Complete' : 'Mark Pending'}</button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
      <div id="edit-${task._id}"></div>
    </div>
  `).join('');
}

async function handleAddTask(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  
  if (!title || !description) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
    
    if (response.ok) {
      document.getElementById('taskForm').reset();
      loadTasks();
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

function startEdit(id, title, description) {
  const editDiv = document.getElementById(`edit-${id}`);
  
  editDiv.innerHTML = `
    <div class="edit-form">
      <input type="text" id="editTitle-${id}" value="${title}" required>
      <textarea id="editDesc-${id}" rows="3" required>${description}</textarea>
      <button onclick="saveEdit('${id}')">Save</button>
      <button class="cancel-btn" onclick="cancelEdit('${id}')">Cancel</button>
    </div>
  `;
}

async function saveEdit(id) {
  const title = document.getElementById(`editTitle-${id}`).value;
  const description = document.getElementById(`editDesc-${id}`).value;
  
  if (!title || !description) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
    
    if (response.ok) {
      loadTasks();
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

function cancelEdit(id) {
  document.getElementById(`edit-${id}`).innerHTML = '';
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      loadTasks();
    }
  } catch (error) {
    console.error('Error toggling status:', error);
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadTasks();
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
