document.getElementById('title').textContent = TITLE;
createSettingsTabs();
const game = new AntiBallsheetGame(
    document.querySelector('.game-container'),
    document.getElementById('ball'),
    document.getElementById('hitbox'),
    document.getElementById('timer'),
    document.getElementById('balls-left'),
    document.getElementById('win-message'),
    document.querySelector('.start-button'),
    document.querySelector('.start-button-container')
);