// Frame Scaling Integration Tests
// These tests verify that frame scaling works properly with the actual game

describe("Frame Scaling Integration Tests", () => {
  let originalWindow;

  beforeAll(() => {
    // Save original window properties
    originalWindow = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    };
  });

  afterAll(() => {
    // Restore original window properties
    Object.assign(window, originalWindow);
  });

    beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="game-container">
        <canvas id="gameCanvas" style="display: none;"></canvas>
      </div>
    `;
    
    // Mock canvas context
    const mockContext = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      drawImage: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      scale: jest.fn(),
    };
    
    // Mock getContext
    const canvas = document.getElementById('gameCanvas');
    canvas.getContext = jest.fn(() => mockContext);
    
    // Reset window properties
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.devicePixelRatio = 1;
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = "";
  });

  test("should initialize canvas with correct dimensions for desktop", () => {
    const {
      initializeFrameScaling,
    } = require("../../static/js/frameScaling.js");

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");

    // Canvas should be resized from default
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
    expect(canvas.width).toBe(canvas.height); // Square aspect ratio

    // CSS dimensions should be set
    expect(canvas.style.width).toBeDefined();
    expect(canvas.style.height).toBeDefined();
    expect(canvas.style.width).toBe(canvas.style.height);
  });

  test("should handle window resize events", () => {
    const {
      initializeFrameScaling,
    } = require("../../static/js/frameScaling.js");

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");
    const initialWidth = canvas.width;
    const initialHeight = canvas.height;

    // Simulate window resize
    window.innerWidth = 800;
    window.innerHeight = 600;

    // Trigger resize event
    window.dispatchEvent(new Event("resize"));

    // Wait for throttled resize to complete
    return new Promise((resolve) => {
      setTimeout(() => {
        // Canvas should be resized
        expect(canvas.width).not.toBe(initialWidth);
        expect(canvas.height).not.toBe(initialHeight);
        expect(canvas.width).toBe(canvas.height);
        resolve();
      }, 300);
    });
  });

  test("should maintain game grid integrity after resize", () => {
    const {
      initializeFrameScaling,
      getGridDimensions,
    } = require("../../static/js/frameScaling.js");

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");
    const GRID_SIZE = 20;

    // Calculate grid dimensions
    const gridDimensions = getGridDimensions(
      parseInt(canvas.style.width),
      parseInt(canvas.style.height),
      GRID_SIZE
    );

    // Grid should be reasonable for gameplay
    expect(gridDimensions.gridWidth).toBeGreaterThanOrEqual(15);
    expect(gridDimensions.gridHeight).toBeGreaterThanOrEqual(15);
    expect(gridDimensions.gridWidth).toBeLessThanOrEqual(40);
    expect(gridDimensions.gridHeight).toBeLessThanOrEqual(40);
  });

  test("should handle mobile viewport correctly", () => {
    const {
      initializeFrameScaling,
    } = require("../../static/js/frameScaling.js");

    // Simulate mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");

    // Canvas should be sized appropriately for mobile
    const canvasSize = parseInt(canvas.style.width);
    expect(canvasSize).toBeLessThanOrEqual(350);
    expect(canvasSize).toBeGreaterThanOrEqual(300);
    expect(canvas.style.width).toBe(canvas.style.height);
  });

  test("should handle tablet viewport correctly", () => {
    const {
      initializeFrameScaling,
    } = require("../../static/js/frameScaling.js");

    // Simulate tablet viewport
    window.innerWidth = 768;
    window.innerHeight = 1024;

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");

    // Canvas should be sized appropriately for tablet
    const canvasSize = parseInt(canvas.style.width);
    expect(canvasSize).toBeGreaterThan(400);
    expect(canvasSize).toBeLessThanOrEqual(600);
    expect(canvas.style.width).toBe(canvas.style.height);
  });

  test("should handle high DPI displays", () => {
    const {
      initializeFrameScaling,
    } = require("../../static/js/frameScaling.js");

    // Simulate high DPI display
    window.devicePixelRatio = 2;

    // Initialize frame scaling
    initializeFrameScaling();

    const canvas = document.getElementById("gameCanvas");

    // Canvas internal dimensions should be scaled for pixel ratio
    const cssWidth = parseInt(canvas.style.width);
    const cssHeight = parseInt(canvas.style.height);

    expect(canvas.width).toBe(cssWidth * 2);
    expect(canvas.height).toBe(cssHeight * 2);
  });
});
