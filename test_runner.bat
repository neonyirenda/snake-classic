@echo off
REM Test runner script for Snake Classic (Windows)
echo 🧪 Running Snake Classic Test Suite
echo ======================================

REM Check if virtual environment exists
if not exist "venv\" (
    echo ⚠️  Virtual environment not found. Creating one...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate

REM Install/upgrade dependencies
echo 📦 Installing/upgrading dependencies...
pip install -r requirements.txt

REM Run Python tests
echo.
echo 🐍 Running Python/Flask tests...
echo =================================
python -m pytest tests/test_app.py -v

REM Check if npm is available and package.json exists
where npm >nul 2>&1
if %errorlevel% == 0 (
    if exist "package.json" (
        echo.
        echo 🟨 Running JavaScript tests...
        echo ==============================
        
        REM Install npm dependencies if node_modules doesn't exist
        if not exist "node_modules\" (
            echo 📦 Installing npm dependencies...
            npm install
        )
        
        REM Run JavaScript tests
        npm test
    ) else (
        echo.
        echo ⚠️  package.json not found. Skipping JavaScript tests.
    )
) else (
    echo.
    echo ⚠️  npm not found. Skipping JavaScript tests.
    echo      Install Node.js and npm to run JavaScript tests.
)

echo.
echo ✅ Test suite completed!
echo =======================

REM Keep virtual environment activated for further use
echo Virtual environment remains activated for your use.
pause 