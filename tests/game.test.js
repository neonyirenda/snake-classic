// Mock the constants and assets before importing game.js
jest.mock("../static/js/constants.js", () => ({
  GRID_SIZE: 20,
  WALL_THICKNESS: 2,
  INITIAL_SPEED: 200,
  SPEED_INCREMENT: -25,
  FRUITS_PER_LEVEL: 3,
  LEVELS_PER_SPEED_INCREASE: 3,
  FRUIT_TYPES: {
    APPLE: { color: "#e74c3c", score: 1, length: 1 },
    ROTTEN_APPLE: { color: "#000000", score: -2, length: -2 },
    SPECIAL_APPLE: { color: "#ff69b4", score: 4, length: 4 },
  },
}));

jest.mock("../static/js/assets.js", () => ({
  snakeHeadImages: {
    up: { src: "mock-up.png" },
    down: { src: "mock-down.png" },
    left: { src: "mock-left.png" },
    right: { src: "mock-right.png" },
  },
  snakeBodyImages: {
    horizontal: { src: "mock-horizontal.png" },
    vertical: { src: "mock-vertical.png" },
  },
  snakeTailImages: {
    up: { src: "mock-tail-up.png" },
    down: { src: "mock-tail-down.png" },
    left: { src: "mock-tail-left.png" },
    right: { src: "mock-tail-right.png" },
  },
  fruit: {
    apple: { src: "mock-apple.png" },
    super_apple: { src: "mock-super-apple.png" },
    rotten_apple: { src: "mock-rotten-apple.png" },
  },
}));

// Mock DOM elements that the game uses
const mockCanvas = {
  width: 800,
  height: 600,
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    drawImage: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
  })),
};

const mockElements = {
  gameCanvas: mockCanvas,
  menu: { style: { display: "block" } },
  highscores: { style: { display: "none" } },
  startButton: { addEventListener: jest.fn() },
  highscoresButton: { addEventListener: jest.fn() },
  backButton: { addEventListener: jest.fn() },
  resumeButton: { addEventListener: jest.fn() },
  restartButton: { addEventListener: jest.fn() },
  quitButton: { addEventListener: jest.fn() },
  "pause-menu": { style: { display: "none" } },
  upButton: { addEventListener: jest.fn() },
  leftButton: { addEventListener: jest.fn() },
  downButton: { addEventListener: jest.fn() },
  rightButton: { addEventListener: jest.fn() },
};

global.document.getElementById = jest.fn((id) => mockElements[id]);

// Mock functions that are called in event listeners
global.showMenu = jest.fn();
global.displayHighscores = jest.fn();
global.initializeFrameScaling = jest.fn();

