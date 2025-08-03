
// IoT Dashboard - ESP32 Communication
class IoTDashboard {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTheme();
        this.addLogEntry('Dashboard initialized. Ready to connect to ESP32.');
    }

    initializeElements() {
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;

        // Connection elements
        this.wsUrlInput = document.getElementById('wsUrl');
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.connectionStatus = document.getElementById('connectionStatus');

        // Sensor elements
        this.temperature = document.getElementById('temperature');
        this.humidity = document.getElementById('humidity');
        this.lightLevel = document.getElementById('lightLevel');
        this.wifiSignal = document.getElementById('wifiSignal');

        // Control elements
        this.redLed = document.getElementById('redLed');
        this.greenLed = document.getElementById('greenLed');
        this.blueLed = document.getElementById('blueLed');
        this.servoAngle = document.getElementById('servoAngle');
        this.servoValue = document.getElementById('servoValue');
        this.relay1 = document.getElementById('relay1');
        this.relay2 = document.getElementById('relay2');

        // Message elements
        this.messageInput = document.getElementById('messageInput');
        this.sendMessageBtn = document.getElementById('sendMessage');

        // Log elements
        this.logContent = document.getElementById('logContent');
        this.clearLogBtn = document.getElementById('clearLog');
        this.exportLogBtn = document.getElementById('exportLog');
    }

    bindEvents() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Connection events
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());

        // Control events
        this.redLed.addEventListener('change', () => this.sendLEDControl('red', this.redLed.checked));
        this.greenLed.addEventListener('change', () => this.sendLEDControl('green', this.greenLed.checked));
        this.blueLed.addEventListener('change', () => this.sendLEDControl('blue', this.blueLed.checked));
        
        this.servoAngle.addEventListener('input', () => {
            this.servoValue.textContent = this.servoAngle.value + '°';
            this.sendServoControl(this.servoAngle.value);
        });

        this.relay1.addEventListener('change', () => this.sendRelayControl(1, this.relay1.checked));
        this.relay2.addEventListener('change', () => this.sendRelayControl(2, this.relay2.checked));

        // Message events
        this.sendMessageBtn.addEventListener('click', () => this.sendCustomMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendCustomMessage();
        });

        // Log events
        this.clearLogBtn.addEventListener('click', () => this.clearLog());
        this.exportLogBtn.addEventListener('click', () => this.exportLog());
    }

    // Theme Management
    toggleTheme() {
        if (this.body.classList.contains('dark-mode')) {
            this.body.classList.remove('dark-mode');
            this.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            this.body.classList.remove('light-mode');
            this.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.body.classList.remove('dark-mode', 'light-mode');
        this.body.classList.add(savedTheme + '-mode');
    }

    // WebSocket Connection
    connect() {
        const url = this.wsUrlInput.value.trim();
        if (!url) {
            this.addLogEntry('Error: WebSocket URL is required', 'error');
            return;
        }

        try {
            this.websocket = new WebSocket(url);
            this.setupWebSocketEvents();
            this.updateConnectionUI('connecting');
            this.addLogEntry(`Attempting to connect to ${url}...`);
        } catch (error) {
            this.addLogEntry(`Connection error: ${error.message}`, 'error');
        }
    }

    setupWebSocketEvents() {
        this.websocket.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionUI('connected');
            this.addLogEntry('WebSocket connection established successfully');
            
            // Request initial sensor data
            this.sendMessage({ type: 'get_sensors' });
        };

        this.websocket.onmessage = (event) => {
            this.handleMessage(event.data);
        };

        this.websocket.onclose = (event) => {
            this.isConnected = false;
            this.updateConnectionUI('disconnected');
            this.addLogEntry(`Connection closed: ${event.code} - ${event.reason}`);
            
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };

        this.websocket.onerror = (error) => {
            this.addLogEntry(`WebSocket error: ${error.message}`, 'error');
        };
    }

    disconnect() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.isConnected = false;
        this.updateConnectionUI('disconnected');
        this.addLogEntry('Disconnected from ESP32');
    }

    scheduleReconnect() {
        this.reconnectAttempts++;
        this.addLogEntry(`Attempting to reconnect in ${this.reconnectDelay/1000} seconds... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.connect();
            }
        }, this.reconnectDelay);
    }

    updateConnectionUI(status) {
        const statusIndicator = this.connectionStatus;
        const statusText = statusIndicator.querySelector('.status-text');
        const statusDot = statusIndicator.querySelector('.status-dot');

        switch (status) {
            case 'connected':
                statusIndicator.classList.add('connected');
                statusText.textContent = 'Connected';
                this.connectBtn.disabled = true;
                this.disconnectBtn.disabled = false;
                break;
            case 'connecting':
                statusText.textContent = 'Connecting...';
                this.connectBtn.disabled = true;
                this.disconnectBtn.disabled = true;
                break;
            case 'disconnected':
                statusIndicator.classList.remove('connected');
                statusText.textContent = 'Disconnected';
                this.connectBtn.disabled = false;
                this.disconnectBtn.disabled = true;
                break;
        }
    }

    // Message Handling
    sendMessage(data) {
        if (this.isConnected && this.websocket) {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            this.websocket.send(message);
            this.addLogEntry(`Sent: ${message}`);
        } else {
            this.addLogEntry('Cannot send message: not connected', 'error');
        }
    }

    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            this.addLogEntry(`Received: ${data}`);

            switch (message.type) {
                case 'sensor_data':
                    this.updateSensorData(message.data);
                    break;
                case 'led_status':
                    this.updateLEDStatus(message.data);
                    break;
                case 'servo_status':
                    this.updateServoStatus(message.data);
                    break;
                case 'relay_status':
                    this.updateRelayStatus(message.data);
                    break;
                case 'error':
                    this.addLogEntry(`ESP32 Error: ${message.message}`, 'error');
                    break;
                default:
                    this.addLogEntry(`Unknown message type: ${message.type}`);
            }
        } catch (error) {
            // Handle plain text messages
            this.addLogEntry(`Received: ${data}`);
        }
    }

    // Sensor Data Updates
    updateSensorData(data) {
        if (data.temperature !== undefined) {
            this.temperature.textContent = `${data.temperature.toFixed(1)}°C`;
        }
        if (data.humidity !== undefined) {
            this.humidity.textContent = `${data.humidity.toFixed(1)}%`;
        }
        if (data.light !== undefined) {
            this.lightLevel.textContent = `${data.light} lux`;
        }
        if (data.wifi !== undefined) {
            this.wifiSignal.textContent = `${data.wifi} dBm`;
        }
    }

    // Control Functions
    sendLEDControl(color, state) {
        this.sendMessage({
            type: 'led_control',
            data: {
                color: color,
                state: state
            }
        });
    }

    sendServoControl(angle) {
        this.sendMessage({
            type: 'servo_control',
            data: {
                angle: parseInt(angle)
            }
        });
    }

    sendRelayControl(relay, state) {
        this.sendMessage({
            type: 'relay_control',
            data: {
                relay: relay,
                state: state
            }
        });
    }

    sendCustomMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.sendMessage({
                type: 'custom_message',
                data: {
                    message: message
                }
            });
            this.messageInput.value = '';
        }
    }

    // Status Updates
    updateLEDStatus(data) {
        const ledMap = {
            'red': this.redLed,
            'green': this.greenLed,
            'blue': this.blueLed
        };
        
        if (ledMap[data.color]) {
            ledMap[data.color].checked = data.state;
        }
    }

    updateServoStatus(data) {
        this.servoAngle.value = data.angle;
        this.servoValue.textContent = `${data.angle}°`;
    }

    updateRelayStatus(data) {
        const relayMap = {
            1: this.relay1,
            2: this.relay2
        };
        
        if (relayMap[data.relay]) {
            relayMap[data.relay].checked = data.state;
        }
    }

    // Log Management
    addLogEntry(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = `[${timestamp}]`;
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'log-message';
        messageSpan.textContent = message;
        
        if (type === 'error') {
            messageSpan.style.color = '#ff4757';
        }
        
        logEntry.appendChild(timeSpan);
        logEntry.appendChild(messageSpan);
        
        this.logContent.appendChild(logEntry);
        this.logContent.scrollTop = this.logContent.scrollHeight;
        
        // Limit log entries to prevent memory issues
        if (this.logContent.children.length > 100) {
            this.logContent.removeChild(this.logContent.firstChild);
        }
    }

    clearLog() {
        this.logContent.innerHTML = '';
        this.addLogEntry('Log cleared');
    }

    exportLog() {
        const logEntries = Array.from(this.logContent.children).map(entry => {
            return entry.textContent;
        }).join('\n');
        
        const blob = new Blob([logEntries], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iot-dashboard-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLogEntry('Log exported successfully');
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.iotDashboard = new IoTDashboard();
});

// Example ESP32 WebSocket Server Code (for reference)
/*
#include <WiFi.h>
#include <WebSocketsServer.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            Serial.printf("[%u] Connected!\n", num);
            break;
        case WStype_TEXT:
            handleWebSocketMessage(num, payload, length);
            break;
    }
}

void handleWebSocketMessage(uint8_t num, uint8_t * payload, size_t length) {
    String message = String((char*)payload);
    // Parse JSON and handle different message types
    // Send sensor data, control LEDs, servo, relays, etc.
}

void setup() {
    Serial.begin(115200);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
    // Send sensor data periodically
}
*/
