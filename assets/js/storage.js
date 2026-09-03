const STORAGE_KEY = 'pitagorasVirtual.data';

function loadGameData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { bestScore: 0, history: [], soundEnabled: true };
        const parsed = JSON.parse(raw);
        return {
            bestScore: parsed.bestScore || 0,
            history: Array.isArray(parsed.history) ? parsed.history : [],
            soundEnabled: parsed.soundEnabled !== false
        };
    } catch (e) {
        return { bestScore: 0, history: [], soundEnabled: true };
    }
}

function saveGameData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
}

function getBestScore() {
    return loadGameData().bestScore;
}

function registerSingleplayerResult(score) {
    const data = loadGameData();
    const isRecord = score > data.bestScore;
    if (isRecord) data.bestScore = score;
    data.history.unshift({ mode: 'SINGLE', score, date: Date.now() });
    data.history = data.history.slice(0, 10);
    saveGameData(data);
    return isRecord;
}

function registerMultiplayerResult(players) {
    const data = loadGameData();
    const winner = [...players].sort((a, b) => b.score - a.score)[0];
    data.history.unshift({ mode: 'MULTI', winnerName: winner.name, score: winner.score, date: Date.now() });
    data.history = data.history.slice(0, 10);
    saveGameData(data);
}

function getSoundPreference() {
    return loadGameData().soundEnabled;
}

function setSoundPreference(enabled) {
    const data = loadGameData();
    data.soundEnabled = enabled;
    saveGameData(data);
}
