import pytest
import json
import os
import tempfile
from unittest.mock import patch, mock_open
from app import app, get_highscores, save_highscores, HIGHSCORES_FILE


@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def temp_highscores_file():
    """Create a temporary highscores file for testing."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        test_data = [{"name": "Alice", "score": 100}, {"name": "Bob", "score": 80}]
        json.dump(test_data, f)
        temp_file = f.name

    # Patch the HIGHSCORES_FILE constant
    with patch("app.HIGHSCORES_FILE", temp_file):
        yield temp_file

    # Clean up
    os.unlink(temp_file)


class TestGetHighscores:
    """Test the get_highscores function."""

    def test_get_highscores_file_not_exists(self):
        """Test get_highscores when file doesn't exist."""
        with patch("app.HIGHSCORES_FILE", "nonexistent.json"):
            result = get_highscores()
            assert result == []

    def test_get_highscores_valid_file(self, temp_highscores_file):
        """Test get_highscores with valid JSON file."""
        result = get_highscores()
        expected = [{"name": "Alice", "score": 100}, {"name": "Bob", "score": 80}]
        assert result == expected

    def test_get_highscores_invalid_json(self):
        """Test get_highscores with invalid JSON."""
        with patch("builtins.open", mock_open(read_data="invalid json")):
            with patch("os.path.exists", return_value=True):
                result = get_highscores()
                assert result == []

    def test_get_highscores_io_error(self):
        """Test get_highscores with IO error."""
        with patch("builtins.open", side_effect=IOError("File error")):
            with patch("os.path.exists", return_value=True):
                result = get_highscores()
                assert result == []


class TestSaveHighscores:
    """Test the save_highscores function."""

    def test_save_highscores_success(self, temp_highscores_file):
        """Test successful save of highscores."""
        test_scores = [
            {"name": "Charlie", "score": 120},
            {"name": "Diana", "score": 90},
        ]

        save_highscores(test_scores)

        # Verify the file was written correctly
        with open(temp_highscores_file, "r") as f:
            saved_data = json.load(f)

        assert saved_data == test_scores

    def test_save_highscores_io_error(self):
        """Test save_highscores with IO error."""
        test_scores = [{"name": "Test", "score": 50}]

        with patch("builtins.open", side_effect=IOError("Write error")):
            # Should not raise an exception
            save_highscores(test_scores)


class TestRoutes:
    """Test the Flask routes."""

    def test_index_route(self, client):
        """Test the index route."""
        response = client.get("/")
        assert response.status_code == 200
        assert b"<!DOCTYPE html>" in response.data

    def test_get_highscores_route(self, client, temp_highscores_file):
        """Test GET /highscores route."""
        response = client.get("/highscores")
        assert response.status_code == 200

        data = json.loads(response.data)
        expected = [{"name": "Alice", "score": 100}, {"name": "Bob", "score": 80}]
        assert data == expected

    def test_post_highscores_route_success(self, client, temp_highscores_file):
        """Test successful POST /highscores route."""
        new_score = {"name": "Charlie", "score": 150}

        response = client.post(
            "/highscores", json=new_score, content_type="application/json"
        )
        assert response.status_code == 201

        data = json.loads(response.data)
        assert data == {"status": "success"}

        # Verify the score was saved
        scores = get_highscores()
        assert any(
            score["name"] == "Charlie" and score["score"] == 150 for score in scores
        )

    def test_post_highscores_route_invalid_data(self, client):
        """Test POST /highscores with invalid data."""
        # Missing name
        response = client.post(
            "/highscores", json={"score": 100}, content_type="application/json"
        )
        assert response.status_code == 400

        # Missing score
        response = client.post(
            "/highscores", json={"name": "Test"}, content_type="application/json"
        )
        assert response.status_code == 400

        # Empty data
        response = client.post("/highscores", json={}, content_type="application/json")
        assert response.status_code == 400

    def test_post_highscores_route_empty_name(self, client):
        """Test POST /highscores with empty name."""
        response = client.post(
            "/highscores",
            json={"name": "   ", "score": 100},
            content_type="application/json",
        )
        assert response.status_code == 400

        data = json.loads(response.data)
        assert data == {"error": "Name cannot be empty"}

    def test_post_highscores_route_invalid_score(self, client):
        """Test POST /highscores with invalid score."""
        response = client.post(
            "/highscores",
            json={"name": "Test", "score": "invalid"},
            content_type="application/json",
        )
        assert response.status_code == 400

        data = json.loads(response.data)
        assert data == {"error": "Invalid score format"}

    def test_post_highscores_route_top_10_limit(self, client, temp_highscores_file):
        """Test that only top 10 scores are kept."""
        # Add 12 scores
        for i in range(12):
            score_data = {"name": f"Player{i}", "score": i * 10}
            client.post("/highscores", json=score_data, content_type="application/json")

        # Verify only top 10 are kept
        scores = get_highscores()
        assert len(scores) == 10

        # Verify they are sorted by score descending
        assert all(
            scores[i]["score"] >= scores[i + 1]["score"] for i in range(len(scores) - 1)
        )

    def test_post_highscores_route_no_json(self, client):
        """Test POST /highscores without JSON content type."""
        response = client.post("/highscores", data="not json")
        assert response.status_code == 415  # Unsupported Media Type
