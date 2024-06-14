function createColorPicker(styleName, cssProperty, captionText, initialColor) {
    const container = document.createElement('div');
    container.style.marginBottom = '5px';
    const caption = document.createElement('span');
    caption.textContent = captionText;
    caption.style.marginRight = '10px';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = `color-picker${captionText}`;
    const storedColor = localStorage.getItem(colorPicker.id);
    colorPicker.value = storedColor ? storedColor : initialColor;
    const elements = document.querySelectorAll(styleName);
    elements.forEach(element => {
        element.style[cssProperty] = colorPicker.value;
    });
    colorPicker.addEventListener('input', function () {
        const elements = document.querySelectorAll(styleName);
        elements.forEach(element => {
            element.style[cssProperty] = colorPicker.value;
        });
    });
    colorPicker.addEventListener('change', function () {
        localStorage.setItem(colorPicker.id, colorPicker.value);
    });
    container.appendChild(caption);
    container.appendChild(colorPicker);
    return container;
}
function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map(Number);
    return "#" + ((1 << 24) + (result[0] << 16) + (result[1] << 8) + result[2]).toString(16).slice(1).toUpperCase();
}
function createCustomizationContainer() {
    const customizationContainer = document.createElement('div');
    customizationContainer.className = 'settings-container';

    colorPickers.forEach(picker => {
        customizationContainer.appendChild(createColorPicker(picker.styleName, picker.cssProperty, picker.captionText, picker.initialColor));
    });
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Default Colors';
    resetButton.addEventListener('click', () => {
        setColorsToDefault();
    });
    resetButton.classList.add("default-button");
    customizationContainer.appendChild(resetButton);

    return customizationContainer;
}
function setColorsToDefault() {

    colorPickers.forEach(picker => {
        const elements = document.querySelectorAll(picker.styleName);
        elements.forEach(element => {
            element.style[picker.cssProperty] = picker.initialColor;
        });
        const colorPicker = document.getElementById(`color-picker${picker.captionText}`);
        if (colorPicker) {
            colorPicker.value = picker.initialColor;
            localStorage.setItem(colorPicker.id, colorPicker.value);
        }
    });
}
function createSettingsContainer() {
    let settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-container';
    settings.forEach(setting => {
        let settingElement = document.createElement('div');
        settingElement.className = 'setting';

        settingElement.innerHTML = `
    <label for="${setting.id}">${setting.label}<span id="${setting.valueId}">${setting.value}${setting.step ? '' : '%'}</span></label>
    <input type="range" id="${setting.id}" class="range-slider" min="${setting.min}" max="${setting.max}" value="${setting.value}"${setting.step ? ` step="${setting.step}"` : ''}>
    <div class="range-labels">${setting.labels.map(label => `<span>${label}</span>`).join('')}</div>
`;

        settingsContainer.appendChild(settingElement);
    });

    let setToDefaultButton = document.createElement('button');
    setToDefaultButton.id = 'set-to-default';
    setToDefaultButton.className = 'default-button';
    setToDefaultButton.textContent = 'Set to Default';
    settingsContainer.appendChild(setToDefaultButton);

    return settingsContainer;
}

