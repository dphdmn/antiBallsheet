class GameStats {
    constructor(name) {
        this.name = name;
        this.parameters = {};
        this.scores = [];
        this.loadFromLocalStorage();
    }

    addParameter(label, lowerIsBetter) {
        if (this.parameters.hasOwnProperty(label)) {
            return;
        }

        this.parameters[label] = {
            lowerIsBetter: lowerIsBetter,
            values: []
        };
    }

    add(values) {
        const timestamp = new Date();
        const scoreEntry = { timestamp, values };

        for (const [key, value] of Object.entries(values)) {
            if (this.parameters[key]) {
                this.parameters[key].values.push({ value, timestamp });
            }
        }

        this.scores.push(scoreEntry);
        this.saveToLocalStorage();
    }
    removeLastScore(confirm = true) {
        if (confirm && !window.confirm("Are you sure you want to remove the last score?")) {
            return;
        }

        if (this.scores.length === 0) {
            return;
        }
        this.scores.pop();
        this.saveToLocalStorage();
    }
    removeAllScores(confirm = true) {
        if (confirm && !window.confirm(`Are you sure you want to remove all scores for "${this.coolName()}?"`)) {
            return;
        }

        this.scores = [];
        this.saveToLocalStorage();
    }
    getAllScores() {
        return JSON.stringify(this.scores, null, 2);
    }
    coolName() {
        let [numberOfBalls, sizePercent] = this.name.split(',').map(s => s.trim());
        numberOfBalls = parseInt(numberOfBalls);
        sizePercent = parseInt(sizePercent);
        return `Scores history of catching ${numberOfBalls} balls with size ${sizePercent}%`;
    }
    createGraph(parameters, container) {
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.parentNode.removeChild(existingCanvas);
        }
    
        // Generate labels for the x-axis
        const labels = this.scores.map(score => new Date(score.timestamp).toLocaleString());
    
        // Generate datasets for each parameter
        const datasets = parameters.map(param => {
            const data = this.scores.map(score => score.values[param]);
            const rngColor =  this.getRandomColor();
            return {
                label: param,
                data,
                fill: false,
                borderColor: rngColor,
                backgroundColor: rngColor,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 2
            };
        });
    
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        // Create a new Chart instance
        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets
            },
            options: {
                responsive: true,
                devicePixelRatio: 4,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: this.coolName(),
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 12
                        },
                        footerFont: {
                            size: 10
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(200, 200, 200, 0.3)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(200, 200, 200, 0.3)'
                        }
                    }
                },
                animation: {
                    duration: 0,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    }
    

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    saveToLocalStorage() {
        const data = {
            name: this.name,
            parameters: this.parameters,
            scores: this.scores
        };
        localStorage.setItem(`GameStats_${this.name}`, JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem(`GameStats_${this.name}`));
        if (data) {
            this.name = data.name;
            this.parameters = data.parameters;
            this.scores = data.scores;
        }
    }
}