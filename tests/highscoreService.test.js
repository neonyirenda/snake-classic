// Mock fetch for testing API calls
global.fetch = jest.fn();

// Import the highscore service functions
const {
  getHighscores,
  saveHighScore,
} = require("../static/js/highscoreService.js");

describe("Highscore Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getHighscores", () => {
    test("should fetch highscores from API", async () => {
      const mockHighscores = [
        { name: "Alice", score: 150 },
        { name: "Bob", score: 120 },
      ];

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockHighscores),
      });

      const result = await getHighscores();

      expect(fetch).toHaveBeenCalledWith("/highscores");
      expect(result).toEqual(mockHighscores);
    });

    test("should handle fetch error gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getHighscores()).rejects.toThrow("Network error");
    });

    test("should handle JSON parse error", async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
      });

      await expect(getHighscores()).rejects.toThrow("Invalid JSON");
    });
  });

  describe("saveHighScore", () => {
    test("should save highscore to API", async () => {
      const mockResponse = { status: "success" };

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await saveHighScore(100, "TestPlayer");

      expect(fetch).toHaveBeenCalledWith("/highscores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "TestPlayer", score: 100 }),
      });
    });

    test("should handle different score types", async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ status: "success" }),
      });

      await saveHighScore(250, "PlayerTwo");

      expect(fetch).toHaveBeenCalledWith("/highscores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "PlayerTwo", score: 250 }),
      });
    });

    test("should handle save error gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Save error"));

      await expect(saveHighScore(100, "TestPlayer")).rejects.toThrow(
        "Save error"
      );
    });

    test("should handle server error response", async () => {
      fetch.mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: "Invalid data" }),
      });

      // The function doesn't handle errors, so it should complete without throwing
      await expect(saveHighScore(100, "TestPlayer")).resolves.toBeUndefined();
    });
  });

  describe("input validation", () => {
    test("should send correct data format for valid inputs", async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ status: "success" }),
      });

      await saveHighScore(500, "ValidPlayer");

      const call = fetch.mock.calls[0];
      const body = JSON.parse(call[1].body);

      expect(body).toEqual({
        name: "ValidPlayer",
        score: 500,
      });
      expect(typeof body.name).toBe("string");
      expect(typeof body.score).toBe("number");
    });

    test("should handle edge case values", async () => {
      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ status: "success" }),
      });

      await saveHighScore(0, "EdgeCase");

      const call = fetch.mock.calls[0];
      const body = JSON.parse(call[1].body);

      expect(body.score).toBe(0);
      expect(body.name).toBe("EdgeCase");
    });
  });
});