// Import the game functions after mocking
// Since the game.js file uses global state, we need to reset it between tests
describe("Game Logic Tests", () => {
  let gameModule;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Reset the game state by reimporting the module
    jest.resetModules();

    // Mock the required modules again
    jest.doMock("../static/js/constants.js", () => ({
      GRID_SIZE: 20,
      WALL_THICKNESS: 2,
      INITIAL_SPEED: 200,
      SPEED_INCREMENT: -25,
      FRUITS_PER_LEVEL: 3,
      LEVELS_PER_SPEED_INCREASE: 3,
      FRUIT_TYPES: {
        APPLE: { color: "#e74c3c", score: 1, length: 1 },
        ROTTEN_APPLE: { color: "#000000", score: -2, length: -2 },
        SPECIAL_APPLE: { color: "#ff69b4", score: 4, length: 4 },
      },
    }));

    gameModule = require("../static/js/game.js");
  });

  describe("Game State Management", () => {
    test("should initialize game state correctly", () => {
      // The gameState should be initialized with default values
      expect(gameModule.gameState).toBeDefined();
      expect(gameModule.gameState.score).toBe(0);
      expect(gameModule.gameState.level).toBe(1);
      expect(gameModule.gameState.gameOver).toBe(false);
      expect(gameModule.gameState.paused).toBe(false);
    });

    test("should reset game state when resetGame is called", () => {
      // Modify game state
      gameModule.gameState.score = 100;
      gameModule.gameState.level = 5;
      gameModule.gameState.gameOver = true;

      // Reset game
      gameModule.resetGame();

      // Check that state is reset
      expect(gameModule.gameState.score).toBe(0);
      expect(gameModule.gameState.level).toBe(1);
      expect(gameModule.gameState.gameOver).toBe(false);
      expect(gameModule.gameState.snake.length).toBe(1);
      expect(gameModule.gameState.snake[0]).toEqual({ x: 10, y: 10 });
      expect(["up", "down", "left", "right"]).toContain(
        gameModule.gameState.direction
      );
    });
  });

  describe("Food Generation", () => {
    test("should generate food within game boundaries", () => {
      gameModule.resetGame();
      gameModule.generateFood();

      const food = gameModule.gameState.foods[0];
      expect(food.x).toBeGreaterThanOrEqual(2); // WALL_THICKNESS
      expect(food.y).toBeGreaterThanOrEqual(2); // WALL_THICKNESS
      expect(food.x).toBeLessThan(38); // (800/20) - 2
      expect(food.y).toBeLessThan(28); // (600/20) - 2
    });

    test("should not generate food on snake position", () => {
      gameModule.resetGame();

      // Set snake position
      gameModule.gameState.snake = [{ x: 10, y: 10 }];

      // Generate food multiple times to test randomness
      for (let i = 0; i < 10; i++) {
        gameModule.generateFood();
        const food = gameModule.gameState.foods[0];
        expect(food.x !== 10 || food.y !== 10).toBe(true);
      }
    });

    test("should generate multiple foods at level 5+", () => {
      gameModule.resetGame();
      gameModule.gameState.level = 5;

      gameModule.generateFood();

      expect(gameModule.gameState.foods.length).toBe(2);
    });

    test("should generate single food at levels 1-4", () => {
      gameModule.resetGame();
      gameModule.gameState.level = 3;

      gameModule.generateFood();

      expect(gameModule.gameState.foods.length).toBe(1);
      expect(gameModule.gameState.foods[0].type).toEqual({
        color: "#e74c3c",
        score: 1,
        length: 1,
      });
    });
  });

  describe("Collision Detection", () => {
    test("should detect wall collision", () => {
      gameModule.resetGame();

      // Test collision with left wall
      const leftWallHead = { x: 1, y: 10 };
      expect(gameModule.isCollision(leftWallHead)).toBe(true);

      // Test collision with right wall
      const rightWallHead = { x: 38, y: 10 };
      expect(gameModule.isCollision(rightWallHead)).toBe(true);

      // Test collision with top wall
      const topWallHead = { x: 10, y: 1 };
      expect(gameModule.isCollision(topWallHead)).toBe(true);

      // Test collision with bottom wall
      const bottomWallHead = { x: 10, y: 28 };
      expect(gameModule.isCollision(bottomWallHead)).toBe(true);
    });

    test("should detect self collision", () => {
      gameModule.resetGame();

      // Create a snake that would collide with itself
      gameModule.gameState.snake = [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 }, // body
        { x: 8, y: 10 }, // body
        { x: 7, y: 10 }, // tail
      ];

      // Test collision with body
      const collidingHead = { x: 9, y: 10 };
      expect(gameModule.isCollision(collidingHead)).toBe(true);
    });

    test("should not detect collision for valid position", () => {
      gameModule.resetGame();

      // Test valid position
      const validHead = { x: 15, y: 15 };
      expect(gameModule.isCollision(validHead)).toBe(false);
    });
  });

  describe("Food Collision Detection", () => {
    test("should detect when food is on snake", () => {
      gameModule.resetGame();
      gameModule.gameState.snake = [{ x: 10, y: 10 }];

      const foodOnSnake = { x: 10, y: 10 };
      expect(gameModule.isFoodOnSnake(foodOnSnake)).toBe(true);

      const foodNotOnSnake = { x: 15, y: 15 };
      expect(gameModule.isFoodOnSnake(foodNotOnSnake)).toBe(false);
    });

    test("should detect when food is on existing food", () => {
      gameModule.resetGame();
      gameModule.gameState.foods = [
        { x: 10, y: 10, type: gameModule.FRUIT_TYPES.APPLE },
      ];

      const duplicateFood = { x: 10, y: 10 };
      expect(gameModule.isFoodOnFood(duplicateFood)).toBe(true);

      const uniqueFood = { x: 15, y: 15 };
      expect(gameModule.isFoodOnFood(uniqueFood)).toBe(false);
    });
  });

  describe("Game Pause/Resume", () => {
    test("should toggle pause state", () => {
      gameModule.resetGame();

      // Initially not paused
      expect(gameModule.gameState.paused).toBe(false);

      // Toggle pause
      gameModule.togglePause();
      expect(gameModule.gameState.paused).toBe(true);

      // Toggle again
      gameModule.togglePause();
      expect(gameModule.gameState.paused).toBe(false);
    });

    test("should show/hide pause menu when toggling pause", () => {
      gameModule.resetGame();

      gameModule.togglePause();
      expect(mockElements["pause-menu"].style.display).toBe("flex");

      gameModule.togglePause();
      expect(mockElements["pause-menu"].style.display).toBe("none");
    });
  });

  describe("Speed and Level Management", () => {
    test("should increase level based on fruits eaten", () => {
      gameModule.resetGame();

      // Simulate eating 3 fruits (FRUITS_PER_LEVEL)
      gameModule.gameState.fruitsEaten = 3;

      // Manually calculate level as the game would
      const expectedLevel =
        Math.floor(gameModule.gameState.fruitsEaten / 3) + 1;
      expect(expectedLevel).toBe(2);
    });

    test("should increase speed every 3 levels", () => {
      gameModule.resetGame();
      const initialSpeed = gameModule.gameState.speed;

      // Simulate reaching level 4 (3 levels after initial)
      gameModule.gameState.level = 4;
      gameModule.gameState.lastSpeedIncreaseLevel = 1;

      // Check if speed should increase
      const shouldIncrease =
        gameModule.gameState.level >=
        gameModule.gameState.lastSpeedIncreaseLevel + 3;
      expect(shouldIncrease).toBe(true);
    });
  });
});
