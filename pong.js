const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 80;
const ballSize = 10;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let playerScore = 0, aiScore = 0;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = '20px Arial';
  ctx.fillText(text, x, y);
}

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom collision
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1;
  }

  // Player paddle collision
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= playerY &&
    ballY <= playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
    let deltaY = ballY + ballSize / 2 - (playerY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.2;
  }

  // AI paddle collision
  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= aiY &&
    ballY <= aiY + paddleHeight
  ) {
    ballSpeedX *= -1;
    let deltaY = ballY + ballSize / 2 - (aiY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.2;
  }

  // Score update
  if (ballX < 0) {
    aiScore++;
    resetBall();
  } else if (ballX + ballSize > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement (simple)
  if (aiY + paddleHeight / 2 < ballY + ballSize / 2) {
    aiY += 3;
  } else {
    aiY -= 3;
  }
  aiY = Math.max(Math.min(aiY, canvas.height - paddleHeight), 0);

  // Draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(0, 0, canvas.width, canvas.height, '#222');
  drawRect(0, playerY, paddleWidth, paddleHeight, '#fff');
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, '#fff');
  drawCircle(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, '#fff');
  for (let i = 10; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 1, i, 2, 20, '#888');
  }
  document.getElementById('score').innerText = `Player: ${playerScore} | AI: ${aiScore}`;

  requestAnimationFrame(update);
}

document.addEventListener('mousemove', function (e) {
  let rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  playerY = Math.max(Math.min(playerY, canvas.height - paddleHeight), 0);
});

update();