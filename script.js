const basket = document.getElementById('basket');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');

let score = 0;
let lives = 3;
let basketPosition = 160;
let items = [];
let dropSpeed = 50;
let level = 1;

// Sound effects
const catchSound = new Audio('catch.mp3');
const missSound = new Audio('miss.mp3');
const powerUpSound = new Audio('powerup.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Control the basket
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && basketPosition > 0) {
        basketPosition -= 20;
    } else if (e.key === 'ArrowRight' && basketPosition < 320) {
        basketPosition += 20;
    }
    basket.style.left = `${basketPosition}px`;
});

// Generate random items (regular, power-up, penalty)
function createItem() {
    const item = document.createElement('div');
    item.classList.add('item');

    // Randomly assign item type: regular, power-up, or penalty
    const itemType = Math.random() < 0.1 ? 'power-up' : (Math.random() < 0.15 ? 'penalty' : 'regular');
    item.classList.add(itemType);
    item.style.left = `${Math.random() * 380}px`;
    item.dataset.type = itemType;

    gameContainer.appendChild(item);
    items.push(item);
}

// Update items' positions and check for catches/misses
function updateItems() {
    items.forEach((item, index) => {
        const itemType = item.dataset.type;
        let itemPositionY = parseInt(item.style.top || 0) + 5;

        item.style.top = `${itemPositionY}px`;

        // Check if item is caught
        if (itemPositionY >= 560 && Math.abs(parseInt(item.style.left) - basketPosition) < 60) {
            if (itemType === 'regular') {
                score++;
                catchSound.play();
            } else if (itemType === 'power-up') {
                score += 5;
                lives = Math.min(5, lives + 1);
                powerUpSound.play();
            } else if (itemType === 'penalty') {
                score -= 2;
                lives = Math.max(0, lives - 1);
                missSound.play();
            }
            item.remove();
            items.splice(index, 1);
            scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
        }

        // Check if item is missed
        else if (itemPositionY > 600) {
            if (itemType !== 'penalty') {
                lives--;
            }
            scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
            item.remove();
            items.splice(index, 1);

            // Check if game is over
            if (lives <= 0) {
                gameOverSound.play();
                alert(`Game Over! Final Score: ${score}`);
                updateLeaderboard();
                resetGame();
            }
        }
    });
}

// Level and difficulty scaling
function levelUp() {
    if (score > 0 && score % 20 === 0) { // Level up every 20 points
        level++;
        dropSpeed = Math.max(10, dropSpeed - 5);  // Increase difficulty
        scoreElement.textContent = `Score: ${score} | Lives: ${lives} | Level: ${level}`;
        alert(`Level Up! Welcome to Level ${level}`);
    }
}

// Reset the game
function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    dropSpeed = 50;
    scoreElement.textContent = 'Score: 0 | Lives: 3 | Level: 1';
    items.forEach(item => item.remove());
    items = [];
}

// Leaderboard
function updateLeaderboard() {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        alert(`New High Score: ${score}!`);
    } else {
        alert(`Your Score: ${score}. High Score: ${highScore}`);
    }
}

// Main game loop
function gameLoop() {
    if (Math.random() < 0.05) { // Spawn new item with some probability
        createItem();
    }
    updateItems();
    levelUp();
}

// Start the game
setInterval(gameLoop, dropSpeed);
