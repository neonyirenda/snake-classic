async function getHighscores() {
  const response = await fetch("/highscores");
  return await response.json();
}

async function saveHighScore(score, name) {
  await fetch("/highscores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, score }),
  });
}

// Export functions for testing (only in Node.js environment)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getHighscores,
    saveHighScore,
  };
}
