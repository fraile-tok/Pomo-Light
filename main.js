// Important Variables
workTime = .1; // minutes
shortTime = .1; // minutes
longTime = .1; // minutes

// Timer State
const state = {
    mode: 'work', // cycles between work, short, long
    lengths: { work: workTime*60, short: shortTime*60, long: longTime*60}, // in seconds
    remaining: workTime*60, // in seconds
    running: false,
    completedWorks: 0
}

// Functions
function renderTime() {
    const mins = Math.floor(state.remaining / 60);
    const secs = state.remaining % 60;
    document.getElementById('time').innerHTML = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

let intervalId = null;
function start() {
    if (state.running) return;
    state.running = true;
    intervalId = setInterval(tick, 1000);
}

function pause() {
    state.running = false;
    clearInterval(intervalId);
    intervalId = null;
}

function stop() {
    pause();
    state.remaining = state.lengths[state.mode];
    renderTime();
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
        if (state.completedWorks % 4 === 0) {
            state.mode = 'long';
        } else {
            state.mode = 'short';
        }
    } else {
        state.mode = 'work';
    }
    state.remaining = state.lengths[state.mode];
    renderTime();
    start();
}

// Init
document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('stop').addEventListener('click', stop);

renderTime();