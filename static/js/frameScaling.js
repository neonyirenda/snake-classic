// Frame Scaling Module
// Handles responsive canvas sizing based on viewport dimensions

// Constants for frame scaling
const MIN_CANVAS_SIZE = 300;
const MAX_CANVAS_SIZE = 800;
const MOBILE_BREAKPOINT = 600;
const TABLET_BREAKPOINT = 1024;

// Throttle delay for resize events (in milliseconds)
const RESIZE_THROTTLE_DELAY = 250;

/**
 * Calculates the optimal canvas size based on viewport dimensions
 * @param {number} viewportWidth - The viewport width
 * @param {number} viewportHeight - The viewport height
 * @returns {Object} Object with width and height properties
 */
function calculateOptimalCanvasSize(viewportWidth, viewportHeight) {
  // Validate input parameters
  if (typeof viewportWidth !== "number" || typeof viewportHeight !== "number") {
    throw new Error("Invalid viewport dimensions");
  }

  // Calculate the smaller dimension to maintain square aspect ratio
  const minDimension = Math.min(viewportWidth, viewportHeight);

  // Calculate canvas size based on viewport category
  let canvasSize;

  if (minDimension <= MOBILE_BREAKPOINT) {
    // Mobile: Use 90% of smaller dimension, with some padding
    canvasSize = Math.floor(minDimension * 0.85);
  } else if (minDimension <= TABLET_BREAKPOINT) {
    // Tablet: Use 70% of smaller dimension
    canvasSize = Math.floor(minDimension * 0.7);
  } else {
    // Desktop: Use 60% of smaller dimension
    canvasSize = Math.floor(minDimension * 0.6);
  }

  // Ensure canvas size is within bounds
  canvasSize = Math.max(MIN_CANVAS_SIZE, Math.min(MAX_CANVAS_SIZE, canvasSize));

  // Ensure canvas size is divisible by GRID_SIZE for clean grid alignment
  const gridSize = typeof GRID_SIZE !== "undefined" ? GRID_SIZE : 20;
  canvasSize = Math.floor(canvasSize / gridSize) * gridSize;

  return {
    width: canvasSize,
    height: canvasSize,
  };
}

/**
 * Validates if canvas dimensions are within acceptable limits
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCanvasSize(width, height) {
  // Check for valid numeric values
  if (typeof width !== "number" || typeof height !== "number") {
    return false;
  }

  // Check for non-negative values
  if (width <= 0 || height <= 0) {
    return false;
  }

  // Check bounds
  if (
    width < MIN_CANVAS_SIZE ||
    width > MAX_CANVAS_SIZE ||
    height < MIN_CANVAS_SIZE ||
    height > MAX_CANVAS_SIZE
  ) {
    return false;
  }

  // Ensure square dimensions
  if (width !== height) {
    return false;
  }

  return true;
}

/**
 * Calculates grid dimensions based on canvas size
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels
 * @param {number} gridSize - Size of each grid cell
 * @returns {Object} Object with gridWidth and gridHeight properties
 */
function getGridDimensions(canvasWidth, canvasHeight, gridSize) {
  // Validate input parameters
  if (canvasWidth <= 0 || canvasHeight <= 0 || gridSize <= 0) {
    throw new Error("Invalid canvas dimensions or grid size");
  }

  return {
    gridWidth: Math.floor(canvasWidth / gridSize),
    gridHeight: Math.floor(canvasHeight / gridSize),
  };
}

/**
 * Updates the canvas element with new dimensions
 * @param {number} width - New canvas width
 * @param {number} height - New canvas height
 */
function updateCanvasSize(width, height) {
  // Validate dimensions
  if (!isValidCanvasSize(width, height)) {
    throw new Error("Invalid canvas size");
  }

  const canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    throw new Error("Canvas element not found");
  }

  // Get device pixel ratio for crisp rendering
  const devicePixelRatio = window.devicePixelRatio || 1;

  // Update canvas internal dimensions (for drawing context)
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  // Update canvas CSS dimensions (for display)
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  // Scale the context to match device pixel ratio
  const context = canvas.getContext("2d");
  if (context) {
    context.scale(devicePixelRatio, devicePixelRatio);
  }
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Handles window resize events
 */
function handleResize() {
  const { width, height } = calculateOptimalCanvasSize(
    window.innerWidth,
    window.innerHeight
  );
  updateCanvasSize(width, height);
}

/**
 * Initializes frame scaling functionality
 */
function initializeFrameScaling() {
  // Calculate and apply initial canvas size
  const { width, height } = calculateOptimalCanvasSize(
    window.innerWidth,
    window.innerHeight
  );
  updateCanvasSize(width, height);

  // Set up throttled resize listener
  const throttledResize = throttle(handleResize, RESIZE_THROTTLE_DELAY);
  window.addEventListener("resize", throttledResize);

  // Optional: Handle orientation changes on mobile
  window.addEventListener("orientationchange", throttledResize);
}

// Export functions for testing (only in Node.js environment)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateOptimalCanvasSize,
    updateCanvasSize,
    getGridDimensions,
    isValidCanvasSize,
    initializeFrameScaling,
    handleResize,
    throttle,
  };
}
