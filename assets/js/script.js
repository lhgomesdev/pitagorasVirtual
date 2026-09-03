let gameMode = null; // 'SINGLE' | 'MULTI'
let targetNumber = 0;
let cards = [];

// Singleplayer State
let singleScore = 0;
let timeLeft = 90;
let timerId = null;

// Multiplayer State
let players = [];
let currentPlayerIndex = null;
let multiGameState = 'BUZZER'; // 'BUZZER' | 'ANSWERING'

let currentEquation = [];
let expecting = 'number';

const CARD_COLORS = ['card--sun', 'card--sky', 'card--leaf', 'card--coral', 'card--tangerine'];

const PLAYER_COLORS = ['player-sky', 'player-leaf', 'player-coral', 'player-grape'];

const UIElements = {
    mainMenu: document.getElementById('main-menu'),
    multiSetup: document.getElementById('multi-setup'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen'),

    singleHeader: document.getElementById('single-header'),
    singleScoreDisplay: document.getElementById('single-score-display'),
    timeDisplay: document.getElementById('time-display'),
    singleEndContent: document.getElementById('single-end-content'),
    finalScore: document.getElementById('final-score'),

    multiHeader: document.getElementById('multi-header'),
    playersList: document.getElementById('players-list'),
    addPlayerBtn: document.getElementById('add-player-btn'),
    scoreboard: document.getElementById('scoreboard'),
    buzzerArea: document.getElementById('buzzer-area'),
    buzzersContainer: document.getElementById('buzzers-container'),
    btnCancelTurn: document.getElementById('btn-cancel-turn'),
    turnIndicator: document.getElementById('turn-indicator'),
    turnName: document.getElementById('turn-name'),
    multiEndContent: document.getElementById('multi-end-content'),

    target: document.getElementById('target-display'),
    cards: document.getElementById('cards-container'),
    operators: document.getElementById('operators-container'),
    equation: document.getElementById('equation-display'),
    actionArea: document.getElementById('action-area'),
    skipText: document.getElementById('skip-text'),
    endSubtitle: document.getElementById('end-subtitle'),
    rulesModal: document.getElementById('rules-modal'),

    bestScoreBadge: document.getElementById('best-score-badge'),
    bestScoreValue: document.getElementById('best-score-value'),
    newRecordBadge: document.getElementById('new-record-badge'),
    soundIcon: document.getElementById('sound-icon')
};

function updateBestScoreBadge() {
    const best = getBestScore();
    if (best > 0) {
        UIElements.bestScoreValue.textContent = best;
        UIElements.bestScoreBadge.classList.remove('hidden');
    }
}

function updateSoundToggleUI() {
    UIElements.soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
}

updateBestScoreBadge();
updateSoundToggleUI();

function setMode(mode) {
    gameMode = mode;
    UIElements.mainMenu.classList.add('hidden');

    if (mode === 'SINGLE') {
        startSingleplayer();
    } else {
        UIElements.multiSetup.classList.remove('hidden');
    }
}

function backToMenu() {
    UIElements.multiSetup.classList.add('hidden');
    UIElements.mainMenu.classList.remove('hidden');
    gameMode = null;
}

function addPlayerInput() {
    const count = UIElements.playersList.children.length;
    if (count >= 4) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('aria-label', `Nome do Jogador ${count + 1}`);
    input.className = 'player-input text-input';
    input.value = `Jogador ${count + 1}`;
    UIElements.playersList.appendChild(input);

    if (count + 1 >= 4) UIElements.addPlayerBtn.classList.add('hidden');
}

function openRules() {
    UIElements.rulesModal.classList.remove('hidden');
}

function closeRules() {
    UIElements.rulesModal.classList.add('hidden');
}

function startSingleplayer() {
    singleScore = 0;
    timeLeft = 120;
    UIElements.singleScoreDisplay.textContent = singleScore;
    updateTime();

    UIElements.singleHeader.classList.remove('hidden');
    UIElements.multiHeader.classList.add('hidden');
    UIElements.buzzerArea.classList.add('hidden');
    UIElements.btnCancelTurn.classList.add('hidden');
    UIElements.actionArea.classList.remove('hidden');
    UIElements.operators.classList.remove('is-disabled');
    UIElements.equation.classList.remove('is-waiting');
    UIElements.skipText.textContent = "Não encontro a resposta (-5 pts)";

    UIElements.game.classList.remove('hidden');

    clearInterval(timerId);
    timerId = setInterval(gameTick, 1000);

    nextRound();
}

function startMultiplayer() {
    const inputs = document.querySelectorAll('.player-input');

    players = Array.from(inputs).map((input, index) => ({
        id: index,
        name: input.value.trim() || `Jogador ${index + 1}`,
        score: 0,
        locked: false,
        color: PLAYER_COLORS[index]
    }));

    if (players.length === 0) return;

    UIElements.multiSetup.classList.add('hidden');

    UIElements.multiHeader.classList.remove('hidden');
    UIElements.singleHeader.classList.add('hidden');
    UIElements.btnCancelTurn.classList.remove('hidden');
    UIElements.skipText.textContent = "Ninguém sabe (Nova Rodada)";

    updateScoreboard();
    UIElements.game.classList.remove('hidden');

    nextRound();
}

function nextRound() {
    if (gameMode === 'MULTI') {
        players.forEach(p => p.locked = false);
        setBuzzerState();
    } else {
        clearEquation();
    }

    while(cards.length < 5) {
        cards.push({
            id: Math.random().toString(36).substring(2, 9),
            value: Math.floor(Math.random() * 10) + 1,
            used: false
        });
    }

    generateSmartTarget();
    renderCards();
}

function generateSmartTarget() {
    let targetFound = false;
    let attempts = 0;
    const ops = ['+', '-', '*'];

    while(!targetFound && attempts < 100) {
        attempts++;
        let numCards = Math.random() > 0.5 ? 2 : 3;
        let available = [...cards].sort(() => 0.5 - Math.random());
        let selected = available.slice(0, numCards);

        let expr = selected[0].value.toString();
        for(let i=1; i<numCards; i++) {
            let op = ops[Math.floor(Math.random() * ops.length)];
            expr += op + selected[i].value;
        }

        try {
            let result = eval(expr);
            if (Number.isInteger(result) && result > 0 && result <= 100) {
                targetNumber = result;
                targetFound = true;
            }
        } catch(e) {}
    }

    if(!targetFound) targetNumber = Math.floor(Math.random() * 20) + 5;

    UIElements.target.textContent = targetNumber;
    UIElements.target.parentElement.classList.remove('is-pulsing');
    void UIElements.target.parentElement.offsetWidth;
    UIElements.target.parentElement.classList.add('is-pulsing');
    setTimeout(() => UIElements.target.parentElement.classList.remove('is-pulsing'), 200);
}

function gameTick() {
    timeLeft--;
    updateTime();
    if (timeLeft <= 10 && timeLeft > 0) playTick();
    if (timeLeft <= 0) {
        endGame();
    }
}

function updateTime() {
    UIElements.timeDisplay.textContent = timeLeft + 's';
    if (timeLeft <= 10) UIElements.timeDisplay.classList.add('is-critical');
}

function updateScoreboard() {
    UIElements.scoreboard.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = `score-tile ${p.color}`;
        div.innerHTML = `
            <p class="score-tile__name" title="${p.name}">${p.name}</p>
            <p class="score-tile__value">${p.score}</p>
        `;
        UIElements.scoreboard.appendChild(div);
    });
}

