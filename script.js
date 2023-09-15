let MOVE_SPEED = 3;
const GRAVITY = 0.5;
const PIPE_GAP = 35;
const PIPE_SPAWN_INTERVAL = 115;

const bird = document.querySelector(".bird");
const backgroundImage = document
  .querySelector(".background")
  .getBoundingClientRect();

const scoreValue = document.querySelector(".score_val");
const message = document.querySelector(".message");

const difficulty = document.querySelector(".difficulty");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const legendButton = document.getElementById("legend");

const scoreTitle = document.querySelector(".score_title");
const birdImage = document.getElementById("bird-1");

const pointSound = new Audio("sounds/point.mp3");
const dieSound = new Audio("sounds/die.mp3");
const flyingSound = new Audio("sounds/flying.mp3");

birdImage.style.display = "none";
message.classList.add("messageStyle");

let gameState = "Start";
let dieSoundPlayed = false;
let bird_dy = 0;
let pipeSeparation = 0;

easyButton.addEventListener("click", function () {
  MOVE_SPEED = 3;
  restartGame();
});

mediumButton.addEventListener("click", function () {
  MOVE_SPEED = 15;
  restartGame();
});

legendButton.addEventListener("click", function () {
  MOVE_SPEED = 30;
  restartGame();
});

// MOBILE
easyButton.addEventListener("touchstart", function () {
  MOVE_SPEED = 3;
  restartGame();
});

mediumButton.addEventListener("touchstart", function () {
  MOVE_SPEED = 15;
  restartGame();
});

legendButton.addEventListener("touchstart", function () {
  MOVE_SPEED = 30;
  restartGame();
});

document.addEventListener("keydown", handleKeyDown);

document.addEventListener("keyup", handleKeyUp);

document.addEventListener("touchstart", handleTouchStart);

document.addEventListener("touchend", handleTouchEnd);

function handleKeyDown(e) {
  if (e.key == "Enter" && gameState != "Play") {
    restartGame();
  } else if (e.key == "ArrowUp" || e.key == " ") {
    jump();
  }
}

function handleKeyUp(e) {
  if (e.key == "ArrowUp" || e.key == " ") {
    resetJump();
  }
}

// Mobile
function handleTouchStart() {
  if (gameState != "Play") {
    restartGame();
  } else {
    jump();
  }
}

function handleTouchEnd() {
  resetJump();
}

function restartGame() {
  clearPipes();
  birdImage.style.display = "block";
  bird.style.top = "40vh";
  gameState = "Play";
  message.innerHTML = "";
  scoreTitle.innerHTML = "Score: ";
  scoreValue.innerHTML = "0";
  difficulty.style.display = "none";
  message.classList.remove("messageStyle");
  bird_dy = 0;
  play();
}

function clearPipes() {
  document.querySelectorAll(".pipe_sprite").forEach((pipe) => {
    pipe.remove();
  });
}

function play() {
  move();
  applyGravity();
  createPipe();
}

function move() {
  if (gameState != "Play") return;

  const pipeSprites = document.querySelectorAll(".pipe_sprite");
  let scoredPipe = false; // To track if the bird has already scored in this frame

  pipeSprites.forEach((pipe) => {
    const pipeProps = pipe.getBoundingClientRect();
    const birdProps = bird.getBoundingClientRect();

    if (pipeProps.right <= 0) {
      pipe.remove();
    } else {
      if (checkCollision(pipeProps, birdProps)) {
        endGame();
        return;
      } else {
        if (!scoredPipe && shouldIncreaseScore(pipeProps, birdProps, pipe)) {
          increaseScore();
          scoredPipe = true; // Set scoredPipe to true to prevent double scoring
        }
        pipe.style.left = pipeProps.left - MOVE_SPEED + "px";
      }
    }
  });
  requestAnimationFrame(move);
}

// Rest of the code remains the same

function checkCollision(pipeProps, birdProps) {
  return (
    birdProps.left < pipeProps.left + pipeProps.width &&
    birdProps.left + birdProps.width > pipeProps.left &&
    birdProps.top < pipeProps.top + pipeProps.height &&
    birdProps.top + birdProps.height > pipeProps.top
  );
}

function shouldIncreaseScore(pipeProps, birdProps, pipe) {
  return (
    pipeProps.right < birdProps.left &&
    pipeProps.right + MOVE_SPEED >= birdProps.left &&
    pipe.increase_score === "1"
  );
}

function increaseScore() {
  scoreValue.innerHTML = +scoreValue.innerHTML + 1;
  pointSound.play();
}

requestAnimationFrame(move);

function applyGravity() {
  if (gameState != "Play") return;
  bird_dy = bird_dy + GRAVITY;

  const birdProps = bird.getBoundingClientRect();

  if (checkCollisionWithBounds(birdProps)) {
    endGame();
    return;
  }
  bird.style.top = birdProps.top + bird_dy + "px";
  requestAnimationFrame(applyGravity);
}

function checkCollisionWithBounds(birdProps) {
  return birdProps.top <= 0 || birdProps.bottom >= backgroundImage.bottom;
}

requestAnimationFrame(applyGravity);

function jump() {
  if (gameState != "Play") return;
  flyingSound.play();
  birdImage.src = "img/Bird-3.png";
  birdImage.src = "img/Bird-2.png";
  bird_dy = -7.6;
}

function resetJump() {
  if (gameState != "Play") return;
  birdImage.src = "img/Bird-3.png";
  birdImage.src = "img/Bird.png";
}

function createPipe() {
  if (gameState != "Play") return;

  if (pipeSeparation > PIPE_SPAWN_INTERVAL) {
    pipeSeparation = 0;

    const pipePosition = Math.floor(Math.random() * 43) + 8;

    createPipeSprite(pipePosition - 70);
    createPipeSprite(pipePosition + PIPE_GAP);
  }
  pipeSeparation++;
  requestAnimationFrame(createPipe);
}

function createPipeSprite(topPosition) {
  const pipeSprite = document.createElement("div");
  pipeSprite.className = "pipe_sprite";
  pipeSprite.style.top = topPosition + "vh";
  pipeSprite.style.left = "100vw";
  pipeSprite.increase_score = "1";
  document.body.appendChild(pipeSprite);
}

function endGame() {
  dieSound.play();
  gameState = "End";
  message.innerHTML =
    "Game Over".fontcolor("red") + "<br>Press Enter To Restart";
  message.classList.add("messageStyle");
  birdImage.style.display = "none";
}
