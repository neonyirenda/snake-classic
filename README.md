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

## Development

This project follows **Test-Driven Development (TDD)** principles. For detailed future plans and roadmap, see [TODO.md](TODO.md).

### Testing
- **Backend Tests:** Python tests using pytest
- **Frontend Tests:** JavaScript tests using Jest
- **Test Coverage:** Targeting 80%+ code coverage

#### Running Tests

**Easy way (all tests):**
```bash
# Linux/macOS
./test_runner.sh

# Windows
test_runner.bat
```

**Manual way:**
```bash
# Backend tests only
python -m pytest tests/test_app.py -v

# Frontend tests only (requires Node.js)
npm test

# With coverage
python -m pytest tests/test_app.py --cov=app --cov-report=html
npm test -- --coverage
```

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