function renderBuzzers() {
    UIElements.buzzersContainer.innerHTML = '';
    let allLocked = true;

    players.forEach((p, index) => {
        const btn = document.createElement('button');
        if (p.locked) {
            btn.className = 'buzzer buzzer--locked';
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> ${p.name}`;
            btn.disabled = true;
        } else {
            allLocked = false;
            btn.className = `buzzer ${p.color}`;
            btn.textContent = p.name;
            btn.onclick = () => buzzIn(index);
        }
        UIElements.buzzersContainer.appendChild(btn);
    });

    if (allLocked) {
        setTimeout(() => { skipRound(); }, 1000);
    }
}

function buzzIn(playerIndex) {
    currentPlayerIndex = playerIndex;
    playBuzz();
    setAnsweringState();
}

function cancelTurn() {
    clearEquation();
    setBuzzerState();
}

function setBuzzerState() {
    multiGameState = 'BUZZER';
    currentPlayerIndex = null;
    clearEquation();

    UIElements.buzzerArea.classList.remove('hidden');
    UIElements.actionArea.classList.add('hidden');
    UIElements.turnIndicator.classList.add('hidden');
    UIElements.operators.classList.add('is-disabled');

    UIElements.equation.textContent = 'Aguardando...';
    UIElements.equation.classList.add('is-waiting');

    renderBuzzers();
    renderCards();
}

function setAnsweringState() {
    multiGameState = 'ANSWERING';
    const player = players[currentPlayerIndex];

    UIElements.buzzerArea.classList.add('hidden');
    UIElements.actionArea.classList.remove('hidden');

    UIElements.turnIndicator.classList.remove('hidden');
    UIElements.turnName.textContent = player.name;
    UIElements.turnName.className = `turn-indicator__name ${player.color}`;

    UIElements.operators.classList.remove('is-disabled');

    UIElements.equation.textContent = '...';
    UIElements.equation.classList.remove('is-waiting');

    renderCards();
}

function renderCards() {
    UIElements.cards.innerHTML = '';
    cards.forEach((c, index) => {
        const btn = document.createElement('button');

        let isClickable = true;
        if (gameMode === 'MULTI' && multiGameState === 'BUZZER') isClickable = false;
        if (c.used) isClickable = false;

        const color = CARD_COLORS[index % CARD_COLORS.length];
        btn.className = `card ${color}${isClickable ? '' : ' card--disabled'}`;
        btn.textContent = c.value;

        if (isClickable) {
            btn.onclick = () => addCard(index);
        }

        UIElements.cards.appendChild(btn);
    });
}

function addCard(index) {
    if (gameMode === 'MULTI' && multiGameState !== 'ANSWERING') return;
    if (expecting !== 'number' || cards[index].used) return;

    cards[index].used = true;
    currentEquation.push({ type: 'number', value: cards[index].value.toString(), cardId: cards[index].id });
    expecting = 'operator';

    playClick();
    renderCards();
    renderEquation();
}

function addOperator(op) {
    if (gameMode === 'MULTI' && multiGameState !== 'ANSWERING') return;
    if (expecting !== 'operator' || currentEquation.length === 0) return;

    currentEquation.push({ type: 'operator', value: op });
    expecting = 'number';

    playClick();
    renderEquation();
}

function clearEquation() {
    currentEquation = [];
    expecting = 'number';
    cards.forEach(c => c.used = false);
    renderCards();
    renderEquation();
}

function renderEquation() {
    if (gameMode === 'MULTI' && multiGameState === 'BUZZER') return;

    if (currentEquation.length === 0) {
        UIElements.equation.textContent = '...';
        return;
    }

    UIElements.equation.textContent = currentEquation.map(item => {
        if(item.value === '*') return '×';
        if(item.value === '/') return '÷';
        return item.value;
    }).join(' ');
}

function submitEquation() {
    if (currentEquation.length === 0) return;

    let eqToEval = [...currentEquation];
    if (eqToEval[eqToEval.length - 1].type === 'operator') {
        eqToEval.pop();
    }

    const evalStr = eqToEval.map(item => item.value).join('');

    try {
        const result = eval(evalStr);
        if (result === targetNumber) {
            successRound(eqToEval);
        } else {
            failRound();
        }
    } catch(e) {
        failRound();
    }
}

function successRound(finalEq) {
    const cardsUsedCount = finalEq.filter(i => i.type === 'number').length;
    const points = 10 + ((cardsUsedCount - 1) * 5);

    if (gameMode === 'SINGLE') {
        singleScore += points;
        UIElements.singleScoreDisplay.textContent = singleScore;
    } else {
        players[currentPlayerIndex].score += points;
        updateScoreboard();
    }

    const usedIds = finalEq.filter(i => i.type === 'number').map(i => i.cardId);
    cards = cards.filter(c => !usedIds.includes(c.id));

    playSuccess();
    UIElements.equation.classList.add('is-success');

    setTimeout(() => {
        UIElements.equation.classList.remove('is-success');
        nextRound();
    }, gameMode === 'SINGLE' ? 500 : 1000);
}

function failRound() {
    playFail();
    UIElements.equation.classList.add('is-fail');
    setTimeout(() => {
        UIElements.equation.classList.remove('is-fail');

        if (gameMode === 'SINGLE') {
            clearEquation();
        } else {
            players[currentPlayerIndex].locked = true;
            setBuzzerState();
        }
    }, 600);
}

function skipRound() {
    if (gameMode === 'SINGLE') {
        if(singleScore >= 5) singleScore -= 5;
        UIElements.singleScoreDisplay.textContent = singleScore;
    }
    cards = [];
    nextRound();
}

function endGame() {
    clearInterval(timerId);
    UIElements.game.classList.add('hidden');
    UIElements.end.classList.remove('hidden');

    if (gameMode === 'SINGLE') {
        const isRecord = registerSingleplayerResult(singleScore);
        UIElements.endSubtitle.textContent = "O tempo acabou.";
        UIElements.singleEndContent.classList.remove('hidden');
        UIElements.multiEndContent.classList.add('hidden');
        UIElements.finalScore.textContent = singleScore;
        UIElements.newRecordBadge.classList.toggle('hidden', !isRecord);
        updateBestScoreBadge();
    } else {
        registerMultiplayerResult(players);
        UIElements.endSubtitle.textContent = "Confira o pódio dos grandes matemáticos.";
        UIElements.singleEndContent.classList.add('hidden');
        UIElements.multiEndContent.classList.remove('hidden');

        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        UIElements.multiEndContent.innerHTML = '';

        sortedPlayers.forEach((p, index) => {
            let medal = index === 0 ? '<i class="fa-solid fa-medal medal medal--gold"></i>' :
                index === 1 ? '<i class="fa-solid fa-medal medal medal--silver"></i>' :
                    index === 2 ? '<i class="fa-solid fa-medal medal medal--bronze"></i>' : '<i class="fa-solid fa-thumbs-up medal medal--none"></i>';
            const div = document.createElement('div');
            div.className = `podium-row ${p.color}${index === 0 ? ' podium-row--first' : ''}`;
            div.innerHTML = `
                <div class="podium-row__player">
                    <span class="podium-row__medal">${medal}</span>
                    <span class="podium-row__name">${p.name}</span>
                </div>
                <span class="podium-row__score">${p.score} pt</span>
            `;
            UIElements.multiEndContent.appendChild(div);
        });
    }
}