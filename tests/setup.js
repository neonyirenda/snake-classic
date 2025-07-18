// Jest setup file
require("@testing-library/jest-dom");

// Mock DOM elements that are used in the game
global.document = {
  getElementById: jest.fn(),
  addEventListener: jest.fn(),
  createElement: jest.fn(),
};

// Mock canvas context
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  drawImage: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 10 })),
}));

// Mock Image constructor
global.Image = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  src: "",
  width: 0,
  height: 0,
}));

// Mock setInterval and clearInterval
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

// Mock prompt for highscores
global.prompt = jest.fn();

// Mock console methods to avoid clutter in tests
global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
