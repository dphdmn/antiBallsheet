const TITLE = `antiBallsheet game by dph, ${VERSION}`;
const FIELD_SIZE_PX = 600;
const DEFAULTS = {
    'balls-to-catch': 100,
    'ball-size': 10,
    'cursor-size': 16,
    'minimal-distance': 40
};
const DEFAULT_COLORS = {
    htmlBackground: '#111111',
    bodyBackground: '#111111',
    gameContainerBackground: '#000000',
    gameContainerBorder: '#004444',
    ballBackground: '#fa96c8',
    title: '#00FFFF'
};
const colorPickers = [
    { styleName: 'html', cssProperty: 'backgroundColor', captionText: 'Main background', initialColor: DEFAULT_COLORS.htmlBackground },
    { styleName: 'body', cssProperty: 'backgroundColor', captionText: 'Settings screen background', initialColor: DEFAULT_COLORS.bodyBackground },
    { styleName: '.game-container', cssProperty: 'backgroundColor', captionText: 'Gamefield background', initialColor: DEFAULT_COLORS.gameContainerBackground },
    { styleName: '.game-container', cssProperty: 'borderColor', captionText: 'Gamefield border', initialColor: DEFAULT_COLORS.gameContainerBorder },
    { styleName: '#ball', cssProperty: 'backgroundColor', captionText: 'Target color', initialColor: DEFAULT_COLORS.ballBackground },
    { styleName: '.info', cssProperty: 'color', captionText: 'Info text color', initialColor: DEFAULT_COLORS.title }
];
const settings = [
    { label: 'Balls to catch: ', id: 'balls-to-catch', valueId: 'balls-to-catch-value', min: 50, max: 500, value: 350, step: 50, labels: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500] },
    { label: 'Ball size: ', id: 'ball-size', valueId: 'ball-size-value', min: 5, max: 20, value: 10, labels: ['20%', '15%', '10%', '5%'] },
    { label: 'Cursor size (visual only): ', id: 'cursor-size', valueId: 'cursor-size-value', min: 0, max: 64, value: 8, step: 2, labels: [64, 56, 48, 40, 32, 24, 16, 8, 0] }
];