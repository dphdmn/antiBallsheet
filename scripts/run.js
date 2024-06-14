document.getElementById('title').textContent = TITLE;
createSettingsTabs();
loadSettings();
document.getElementById('balls-to-catch').addEventListener('input', function () {
    updateLabel('balls-to-catch');
});
document.getElementById('ball-size').addEventListener('input', function () {
    updateLabel('ball-size');
});
document.getElementById('cursor-size').addEventListener('input', function () {
    var cursorSize = parseInt(document.getElementById('cursor-size').value);
    setCursor(cursorSize);
    updateLabel('cursor-size');
});
document.getElementById('set-to-default').addEventListener('click', function () {
    setToDefault();
});
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