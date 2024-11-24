const bird = document.getElementById('bird');
const gameContainer = document.getElementById('gameContainer');
const scoreBoard = document.getElementById('scoreBoard');
const gameOverScreen = document.getElementById('gameOver');

let birdTop = 300;
let gravity = 3;
let isGameOver = false;
let obstacleLeft = 400;
let score = 0;
let obstacles = [];

function startGame() {
  isGameOver = false;
  score = 0;
  birdTop = 300;
  obstacleLeft = 400;
  bird.style.top = birdTop + 'px';
  gameOverScreen.classList.add('hidden');
  scoreBoard.textContent = `Score: ${score}`;

  clearObstacles();
  generateObstacles();
  gameLoop();
}

function gameLoop() {
  if (isGameOver) return;

  birdTop += gravity;
  bird.style.top = birdTop + 'px';

  obstacles.forEach(obstacle => {
    obstacle.left -= 2;
    if (obstacle.left < -60) {
      obstacle.element.remove();
      obstacles.shift();
      score++;
      scoreBoard.textContent = `Score: ${score}`;
    } else {
      obstacle.element.style.left = obstacle.left + 'px';
    }

    if (checkCollision(obstacle)) {
      endGame();
    }
  });

  if (birdTop >= gameContainer.clientHeight - 40 || birdTop <= 0) {
    endGame();
  }

  requestAnimationFrame(gameLoop);
}

function checkCollision(obstacle) {
  const birdRect = bird.getBoundingClientRect();
  const obstacleRect = obstacle.element.getBoundingClientRect();

  return (
    birdRect.right > obstacleRect.left &&
    birdRect.left < obstacleRect.right &&
    (birdRect.top < obstacleRect.top + obstacle.topHeight ||
      birdRect.bottom > obstacleRect.bottom - obstacle.bottomHeight)
  );
}

function endGame() {
  isGameOver = true;
  gameOverScreen.classList.remove('hidden');
}

function flap() {
  birdTop -= 50;
}

function generateObstacles() {
  if (isGameOver) return;

  const obstacleTopHeight = Math.random() * 150 + 50;
  const gap = 120;
  const obstacleBottomHeight = gameContainer.clientHeight - gap - obstacleTopHeight;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.height = `${obstacleTopHeight}px`;
  obstacle.style.top = '0';
  obstacle.style.left = `${obstacleLeft}px`;

  const obstacleBottom = document.createElement('div');
  obstacleBottom.classList.add('obstacle');
  obstacleBottom.style.height = `${obstacleBottomHeight}px`;
  obstacleBottom.style.bottom = '0';
  obstacleBottom.style.left = `${obstacleLeft}px`;

  gameContainer.appendChild(obstacle);
  gameContainer.appendChild(obstacleBottom);

  obstacles.push({ element: obstacle, left: obstacleLeft, topHeight: obstacleTopHeight });
  obstacles.push({ element: obstacleBottom, left: obstacleLeft, bottomHeight: obstacleBottomHeight });

  setTimeout(generateObstacles, 2000);
}

function clearObstacles() {
  obstacles.forEach(obstacle => obstacle.element.remove());
  obstacles = [];
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (isGameOver) {
      startGame();
    } else {
      flap();
    }
  }
});

startGame();
