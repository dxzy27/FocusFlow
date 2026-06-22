// Timer settings
let POMODORO_TIME = parseInt(localStorage.getItem('pomodoroTime') || '1500');
let SHORT_BREAK_TIME = parseInt(localStorage.getItem('shortBreakTime') || '300');
let LONG_BREAK_TIME = parseInt(localStorage.getItem('longBreakTime') || '900');



// Sound settings
let ALARM_SOUND = localStorage.getItem('alarmSound') || 'kitchen';
let ALARM_VOLUME = parseInt(localStorage.getItem('alarmVolume') || '50');
let ALARM_REPEAT = parseInt(localStorage.getItem('alarmRepeat') || '1');
let TICKING_SOUND = localStorage.getItem('tickingSound') || 'none';
let TICKING_VOLUME = parseInt(localStorage.getItem('tickingVolume') || '50');

// Audio elements
const alarmSounds = {
    kitchen: document.getElementById('alarmKitchen'),
    bell: document.getElementById('alarmBell'),
    digital: document.getElementById('alarmDigital')
};

const tickingSounds = {
    soft: document.getElementById('tickingSoft'),
    mechanical: document.getElementById('tickingMechanical'),
    white: document.getElementById('whiteNoise'),
    brown: document.getElementById('brownNoise')
};

// Sound control functions
function playAlarm() {
    return new Promise((resolve) => {
        if (ALARM_SOUND === 'none') {
            resolve();
            return;
        }
        
        const alarm = alarmSounds[ALARM_SOUND];
        if (!alarm) {
            resolve();
            return;
        }

        alarm.volume = ALARM_VOLUME / 100;
        let playCount = 0;

        function playNext() {
            playCount++;
            if (playCount <= ALARM_REPEAT) {
                alarm.currentTime = 0;
                alarm.play()
                    .catch(console.error)
                    .then(() => {
                        if (playCount === ALARM_REPEAT) {
                            resolve();
                        }
                    });
            } else {
                resolve();
            }
        }

        alarm.addEventListener('ended', playNext, { once: true });
        playNext();
    });
}

function playTickingSound() {
    // Only play a single tick sound when timer starts
    if (TICKING_SOUND !== 'none') {
        const ticking = tickingSounds[TICKING_SOUND];
        if (ticking) {
            ticking.volume = TICKING_VOLUME / 100;
            ticking.currentTime = 0;
            ticking.play().catch(console.error);
        }
    }
}

function stopAllTickingSounds() {
    // Stop all ticking sounds
    Object.values(tickingSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

function updateTickingSound() {
    // This function is now only used when changing sound settings
    stopAllTickingSounds();
}

// Update ticking sound when changed in settings
function updateSoundSettings() {
    Object.values(alarmSounds).forEach(sound => {
        sound.volume = ALARM_VOLUME / 100;
    });
    Object.values(tickingSounds).forEach(sound => {
        sound.volume = TICKING_VOLUME / 100;
    });
    updateTickingSound();
}

// DOM Elements
const timerDisplay = document.querySelector('.timer');
const startBtn = document.querySelector('.start-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const trackName = document.querySelector('.track-name');
const progress = document.querySelector('.progress');

// Timer variables
let timeLeft = POMODORO_TIME;
let isRunning = false;
let timerInterval;
let currentMode = 'pomodoro';



// Music player variables
let currentTrack = 0;
let currentGenre = 'lofi';

const playlists = {
    lofi: [
        { name: 'At a glance', url: 'music/lofi/track1.mp3' },
        { name: 'Beauty', url: 'music/lofi/track2.mp3' },
        { name: 'Call me', url: 'music/lofi/track3.mp3' },
        { name: 'Garden in a bottle', url: 'music/lofi/track4.mp3' },
        { name: 'Get some rest', url: 'music/lofi/track5.mp3' }
    ],
    classical: [
        { name: 'Mozart - Piano Concerto', url: 'music/classical/track1.mp3' },
        { name: 'Bach - Air on G String', url: 'music/classical/track2.mp3' },
        { name: 'Beethoven - Moonlight Sonata', url: 'music/classical/track3.mp3' }
    ],
    nature: [
        { name: 'Rain Sounds', url: 'music/nature/track1.mp3' },
        { name: 'Ocean Waves', url: 'music/nature/track2.mp3' },
        { name: 'Forest Ambience', url: 'music/nature/track3.mp3' }
    ]
};

let tracks = playlists[currentGenre];

let audio = new Audio();
let isPlaying = false;

// Timer functions
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'STOP';
        document.body.classList.add('timer-running');
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = 'START';
                document.body.classList.remove('timer-running');
                alert('Time is up!');
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'START';
        document.body.classList.remove('timer-running');
    }
}

function switchMode(mode) {
    currentMode = mode;
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'START';
    
    // Remove all mode classes first
    document.body.classList.remove('short-break-mode', 'long-break-mode');
    
    switch (mode) {
        case 'pomodoro':
            timeLeft = POMODORO_TIME;
            break;
        case 'short-break':
            timeLeft = SHORT_BREAK_TIME;
            document.body.classList.add('short-break-mode');
            break;
        case 'long-break':
            timeLeft = LONG_BREAK_TIME;
            document.body.classList.add('long-break-mode');
            break;
    }
    
    updateTimerDisplay();
}

// Music player functions
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function loadTrack(trackIndex) {
    audio.src = tracks[trackIndex].url;
    trackName.textContent = tracks[trackIndex].name;
    if (isPlaying) {
        audio.play();
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
}

// Genre selection
const genreBtns = document.querySelectorAll('.genre-btn');

function switchGenre(genre) {
    currentGenre = genre;
    tracks = playlists[genre];
    currentTrack = 0;
    
    // Update active button
    genreBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.genre === genre) {
            btn.classList.add('active');
        }
    });

    // Load first track of new genre
    loadTrack(0);
    if (isPlaying) {
        audio.play();
    }
    logActivity(`Switched to ${genre} music`);
}

