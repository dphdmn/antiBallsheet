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

    const settings = [
        { label: 'Balls to catch: ', id: 'balls-to-catch', valueId: 'balls-to-catch-value', min: 50, max: 500, value: 350, step: 50, labels: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500] },
        { label: 'Ball size: ', id: 'ball-size', valueId: 'ball-size-value', min: 5, max: 20, value: 10, labels: ['20%', '15%', '10%', '5%'] },
        { label: 'Cursor size (visual only): ', id: 'cursor-size', valueId: 'cursor-size-value', min: 0, max: 64, value: 8, step: 2, labels: [64, 56, 48, 40, 32, 24, 16, 8, 0] }
    ];

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
function createSettingsTabs() {
    const tabContainerSettings = document.createElement('div');
    tabContainerSettings.className = 'tab-container';
    tabContainerSettings.style.textAlign = "center";
    const settingsButton = createTabButton('Settings', 'mysettings', tabContainerSettings);
    const customizationButton = createTabButton('Customization', 'mycustomization', tabContainerSettings);
    tabContainerSettings.appendChild(settingsButton);
    tabContainerSettings.appendChild(customizationButton);
    settingsContainer = createSettingsContainer();
    tabContainerSettings.appendChild(createTabContent('mysettings', settingsContainer));
    customizationContainer = createCustomizationContainer();
    tabContainerSettings.appendChild(createTabContent('mycustomization', customizationContainer));
    document.querySelector('.start-button-container').appendChild(tabContainerSettings);
    settingsButton.click();
}
function setCursor(size) {
    const html = document.documentElement;

    if (size === 0) {
        html.style.cursor = 'auto';
    } else {
        // Create a new Image object to preload the cursor
        const cursorImg = new Image();
        cursorImg.onload = function () {
            const cursorUrl = `url('${cursorImg.src}') ${size / 2} ${size / 2}, not-allowed`;
            html.style.cursor = cursorUrl;
        };
        cursorImg.onerror = function () {
            // Handle error if the image fails to load
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
        tabContainer.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        tabContainer.querySelector(`#${targetId}`).classList.add('active');
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

function createWinMessage(ballToCatch, totalTime, minTime, maxTime, averageTime, ballSizeP, reactionTimesList) {
    const winMessage = document.getElementById('win-message');
    winMessage.innerHTML = '';
    winMessage.appendChild(createStatsElement(ballToCatch, totalTime, averageTime, minTime, maxTime, ballSizeP));

    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'reaction-time-chart';

    const reactionList = document.createElement('p');
    reactionList.id = 'reaction-times-list';
    reactionList.textContent = reactionTimesList;
    const chartButton = createTabButton('Chart', 'chart-tab', tabContainer);
    const listButton = createTabButton('List', 'list-tab', tabContainer);
    tabContainer.appendChild(chartButton);
    tabContainer.appendChild(listButton);
    tabContainer.appendChild(createTabContent('chart-tab', chartCanvas));
    tabContainer.appendChild(createTabContent('list-tab', reactionList));

    winMessage.appendChild(tabContainer);

    chartButton.click(); // Show the first tab by default
}