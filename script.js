const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballSize < 0) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (playerY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            computerScore++;
            updateScore();
            resetBall();
        }
    }

    if (ballX + ballSize > canvas.width) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            playerScore++;
            updateScore();
            resetBall();
        }
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5;
}

function moveComputer() {
    if (computerY + paddleHeight / 2 < ballY) {
        computerY += 6;
    } else {
        computerY -= 6;
    }
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawRect(0, playerY, paddleWidth, paddleHeight, '#fff');
    drawRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight, '#fff');
    drawCircle(ballX, ballY, ballSize, '#fff');
}

function updateScore() {
    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('computerScore').innerText = computerScore;

    if (playerScore === 5) {
        showMessage('Você venceu!');
        setTimeout(resetGame, 3000);
    } else if (computerScore === 5) {
        showMessage('Você perdeu!', true);
        setTimeout(resetGame, 3000);
    }
}

function showMessage(message, isLoss = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    messageDiv.classList.remove('hidden');
    if (isLoss) {
        messageDiv.style.backgroundImage = "url('path/to/your/defeat-image.png')";
        messageDiv.style.backgroundSize = "cover";
    }
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    document.getElementById('message').classList.add('hidden');
    resetBall();
}

function gameLoop() {
    moveBall();
    moveComputer();
    draw();
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    playerY = event.clientY - rect.top - root.scrollTop - paddleHeight / 2;
});

setInterval(gameLoop, 1000 / 60);
