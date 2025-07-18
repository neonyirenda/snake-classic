// Load constants in Node.js environment (for testing)
if (typeof module !== "undefined" && module.exports) {
  const constants = require("./constants.js");
  Object.assign(global, constants);
}

const gameState = {
  snake: [],
  foods: [],
  direction: "right",
  score: 0,
  level: 1,
  lastSpeedIncreaseLevel: 1,
  gameOver: false,
  gameInterval: null,
  speed: INITIAL_SPEED,
  fruitsEaten: 0,
  paused: false,
};

function startGame() {
  showGame();
  resetGame();
  gameState.gameInterval = setInterval(update, gameState.speed);
}

function resetGame() {
  const directions = ["up", "down", "left", "right"];
  const randomDirection =
    directions[Math.floor(Math.random() * directions.length)];

  gameState.snake = [{ x: 10, y: 10 }];
  gameState.foods = [];
  gameState.direction = randomDirection;
  gameState.score = 0;
  gameState.level = 1;
  gameState.lastSpeedIncreaseLevel = 1;
  gameState.gameOver = false;
  gameState.paused = false;
  gameState.speed = INITIAL_SPEED;
  gameState.fruitsEaten = 0;
  generateFood();
}

function generateFood() {
  const canvas = document.getElementById("gameCanvas");
  const gridSizeX = canvas.width / GRID_SIZE;
  const gridSizeY = canvas.height / GRID_SIZE;
  gameState.foods = []; // Clear existing food

  const createFood = (type) => {
    let food;
    do {
      food = {
        x:
          Math.floor(Math.random() * (gridSizeX - 2 * WALL_THICKNESS)) +
          WALL_THICKNESS,
        y:
          Math.floor(Math.random() * (gridSizeY - 2 * WALL_THICKNESS)) +
          WALL_THICKNESS,
        type: type,
      };
    } while (isFoodOnSnake(food) || isFoodOnFood(food));
    return food;
  };

  if (gameState.level >= 5) {
    // Level 5+: Special apple pair is now much rarer (12.5% chance)
    if (Math.random() > 0.125) {
      gameState.foods.push(createFood(FRUIT_TYPES.APPLE));
      gameState.foods.push(createFood(FRUIT_TYPES.ROTTEN_APPLE));
    } else {
      gameState.foods.push(createFood(FRUIT_TYPES.APPLE));
      gameState.foods.push(createFood(FRUIT_TYPES.SPECIAL_APPLE));
    }
  } else {
    // Levels 1-4: Only red apples
    gameState.foods.push(createFood(FRUIT_TYPES.APPLE));
  }
}

function isFoodOnSnake(food) {
  for (let i = 0; i < gameState.snake.length; i++) {
    if (food.x === gameState.snake[i].x && food.y === gameState.snake[i].y) {
      return true;
    }
  }
  return false;
}

function isFoodOnFood(newFood) {
  for (const existingFood of gameState.foods) {
    if (newFood.x === existingFood.x && newFood.y === existingFood.y) {
      return true;
    }
  }
  return false;
}

