# IoT Dashboard - ESP32 Communication Interface

A modern, responsive web dashboard for communicating with ESP32 devices via WebSocket connections. Features real-time sensor monitoring, device control, and comprehensive logging.

## 🎨 Design Features

- **Custom Color Theme**: Uses your specified colors (#090040, #471396, #B13BFF, #FFCC00)
- **Dark/Light Mode**: Toggle between themes with persistent settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Features

### Connection Management
- WebSocket connection to ESP32
- Real-time connection status indicator
- Automatic reconnection with configurable attempts
- Connection log with timestamps

### Sensor Monitoring
- **Temperature**: Real-time temperature readings
- **Humidity**: Humidity sensor data
- **Light Level**: Ambient light sensor readings
- **WiFi Signal**: Signal strength monitoring

### Device Control
- **LED Control**: Toggle red, green, and blue LEDs
- **Servo Motor**: Control servo angle (0-180°)
- **Relay Control**: Toggle relay states
- **Custom Messages**: Send custom commands to ESP32

### Communication Log
- Real-time message logging
- Export log functionality
- Clear log option
- Error highlighting

## 📋 Requirements

### ESP32 Setup
1. Install required libraries:
   ```cpp
   #include <WiFi.h>
   #include <WebSocketsServer.h>
   #include <ArduinoJson.h>
   ```

2. Configure WiFi credentials in your ESP32 code
3. Set up WebSocket server on port 81 (default)

### Web Browser
- Modern browser with WebSocket support
- No additional software required

## 🔧 Installation

1. **Download Files**: Save all files to your web server or local directory
2. **ESP32 Code**: Upload the provided ESP32 code to your device
3. **Access Dashboard**: Open `index.html` in your web browser

## 📡 ESP32 Code Example

```cpp
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

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
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.println("JSON parsing failed");
        return;
    }
    
    String type = doc["type"];
    
    if (type == "led_control") {
        String color = doc["data"]["color"];
        bool state = doc["data"]["state"];
        // Control LED based on color and state
        controlLED(color, state);
    }
    else if (type == "servo_control") {
        int angle = doc["data"]["angle"];
        // Control servo to specified angle
        controlServo(angle);
    }
    else if (type == "relay_control") {
        int relay = doc["data"]["relay"];
        bool state = doc["data"]["state"];
        // Control relay
        controlRelay(relay, state);
    }
    else if (type == "get_sensors") {
        // Send sensor data
        sendSensorData();
    }
}

void sendSensorData() {
    DynamicJsonDocument doc(256);
    doc["type"] = "sensor_data";
    doc["data"]["temperature"] = readTemperature();
    doc["data"]["humidity"] = readHumidity();
    doc["data"]["light"] = readLightLevel();
    doc["data"]["wifi"] = WiFi.RSSI();
    
    String jsonString;
    serializeJson(doc, jsonString);
    webSocket.broadcastTXT(jsonString);
}

void setup() {
    Serial.begin(115200);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
    // Send sensor data periodically
    static unsigned long lastSensorUpdate = 0;
    if (millis() - lastSensorUpdate > 5000) { // Every 5 seconds
        sendSensorData();
        lastSensorUpdate = millis();
    }
}
```

## 🎛️ Usage

### Connecting to ESP32
1. Enter your ESP32's IP address in the WebSocket URL field
2. Click "Connect" to establish connection
3. Monitor connection status in the header

### Controlling Devices
- **LEDs**: Toggle switches to control individual LEDs
- **Servo**: Use the slider to set servo angle
- **Relays**: Toggle switches for relay control
- **Custom Messages**: Type custom commands and send

### Monitoring Sensors
- Real-time sensor data updates
- Visual indicators for each sensor type
- Automatic updates every 5 seconds

### Log Management
- View all communication in real-time
- Export logs for analysis
- Clear logs when needed

## 🎨 Customization

### Color Theme
The dashboard uses your specified colors:
- Primary Dark: `#090040`
- Primary Medium: `#471396`
- Primary Light: `#B13BFF`
- Accent: `#FFCC00`

### Adding New Sensors
1. Add sensor element to HTML
2. Update JavaScript sensor handling
3. Modify ESP32 code to send new sensor data

### Adding New Controls
1. Add control element to HTML
2. Add event handler in JavaScript
3. Implement control logic in ESP32 code

## 🔒 Security Notes

- This dashboard is designed for local network use
- No authentication is implemented
- Consider adding security measures for production use
- WebSocket connections are not encrypted by default

## 🐛 Troubleshooting

### Connection Issues
- Verify ESP32 IP address
- Check WiFi connection
- Ensure WebSocket server is running
- Check browser console for errors

### Sensor Data Not Updating
- Verify sensor connections on ESP32
- Check serial monitor for errors
- Ensure JSON format is correct

### Controls Not Working
- Verify GPIO pin assignments
- Check serial monitor for errors
- Ensure control functions are implemented

## 📱 Browser Compatibility

- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge 12+

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: This dashboard is designed for educational and development purposes. For production use, consider implementing proper security measures and error handling.