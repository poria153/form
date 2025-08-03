// IoT Dashboard JavaScript
class IoTDashboard {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
        this.sensorData = {
            temperature: null,
            humidity: null,
            pressure: null,
            light: null
        };
        this.sensorHistory = {
            temperature: [],
            humidity: [],
            pressure: [],
            light: []
        };
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupWebSocketControls();
        this.setupDeviceControls();
        this.setupLogControls();
        this.loadThemePreference();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-mode');
        
        if (isDark) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const body = document.body;
        
        body.classList.remove('dark-mode', 'light-mode');
        body.classList.add(savedTheme === 'light' ? 'light-mode' : 'dark-mode');
    }

    // WebSocket Management
    setupWebSocketControls() {
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');
        const websocketUrl = document.getElementById('websocketUrl');

        connectBtn.addEventListener('click', () => {
            this.connectWebSocket(websocketUrl.value);
        });

        disconnectBtn.addEventListener('click', () => {
            this.disconnectWebSocket();
        });
    }

    connectWebSocket(url) {
        if (!url) {
            this.addLogMessage('Please enter a WebSocket URL', 'error');
            return;
        }

        try {
            this.websocket = new WebSocket(url);
            
            this.websocket.onopen = () => {
                this.isConnected = true;
                this.updateConnectionStatus(true);
                this.addLogMessage('Connected to ESP32', 'success');
                this.enableDeviceControls();
            };

            this.websocket.onmessage = (event) => {
                this.handleWebSocketMessage(event.data);
            };

            this.websocket.onclose = () => {
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.addLogMessage('Disconnected from ESP32', 'warning');
                this.disableDeviceControls();
            };

            this.websocket.onerror = (error) => {
                this.addLogMessage('WebSocket error: ' + error.message, 'error');
            };

        } catch (error) {
            this.addLogMessage('Failed to connect: ' + error.message, 'error');
        }
    }

    disconnectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    updateConnectionStatus(connected) {
        const statusIndicator = document.getElementById('connectionStatus');
        const statusText = statusIndicator.querySelector('.status-text');
        const statusDot = statusIndicator.querySelector('.status-dot');

        if (connected) {
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.classList.remove('connected');
            statusText.textContent = 'Disconnected';
        }

        // Update button states
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');

        connectBtn.disabled = connected;
        disconnectBtn.disabled = !connected;
    }

    handleWebSocketMessage(data) {
        try {
            const message = JSON.parse(data);
            this.addLogMessage(`Received: ${JSON.stringify(message)}`, 'info');
            
            // Handle different message types
            if (message.type === 'sensor_data') {
                this.updateSensorData(message.data);
            } else if (message.type === 'status') {
                this.addLogMessage(`Status: ${message.message}`, 'info');
            } else if (message.type === 'error') {
                this.addLogMessage(`Error: ${message.message}`, 'error');
            }
        } catch (error) {
            // Handle non-JSON messages
            this.addLogMessage(`Raw message: ${data}`, 'info');
        }
    }

    // Sensor Data Management
    updateSensorData(data) {
        // Update sensor values
        if (data.temperature !== undefined) {
            this.sensorData.temperature = data.temperature;
            document.getElementById('temperatureValue').textContent = `${data.temperature}°C`;
            this.updateSensorHistory('temperature', data.temperature);
        }

        if (data.humidity !== undefined) {
            this.sensorData.humidity = data.humidity;
            document.getElementById('humidityValue').textContent = `${data.humidity}%`;
            this.updateSensorHistory('humidity', data.humidity);
        }

        if (data.pressure !== undefined) {
            this.sensorData.pressure = data.pressure;
            document.getElementById('pressureValue').textContent = `${data.pressure} hPa`;
            this.updateSensorHistory('pressure', data.pressure);
        }

        if (data.light !== undefined) {
            this.sensorData.light = data.light;
            document.getElementById('lightValue').textContent = `${data.light} lux`;
            this.updateSensorHistory('light', data.light);
        }
    }

    updateSensorHistory(sensorType, value) {
        const history = this.sensorHistory[sensorType];
        history.push({
            value: value,
            timestamp: Date.now()
        });

        // Keep only last 50 readings
        if (history.length > 50) {
            history.shift();
        }

        // Update chart visualization
        this.updateSensorChart(sensorType);
    }

    updateSensorChart(sensorType) {
        const chartElement = document.getElementById(`${sensorType}Chart`);
        const history = this.sensorHistory[sensorType];
        
        if (history.length < 2) return;

        // Create a simple bar chart visualization
        const maxValue = Math.max(...history.map(h => h.value));
        const minValue = Math.min(...history.map(h => h.value));
        const range = maxValue - minValue || 1;

        const bars = history.slice(-10).map(h => {
            const height = ((h.value - minValue) / range) * 100;
            return `<div class="chart-bar" style="height: ${height}%"></div>`;
        }).join('');

        chartElement.innerHTML = `
            <div class="chart-container">
                ${bars}
            </div>
        `;
    }

    // Device Controls
    setupDeviceControls() {
        // LED Controls
        const ledCheckboxes = document.querySelectorAll('input[data-led]');
        ledCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.sendLEDCommand(e.target.dataset.led, e.target.checked);
            });
        });

        // Servo Control
        const servoSlider = document.getElementById('servoAngle');
        const servoValue = document.getElementById('servoValue');
        
        servoSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            servoValue.textContent = `${value}°`;
        });

        servoSlider.addEventListener('change', (e) => {
            this.sendServoCommand(e.target.value);
        });

        // Motor Control
        const motorSlider = document.getElementById('motorSpeed');
        const motorValue = document.getElementById('motorValue');
        
        motorSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            motorValue.textContent = `${value}%`;
        });

        motorSlider.addEventListener('change', (e) => {
            this.sendMotorCommand(e.target.value);
        });
    }

    enableDeviceControls() {
        const controls = document.querySelectorAll('.control-card input, .control-card select');
        controls.forEach(control => {
            control.disabled = false;
        });
    }

    disableDeviceControls() {
        const controls = document.querySelectorAll('.control-card input, .control-card select');
        controls.forEach(control => {
            control.disabled = true;
        });
    }

    sendLEDCommand(ledNumber, state) {
        const command = {
            type: 'led_control',
            led: parseInt(ledNumber),
            state: state
        };
        this.sendWebSocketMessage(command);
    }

    sendServoCommand(angle) {
        const command = {
            type: 'servo_control',
            angle: parseInt(angle)
        };
        this.sendWebSocketMessage(command);
    }

    sendMotorCommand(speed) {
        const command = {
            type: 'motor_control',
            speed: parseInt(speed)
        };
        this.sendWebSocketMessage(command);
    }

    sendWebSocketMessage(message) {
        if (this.websocket && this.isConnected) {
            this.websocket.send(JSON.stringify(message));
            this.addLogMessage(`Sent: ${JSON.stringify(message)}`, 'info');
        } else {
            this.addLogMessage('Not connected to ESP32', 'error');
        }
    }

    // Log Management
    setupLogControls() {
        const clearLogBtn = document.getElementById('clearLog');
        const exportLogBtn = document.getElementById('exportLog');

        clearLogBtn.addEventListener('click', () => {
            this.clearLog();
        });

        exportLogBtn.addEventListener('click', () => {
            this.exportLog();
        });
    }

    addLogMessage(message, type = 'info') {
        const logContainer = document.getElementById('messageLog');
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="message">${message}</span>
        `;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Keep only last 100 entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 100) {
            entries[0].remove();
        }
    }

    clearLog() {
        const logContainer = document.getElementById('messageLog');
        logContainer.innerHTML = '';
        this.addLogMessage('Log cleared', 'info');
    }

    exportLog() {
        const logContainer = document.getElementById('messageLog');
        const entries = logContainer.querySelectorAll('.log-entry');
        
        let logText = 'IoT Dashboard Log\n';
        logText += '================\n\n';
        
        entries.forEach(entry => {
            const timestamp = entry.querySelector('.timestamp').textContent;
            const message = entry.querySelector('.message').textContent;
            logText += `${timestamp} ${message}\n`;
        });

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iot-dashboard-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.addLogMessage('Log exported successfully', 'success');
    }

    // Utility Methods
    formatNumber(num) {
        return parseFloat(num).toFixed(2);
    }

    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Simulate sensor data for testing (remove in production)
    simulateSensorData() {
        if (!this.isConnected) return;

        const mockData = {
            type: 'sensor_data',
            data: {
                temperature: this.getRandomValue(20, 30),
                humidity: this.getRandomValue(40, 80),
                pressure: this.getRandomValue(1000, 1020),
                light: this.getRandomValue(100, 1000)
            }
        };

        this.handleWebSocketMessage(JSON.stringify(mockData));
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new IoTDashboard();
    
    // For testing purposes - simulate sensor data every 2 seconds
    // Remove this in production
    setInterval(() => {
        if (dashboard.isConnected) {
            dashboard.simulateSensorData();
        }
    }, 2000);
});

// Add CSS for chart visualization
const chartStyles = `
<style>
.chart-container {
    display: flex;
    align-items: end;
    height: 100%;
    gap: 2px;
}

.chart-bar {
    flex: 1;
    background: linear-gradient(to top, var(--primary-light), var(--accent));
    border-radius: 2px;
    min-height: 4px;
    transition: height 0.3s ease;
}

.chart-bar:hover {
    background: var(--accent);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', chartStyles);
