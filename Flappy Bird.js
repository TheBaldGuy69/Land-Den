const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1600;
canvas.height = 900;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.2,
    lift: -4,
    velocity: 0
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 200;
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

function updateBird() {
    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        if (bird.y + bird.height > canvas.height) {
            endGame();
        }
    }
}

function updatePipes() {
    if (!gameOver) {
        if (frame % 90 === 0) {
            let top = Math.random() * (canvas.height - pipeGap - 20) + 10;
            pipes.push({ x: canvas.width, top });
        }
        pipes.forEach(pipe => pipe.x -= 2);
        if (pipes.length && pipes[0].x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    }
}

function checkCollision() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap) {
                endGame();
            }
        }
    }
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText("YOU DIED", canvas.width / 2 - 120, canvas.height / 2 - 30); // Large "YOU DIED" text
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 + 20);
    ctx.font = "20px Arial";
    ctx.fillText("Press Space to Restart", canvas.width / 2 - 90, canvas.height / 2 + 50);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    frame = 0;
    gameLoop();
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    checkCollision();
    drawScore();
    frame++;
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

gameLoop();
