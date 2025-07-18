// Mock DOM elements for UI testing
const mockElements = {
  menu: { style: { display: "block" } },
  highscores: { style: { display: "none" } },
  gameCanvas: { style: { display: "none" } },
};

global.document.getElementById = jest.fn((id) => mockElements[id]);

// Import UI functions after mocking
const { showMenu, showGame } = require("../static/js/ui.js");

describe("UI Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset element display states
    mockElements.menu.style.display = "block";
    mockElements.highscores.style.display = "none";
    mockElements.gameCanvas.style.display = "none";
  });

  describe("showMenu", () => {
    test("should show menu and hide other elements", () => {
      showMenu();

      expect(mockElements.menu.style.display).toBe("block");
      expect(mockElements.highscores.style.display).toBe("none");
      expect(mockElements.gameCanvas.style.display).toBe("none");
    });

    test("should call getElementById for each element", () => {
      showMenu();

      expect(document.getElementById).toHaveBeenCalledWith("menu");
      expect(document.getElementById).toHaveBeenCalledWith("highscores");
      expect(document.getElementById).toHaveBeenCalledWith("gameCanvas");
    });
  });

  describe("showGame", () => {
    test("should show game canvas and hide menu", () => {
      showGame();

      expect(mockElements.menu.style.display).toBe("none");
      expect(mockElements.gameCanvas.style.display).toBe("block");
    });

    test("should call getElementById for menu and gameCanvas", () => {
      showGame();

      expect(document.getElementById).toHaveBeenCalledWith("menu");
      expect(document.getElementById).toHaveBeenCalledWith("gameCanvas");
    });
  });

  describe("element state transitions", () => {
    test("should properly transition from menu to game", () => {
      // Start with menu visible
      expect(mockElements.menu.style.display).toBe("block");
      expect(mockElements.gameCanvas.style.display).toBe("none");

      // Show game
      showGame();
      expect(mockElements.menu.style.display).toBe("none");
      expect(mockElements.gameCanvas.style.display).toBe("block");

      // Show menu again
      showMenu();
      expect(mockElements.menu.style.display).toBe("block");
      expect(mockElements.gameCanvas.style.display).toBe("none");
    });
  });
});
