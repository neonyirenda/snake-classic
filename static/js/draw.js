function draw(snake, foods, score, level, direction) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wall with alternating brick pattern
    const lightBrick = '#A0522D'; // Sienna
    const darkBrick = '#8B4513'; // SaddleBrown
    for (let x = 0; x < canvas.width / GRID_SIZE; x++) {
        for (let y = 0; y < canvas.height / GRID_SIZE; y++) {
            if (x < WALL_THICKNESS || x >= canvas.width / GRID_SIZE - WALL_THICKNESS ||
                y < WALL_THICKNESS || y >= canvas.height / GRID_SIZE - WALL_THICKNESS) {
                
                // Create a checkerboard pattern
                if ((x + y) % 2 === 0) {
                    ctx.fillStyle = lightBrick;
                } else {
                    ctx.fillStyle = darkBrick;
                }
                
                ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                // Add a darker stroke for mortar
                ctx.strokeStyle = '#5A2D0C';
                ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    // Draw snake
    if (snake.length === 0) return;

    // Draw Head
    const head = snake[0];
    ctx.drawImage(snakeHeadImages[direction], head.x * GRID_SIZE, head.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Draw Body
    for (let i = 1; i < snake.length - 1; i++) {
        const prev = snake[i - 1];
        const current = snake[i];
        const next = snake[i + 1];
        let bodyImage;

        // Straight pieces
        if (prev.x === next.x) {
            bodyImage = snakeBodyImages.vertical;
        } else if (prev.y === next.y) {
            bodyImage = snakeBodyImages.horizontal;
        }
        // Corner pieces
        else {
            const prev_is_above = prev.y < current.y;
            const prev_is_below = prev.y > current.y;
            const prev_is_left = prev.x < current.x;
            const prev_is_right = prev.x > current.x;

            const next_is_above = next.y < current.y;
            const next_is_below = next.y > current.y;
            const next_is_left = next.x < current.x;
            const next_is_right = next.x > current.x;

            if ((prev_is_above && next_is_right) || (prev_is_right && next_is_above)) {
                bodyImage = snakeBodyImages.bottom_left;
            } else if ((prev_is_above && next_is_left) || (prev_is_left && next_is_above)) {
                bodyImage = snakeBodyImages.bottom_right;
            } else if ((prev_is_below && next_is_right) || (prev_is_right && next_is_below)) {
                bodyImage = snakeBodyImages.top_left;
            } else if ((prev_is_below && next_is_left) || (prev_is_left && next_is_below)) {
                bodyImage = snakeBodyImages.top_right;
            }
        }
        
        if (bodyImage) {
            ctx.drawImage(bodyImage, current.x * GRID_SIZE, current.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // Draw Tail
    if (snake.length > 1) {
        const tail = snake[snake.length - 1];
        const before_tail = snake[snake.length - 2];
        let tail_direction;

        if (before_tail.x < tail.x) {
            tail_direction = 'right'; // Snake moving left, tail points right
        } else if (before_tail.x > tail.x) {
            tail_direction = 'left'; // Snake moving right, tail points left
        } else if (before_tail.y < tail.y) {
            tail_direction = 'down'; // Snake moving up, tail points down
        } else {
            tail_direction = 'up'; // Snake moving down, tail points up
        }
        ctx.drawImage(snakeTailImages[tail_direction], tail.x * GRID_SIZE, tail.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    // Draw foods
    for (const food of foods) {
        let imageToDraw;
        if (food.type === FRUIT_TYPES.APPLE) {
            imageToDraw = fruit.apple;
        } else if (food.type === FRUIT_TYPES.ROTTEN_APPLE) {
            imageToDraw = fruit.rotten_apple;
        } else if (food.type === FRUIT_TYPES.SPECIAL_APPLE) {
            imageToDraw = fruit.super_apple;
        }

        if (imageToDraw) {
            ctx.drawImage(imageToDraw, food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        } else {
            // Fallback to colored squares if image not found
            ctx.fillStyle = food.type.color;
            ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw "Score: " text
    ctx.font = '20px Arial';
    const scoreText = 'Score: ';
    const scoreTextWidth = ctx.measureText(scoreText).width;
    
    // Draw score number
    ctx.font = '28px Arial';
    const scoreNumWidth = ctx.measureText(score).width;
    
    const totalWidth = scoreTextWidth + scoreNumWidth;
    const startX = (canvas.width - totalWidth) / 2;

    ctx.font = '20px Arial';
    ctx.fillText(scoreText, startX + scoreTextWidth / 2, 10);
    
    ctx.font = '28px Arial';
    ctx.fillText(score, startX + scoreTextWidth + scoreNumWidth / 2, 6);

    // Draw level
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';

    // Draw "Level: " text
    ctx.font = '20px Arial';
    const levelText = 'Level: ';
    const levelTextWidth = ctx.measureText(levelText).width;

    // Draw level number
    ctx.font = '28px Arial';
    const levelNumWidth = ctx.measureText(level).width;

    const totalLevelWidth = levelTextWidth + levelNumWidth;
    const levelStartX = canvas.width - totalLevelWidth - 10;

    ctx.font = '20px Arial';
    ctx.fillText(levelText, levelStartX + levelTextWidth / 2, 10);

    ctx.font = '28px Arial';
    ctx.fillText(level, levelStartX + levelTextWidth + levelNumWidth / 2, 6);
}

function drawGameOver(score) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
}
