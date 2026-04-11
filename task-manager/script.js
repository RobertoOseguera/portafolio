// Task Manager Pro - Full Featured
// Drag & Drop, LocalStorage, Filters, Export/Import

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    this.updateStats();
  }

  bindEvents() {
    document.getElementById('add-task').addEventListener('click', () => this.addTask());
    document.getElementById('new-task').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    document.getElementById('filter').addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.render();
    });
    
    document.getElementById('clear-completed').addEventListener('click', () => this.clearCompleted());
    
    document.getElementById('export-json').addEventListener('click', () => this.exportJSON());
    document.getElementById('import-json').addEventListener('click', () => this.importJSON());
    
    // Drag & Drop
    const container = document.getElementById('tasks-container');
    container.addEventListener('dragover', this.handleDragOver.bind(this));
    container.addEventListener('drop', this.handleDrop.bind(this));
  }

  addTask() {
    const input = document.getElementById('new-task');
    const text = input.value.trim();
    
    if (!text) return;
    
    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      created: new Date().toLocaleDateString('es-ES')
    };
    
    this.tasks.unshift(task);
    input.value = '';
    this.save();
    this.render();
    this.updateStats();
  }

  toggleTask(id) {
    this.tasks = this.tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    );
    this.save();
    this.render();
    this.updateStats();
  }

  deleteTask(id) {
    if (confirm('¿Eliminar tarea?')) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.save();
      this.render();
      this.updateStats();
    }
  }

  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    const newText = prompt('Editar tarea:', task.text);
    if (newText && newText.trim()) {
      this.tasks = this.tasks.map(t => t.id === id ? {...t, text: newText.trim()} : t);
      this.save();
      this.render();
    }
  }

  clearCompleted() {
    if (confirm('¿Eliminar todas las tareas completadas?')) {
      this.tasks = this.tasks.filter(task => !task.completed);
      this.save();
      this.render();
      this.updateStats();
    }
  }

  getFilteredTasks() {
    return this.tasks.filter(task => {
      if (this.currentFilter === 'all') return true;
      return this.currentFilter === 'pending' ? !task.completed : task.completed;
    });
  }

  render() {
    const container = document.getElementById('tasks-container');
    const filteredTasks = this.getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>${this.currentFilter === 'all' ? '¡Sin tareas! Crea la primera.' : 'No hay tareas ' + (this.currentFilter === 'pending' ? 'pendientes' : 'completadas')}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredTasks.map(task => `
      <div class="task ${task.completed ? 'completed' : ''}" draggable="true" data-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="taskManager.toggleTask(${task.id})">
        <div class="task-main">
          <div class="task-text">${task.text}</div>
          <div class="task-date">${task.created}</div>
        </div>
        <div class="task-actions">
          <button class="edit-btn" onclick="taskManager.editTask(${task.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  updateStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter(t => !t.completed).length;
    const completed = total - pending;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('pending-tasks').textContent = pending;
    document.getElementById('completed-tasks').textContent = completed;
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  exportJSON() {
    const dataStr = JSON.stringify(this.tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
              this.tasks = imported.map(task => ({...task, id: Date.now() + Math.random()}));
              this.save();
              this.render();
              this.updateStats();
              alert('¡Importado correctamente!');
            }
          } catch {
            alert('Error en archivo JSON');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  // Drag & Drop
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDrop(e) {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
      const task = this.tasks.splice(taskIndex, 1)[0];
      this.tasks.unshift(task);
      this.save();
      this.render();
    }
  }
}

// Global instance
const taskManager = new TaskManager();

// Drag start for all tasks
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('task')) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
  }
});
