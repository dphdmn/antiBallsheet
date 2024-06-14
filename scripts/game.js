class AntiBallsheetGame {
    constructor(gameContainer, ball, hitbox, timerDisplay, ballsLeftDisplay, winMessage, startButton, startButtonContainer) {
        this.fieldSize = FIELD_SIZE_PX;
        this.gameContainer = gameContainer;
        this.ball = ball;
        this.hitbox = hitbox;
        this.timerDisplay = timerDisplay;
        this.ballsLeftDisplay = ballsLeftDisplay;
        this.winMessage = winMessage;
        this.startButton = startButton;
        this.startButtonContainer = startButtonContainer;

        this.audio = new Audio('resources/boop.wav');
        this.randomPositions = [];
        this.interval = null;
        this.startTime = null;
        this.lastHitTime = null;
        this.reactionTimes = [];
        this.gameContainer.oncontextmenu = function () { return false; }
        this.gameContainer.onmousedown = function () { return false; }
        this.addEventListeners();

    }
    generateRandomPositions() {
        this.randomPositions = [];
        for (let i = 0; i < this.ballToCatch; i++) {
            const { x, y } = this.getRandomPosition();
            const hitboxTransform = `translate3d(${x - this.cursorRadius}px, ${y - this.cursorRadius}px, 0)`;
            const ballTransform = `translate3d(${x}px, ${y}px, 0)`;
            this.randomPositions.push({ hitboxTransform, ballTransform });
        }
        this.currentPositionIndex = 0;
    }
    configure() {
        let currentSettings = getSettings();
        currentSettings.minimalDistance = DEFAULTS['minimal-distance']; //temporarly hard-locked
        this.ballToCatch = currentSettings.ballsToCatch;

        this.ballSizeP = currentSettings.ballSize;
        this.ballSize = this.fieldSize * this.ballSizeP / 100;
        this.distanceRatio = currentSettings.minimalDistance / 100;

        this.minDistance = (this.fieldSize - this.ballSize) * this.distanceRatio;

    }

    updateSizes() {
        this.ball.style.width = this.ball.style.height = `${this.ballSize}px`;
        this.gameContainer.style.width = this.gameContainer.style.height = `${this.fieldSize}px`;

        this.ballRadius = this.ball.clientWidth / 2;
        this.cursorRadius = this.ballRadius;
        this.hitboxRadius = this.ballRadius + this.cursorRadius;

        this.hitbox.style.width = this.hitbox.style.height = `${this.hitboxRadius * 2}px`;
    }
    getRandomPosition() {
        let x, y;
        do {
            let maxW = this.gameContainer.clientWidth - this.ball.clientWidth;
            let maxH = this.gameContainer.clientHeight - this.ball.clientHeight;
            let cx = maxW / 2, cy = maxH / 2;
            let a = maxW / 2;
            let b = maxH / 2;
            let t = myrandom.real(0, 2 * Math.PI);
            let r = Math.sqrt(myrandom.real(0, 1));
            x = cx + a * r * Math.cos(t);
            y = cy + b * r * Math.sin(t);
        } while (this.distanceBetweenPoints(x, y, this.latestX, this.latestY) < this.minDistance);
        this.latestX = x;
        this.latestY = y;
        return { x, y };
    }
    distanceBetweenPoints(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    moveBall() {
        const { hitboxTransform, ballTransform } = this.randomPositions[this.currentPositionIndex++];
        this.hitbox.style.transform = hitboxTransform;
        this.ball.style.transform = ballTransform;
        this.lastHitTime = Date.now();
    }

    updateTimer() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        this.timerDisplay.textContent = `Time: ${elapsedTime.toFixed(2)}s`;
    }

    startGame() {
        this.configure();
        document.getElementById('title').textContent = "";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        clearInterval(this.interval);
        this.reactionTimes = [];
        this.randomPositions = [];
        this.ballsLeft = this.ballToCatch;
        this.timerDisplay.textContent = `Time: 0.00s`;
        this.updateDisplay();
        this.gameContainer.style.display = 'flex';
        this.startButtonContainer.style.display = 'none';
        this.updateSizes();
        this.generateRandomPositions();
        this.moveBall();
        this.startTime = Date.now();
        this.lastHitTime = Date.now();
        this.interval = setInterval(this.updateTimer.bind(this), 10);
    }

    endGame() {
        document.getElementById('title').textContent = TITLE;
        document.documentElement.style.overflow = "visible";
        document.body.style.overflow = "visible";
        clearInterval(this.interval);
        this.showResults();
        this.startButtonContainer.style.display = 'block';
        this.gameContainer.style.display = 'none';
    }

    updateDisplay() {
        this.ballsLeftDisplay.textContent = `Balls Left: ${this.ballsLeft}`;
    }
    handleHit() {
        this.ballsLeft--;
        const lastHitTime = this.lastHitTime;
        if (this.ballsLeft > 0) {
            this.moveBall();
        }
        const hitTime = Date.now();
        const reactionTime = (hitTime - lastHitTime) / 1000;
        this.reactionTimes.push(reactionTime);
        this.audio.play();
        this.updateDisplay();
        if (this.ballsLeft === 0) {
            this.endGame();
        }
    }
    launchGame() {
        this.winMessage.style.display = 'none';
        this.startButtonContainer.style.display = 'block';
        this.startGame();
    }
    abortGame() {
        this.endGame();
        this.winMessage.style.display = 'none';
        this.timerDisplay.textContent = "";
        this.ballsLeftDisplay.textContent = "";
    }
    handleRestart(e) {
        if (e.key === 'r' || e.key === 'R' || e.key === 'К' || e.key === 'к' || e.key === " ") {
            this.launchGame();
        }
        if (e.key === "Escape") {
            this.abortGame();
        }
    }

    showResults() {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const averageTime = this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length;
        const minTime = Math.min(...this.reactionTimes);
        const maxTime = Math.max(...this.reactionTimes);
        const reactionTimesList = this.reactionTimes.join(', ');
        createWinMessage(this.ballToCatch, totalTime, minTime, maxTime, averageTime, this.ballSizeP, reactionTimesList);
        this.winMessage.style.display = 'block';
        this.displayChart();
    }

    displayChart() {
        const ctx = document.getElementById('reaction-time-chart').getContext('2d');

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.reactionTimes.map((_, index) => index + 1),
                datasets: [{
                    label: 'Reaction Time (s)',
                    data: this.reactionTimes,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                devicePixelRatio: 4,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }

    addEventListeners() {
        this.hitbox.addEventListener('mouseover', this.handleHit.bind(this));
        document.addEventListener('keydown', this.handleRestart.bind(this));
        this.startButton.addEventListener('click', this.launchGame.bind(this));
    }
}
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
loadSettings();
function setToDefault() {
    for (var setting in DEFAULTS) {
        var slider = document.getElementById(setting);
        var value = DEFAULTS[setting];
        if (slider !== null) {
            slider.value = value;
            updateLabel(setting);
        }

    }
    setCursor(DEFAULTS["cursor-size"]);
}
function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}
function loadSettings() {
    var storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        var settings = JSON.parse(storedSettings);
        var settingsMap = {
            ballsToCatch: 'balls-to-catch',
            ballSize: 'ball-size',
            cursorSize: 'cursor-size',
            minimalDistance: 'minimal-distance'
        };
        setCursor(settings.cursorSize);
        for (var setting in settings) {
            var sliderId = settingsMap[setting];
            var value = settings[setting];
            var slider = document.getElementById(sliderId);
            if (slider) {
                slider.value = value;
                updateLabel(sliderId);
            }
        }
    } else {
        setToDefault();
    }
}

function updateLabel(setting) {
    var slider = document.getElementById(setting);
    var valueLabel = document.getElementById(setting + '-value');
    var value = slider.value;
    valueLabel.textContent = value + (setting === 'ball-size' || setting === 'minimal-distance' ? '%' : '');
}

function getSettings() {
    var ballsToCatch = parseInt(document.getElementById('balls-to-catch').value);
    var ballSize = parseInt(document.getElementById('ball-size').value);
    var cursorSize = parseInt(document.getElementById('cursor-size').value);
    setCursor(cursorSize);
    var minimalDistance = DEFAULTS['minimal-distance'];

    var settings = {
        ballsToCatch: ballsToCatch,
        ballSize: ballSize,
        cursorSize: cursorSize,
        minimalDistance: minimalDistance
    };

    saveSettings(settings);

    return settings;
}