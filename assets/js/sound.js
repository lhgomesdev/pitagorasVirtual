let soundEnabled = getSoundPreference();
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        const startTime = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    } catch (e) {}
}

function playClick() {
    playTone(440, 0.07, 'square', 0.07);
}

function playSuccess() {
    playTone(523.25, 0.12, 'sine', 0.15);
    playTone(659.25, 0.12, 'sine', 0.15, 0.1);
    playTone(783.99, 0.22, 'sine', 0.15, 0.2);
}

function playFail() {
    playTone(220, 0.15, 'sawtooth', 0.12);
    playTone(160, 0.25, 'sawtooth', 0.12, 0.12);
}

function playBuzz() {
    playTone(880, 0.1, 'square', 0.12);
}

function playTick() {
    playTone(700, 0.04, 'sine', 0.05);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    setSoundPreference(soundEnabled);
    updateSoundToggleUI();
    if (soundEnabled) playClick();
}
