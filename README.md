# Snake

A classic snake game built with a Python Flask backend and a JavaScript frontend.

## Live Demo

Play the game here: [https://neonyirenda.pythonanywhere.com/](https://neonyirenda.pythonanywhere.com/) Leave your highscore 😉

## Features

*   **Classic Snake Gameplay:** Control the snake to eat food and grow longer.
*   **Increasing Difficulty:** The game speeds up every 7 fruits eaten, increasing the challenge.
*   **High Score System:** At the end of each game, you can enter your name to be saved on the leaderboard.
*   **Pause and Resume:** Press the "Escape" key to pause the game and resume when you're ready.
*   **Clean, Modern UI:** A visually appealing and responsive user interface.

## Future Plans

- [x] **Design:** Make the frame look like a brick 🧱 wall with alternating colors.
    - [x] **Favicon** Add a favicon
- [x] **Gameplay:**
    - [x] Separate level from score.
    - [x] Display level in the top-right corner.
    - [x] Increase speed every 3 levels.
    - [x] Snake starts in a random direction.
    - [x] Add mobile controls 
    - [ ] Add a winning condtion.
- [x] **Fruit Variety:**
    - [x] Add different fruits with unique effects:
        - 🍎 **Apple (Red):** Standard fruit, snake grows by 1.
        - ⚫ **Rotten Apple (Black):** Reduces snake length by 2 and score by 2.
        - 🌸 **Special Apple (Pink):** Snake grows by 4, appears rarely.
    - [x] Implement multiple fruit drops (e.g., two at a time).
    - [x] Allow players to choose between two different fruits at higher levels (e.g., starting at level 5).
- [ ] **Sound Effects:** Add sound effects for eating food, game over, and other events.
- [ ] **Visual Effects:** Implement visual effects like screen shake or particle effects to enhance the player experience.
- [x] **Snake Assets:** Add custom graphics or sprites for the snake.
    - [ ] **Body Code** work body code when snake is turning currently hacky, would take a minute but ZESCO
- [x] **Fruit Assets:** Add fruit assets for the fruit, super fruit and bomb.
- [x] **Code Refactoring:**
    - [x] Centralize asset loading in `assets.js`.
    - [x] Rename `api.js` to `highscoreService.js` for better clarity.
- [x] **Speed Scaling:** Adjust speed to scale up faster for a more challenging experience.
- [ ] **Snake Color Options:** Allow players to choose their snake color before starting the game.
- [ ] **Changing Map:** Implement maps that change layout or obstacles as the game progresses.
- [ ] **Frame Scaling** Have frame scale depending on screen size.

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/oktobersveryown/snake-classic.git
    cd your-repo-name
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
    or

    ```fish
    python -m venv venv
    source venv/bin/activate.fish
    ```
    or
    ```ps1
    python -m venv venv
    .\venv\bin\activate.ps1
    ```
    
4.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run the application:**
    ```bash
    flask run
    ```
6.  **Open your browser and go to `http://127.0.0.1:5000` to play.**

## Attribution

*   Snake and fruit assets by [clearcode](https://opengameart.org/content/snake-game-assets) on OpenGameArt.org.
