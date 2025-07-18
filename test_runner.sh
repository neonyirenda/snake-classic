#!/bin/bash

# Test runner script for Snake Classic
echo "🧪 Running Snake Classic Test Suite"
echo "======================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating one..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📦 Installing/upgrading dependencies..."
pip install -r requirements.txt

# Run Python tests
echo ""
echo "🐍 Running Python/Flask tests..."
echo "================================="
python -m pytest tests/test_app.py -v

# Check if npm is available and package.json exists
if command -v npm &> /dev/null && [ -f "package.json" ]; then
    echo ""
    echo "🟨 Running JavaScript tests..."
    echo "=============================="
    
    # Install npm dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        npm install
    fi
    
    # Run JavaScript tests
    npm test
else
    echo ""
    echo "⚠️  npm not found or package.json missing. Skipping JavaScript tests."
    echo "      Install Node.js and npm to run JavaScript tests."
fi

echo ""
echo "✅ Test suite completed!"
echo "======================="

# Keep virtual environment activated for further use
echo "Virtual environment remains activated for your use." 