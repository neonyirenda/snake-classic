const GRID_SIZE = 20;
const WALL_THICKNESS = 2;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = -25;
const FRUITS_PER_LEVEL = 3;
const LEVELS_PER_SPEED_INCREASE = 3;

const FRUIT_TYPES = {
    APPLE: { color: '#e74c3c', score: 1, length: 1 },
    ROTTEN_APPLE: { color: '#000000', score: -2, length: -2 },
    SPECIAL_APPLE: { color: '#ff69b4', score: 4, length: 4 }
};

// Export for Node.js (testing environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GRID_SIZE,
        WALL_THICKNESS,
        INITIAL_SPEED,
        SPEED_INCREMENT,
        FRUITS_PER_LEVEL,
        LEVELS_PER_SPEED_INCREASE,
        FRUIT_TYPES
    };
}