function update() {
  if (gameState.gameOver || gameState.paused) {
    return;
  }

  const head = { x: gameState.snake[0].x, y: gameState.snake[0].y };

  switch (gameState.direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  if (isCollision(head)) {
    endGame();
    return;
  }

  gameState.snake.unshift(head);

  let ateFood = false;
  for (let i = 0; i < gameState.foods.length; i++) {
    const food = gameState.foods[i];
    if (head.x === food.x && head.y === food.y) {
      const fruit = food.type;
      gameState.score += fruit.score;
      gameState.fruitsEaten++;

      const oldLevel = gameState.level;
      gameState.level =
        Math.floor(gameState.fruitsEaten / FRUITS_PER_LEVEL) + 1;

      if (
        gameState.level > oldLevel &&
        gameState.level >=
          gameState.lastSpeedIncreaseLevel + LEVELS_PER_SPEED_INCREASE
      ) {
        gameState.speed = Math.max(50, gameState.speed + SPEED_INCREMENT);
        gameState.lastSpeedIncreaseLevel = gameState.level;
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = setInterval(update, gameState.speed);
      }

      if (fruit.length > 0) {
        for (let j = 0; j < fruit.length - 1; j++) {
          gameState.snake.push({});
        }
      } else if (fruit.length < 0) {
        for (let j = 0; j < Math.abs(fruit.length); j++) {
          if (gameState.snake.length > 1) {
            gameState.snake.pop();
          }
        }
      }

      generateFood(); // Generate new food
      ateFood = true;
      break;
    }
  }

  if (!ateFood) {
    gameState.snake.pop();
  }

  draw(
    gameState.snake,
    gameState.foods,
    gameState.score,
    gameState.level,
    gameState.direction
  );
}

function isCollision(head) {
  const canvas = document.getElementById("gameCanvas");
  const gridSizeX = canvas.width / GRID_SIZE;
  const gridSizeY = canvas.height / GRID_SIZE;

  // Wall collision
  if (
    head.x < WALL_THICKNESS ||
    head.x >= gridSizeX - WALL_THICKNESS ||
    head.y < WALL_THICKNESS ||
    head.y >= gridSizeY - WALL_THICKNESS
  ) {
    return true;
  }

  // Self collision
  for (let i = 1; i < gameState.snake.length; i++) {
    if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
      return true;
    }
  }
  return false;
}

function endGame() {
  gameState.gameOver = true;
  clearInterval(gameState.gameInterval);
  drawGameOver(gameState.score);

  setTimeout(() => {
    const playerName = prompt(
      "Your score: " +
        gameState.score +
        "\nEnter your name for the leaderboard:"
    );
    if (playerName && playerName.trim()) {
      saveHighScore(gameState.score, playerName.trim());
    }
    showMenu();
  }, 500);
}

function togglePause() {
  gameState.paused = !gameState.paused;
  const pauseMenu = document.getElementById("pause-menu");
  if (gameState.paused) {
    clearInterval(gameState.gameInterval);
    pauseMenu.style.display = "flex";
  } else {
    gameState.gameInterval = setInterval(update, gameState.speed);
    pauseMenu.style.display = "none";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!gameState.gameOver) {
      togglePause();
    }
    return;
  }

  if (!gameState.gameOver && !gameState.paused) {
    switch (e.key) {
      case "ArrowUp":
        if (gameState.direction !== "down") gameState.direction = "up";
        break;
      case "ArrowDown":
        if (gameState.direction !== "up") gameState.direction = "down";
        break;
      case "ArrowLeft":
        if (gameState.direction !== "right") gameState.direction = "left";
        break;
      case "ArrowRight":
        if (gameState.direction !== "left") gameState.direction = "right";
        break;
    }
  }
});

document.getElementById("startButton").addEventListener("click", startGame);
document
  .getElementById("highscoresButton")
  .addEventListener("click", displayHighscores);
document.getElementById("backButton").addEventListener("click", showMenu);
document.getElementById("resumeButton").addEventListener("click", togglePause);
document.getElementById("restartButton").addEventListener("click", () => {
  document.getElementById("pause-menu").style.display = "none";
  startGame();
});
document.getElementById("quitButton").addEventListener("click", () => {
  document.getElementById("pause-menu").style.display = "none";
  showMenu();
});

// Mobile controls
document.getElementById("upButton").addEventListener("click", () => {
  if (gameState.direction !== "down") gameState.direction = "up";
});
document.getElementById("leftButton").addEventListener("click", () => {
  if (gameState.direction !== "right") gameState.direction = "left";
});
document.getElementById("downButton").addEventListener("click", () => {
  if (gameState.direction !== "up") gameState.direction = "down";
});
document.getElementById("rightButton").addEventListener("click", () => {
  if (gameState.direction !== "left") gameState.direction = "right";
});

// Initial setup
showMenu();

// Export functions for testing (only in Node.js environment)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    gameState,
    startGame,
    resetGame,
    generateFood,
    isFoodOnSnake,
    isFoodOnFood,
    update,
    isCollision,
    endGame,
    togglePause,
    FRUIT_TYPES,
  };
}
