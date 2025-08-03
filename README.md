# ESP32 IoT Dashboard

A modern, responsive web dashboard for communicating with ESP32 microcontrollers via WebSocket connections. Features real-time sensor data visualization, device control, and a beautiful dark/light theme interface.

## 🎨 Theme Colors

The dashboard uses a custom color palette as specified:
- **Primary Dark**: `#090040`
- **Secondary Purple**: `#471396`
- **Accent Purple**: `#B13BFF`
- **Accent Yellow**: `#FFCC00`

## ✨ Features

### 🌓 Theme Support
- **Dark Mode** (default): Professional dark interface for extended use
- **Light Mode**: Clean, bright interface for daylight conditions
- Prominent theme toggle buttons in the header
- Smooth transitions between themes

### 📡 WebSocket Communication
- Real-time bidirectional communication with ESP32
- Automatic connection status monitoring
- JSON and raw message format support
- Connection retry and error handling

### 📊 Real-time Data Visualization
- **Sensor Monitoring**: Temperature, Humidity, Light, Voltage
- **Live Charts**: Interactive Chart.js graphs with 20-point history
- **Visual Indicators**: Animated status indicators and progress displays

### 🎛️ Device Control
- **LED Control**: Toggle switches for LED1 and LED2
- **Fan Control**: On/off switching for fan devices
- **Servo Control**: Angle adjustment slider (0-180°)
- **Real-time Feedback**: Instant visual confirmation of control actions

### 📝 Message Logging
- Timestamped message history
- Color-coded message types (sent, received, error, system)
- Scrollable log with auto-scroll to latest messages
- Clear log functionality

### 📱 Responsive Design
- Mobile-friendly responsive layout
- Adaptive grid system
- Touch-friendly controls
- Optimized for various screen sizes

## 🚀 Quick Start

### 1. Setup Files
1. Download all files to your web server directory:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Ensure your web server supports static file serving

### 2. ESP32 Setup
Install required libraries in Arduino IDE:
```arduino
// Library Manager -> Install:
- WebSocketsServer by Markus Sattler
- ArduinoJson by Benoit Blanchon
```

### 3. Open Dashboard
1. Open `index.html` in a web browser
2. The dashboard starts in **dark mode** by default
3. Use the theme toggle buttons to switch between modes

## 🔌 Connecting to ESP32

### Default Connection
- **URL Format**: `ws://[ESP32_IP_ADDRESS]:81`
- **Default Example**: `ws://192.168.1.100:81`

### Connection Steps
1. Ensure your ESP32 is connected to the same network
2. Find your ESP32's IP address (check Serial Monitor)
3. Enter the WebSocket URL in the connection field
4. Click **Connect**
5. Monitor connection status in the dashboard

## 📋 Message Formats

### Sensor Data (ESP32 → Dashboard)

**JSON Format:**
```json
{
  "sensors": {
    "temperature": 25.5,
    "humidity": 60.2,
    "light": 850,
    "voltage": 3.3
  }
}
```

**Raw Format:**
```
temp:25.5,humidity:60.2,light:850,voltage:3.3
```

### Device Control (Dashboard → ESP32)

**JSON Format:**
```json
{
  "type": "control",
  "device": "led1",
  "value": true
}
```

### Device Status (ESP32 → Dashboard)

**JSON Format:**
```json
{
  "devices": {
    "led1": true,
    "led2": false,
    "fan": true,
    "servo": 90
  }
}
```

**Raw Format:**
```
led1:on,led2:off,fan:on
```

## 🎮 Demo Mode

For testing without ESP32 hardware:

### Activation Methods
1. **Button**: Click "📊 Start Demo" button
2. **Keyboard**: Press `Ctrl+D` (or `Cmd+D` on Mac)

### Demo Features
- Simulated sensor data updates every 2 seconds
- Random realistic values for all sensors
- Interactive charts and displays
- Full UI testing capability

## ⌨️ Keyboard Shortcuts

- **`Ctrl/Cmd + D`**: Start demo mode
- **`Ctrl/Cmd + L`**: Clear message log

## 🛠️ ESP32 Arduino Code Template

```cpp
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

const char* ssid = "your-wifi-ssid";
const char* password = "your-wifi-password";

WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
    Serial.begin(115200);
    
    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    // Start WebSocket server
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
    
    // Send sensor data every 2 seconds
    static unsigned long lastSend = 0;
    if (millis() - lastSend > 2000) {
        sendSensorData();
        lastSend = millis();
    }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_CONNECTED:
            Serial.printf("Client %u connected\n", num);
            break;
            
        case WStype_DISCONNECTED:
            Serial.printf("Client %u disconnected\n", num);
            break;
            
        case WStype_TEXT:
            handleWebSocketMessage(num, (char*)payload);
            break;
    }
}

void sendSensorData() {
    DynamicJsonDocument doc(1024);
    
    doc["sensors"]["temperature"] = random(200, 350) / 10.0; // 20-35°C
    doc["sensors"]["humidity"] = random(300, 800) / 10.0;    // 30-80%
    doc["sensors"]["light"] = random(100, 1000);             // 100-1000 lux
    doc["sensors"]["voltage"] = random(300, 360) / 100.0;    // 3.0-3.6V
    
    String message;
    serializeJson(doc, message);
    webSocket.broadcastTXT(message);
}

void handleWebSocketMessage(uint8_t num, char* payload) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    if (doc["type"] == "control") {
        String device = doc["device"];
        bool value = doc["value"];
        
        // Control your devices here
        if (device == "led1") {
            digitalWrite(LED_PIN_1, value ? HIGH : LOW);
        } else if (device == "led2") {
            digitalWrite(LED_PIN_2, value ? HIGH : LOW);
        } else if (device == "fan") {
            digitalWrite(FAN_PIN, value ? HIGH : LOW);
        } else if (device == "servo") {
            int angle = doc["value"];
            // Control servo to specified angle
        }
    }
}
```

## 🔧 Customization

### Adding New Sensors
1. Update the sensor grid in `index.html`
2. Add corresponding CSS styling
3. Modify JavaScript sensor data handling
4. Update ESP32 code to send new sensor data

### Adding New Controls
1. Add control elements to the controls panel
2. Implement event listeners in JavaScript
3. Update the `sendControl()` method
4. Handle new commands in ESP32 code

### Theming
- Modify CSS custom properties in `:root` and `.dark-mode`
- All colors are centralized using CSS variables
- Consistent theme application across all components

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (Full grid layout)
- **Tablet**: 481px - 768px (2-column sensor grid)
- **Mobile**: ≤ 480px (Single column layout)

## 🌐 Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🔒 Security Considerations

- WebSocket connections are unencrypted by default
- For production use, consider implementing WSS (WebSocket Secure)
- Add authentication if needed for device access control
- Validate all incoming data on both client and ESP32

## 🐛 Troubleshooting

### Connection Issues
1. **Check Network**: Ensure ESP32 and browser are on same network
2. **Verify IP**: Confirm ESP32 IP address in Serial Monitor
3. **Port Access**: Ensure port 81 is accessible
4. **Firewall**: Check firewall settings on both devices

### Performance Issues
1. **Data Rate**: Reduce sensor update frequency if needed
2. **Chart Points**: Modify chart history length (default: 20 points)
3. **Browser Resources**: Close unnecessary tabs/applications

### Display Issues
1. **Theme Problems**: Clear browser cache and reload
2. **Responsive Layout**: Check viewport meta tag
3. **Chart Rendering**: Ensure Chart.js loads properly

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Happy IoT Development! 🚀**