const basket = document.getElementById('basket');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const cheatMenu = document.getElementById('cheat-menu');
const cheatSpeedInput = document.getElementById('cheat-speed');
const cheatLevelInput = document.getElementById('cheat-level');
const cheatLivesInput = document.getElementById('cheat-lives');
const cheatScoreInput = document.getElementById('cheat-score');
const applyCheatsButton = document.getElementById('apply-cheats');

let score = 0;
let lives = 3;
let basketPosition = 160;
let items = [];
let dropSpeed = 50;
let level = 1;

// Open/Close Cheat Menu with F8
document.addEventListener('keydown', (e) => {
    if (e.key === 'F8') {
        cheatMenu.style.display = cheatMenu.style.display === 'none' || cheatMenu.style.display === '' ? 'block' : 'none';
    }
});
// Control the basket
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && basketPosition > 0) {
        basketPosition -= 20;
    } else if (e.key === 'ArrowRight' && basketPosition < 320) {
        basketPosition += 20;
    }
    basket.style.left = `${basketPosition}px`;
});

// Generate random items
function createItem() {
    const item = document.createElement('div');
    item.classList.add('item');
    const itemType = Math.random() < 0.1 ? 'power-up' : (Math.random() < 0.15 ? 'penalty' : 'regular');
    item.classList.add(itemType);
    item.style.left = `${Math.random() * 380}px`;
    item.dataset.type = itemType;

    gameContainer.appendChild(item);
    items.push(item);
}

// Update item positions
function updateItems() {
    items.forEach((item, index) => {
        const itemType = item.dataset.type;
        let itemPositionY = parseInt(item.style.top || 0) + 5;
        item.style.top = `${itemPositionY}px`;

        if (itemPositionY >= 560 && Math.abs(parseInt(item.style.left) - basketPosition) < 60) {
            if (itemType === 'regular') score++;
            else if (itemType === 'power-up') {
                score += 5;
                lives = Math.min(5, lives + 1);
            } else if (itemType === 'penalty') {
                score -= 2;
                lives = Math.max(0, lives - 1);
            }
            item.remove();
            items.splice(index, 1);
            scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
        } else if (itemPositionY > 600) {
            if (itemType !== 'penalty') lives--;
            scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
            item.remove();
            items.splice(index, 1);
            if (lives <= 0) showGameOverModal();
        }
    });
}

// Level Up
function levelUp() {
    if (score > 0 && score % 20 === 0) {
        level++;
        dropSpeed = Math.max(10, dropSpeed - 5);
        scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
        alert(`Level Up! Welcome to Level ${level}`);
    }
}

// Show Game Over Modal
function showGameOverModal() {
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScoreElement = document.getElementById('final-score');
    const highScoreElement = document.getElementById('high-score');

    finalScoreElement.textContent = `Your Final Score: ${score}`;
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) localStorage.setItem('highScore', score);
    highScoreElement.textContent = `High Score: ${Math.max(score, highScore)}`;

    gameOverModal.style.display = 'flex';

    const restartButton = document.getElementById('restart-button');
    restartButton.onclick = () => {
        gameOverModal.style.display = 'none';
        resetGame();
    };
}

// Reset Game
function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    dropSpeed = 50;
    scoreElement.textContent = 'Score: 0 | Lives: 3 | Level: 1';
    items.forEach(item => item.remove());
    items = [];
}

// Game Loop
function gameLoop() {
    if (Math.random() < 0.05) createItem();
    updateItems();
    levelUp();
}

applyCheatsButton.addEventListener('click', () => {
    const newSpeed = parseInt(cheatSpeedInput.value);
    const newLevel = parseInt(cheatLevelInput.value);
    const newLives = parseInt(cheatLivesInput.value);
    const newScore = parseInt(cheatScoreInput.value);

    if (!isNaN(newSpeed) && newSpeed > 0) dropSpeed = newSpeed;
    if (!isNaN(newLevel) && newLevel > 0) level = newLevel;
    if (!isNaN(newLives) && newLives > 0) lives = newLives;
    if (!isNaN(newScore) && newScore >= 0) score = newScore;

    scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
    alert('Cheats Applied!');
    cheatMenu.style.display = 'none';
});




// Start Game
setInterval(gameLoop, dropSpeed);
