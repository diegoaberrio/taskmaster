// utils/pointsCalculator.js

const calculatePoints = (priority) => {
    switch (priority) {
        case 'high':
            return 100;
        case 'medium':
            return 50;
        case 'low':
            return 25;
        default:
            return 0;
    }
};

module.exports = { calculatePoints };