// Event listeners
startBtn.addEventListener('click', startTimer);

genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchGenre(btn.dataset.genre);
    });
});

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        navBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        switchMode(e.target.dataset.mode);
    });
});

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// Logging functionality
let userActivities = [];

function logActivity(action) {
    const timestamp = new Date().toLocaleString();
    userActivities.push(`${timestamp}: ${action}`);
}

function generateLogFile() {
    const logContent = userActivities.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Track completed pomodoros
let completedPomodoros = 0;

// Add logging to timer actions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'STOP';
        document.body.classList.add('timer-running');
        logActivity(`Started ${currentMode} timer`);
        
        // Play a single tick sound only when pomodoro timer starts
        if (currentMode === 'pomodoro') {
            playTickingSound();
        }
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = 'START';
                document.body.classList.remove('timer-running');
                logActivity(`Completed ${currentMode} session`);
                
                // Stop any ticking sounds
                stopAllTickingSounds();
                
                // Play the alarm sound
                playAlarm();
                
                // Only increment completed pomodoros for pomodoro sessions (not breaks)
                if (currentMode === 'pomodoro') {
                    completedPomodoros++;
                    updateTaskCompletion();
                    logActivity(`Completed ${completedPomodoros} pomodoro(s) total`);
                }
                
                // Auto-reset timer to current mode's duration
                resetTimerToCurrentMode();
                showNotification(`Timer reset to ${formatTime(timeLeft)}`);
                logActivity(`Timer auto-reset to ${currentMode} duration`);
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'START';
        document.body.classList.remove('timer-running');
        logActivity(`Stopped ${currentMode} timer`);
        
        // Stop any ticking sounds when timer is stopped
        stopAllTickingSounds();
    }
}

// Add logging to mode switches
function switchMode(mode) {
    logActivity(`Switched to ${mode} mode`);
    currentMode = mode;
    // Remove all mode classes first
    document.body.classList.remove('short-break-mode', 'long-break-mode');
    
    switch (mode) {
        case 'pomodoro':
            timeLeft = POMODORO_TIME;
            break;
        case 'short-break':
            timeLeft = SHORT_BREAK_TIME;
            document.body.classList.add('short-break-mode');
            break;
        case 'long-break':
            timeLeft = LONG_BREAK_TIME;
            document.body.classList.add('long-break-mode');
            break;
    }
    
    updateTimerDisplay();
}

// Function to reset timer to current mode's duration
function resetTimerToCurrentMode() {
    switch (currentMode) {
        case 'pomodoro':
            timeLeft = POMODORO_TIME;
            break;
        case 'short-break':
            timeLeft = SHORT_BREAK_TIME;
            break;
        case 'long-break':
            timeLeft = LONG_BREAK_TIME;
            break;
    }
    updateTimerDisplay();
}

