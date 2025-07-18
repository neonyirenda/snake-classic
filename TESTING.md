# Testing Guide for Snake Classic

This document provides comprehensive information about testing in the Snake Classic project.

## Test Structure

```
tests/
├── __init__.py                 # Test package initialization
├── setup.js                   # Jest setup and mocking
├── test_app.py                # Flask backend tests
├── game.test.js               # Game logic tests
├── ui.test.js                 # UI function tests
└── highscoreService.test.js   # API service tests
```

## Test Frameworks

### Backend Testing (Python)

- **Framework:** pytest
- **Coverage:** pytest-cov
- **Flask Testing:** pytest-flask
- **Target Coverage:** 80%+

### Frontend Testing (JavaScript)

- **Framework:** Jest
- **Environment:** jsdom (for DOM testing)
- **Coverage:** Built-in Jest coverage
- **Target Coverage:** 80%+

## Test Categories

### 1. Backend Tests (`test_app.py`)

Tests the Flask application including:

- **Route Testing:** GET/POST endpoints
- **Function Testing:** `get_highscores()`, `save_highscores()`
- **Error Handling:** Invalid inputs, file I/O errors
- **Data Validation:** Input sanitization, type checking

### 2. Game Logic Tests (`game.test.js`)

Tests core game mechanics:

- **State Management:** Game initialization, reset
- **Food Generation:** Boundary checking, collision avoidance
- **Collision Detection:** Wall collisions, self-collision
- **Game Flow:** Pause/resume, level progression
- **Speed Management:** Level-based speed increases

### 3. UI Tests (`ui.test.js`)

Tests user interface functions:

- **Menu Navigation:** Show/hide different screens
- **Element Manipulation:** DOM state changes
- **Event Handling:** User interactions

### 4. API Service Tests (`highscoreService.test.js`)

Tests frontend-backend communication:

- **HTTP Requests:** GET/POST to highscores API
- **Error Handling:** Network failures, invalid responses
- **Data Serialization:** JSON formatting

## Running Tests

### Quick Start

```bash
# Run all tests (Linux/macOS)
./test_runner.sh

# Run all tests (Windows)
test_runner.bat
```

### Individual Test Suites

```bash
# Backend tests only
python -m pytest tests/test_app.py -v

# Frontend tests only
npm test

# Watch mode (re-runs tests on changes)
npm run test:watch
```

### Coverage Reports

```bash
# Backend coverage
python -m pytest tests/test_app.py --cov=app --cov-report=html

# Frontend coverage
npm run test:coverage
```

Coverage reports are generated in:

- Backend: `htmlcov/index.html`
- Frontend: `coverage/lcov-report/index.html`

## Test Configuration

### pytest Configuration (`pytest.ini`)

```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
addopts = -v --cov=app --cov-report=html --cov-fail-under=80
```

### Jest Configuration (`package.json`)

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": ["static/js/**/*.js", "!static/js/assets.js"],
    "coverageDirectory": "coverage",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
  }
}
```

## Writing New Tests

### Backend Test Example

```python
def test_new_feature(client):
    """Test description."""
    response = client.get('/new-endpoint')
    assert response.status_code == 200
    assert 'expected_content' in response.data
```

### Frontend Test Example

```javascript
describe("New Feature", () => {
  test("should perform expected behavior", () => {
    // Setup
    const result = newFunction();

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

## Mocking Strategy

### Backend Mocking

- File I/O operations with `mock_open()`
- External dependencies with `patch()`
- Database operations with fixtures

### Frontend Mocking

- DOM elements with Jest mocks
- HTTP requests with `fetch` mock
- Browser APIs with global mocks

## Test-Driven Development Workflow

1. **Write Test First:** Define expected behavior
2. **Run Test:** Verify it fails (red)
3. **Write Code:** Implement minimal functionality
4. **Run Test:** Verify it passes (green)
5. **Refactor:** Improve code quality
6. **Repeat:** Continue with next feature

## Best Practices

### Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Data

- Use fixtures for reusable test data
- Create isolated test environments
- Clean up after tests

### Coverage Guidelines

- Aim for 80%+ code coverage
- Focus on critical paths
- Don't sacrifice quality for coverage

## Debugging Tests

### Common Issues

- **Import Errors:** Check module exports
- **Async Issues:** Use proper async/await
- **Mock Problems:** Verify mock setup

### Debugging Commands

```bash
# Run single test with verbose output
python -m pytest tests/test_app.py::TestGetHighscores::test_get_highscores_valid_file -vv

# Run Jest with debug output
npm test -- --verbose
```

## Continuous Integration

The project is set up for CI/CD with:

- Automated test runs on push
- Coverage reporting
- Test failure notifications

## Contributing

When contributing:

1. Write tests for new features
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this guide if needed

## Resources

- [pytest documentation](https://docs.pytest.org/)
- [Jest documentation](https://jestjs.io/)
- [Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
