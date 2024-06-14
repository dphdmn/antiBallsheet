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
