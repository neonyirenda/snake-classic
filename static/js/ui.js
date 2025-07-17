function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('highscores').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';
}

function showGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
}

async function displayHighscores() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('highscores').style.display = 'block';
    const highscoresList = document.getElementById('highscoresList');
    highscoresList.innerHTML = '';
    const highscores = await getHighscores();
    if (highscores.length === 0) {
        highscoresList.innerHTML = '<li>No high scores yet!</li>';
    } else {
        highscores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            highscoresList.appendChild(li);
        });
    }
}