function setCursor(size) {
    const html = document.documentElement;

    if (size === 0) {
        html.style.cursor = 'auto';
    } else {
        const cursorImg = new Image();
        cursorImg.onload = function () {
            const cursorUrl = `url('${cursorImg.src}') ${size / 2} ${size / 2}, not-allowed`;
            html.style.cursor = cursorUrl;
        };
        cursorImg.onerror = function () {
            console.error("Failed to preload cursor image");
        };
        cursorImg.src = `resources/cursors/circle_${size}.png`;
    }
}
function createScoreValueElement(value) {
    const span = document.createElement('span');
    span.className = 'scoreValue';
    span.textContent = value;
    return span;
}
function createTableRowElement(label, value) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    const tdValue = document.createElement('td');
    tdValue.appendChild(createScoreValueElement(value));
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    return tr;
}
function createStatsElement(ballToCatch, totalTime, averageTime, minTime, maxTime, ballSizeP) {
    const table = document.createElement('table');
    table.className = 'statsTable';
    table.appendChild(createTableRowElement('Balls size', ballSizeP + '%'));
    table.appendChild(createTableRowElement('Balls', ballToCatch));
    table.appendChild(createTableRowElement('Time', totalTime.toFixed(3) + 's'));

    const averageRow = createTableRowElement('Reaction', averageTime.toFixed(3) + 's');
    const averageSpan = averageRow.querySelector('.scoreValue');
    averageSpan.title = `min: ${minTime.toFixed(3)} / max: ${maxTime.toFixed(3)}`;
    table.appendChild(averageRow);
    return table;
}
function createTabButton(text, targetId, tabContainer) {
    const button = document.createElement('button');
    button.className = 'tab-button';
    button.textContent = text;
    button.onclick = () => {
        const tabContents = tabContainer.querySelectorAll('.tab-content');
        const targetTab = tabContainer.querySelector(`#${targetId}`);
        
        if (tabContents.length === 0) {
            console.warn('No tab contents found.');
            return;
        }
        
        if (!targetTab) {
            console.warn(`No tab content found with ID: ${targetId}`);
            console.warn(tabContainer);
            return;
        }
        
        tabContents.forEach(tab => tab.classList.remove('active'));
        targetTab.classList.add('active');
    };
    return button;
}
function createTabContent(id, content) {
    const div = document.createElement('div');
    div.id = id;
    div.className = 'tab-content';
    div.appendChild(content);
    return div;
}
function appendStats(statsObject, time, minAvgTime, maxAvgTime, averageTime) {
    statsObject.add({ time, averageTime, minAvgTime, maxAvgTime });
    const historyChartContainer = document.createElement('div');
    historyChartContainer.style.maxWidth = "800px";
    historyChartContainer.style.minHeight = "400px";
    const historyRawDataContainer = document.createElement('div');
    const rawStatsData = document.createElement('p');
    rawStatsData.textContent = statsObject.getAllScores();
    historyRawDataContainer.style.display = "flex";
    historyRawDataContainer.style.justifyContent = "center";
    rawStatsData.style.overflowY = "scroll";
    historyRawDataContainer.appendChild(rawStatsData);
    rawStatsData.style.maxWidth = "500px";
    rawStatsData.style.maxHeight = "300px";
    statsObject.createGraph(['time', 'averageTime', 'minAvgTime', 'maxAvgTime'], historyChartContainer);
    const tabContainerScoresHistory = createTabBlock('scores-history', ['Chart', 'Raw data'], [historyChartContainer, historyRawDataContainer]);
    tabContainerScoresHistory.id = "scores-history-tabs";
    const existingElement = document.getElementById("scores-history-tabs");

    if (existingElement) existingElement.parentNode.removeChild(existingElement);
    const removeLastScoreButton = document.createElement('button');
    removeLastScoreButton.classList.add("dangerousButton");
    removeLastScoreButton.textContent = "Remove last score";
    removeLastScoreButton.style.marginRight = "10px";
    removeLastScoreButton.addEventListener('click', function() {
        statsObject.removeLastScore(true);
        rawStatsData.textContent = statsObject.getAllScores();
        statsObject.createGraph(['time', 'averageTime', 'minAvgTime', 'maxAvgTime'], historyChartContainer);
    });

    const removeAllScoresButton = document.createElement('button');
    removeAllScoresButton.textContent = "Remove all scores";
    removeAllScoresButton.classList.add("dangerousButton");
    removeAllScoresButton.addEventListener('click', function() {
        statsObject.removeAllScores(true);
        rawStatsData.textContent = statsObject.getAllScores();
        statsObject.createGraph(['time', 'averageTime', 'minAvgTime', 'maxAvgTime'], historyChartContainer);
    });
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = "10px";
    buttonContainer.appendChild(removeLastScoreButton);
    buttonContainer.appendChild(removeAllScoresButton);

    tabContainerScoresHistory.appendChild(buttonContainer);
    document.querySelector('.start-button-container').appendChild(tabContainerScoresHistory);
}
function createTabBlock(blockName, buttonLabels, tabData) {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';
    const buttons = buttonLabels.map((label, index) => {
        return createTabButton(label, `tab-${blockName}-${index}`, tabContainer);
    });
    tabContainer.append(...buttons);
    tabData.forEach((data, index) => {
        const content = createTabContent(`tab-${blockName}-${index}`, data);
        tabContainer.appendChild(content);
    });
    tabContainer.children[0].click();
    tabContainer.style.textAlign = "center";
    return tabContainer;
}
function createSettingsTabs() {
    const tabContainerSettings = createTabBlock('settings', ['Settings', 'Customization'], [createSettingsContainer(), createCustomizationContainer()]);
    document.querySelector('.start-button-container').appendChild(tabContainerSettings);
}
function createWinMessage(statsObject, ballToCatch, totalTime, minTime, maxTime, averageTime, ballSizeP, reactionTimesList) {
    const winMessage = document.getElementById('win-message');
    winMessage.innerHTML = '';
    winMessage.appendChild(createStatsElement(ballToCatch, totalTime, averageTime, minTime, maxTime, ballSizeP));
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'reaction-time-chart';
    const reactionList = document.createElement('p');
    reactionList.id = 'reaction-times-list';
    reactionList.textContent = reactionTimesList;
    tabBlockReactionGraph = createTabBlock('reaction-graph', ['Chart', 'List'], [chartCanvas, reactionList]);
    winMessage.appendChild(tabBlockReactionGraph);
    appendStats(statsObject, totalTime, minTime, maxTime, averageTime);
}
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