// Add log button event listener
document.getElementById('logBtn').addEventListener('click', generateLogFile);

// Task Management
const tasksList = document.getElementById('tasksList');
const addTaskBtn = document.getElementById('addTaskBtn');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.draggable = true;
    taskDiv.innerHTML = `
        <div class="task-content">
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-details">
                <span class="task-text">${task.text}</span>
                <span class="pomodoro-estimate">${task.pomodoros} ${task.pomodoros === 1 ? 'Pomodoro' : 'Pomodoros'}</span>
                ${task.notes ? `<span class="task-notes-display">${task.notes}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="task-edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="task-delete"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add event listeners for checkbox, edit, and delete
    const checkbox = taskDiv.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        logActivity(`${task.completed ? 'Completed' : 'Uncompleted'} task: ${task.text}`);
    });

    const editBtn = taskDiv.querySelector('.task-edit');
    editBtn.addEventListener('click', () => {
        // Show task modal with current task data
        taskInput.value = task.text;
        pomodoroCount.value = task.pomodoros;
        if (task.notes) {
            taskNotes.value = task.notes;
            notesSection.style.display = 'block';
        } else {
            taskNotes.value = '';
            notesSection.style.display = 'none';
        }
        
        // Change save button behavior for editing
        saveTask.dataset.editMode = 'true';
        saveTask.dataset.taskIndex = tasks.indexOf(task);
        
        // Show modal in edit mode
        showTaskModal(true);
    });

    const deleteBtn = taskDiv.querySelector('.task-delete');
    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        taskDiv.remove();
        saveTasks();
        logActivity(`Deleted task: ${task.text}`);
    });
    
    // Drag and drop functionality
    taskDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', tasks.indexOf(task));
        taskDiv.classList.add('dragging');
        setTimeout(() => {
            taskDiv.classList.add('drag-ghost');
        }, 0);
    });
    
    taskDiv.addEventListener('dragend', () => {
        taskDiv.classList.remove('dragging', 'drag-ghost');
    });

    return taskDiv;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        tasksList.appendChild(createTaskElement(task));
    });
}

