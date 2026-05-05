// ===== หา elements จาก HTML =====
const taskInput = document.getElementById('taskInput')
const addBtn = document.getElementById('addBtn')
const taskList = document.getElementById('taskList')
const foxEmoji = document.getElementById('foxEmoji')
const foxSpeech = document.getElementById('foxSpeech')
const moodBtns = document.querySelectorAll('.mood-btn')
const priBtns = document.querySelectorAll('.pri-btn')
let currentPriority = 'normal'

// ===== MOOD =====
moodBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    moodBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    updateFox()
  })
})

// ===== PRIORITY SELECT =====
priBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    priBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentPriority = btn.dataset.priority
  })
})

// ===== ADD TASK =====
addBtn.addEventListener('click', addTask)
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask()
})

function addTask() {
  const text = taskInput.value.trim()
  if (!text) return

  const li = document.createElement('li')
  li.className = `task-item ${currentPriority}` 
  li.innerHTML = `
    <div class="task-check" onclick="toggleTask(this)"></div>
    <span class="task-text">${text}</span>
    <button class="task-delete" onclick="deleteTask(this)">✕</button>
  `
  taskList.appendChild(li)
  taskInput.value = ''
  updateFox()

  function saveTasks() {
  const tasks = []
  taskList.querySelectorAll('.task-item').forEach(item => {
    tasks.push({
      text: item.querySelector('.task-text').textContent,
      done: item.classList.contains('done'),
      priority: item.dataset.priority || 'normal'
    })
  })
  localStorage.setItem('foxnotes', JSON.stringify(tasks))
}
}

// ===== COMPLETE TASK =====
function toggleTask(checkEl) {
  const item = checkEl.parentElement
  item.classList.toggle('done')
  checkEl.classList.toggle('checked')
  checkEl.textContent = checkEl.classList.contains('checked') ? '✓' : ''
  updateFox()
  saveTasks()

  // เช็คว่าเสร็จทุก task มั้ย
  const allTasks = taskList.querySelectorAll('.task-item')
  const doneTasks = taskList.querySelectorAll('.task-item.done')
  if (allTasks.length > 0 && allTasks.length === doneTasks.length) {
    celebrate()
  }
}

// ===== DELETE TASK =====
function deleteTask(btn) {
  btn.parentElement.remove()
  updateFox()
  saveTasks()
}

// ===== FOX REACTIONS =====
function updateFox() {
  const allTasks = taskList.querySelectorAll('.task-item')
  const doneTasks = taskList.querySelectorAll('.task-item.done')
  const total = allTasks.length
  const done = doneTasks.length

  if (total === 0) {
    foxEmoji.textContent = '🦊'
    foxSpeech.textContent = 'Hello, add new task here 🦊'
  } else if (done === 0) {
    foxEmoji.textContent = '🦊'
    foxSpeech.textContent = `Have ${total} task waiting! Let's get started 💪`
  } else if (done < total) {
    foxEmoji.textContent = '🦊'
    foxSpeech.textContent = `Great job! You've completed ${done}/${total} tasks 🔥`
  } else {
    foxEmoji.textContent = '🦊'
    foxSpeech.textContent = `All done!! You're doing great! ✨`
  }
}

// ===== CONFETTI =====
function celebrate() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#a0784a', '#d4b896', '#f5ede0', '#5c3d1e', '#fdf6ec']
  })
}

// ===== SAVE & LOAD =====
function saveTasks() {
  const tasks = []
  taskList.querySelectorAll('.task-item').forEach(item => {
    tasks.push({
      text: item.querySelector('.task-text').textContent,
      done: item.classList.contains('done'),
      priority: item.dataset.priority || 'normal'
    })
  })
  localStorage.setItem('foxnotes', JSON.stringify(tasks))
}

function loadTasks() {
  const saved = localStorage.getItem('foxnotes')
  if (!saved) return
  JSON.parse(saved).forEach(task => {
    const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : ''
    const li = document.createElement('li')
    li.className = `task-item ${task.priority || 'normal'}` + (task.done ? ' done' : '')
    li.dataset.priority = task.priority || 'normal'
    li.innerHTML = `
      <div class="task-check ${task.done ? 'checked' : ''}" onclick="toggleTask(this)">${task.done ? '✓' : ''}</div>
      <span class="task-text">${task.text}</span>
      <span class="priority-dot">${priorityEmoji}</span>
      <button class="task-delete" onclick="deleteTask(this)">✕</button>
    `
    taskList.appendChild(li)
  })
  updateFox()
}

loadTasks()
