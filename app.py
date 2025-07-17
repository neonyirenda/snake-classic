from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

HIGHSCORES_FILE = 'highscores.json'

def get_highscores():
    """Safely reads high scores from the JSON file."""
    if not os.path.exists(HIGHSCORES_FILE):
        return []
    try:
        with open(HIGHSCORES_FILE, 'r') as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError) as e:
        app.logger.error(f"Error reading high scores file: {e}")
        return []

def save_highscores(scores):
    """Safely saves high scores to the JSON file."""
    try:
        with open(HIGHSCORES_FILE, 'w') as f:
            json.dump(scores, f, indent=4)
    except IOError as e:
        app.logger.error(f"Error writing to high scores file: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/highscores', methods=['GET', 'POST'])
def highscores():
    if request.method == 'GET':
        return jsonify(get_highscores())
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data or 'name' not in data or 'score' not in data:
                return jsonify({'error': 'Invalid data format'}), 400
            
            name = str(data['name']).strip()
            score = int(data['score'])

            if not name:
                return jsonify({'error': 'Name cannot be empty'}), 400

        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid score format'}), 400

        scores = get_highscores()
        scores.append({'name': name, 'score': score})
        scores.sort(key=lambda x: x['score'], reverse=True)
        scores = scores[:10]  # Keep top 10
        save_highscores(scores)
        
        return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    app.run(debug=True)