// Set up drag and drop for task list container
function setupTaskDragAndDrop() {
    tasksList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        if (!draggingElement) return;
        
        const afterElement = getDragAfterElement(tasksList, e.clientY);
        if (afterElement) {
            tasksList.insertBefore(draggingElement, afterElement);
        } else {
            tasksList.appendChild(draggingElement);
        }
    });
    
    tasksList.addEventListener('drop', (e) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const taskElements = Array.from(tasksList.querySelectorAll('.task-item'));
        const destinationIndex = taskElements.indexOf(document.querySelector('.dragging'));
        
        if (sourceIndex !== destinationIndex && !isNaN(sourceIndex) && destinationIndex !== -1) {
            // Reorder tasks array
            const [movedTask] = tasks.splice(sourceIndex, 1);
            tasks.splice(destinationIndex, 0, movedTask);
            saveTasks();
            logActivity(`Reordered task: ${movedTask.text}`);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to update task completion based on completed pomodoros
function updateTaskCompletion() {
    // Only proceed if there are tasks
    if (tasks.length === 0) return;
    
    // Find the first uncompleted task
    const firstUncompletedTaskIndex = tasks.findIndex(task => !task.completed);
    
    // If all tasks are completed, do nothing
    if (firstUncompletedTaskIndex === -1) return;
    
    const task = tasks[firstUncompletedTaskIndex];
    
    // Check if we've completed enough pomodoros for this task
    if (completedPomodoros >= task.pomodoros) {
        // Mark the task as completed
        task.completed = true;
        
        // Reset the pomodoro counter for the next task
        completedPomodoros = completedPomodoros - task.pomodoros;
        
        // Save and update UI
        saveTasks();
        renderTasks();
        
        // Show notification
        showNotification(`Task completed: ${task.text}`);
        
        // If we still have completed pomodoros left, recursively check the next task
        if (completedPomodoros > 0) {
            updateTaskCompletion();
        }
    }
}

const taskModal = document.getElementById('taskModal');
const taskInput = document.getElementById('taskInput');
const taskModalTitle = document.getElementById('taskModalTitle');
const pomodoroCount = document.getElementById('pomodoroCount');
const incrementCount = document.getElementById('incrementCount');
const decrementCount = document.getElementById('decrementCount');
const cancelTask = document.getElementById('cancelTask');
const saveTask = document.getElementById('saveTask');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesSection = document.getElementById('notesSection');
const taskNotes = document.getElementById('taskNotes');

function showTaskModal(isEditing = false) {
    taskModal.classList.add('show');
    taskModalTitle.textContent = isEditing ? 'Edit Task' : 'Add Task';
    taskInput.focus();
}

function hideTaskModal() {
    taskModal.classList.remove('show');
    taskInput.value = '';
    pomodoroCount.value = '1';
    taskNotes.value = '';
    notesSection.style.display = 'none';
    
    // Reset edit mode
    saveTask.dataset.editMode = 'false';
    saveTask.dataset.taskIndex = '';
}

addTaskBtn.addEventListener('click', showTaskModal);
cancelTask.addEventListener('click', hideTaskModal);

addNoteBtn.addEventListener('click', () => {
    notesSection.style.display = notesSection.style.display === 'none' ? 'block' : 'none';
    if (notesSection.style.display === 'block') {
        taskNotes.focus();
    }
});

incrementCount.addEventListener('click', () => {
    pomodoroCount.value = parseInt(pomodoroCount.value) + 1;
});

decrementCount.addEventListener('click', () => {
    if (parseInt(pomodoroCount.value) > 1) {
        pomodoroCount.value = parseInt(pomodoroCount.value) - 1;
    }
});

saveTask.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        // Check if we're in edit mode
        if (saveTask.dataset.editMode === 'true') {
            const taskIndex = parseInt(saveTask.dataset.taskIndex);
            const oldTask = tasks[taskIndex];
            const oldText = oldTask.text;
            const oldPomodoros = oldTask.pomodoros;
            
            // Update task data
            oldTask.text = text;
            oldTask.pomodoros = parseInt(pomodoroCount.value);
            oldTask.notes = taskNotes.value.trim();
            
            // Reset edit mode
            saveTask.dataset.editMode = 'false';
            saveTask.dataset.taskIndex = '';
            
            // Update UI
            renderTasks();
            saveTasks();
            logActivity(`Edited task from "${oldText}" (${oldPomodoros} pomodoros) to "${oldTask.text}" (${oldTask.pomodoros} pomodoros)`);
        } else {
            // Add new task
            const task = {
                text: text,
                completed: false,
                pomodoros: parseInt(pomodoroCount.value),
                notes: taskNotes.value.trim()
            };
            tasks.push(task);
            tasksList.appendChild(createTaskElement(task));
            saveTasks();
            logActivity(`Added new task: ${task.text} (${task.pomodoros} pomodoros)`);
        }
        hideTaskModal();
    }
});

// Initialize drag and drop after page load
document.addEventListener('DOMContentLoaded', () => {
    setupTaskDragAndDrop();
});

