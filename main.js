// DOM Elements
const appContainer = document.getElementById('app');
const timeContainer = document.getElementById('timer-container');
const timer = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const workButton = document.getElementById('work-btn');
const shortButton = document.getElementById('short-btn');
const longButton = document.getElementById('long-btn');

const modeClasses = ['work-mode', 'short-mode', 'long-mode', 'off-mode'];

// Important Variables
workTime = 25; // minutes
shortTime = 5; // minutes
longTime = 15; // minutes

// Timer State
const state = {
    mode: 'off', // 'off', 'work', 'short', 'long'
    lengths: { work: workTime*60, short: shortTime*60, long: longTime*60}, // in seconds
    remaining: workTime*60, // in seconds
    running: false,
    completedWorks: 0
}

// Functions
function setMode(next) {
    state.mode = next;
    state.remaining = (next === 'off') ? state.lengths.work : state.lengths[next];
    timeContainer.classList.remove(...modeClasses);
    timeContainer.classList.add(`${next}-mode`);
}

function renderTime() {
    const mins = Math.floor(state.remaining / 60);
    const secs = state.remaining % 60;
    timer.innerHTML = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

let intervalId = null;
function start() {
    if (state.mode === 'off') setMode('work');
    if (state.running) return;
    state.running = true;
    intervalId = setInterval(tick, 1000);
}

function pause() {
    if(!state.running) return;
    state.running = false;
    clearInterval(intervalId);
    intervalId = null;
}

function stop() {
    pause();
    state.completedWorks = 0;
    if(state.mode === 'off') {
        state.remaining = state.lengths.work;
    } else {
        state.remaining = state.lengths[state.mode]
    }
    renderTime();
    setMode('off');
}

function tick() {
    if (state.remaining > 0) {
        state.remaining--;
        renderTime();
    } else {
        pause();
        handleModeEnd(); // change mode
    }
}

function handleModeEnd() {
    if (state.mode === 'work') {
        state.completedWorks++;
        const isLong = state.completedWorks % 4 === 0;
        setMode(isLong ? 'long' : 'short');
    } else {
        setMode('work')
    }
    renderTime();
    start();
}


// Buttons
workButton.addEventListener('click', () => { pause(); setMode('work'); });
shortButton.addEventListener('click', () => { pause(); setMode('short'); });
longButton.addEventListener('click',  () => { pause(); setMode('long');  });

startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
stopButton.addEventListener('click', stop);

renderTime();