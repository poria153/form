# IoT Dashboard for ESP32

A modern, responsive IoT dashboard for communicating with ESP32 devices via WebSocket connections. Features real-time sensor data visualization, device control, and a beautiful dark/light theme.

## Features

- 🌐 **WebSocket Communication** - Real-time bidirectional communication with ESP32
- 📊 **Sensor Data Visualization** - Display temperature, humidity, pressure, and light levels
- 🎛️ **Device Control** - Control LEDs, servos, and motors
- 🌙 **Dark/Light Theme** - Toggle between dark and light modes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 📝 **Communication Log** - Track all messages and export logs
- 🎨 **Modern UI** - Beautiful interface with the specified color theme

## Color Theme

The dashboard uses the following color palette:
- `#090040` - Primary Dark
- `#471396` - Primary Medium  
- `#B13BFF` - Primary Light
- `#FFCC00` - Accent Yellow

## Quick Start

1. **Open the Dashboard**
   ```bash
   # Simply open index.html in your web browser
   # Or serve it using a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Connect to ESP32**
   - Enter your ESP32's WebSocket URL (e.g., `ws://192.168.1.100:81`)
   - Click "Connect"
   - The status indicator will show "Connected" when successful

3. **Monitor Sensor Data**
   - Real-time sensor readings will appear in the cards
   - Mini charts show recent data trends
   - All communication is logged in the message log

4. **Control Devices**
   - Toggle LEDs on/off
   - Adjust servo angle (0-180°)
   - Control motor speed (0-100%)

## ESP32 Setup

Here's an example ESP32 code to work with this dashboard:

```cpp
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// WebSocket server
WebSocketsServer webSocket = WebSocketsServer(81);

// Pin definitions
const int LED1_PIN = 2;
const int LED2_PIN = 4;
const int LED3_PIN = 5;
const int SERVO_PIN = 13;
const int MOTOR_PIN = 14;

// Sensor pins (if using actual sensors)
const int TEMP_PIN = 36;
const int LIGHT_PIN = 39;

void setup() {
  Serial.begin(115200);
  
  // Setup pins
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.println("IP address: " + WiFi.localIP().toString());
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("WebSocket server started");
}

void loop() {
  webSocket.loop();
  
  // Send sensor data every 2 seconds
  static unsigned long lastSensorUpdate = 0;
  if (millis() - lastSensorUpdate > 2000) {
    sendSensorData();
    lastSensorUpdate = millis();
  }
}

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
  Serial.println("Received: " + message);
  
  // Parse JSON message
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.println("JSON parsing failed");
    return;
  }
  
  String type = doc["type"];
  
  if (type == "led_control") {
    int led = doc["led"];
    bool state = doc["state"];
    controlLED(led, state);
  }
  else if (type == "servo_control") {
    int angle = doc["angle"];
    controlServo(angle);
  }
  else if (type == "motor_control") {
    int speed = doc["speed"];
    controlMotor(speed);
  }
}

void controlLED(int led, bool state) {
  int pin;
  switch(led) {
    case 1: pin = LED1_PIN; break;
    case 2: pin = LED2_PIN; break;
    case 3: pin = LED3_PIN; break;
    default: return;
  }
  digitalWrite(pin, state ? HIGH : LOW);
}

void controlServo(int angle) {
  // Implement servo control here
  // You'll need to include Servo.h and create a Servo object
  Serial.printf("Servo angle: %d\n", angle);
}

void controlMotor(int speed) {
  // PWM control for motor
  int pwmValue = map(speed, 0, 100, 0, 255);
  analogWrite(MOTOR_PIN, pwmValue);
}

void sendSensorData() {
  // Read sensor values (replace with actual sensor readings)
  float temperature = random(200, 300) / 10.0; // 20-30°C
  float humidity = random(400, 800) / 10.0;    // 40-80%
  float pressure = random(10000, 10200) / 10.0; // 1000-1020 hPa
  float light = random(100, 1000);              // 100-1000 lux
  
  // Create JSON message
  DynamicJsonDocument doc(512);
  doc["type"] = "sensor_data";
  doc["data"]["temperature"] = temperature;
  doc["data"]["humidity"] = humidity;
  doc["data"]["pressure"] = pressure;
  doc["data"]["light"] = light;
  
  String message;
  serializeJson(doc, message);
  
  // Send to all connected clients
  webSocket.broadcastTXT(message);
}
```

## Required Libraries

For the ESP32, install these libraries:
- `WebSocketsServer` by Markus Sattler
- `ArduinoJson` by Benoit Blanchon

## File Structure

```
iot-dashboard/
├── index.html          # Main dashboard HTML
├── style.css           # Styling with theme colors
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Usage

1. **Upload the ESP32 code** to your device
2. **Update WiFi credentials** in the ESP32 code
3. **Open the dashboard** in your web browser
4. **Enter the ESP32's IP address** in the WebSocket URL field
5. **Click Connect** to establish communication

## Features in Detail

### Sensor Monitoring
- Real-time temperature, humidity, pressure, and light level display
- Mini charts showing recent data trends
- Automatic data logging

### Device Control
- **LED Control**: Toggle 3 LEDs on/off
- **Servo Control**: Adjust servo angle from 0-180°
- **Motor Control**: Control motor speed from 0-100%

### Communication Log
- View all incoming and outgoing messages
- Clear log functionality
- Export log to text file
- Color-coded message types (info, success, error, warning)

### Theme Toggle
- Switch between dark and light modes
- Theme preference is saved in localStorage
- Smooth transitions between themes

## Troubleshooting

**Connection Issues:**
- Ensure ESP32 and computer are on the same WiFi network
- Check that the WebSocket port (81) is not blocked
- Verify the ESP32's IP address is correct

**No Sensor Data:**
- Check that the ESP32 is sending data in the correct JSON format
- Ensure the WebSocket connection is established
- Check the browser console for any JavaScript errors

**Controls Not Working:**
- Verify the ESP32 is receiving the JSON commands
- Check that the pin assignments match your hardware setup
- Ensure the ESP32 code is properly handling the control messages

## Customization

### Adding New Sensors
1. Add sensor reading code to ESP32
2. Update the `sendSensorData()` function
3. Add corresponding HTML elements in `index.html`
4. Update JavaScript to handle new sensor data

### Adding New Controls
1. Add control elements to the HTML
2. Implement control logic in ESP32 code
3. Add JavaScript event handlers
4. Update the WebSocket message handling

### Modifying the Theme
The color variables are defined in `style.css`:
```css
:root {
    --primary-dark: #090040;
    --primary-medium: #471396;
    --primary-light: #B13BFF;
    --accent: #FFCC00;
}
```

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the troubleshooting section above or create an issue in the project repository.