// Add task styles
const taskStyles = `
.task-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.task-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.task-text {
    font-size: 14px;
}

.task-actions {
    display: flex;
    gap: 5px;
}

.task-actions button {
    background: none;
    border: none;
    color: var(--text-color);
    opacity: 0.7;
    cursor: pointer;
    padding: 4px;
}

.task-actions button:hover {
    opacity: 1;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = taskStyles;
document.head.appendChild(styleSheet);





// Settings functionality
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');

// Settings inputs
const pomodoroTimeInput = document.getElementById('pomodoroTime');
const shortBreakTimeInput = document.getElementById('shortBreakTime');
const longBreakTimeInput = document.getElementById('longBreakTime');



// Sound inputs
const alarmSoundInput = document.getElementById('alarmSound');
const alarmVolumeInput = document.getElementById('alarmVolume');
const alarmRepeatInput = document.getElementById('alarmRepeat');
const tickingSoundInput = document.getElementById('tickingSound');
const tickingVolumeInput = document.getElementById('tickingVolume');

// Load saved settings
function loadSettings() {
    // Timer settings
    pomodoroTimeInput.value = POMODORO_TIME;
    shortBreakTimeInput.value = SHORT_BREAK_TIME;
    longBreakTimeInput.value = LONG_BREAK_TIME;



    // Sound settings
    alarmSoundInput.value = ALARM_SOUND;
    alarmVolumeInput.value = ALARM_VOLUME;
    alarmRepeatInput.value = ALARM_REPEAT;
    tickingSoundInput.value = TICKING_SOUND;
    tickingVolumeInput.value = TICKING_VOLUME;
}

// Save settings
function saveSettingsHandler() {
    // Save timer settings to variables
    POMODORO_TIME = parseInt(pomodoroTimeInput.value);
    SHORT_BREAK_TIME = parseInt(shortBreakTimeInput.value);
    LONG_BREAK_TIME = parseInt(longBreakTimeInput.value);



    // Save sound settings to variables
    ALARM_SOUND = alarmSoundInput.value;
    ALARM_VOLUME = parseInt(alarmVolumeInput.value);
    ALARM_REPEAT = parseInt(alarmRepeatInput.value);
    TICKING_SOUND = tickingSoundInput.value;
    TICKING_VOLUME = parseInt(tickingVolumeInput.value);

    // Save timer settings to localStorage
    localStorage.setItem('pomodoroTime', pomodoroTimeInput.value);
    localStorage.setItem('shortBreakTime', shortBreakTimeInput.value);
    localStorage.setItem('longBreakTime', longBreakTimeInput.value);



    // Save sound settings to localStorage
    localStorage.setItem('alarmSound', ALARM_SOUND);
    localStorage.setItem('alarmVolume', ALARM_VOLUME.toString());
    localStorage.setItem('alarmRepeat', ALARM_REPEAT.toString());
    localStorage.setItem('tickingSound', TICKING_SOUND);
    localStorage.setItem('tickingVolume', TICKING_VOLUME.toString());

    // Update sound settings
    updateSoundSettings();

    // Update timer if not running
    if (!isRunning) {
        timeLeft = currentMode === 'pomodoro' ? POMODORO_TIME :
                  currentMode === 'short-break' ? SHORT_BREAK_TIME : LONG_BREAK_TIME;
        updateTimerDisplay();
    }

    // Close modal
    settingsModal.style.display = 'none';
    logActivity('Settings updated');
}

// About button scroll
document.getElementById('aboutBtn').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// Games functionality
const gameButtons = document.querySelectorAll('.game-btn');

const games = {
    dino: 'https://chromedino.com/',
    tetris: 'https://tetris.com/play-tetris',
    pacman: 'https://freepacman.org/',
    snake: 'https://playsnake.org/'
};

function openGame(gameType) {
    const url = games[gameType];
    const width = 1024;
    const height = 768;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
        url,
        'game_window',
        `width=${width},height=${height},left=${left},top=${top}`
    );
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Reset app functionality
function resetApp() {
    // Reset timer settings to defaults
    POMODORO_TIME = 1500; // 25 minutes
    SHORT_BREAK_TIME = 300; // 5 minutes
    LONG_BREAK_TIME = 600; // 10 minutes
    
    // Save to localStorage
    localStorage.setItem('pomodoroTime', POMODORO_TIME);
    localStorage.setItem('shortBreakTime', SHORT_BREAK_TIME);
    localStorage.setItem('longBreakTime', LONG_BREAK_TIME);
    
    // Reset current timer to pomodoro
    currentMode = 'pomodoro';
    timeLeft = POMODORO_TIME;
    
    // Stop timer if running
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'START';
        document.body.classList.remove('timer-running');
    }
    
    // Stop any ticking sounds
    stopAllTickingSounds();
    
    // Update display
    updateTimerDisplay();
    
    // Reset task list
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    tasks = [];
    localStorage.removeItem('tasks');
    
    // Reset completed pomodoros counter
    completedPomodoros = 0;
    
    // Reset activity log
    userActivities = [];
    logActivity('App reset to default settings');
    
    // Reset active mode button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === 'pomodoro') {
            btn.classList.add('active');
        }
    });
    
    // Remove mode classes from body
    document.body.classList.remove('short-break-mode', 'long-break-mode');
    
    // Show subtle notification instead of alert
    showNotification('App reset to default settings');
}

gameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const gameType = btn.dataset.game;
        openGame(gameType);
    });
});

// Add event listener for reset app functionality
document.getElementById('resetApp').addEventListener('click', (e) => {
    e.preventDefault();
    resetApp();
});

// Close modal when clicking outside
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        closeGameModal();
    }
});

// Settings event listeners
settingsBtn.addEventListener('click', () => {
    loadSettings();
    settingsModal.style.display = 'flex';
});

closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

saveSettings.addEventListener('click', saveSettingsHandler);

// Close modal if clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Initialize
updateTimerDisplay();
loadTrack(currentTrack);
renderTasks();
updateSoundSettings(); // Initialize sound settings