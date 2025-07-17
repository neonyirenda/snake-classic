// Snake head
const snakeHeadImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};
snakeHeadImages.up.src = 'static/assets/snake/head_up.png';
snakeHeadImages.down.src = 'static/assets/snake/head_down.png';
snakeHeadImages.left.src = 'static/assets/snake/head_left.png';
snakeHeadImages.right.src = 'static/assets/snake/head_right.png';

// Snake body
const snakeBodyImages = {
    horizontal: new Image(),
    vertical: new Image(),
    top_left: new Image(),
    top_right: new Image(),
    bottom_left: new Image(),
    bottom_right: new Image()
};
snakeBodyImages.horizontal.src = 'static/assets/snake/body_horizontal.png';
snakeBodyImages.vertical.src = 'static/assets/snake/body_vertical.png';
snakeBodyImages.top_left.src = 'static/assets/snake/body_bottomright.png';
snakeBodyImages.top_right.src = 'static/assets/snake/body_bottomleft.png';
snakeBodyImages.bottom_left.src = 'static/assets/snake/body_topright.png';
snakeBodyImages.bottom_right.src = 'static/assets/snake/body_topleft.png';

// Snake tail
const snakeTailImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};
snakeTailImages.up.src = 'static/assets/snake/tail_up.png';
snakeTailImages.down.src = 'static/assets/snake/tail_down.png';
snakeTailImages.left.src = 'static/assets/snake/tail_left.png';
snakeTailImages.right.src = 'static/assets/snake/tail_right.png';

// Food images
const fruit = {
    apple: new Image(),
    super_apple: new Image(),
    rotten_apple: new Image()
};
fruit.apple.src = 'static/assets/fruits/apple.png';
fruit.super_apple.src = 'static/assets/fruits/super_apple.png';
fruit.rotten_apple.src = 'static/assets/fruits/rotten_apple.png';
