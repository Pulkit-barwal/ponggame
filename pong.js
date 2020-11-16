//INSTRUCTION MODAL
var modal_htp = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close-htp")[0];

// Open the modal
btn.onclick = function () {
  modal_htp.style.display = "block";
};
// Close the modal(x)
span.onclick = function () {
  modal_htp.style.display = "none";
};
// Click anywhere outside of the modal => close
window.onclick = function (event) {
  if (event.target == modal_htp) {
    modal_htp.style.display = "none";
  }
};



//TOGGLE THEME
const toggle = document.getElementById("checkbox");
const body = document.querySelector("body");

// Lightmode
toggle.addEventListener("change", () => {
  body.classList.toggle("light");
});



// BUTTONS
const reset = document.querySelector(".reset");
const player2 = document.querySelector(".player2");
const comp = document.querySelector(".comp");

let multiplayer = false;

// 2 Players button
player2.addEventListener("click", () => {
  multiplayer = true;
  com.score = 0;
  user.score = 0;
});
// Reset Switch
reset.addEventListener("click", () => {
  com.score = 0;
  user.score = 0;
});
// Play with Computer
comp.addEventListener("click", () => {
  multiplayer = false;
  com.score = 0;
  user.score = 0;
});



// GAME IMPLEMENTATION
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Game over Modal
var modal = document.querySelector(".modal");
var modalcontent = document.querySelector(".modal-content");
const toggleModal = () => {
  modal.classList.toggle("show-modal");
};

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "#F5DE00",
};

// User Paddle
const user = {
  x: 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "#f21058",
};

// User2 Paddle
const user2 = {
  x: canvas.width - 20,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "#f21058",
};

// COM Paddle
const com = {
  x: canvas.width - 20,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "#f21058",
};

// Net
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 1,
  color: "WHITE",
};

// draw circle (used to draw the ball)
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// draw a rectangle (used to draw paddles)
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// listening to the mouse - USER1
canvas.addEventListener("mousemove", getMousePos);
function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
}

// listening to the keyboard - USER2
var dy = -40;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    upPressed = true;
    if (user2.y > -20) {
      user2.y += dy;
    }
  }
  if (e.keyCode == 40) {
    downPressed = true;
    if (user2.y < canvas.height - 50) {
      user2.y -= dy;
    }
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  }
  if (e.keyCode == 40) {
    downPressed = false;
  }
}

// when COM or USER scores, we reset the ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

// draw the net
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// draw text
function drawText(text, x, y) {
  if (body.classList.contains("light")) {
    ctx.fillStyle = "black";
  } else {
    ctx.fillStyle = "#fff";
  }
  ctx.font = "45px fantasy";
  ctx.fillText(text, x, y);
}

// Collision on right or left side
function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

// Do all the calculations
function update() {
  // change the score of players
  // if the ball goes to the left "ball.x<0" computer/user2 win,
  // else if "ball.x > canvas.width" the user win
  if (ball.x - ball.radius < 0) {
    com.score++;
    comScore.play();
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    userScore.play();
    resetBall();
  }

  //Game end
  if (com.score >= 10 || user.score >= 10) {
    modalcontent.innerHTML = `<h2>Game Over!</h2>`;
    let time = 1;

    // Stop the gameplay
    clearTimeout(loop);

    toggleModal();
    var modalp = setInterval(function () {
      if (time === 0) {
        clearInterval(modalp);
        user.score = 0;
        com.score = 0;
        loop = setInterval(game, 20);
      } else {
        toggleModal();
      }
      time--;
    }, 3500);
  }

  // velocity of ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //Computer AI
  if (!multiplayer) {
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;
  }

  // Collision of ball with top/bottom walls =>inverse y velocity.
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
    wall.play();
  }

  // Check whether the ball hit user or com/user2 paddle
  let player =
    ball.x + ball.radius < canvas.width / 2 ? user : multiplayer ? user2 : com;

  // Ball hits a paddle
  if (collision(ball, player)) {
    hit.play();

    let collidePoint = ball.y - (player.y + player.height / 2);
    // normalize the value of collidePoint, we need to get numbers between -1 and 1.
    // -player.height/2 < collide Point < player.height/2
    collidePoint = collidePoint / (player.height / 2);

    // 1)Ball hits the top of a paddle      => Turn at -45 degree angle
    // 2)Ball hits the center of the paddle => Turn at 0 degree angle
    // 3)Ball hits the bottom of the paddle => Turn at 45 degree angle
    let angleRad = (Math.PI / 4) * collidePoint;

    // Change the X and Y velocity direction
    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // Increase speed of the ball with every collision
    ball.speed += 0.1;
  }
}

// Drawing the canvas
function render() {
  if (body.classList.contains("light")) {
    drawRect(0, 0, canvas.width, canvas.height, "#a2d5f2");
  } else {
    drawRect(0, 0, canvas.width, canvas.height, "#556CFC");
  }

  // User - COM / User2 score
  drawText(user.score, canvas.width / 4, canvas.height / 5);
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);

  // Net
  drawNet();

  // Ball
  drawArc(ball.x, ball.y, ball.radius, ball.color);

  // User - COM/User2 paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);

  // Opponent's paddle
  if (multiplayer) {
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
  } else {
    drawRect(com.x, com.y, com.width, com.height, com.color);
  }
}

function game() {
  update();
  render();
}

// Update the board 50 times per second - 1000/50
let loop = setInterval(game, 20);
