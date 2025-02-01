const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const GRAVITY = 0.1;
const JUMP_SPEED = 4;
const PIPE_SPEED = 2;
const PIPE_GAP = 120;
const PIPE_WIDTH = 50;
const PIPE_COLOR = "#006600";
const BIRD_SIZE = 20;
const BIRD_COLOR = "#FFCC00";

// Variables
var canvas;
var ctx;
var bird;
var pipes;
var score;
var isPlaying;

// Bird class
class Bird {
  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.speed = 0;
  }

  draw() {
    ctx.fillStyle = BIRD_COLOR;
    ctx.fillRect(this.x - BIRD_SIZE / 2, this.y - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
  }

  update() {
    this.speed += GRAVITY;
    this.y += this.speed;
    if (this.y + BIRD_SIZE / 2 >= CANVAS_HEIGHT) {
      isPlaying = false;
    }
  }

  jump() {
    this.speed = -JUMP_SPEED;
  }
}

// Pipe class
class Pipe {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PIPE_WIDTH;
    this.height = CANVAS_HEIGHT - y;
  }

  draw() {
    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, 0, this.width, this.y - PIPE_GAP);
  }

  update() {
    this.x -= PIPE_SPEED;
  }

  isColliding(bird) {
    if (bird.x + BIRD_SIZE / 2 > this.x && bird.x - BIRD_SIZE / 2 < this.x + this.width) {
      if (bird.y - BIRD_SIZE / 2 < this.y - PIPE_GAP || bird.y + BIRD_SIZE / 2 > this.y) {
        return true;
      }
    }
    return false;
  }
}

// Initialize game
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  bird = new Bird();
  pipes = [];
  score = 0;
  isPlaying = true;

  // Generate initial pipes
  for (var i = 0; i < 3; i++) {
    var x = CANVAS_WIDTH + i * (PIPE_WIDTH + PIPE_GAP + 100);
    var y = Math.random() * (CANVAS_HEIGHT - 200) + 100;
    pipes.push(new Pipe(x, y));
  }

  // Event listener for jumping
  canvas.addEventListener("click", function() {
    bird.jump();
  });

  // Start game loop
  requestAnimationFrame(update);
}

// Main game loop
function update() {
  if (!isPlaying) return;

  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Update bird
  bird.update();
  bird.draw();

  // Update and draw pipes
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].update();
    pipes[i].draw();

    // Check for collision
    if (pipes[i].isColliding(bird)) {
      isPlaying = false;
    }
  }

  // Remove old pipes and add new ones
  if (pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    var newY = Math.random() * (CANVAS_HEIGHT - 200) + 100;
    pipes.push(new Pipe(CANVAS_WIDTH, newY));
    score++;
  }

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  // Request next frame
  requestAnimationFrame(update);
}

// Start game when window loads
window.onload = init;
