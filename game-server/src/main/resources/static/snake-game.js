const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scale = 40;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let score = 0;

let snake;
let fruit;
let gameInterval;

(function setup() {
  snake = new Snake();
  fruit = new Fruit();

  fruit.pickLocation();
})();

function startGame() {
  if (!gameInterval) {
    gameInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fruit.draw();
      snake.update();
      snake.draw();

      if (snake.eat(fruit)) {
        score++;
        document.getElementById("score").textContent = score;
        fruit.pickLocation();
      }

      snake.checkCollision();
    }, 100);
  }
}

function stopGame() {
  clearInterval(gameInterval);
  gameInterval = null;
}

function gameOver() {
  const urlParams = new URLSearchParams(window.location.search);
  var userId = urlParams.get("userId");
  alert("게임 오버! 점수: " + score);
  if (userId !== null) {
    fetch("http://tino-back.tasty-site.com:8080/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        gameId: 58,
        gameScore: score,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("게임 점수 전송 중 오류 발생:", error);
      });
    snake.reset();
    stopGame();
  }
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;
  this.tail = [];

  this.draw = function () {
    ctx.fillStyle = "#4CAF50";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.tail.length - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x >= canvas.width ||
      this.y >= canvas.height
    ) {
      gameOver();
    }
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case "w":
        this.xSpeed = 0;
        this.ySpeed = -scale;
        break;
      case "s":
        this.xSpeed = 0;
        this.ySpeed = scale;
        break;
      case "a":
        this.xSpeed = -scale;
        this.ySpeed = 0;
        break;
      case "d":
        this.xSpeed = scale;
        this.ySpeed = 0;
        break;
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.tail.push({ x: this.x - this.xSpeed, y: this.y - this.ySpeed });
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        gameOver();
      }
    }
  };

  this.reset = function () {
    this.x = 0;
    this.y = 0;
    this.tail = [];
    this.xSpeed = scale;
    this.ySpeed = 0;
    score = 0;
    document.getElementById("score").textContent = score;
  };
}

function Fruit() {
  this.x = 0;
  this.y = 0;

  this.pickLocation = function () {
    this.x = Math.floor(Math.random() * columns) * scale;
    this.y = Math.floor(Math.random() * rows) * scale;
  };

  this.draw = function () {
    ctx.fillStyle = "#FF4136";
    ctx.fillRect(this.x, this.y, scale, scale);
  };
}

window.addEventListener("keydown", (event) => {
  const direction = event.key.replace("Arrow", "");
  snake.changeDirection(direction);
});

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("stop-btn").addEventListener("click", stopGame);
