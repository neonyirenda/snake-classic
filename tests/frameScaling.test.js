// Mock DOM elements for frame scaling tests
const mockCanvas = {
  width: 400,
  height: 400,
  style: {
    width: "400px",
    height: "400px",
  },
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    drawImage: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    scale: jest.fn(),
  })),
};

// Mock window object for viewport size
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock window.devicePixelRatio
Object.defineProperty(window, "devicePixelRatio", {
  writable: true,
  configurable: true,
  value: 1,
});

global.document.getElementById = jest.fn((id) => {
  if (id === "gameCanvas") return mockCanvas;
  return null;
});

// Import the frame scaling module after mocking
const {
  calculateOptimalCanvasSize,
  updateCanvasSize,
  getGridDimensions,
  isValidCanvasSize,
  initializeFrameScaling,
} = require("../static/js/frameScaling.js");

describe("Frame Scaling Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset canvas mock
    mockCanvas.width = 400;
    mockCanvas.height = 400;
    mockCanvas.style.width = "400px";
    mockCanvas.style.height = "400px";

    // Reset window dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.devicePixelRatio = 1;
  });

  describe("calculateOptimalCanvasSize", () => {
    test("should calculate size based on viewport dimensions", () => {
      const result = calculateOptimalCanvasSize(1024, 768);

      expect(result).toHaveProperty("width");
      expect(result).toHaveProperty("height");
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    test("should maintain square aspect ratio", () => {
      const result = calculateOptimalCanvasSize(1024, 768);

      expect(result.width).toBe(result.height);
    });

    test("should respect minimum size constraints", () => {
      const result = calculateOptimalCanvasSize(200, 200);

      expect(result.width).toBeGreaterThanOrEqual(300);
      expect(result.height).toBeGreaterThanOrEqual(300);
    });

    test("should respect maximum size constraints", () => {
      const result = calculateOptimalCanvasSize(2000, 2000);

      expect(result.width).toBeLessThanOrEqual(800);
      expect(result.height).toBeLessThanOrEqual(800);
    });

    test("should handle mobile viewport sizes", () => {
      const result = calculateOptimalCanvasSize(375, 667); // iPhone-like dimensions

      expect(result.width).toBeLessThanOrEqual(350);
      expect(result.height).toBeLessThanOrEqual(350);
      expect(result.width).toBe(result.height);
    });

    test("should handle tablet viewport sizes", () => {
      const result = calculateOptimalCanvasSize(768, 1024); // iPad-like dimensions

      expect(result.width).toBeGreaterThan(400);
      expect(result.height).toBeGreaterThan(400);
      expect(result.width).toBe(result.height);
    });

    test("should handle desktop viewport sizes", () => {
      const result = calculateOptimalCanvasSize(1920, 1080); // Desktop

      expect(result.width).toBeGreaterThan(500);
      expect(result.height).toBeGreaterThan(500);
      expect(result.width).toBe(result.height);
    });
  });

  describe("isValidCanvasSize", () => {
    test("should validate minimum canvas size", () => {
      expect(isValidCanvasSize(299, 299)).toBe(false);
      expect(isValidCanvasSize(300, 300)).toBe(true);
    });

    test("should validate maximum canvas size", () => {
      expect(isValidCanvasSize(800, 800)).toBe(true);
      expect(isValidCanvasSize(801, 801)).toBe(false);
    });

    test("should require square dimensions", () => {
      expect(isValidCanvasSize(400, 500)).toBe(false);
      expect(isValidCanvasSize(400, 400)).toBe(true);
    });

    test("should handle edge cases", () => {
      expect(isValidCanvasSize(0, 0)).toBe(false);
      expect(isValidCanvasSize(-100, -100)).toBe(false);
      expect(isValidCanvasSize(null, null)).toBe(false);
      expect(isValidCanvasSize(undefined, undefined)).toBe(false);
    });
  });

  describe("getGridDimensions", () => {
    test("should calculate grid dimensions based on canvas size", () => {
      const result = getGridDimensions(400, 400, 20);

      expect(result.gridWidth).toBe(20);
      expect(result.gridHeight).toBe(20);
    });

    test("should handle different canvas sizes", () => {
      const result = getGridDimensions(600, 600, 20);

      expect(result.gridWidth).toBe(30);
      expect(result.gridHeight).toBe(30);
    });

    test("should handle fractional results", () => {
      const result = getGridDimensions(410, 410, 20);

      expect(result.gridWidth).toBe(20);
      expect(result.gridHeight).toBe(20);
    });

    test("should validate input parameters", () => {
      expect(() => getGridDimensions(0, 0, 20)).toThrow();
      expect(() => getGridDimensions(400, 400, 0)).toThrow();
      expect(() => getGridDimensions(-400, -400, 20)).toThrow();
    });
  });

  describe("updateCanvasSize", () => {
    test("should update canvas width and height", () => {
      updateCanvasSize(600, 600);

      expect(mockCanvas.width).toBe(600);
      expect(mockCanvas.height).toBe(600);
    });

    test("should update canvas CSS dimensions", () => {
      updateCanvasSize(600, 600);

      expect(mockCanvas.style.width).toBe("600px");
      expect(mockCanvas.style.height).toBe("600px");
    });

    test("should handle device pixel ratio", () => {
      window.devicePixelRatio = 2;
      updateCanvasSize(400, 400);

      expect(mockCanvas.width).toBe(800); // 400 * 2
      expect(mockCanvas.height).toBe(800); // 400 * 2
      expect(mockCanvas.style.width).toBe("400px");
      expect(mockCanvas.style.height).toBe("400px");
    });

    test("should validate size before updating", () => {
      expect(() => updateCanvasSize(100, 100)).toThrow();
      expect(() => updateCanvasSize(1000, 1000)).toThrow();
    });
  });

  describe("initializeFrameScaling", () => {
    test("should set up window resize listener", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      initializeFrameScaling();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    test("should calculate and apply initial canvas size", () => {
      initializeFrameScaling();

      expect(mockCanvas.width).toBeGreaterThan(0);
      expect(mockCanvas.height).toBeGreaterThan(0);
    });

    test("should handle window resize events", () => {
      initializeFrameScaling();

      // Get the resize handler
      const resizeHandler = window.addEventListener.mock.calls.find(
        (call) => call[0] === "resize"
      )[1];

      // Simulate window resize
      window.innerWidth = 800;
      window.innerHeight = 600;

      // Call the resize handler
      resizeHandler();

      // Canvas should be updated
      expect(mockCanvas.width).toBeGreaterThan(0);
      expect(mockCanvas.height).toBeGreaterThan(0);
    });

    test("should throttle resize events", (done) => {
      initializeFrameScaling();

      const resizeHandler = window.addEventListener.mock.calls.find(
        (call) => call[0] === "resize"
      )[1];

      let callCount = 0;
      const originalUpdateCanvasSize = updateCanvasSize;

      // Mock updateCanvasSize to count calls
      require("../static/js/frameScaling.js").updateCanvasSize = () => {
        callCount++;
      };

      // Trigger multiple resize events quickly
      for (let i = 0; i < 10; i++) {
        resizeHandler();
      }

      // Should be throttled
      setTimeout(() => {
        expect(callCount).toBeLessThan(10);
        done();
      }, 300);
    });
  });

  describe("integration with game logic", () => {
    test("should maintain game grid consistency", () => {
      const canvasSize = calculateOptimalCanvasSize(1024, 768);
      const gridDimensions = getGridDimensions(
        canvasSize.width,
        canvasSize.height,
        20
      );

      // Grid should be reasonable for gameplay
      expect(gridDimensions.gridWidth).toBeGreaterThanOrEqual(15);
      expect(gridDimensions.gridHeight).toBeGreaterThanOrEqual(15);
      expect(gridDimensions.gridWidth).toBeLessThanOrEqual(40);
      expect(gridDimensions.gridHeight).toBeLessThanOrEqual(40);
    });

    test("should preserve playable area", () => {
      const canvasSize = calculateOptimalCanvasSize(1024, 768);
      const gridDimensions = getGridDimensions(
        canvasSize.width,
        canvasSize.height,
        20
      );

      // Account for wall thickness (2 on each side)
      const playableWidth = gridDimensions.gridWidth - 4;
      const playableHeight = gridDimensions.gridHeight - 4;

      expect(playableWidth).toBeGreaterThanOrEqual(10);
      expect(playableHeight).toBeGreaterThanOrEqual(10);
    });
  });
});
