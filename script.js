const basket = document.getElementById('basket');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');

let score = 0;
let lives = 3;
let basketPosition = 160;
let items = [];
let dropSpeed = 50;
let level = 1;
let paused = false;

// Basket Movement
document.addEventListener('keydown', (e) => {
    if (!paused) {
        if (e.key === 'ArrowLeft' && basketPosition > 0) basketPosition -= 20;
        else if (e.key === 'ArrowRight' && basketPosition < 320) basketPosition += 20;
        basket.style.left = `${basketPosition}px`;
    }
});

// Create Item
function createItem() {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.type = Math.random() < 0.1 ? 'power-up' : (Math.random() < 0.15 ? 'penalty' : 'regular');
    item.style.left = `${Math.random() * 380}px`;
    gameContainer.appendChild(item);
    items.push(item);
}

// Update Items
function updateItems() {
    items.forEach((item, i) => {
        item.style.top = `${(parseInt(item.style.top || 0) + 5)}px`;
        if (parseInt(item.style.top) > 560 && Math.abs(parseInt(item.style.left) - basketPosition) < 60) {
            const type = item.dataset.type;
            if (type === 'regular') score++;
            else if (type === 'power-up') { score += 5; lives = Math.min(5, lives + 1); }
            else if (type === 'penalty') { score -= 2; lives--; }
            item.remove(); items.splice(i, 1);
            if (lives <= 0) resetGame();
        }
    });
    scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
}

// Level Up
function levelUp() {
    if (score > 0 && score % 20 === 0) showLevelUpModal(++level);
}

function showLevelUpModal(level) {
    paused = true;
    document.getElementById('current-level').textContent = level;
    document.getElementById('level-up-modal').style.display = 'flex';
}

document.getElementById('level-up-ok').addEventListener('click', () => {
    paused = false;
    document.getElementById('level-up-modal').style.display = 'none';
});

// Cheat Menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'F8') {
        paused = !paused;
        document.getElementById('cheat-menu').style.display = paused ? 'block' : 'none';
    }
});

document.getElementById('apply-cheats').addEventListener('click', () => {
    dropSpeed = parseInt(document.getElementById('cheat-speed').value) || dropSpeed;
        lives = parseInt(document.getElementById('cheat-lives').value) || lives;
    score = parseInt(document.getElementById('cheat-score').value) || score;
    scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
    document.getElementById('cheat-menu').style.display = 'none';
});

// Game Reset
function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    dropSpeed = 50;
    scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
    items.forEach(item => item.remove());
    items = [];
}

// Game Loop
function gameLoop() {
    if (!paused) {
        createItem();
        updateItems();
        levelUp();
    }
    setTimeout(gameLoop, dropSpeed);
}

// Start the Game Loop
gameLoop();
