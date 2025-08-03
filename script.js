
// تنظیمات EmailJS
const EMAILJS_PUBLIC_KEY = "tOl5cxHrmzOttylqi"; // باید کلید عمومی EmailJS را جایگزین کنید
const EMAILJS_SERVICE_ID = "service_z9cp9lo"; // باید Service ID را جایگزین کنید
const EMAILJS_TEMPLATE_ID = "template_utvocxj"; // باید Template ID را جایگزین کنید

// EmailJS تنظیم شده است
console.log("EmailJS آماده برای استفاده است");

emailjs.init(EMAILJS_PUBLIC_KEY);

// مدیریت تم
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.themeText = this.themeToggle.querySelector('.theme-text');
        
        // تنظیم تم پیش‌فرض به لایت مود
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(this.currentTheme);
        
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            this.themeIcon.textContent = '☀️';
            this.themeText.textContent = 'تم روشن';
        } else {
            this.themeIcon.textContent = '🌙';
            this.themeText.textContent = 'تم تیره';
        }
        
        // انیمیشن تغییر تم
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // انیمیشن دکمه
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
}

// راه‌اندازی مدیر تم
const themeManager = new ThemeManager();

// فرم درخواست خدمات
document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // دریافت داده‌های فرم
    const formData = new FormData(this);
    const data = {};
    
    // تبدیل FormData به object
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // اگر کلید وجود دارد، آن را به آرایه تبدیل کن
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // اعتبارسنجی فیلدهای ضروری
    if (!data.fullName || !data.phone || !data.location) {
        showNotification('لطفاً تمام فیلدهای ضروری را پر کنید', 'error');
        return;
    }
    
    // بررسی انتخاب حداقل یک خدمت
    if (!data.services) {
        showNotification('لطفاً حداقل یک نوع خدمت را انتخاب کنید', 'error');
        return;
    }
    
    // اعتبارسنجی شماره تلفن
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s|-/g, ''))) {
        showNotification('لطفاً شماره تلفن معتبر وارد کنید', 'error');
        return;
    }

    // EmailJS آماده برای ارسال
    console.log("در حال ارسال ایمیل به:", "kavehahangar8778@gmail.com");
    
    // آماده‌سازی داده‌ها برای ارسال
    const servicesArray = Array.isArray(data.services) ? data.services : [data.services];
    const servicesText = servicesArray.map(service => {
        const serviceNames = {
            'battery': 'باتری به باتری',
            'engine': 'تعمیر موتور',
            'tire': 'تعویض لاستیک',
            'general': 'تعمیرات عمومی',
            'electrical': 'برق خودرو',
            'cooling': 'کولر و رادیاتور'
        };
        return serviceNames[service] || service;
    }).join('، ');
    
    const timeNames = {
        'morning': 'صبح (۸-۱۲)',
        'afternoon': 'بعدازظهر (۱۲-۱۷)',
        'evening': 'عصر (۱۷-۲۰)',
        'asap': 'هر چه زودتر'
    };
    
    const urgencyNames = {
        'normal': 'عادی',
        'urgent': 'فوری',
        'emergency': 'اورژانسی'
    };
    
    // ارسال ایمیل
    showNotification('در حال ارسال درخواست...', 'info');
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: "kavehahangar8778@gmail.com",
        customer_name: data.fullName,
        customer_phone: data.phone,
        car_brand: data.carBrand || 'مشخص نشده',
        car_model: data.carModel || 'مشخص نشده',
        location: data.location,
        services: servicesText,
        description: data.description || 'توضیحاتی ارائه نشده',
        preferred_time: timeNames[data.preferredTime] || 'مشخص نشده',
        urgency: urgencyNames[data.urgency] || 'عادی',
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR')
    })
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showNotification('درخواست شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت', 'success');
        // پاک کردن فرم
        document.getElementById('serviceForm').reset();
    })
    .catch(function(error) {
        console.log('FAILED...', error);
        showNotification('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید یا با ما تماس بگیرید', 'error');
    });
});

// تابع نمایش اعلان
function showNotification(message, type) {
    // حذف اعلان قبلی در صورت وجود
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // ایجاد المان اعلان
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon, bgColor, textColor, borderColor;
    switch(type) {
        case 'success':
            icon = '✅';
            bgColor = '#d4edda';
            textColor = '#155724';
            borderColor = '#c3e6cb';
            break;
        case 'error':
            icon = '❌';
            bgColor = '#f8d7da';
            textColor = '#721c24';
            borderColor = '#f5c6cb';
            break;
        case 'info':
            icon = '⏳';
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
            borderColor = '#bee5eb';
            break;
        default:
            icon = 'ℹ️';
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
            borderColor = '#bee5eb';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // اضافه کردن استایل
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${borderColor};
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Vazirmatn', 'Tahoma', sans-serif;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // اضافه کردن به صفحه
    document.body.appendChild(notification);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// اضافه کردن انیمیشن برای اعلان‌ها
const style = document.createElement('style');
style.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        padding: 15px;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// انیمیشن اسکرول نرم
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// تنظیم فوکوس روی فیلدهای فرم
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// افکت تایپ برای عنوان اصلی
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// اجرای انیمیشن تایپ هنگام لود صفحه
window.addEventListener('load', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        const originalText = logo.textContent;
        typeWriter(logo, originalText, 150);
    }
});

// انیمیشن ظاهر شدن کارت‌ها هنگام اسکرول
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// اعمال انیمیشن اولیه
document.querySelectorAll('.service-card, .contact-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
});

// اجرای انیمیشن هنگام اسکرول
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

class ESP32Dashboard {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
        this.chart = null;
        this.chartData = {
            labels: [],
            temperature: [],
            humidity: [],
            light: [],
            voltage: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupChart();
        this.setupThemeToggle();
        this.logMessage('Dashboard initialized', 'system');
    }

    setupEventListeners() {
        // Connection controls
        document.getElementById('connectBtn').addEventListener('click', () => this.connect());
        document.getElementById('disconnectBtn').addEventListener('click', () => this.disconnect());
        
        // Device controls
        document.getElementById('led1').addEventListener('change', (e) => this.sendControl('led1', e.target.checked));
        document.getElementById('led2').addEventListener('change', (e) => this.sendControl('led2', e.target.checked));
        document.getElementById('fan').addEventListener('change', (e) => this.sendControl('fan', e.target.checked));
        
        // Servo control
        const servo = document.getElementById('servo');
        servo.addEventListener('input', (e) => {
            document.getElementById('servoValue').textContent = e.target.value + '°';
            this.sendControl('servo', parseInt(e.target.value));
        });
        
        // Log controls
        document.getElementById('clearLogBtn').addEventListener('click', () => this.clearLog());
    }

    setupThemeToggle() {
        const lightModeBtn = document.getElementById('lightModeBtn');
        const darkModeBtn = document.getElementById('darkModeBtn');
        const body = document.body;

        // Set initial state - dark mode by default as requested
        body.classList.add('dark-mode');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');

        lightModeBtn.addEventListener('click', () => {
            body.classList.remove('dark-mode');
            lightModeBtn.classList.add('active');
            darkModeBtn.classList.remove('active');
            this.logMessage('Switched to light mode', 'system');
        });

        darkModeBtn.addEventListener('click', () => {
            body.classList.add('dark-mode');
            darkModeBtn.classList.add('active');
            lightModeBtn.classList.remove('active');
            this.logMessage('Switched to dark mode', 'system');
        });
    }

    setupChart() {
        const ctx = document.getElementById('dataChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: this.chartData.temperature,
                        borderColor: '#B13BFF',
                        backgroundColor: 'rgba(177, 59, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Humidity (%)',
                        data: this.chartData.humidity,
                        borderColor: '#FFCC00',
                        backgroundColor: 'rgba(255, 204, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Light (lux)',
                        data: this.chartData.light,
                        borderColor: '#471396',
                        backgroundColor: 'rgba(71, 19, 150, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Voltage (V)',
                        data: this.chartData.voltage,
                        borderColor: '#090040',
                        backgroundColor: 'rgba(9, 0, 64, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Values'
                        }
                    }
                },
                animation: {
                    duration: 750
                }
            }
        });
    }

    connect() {
        const url = document.getElementById('websocketUrl').value.trim();
        
        if (!url) {
            this.logMessage('Please enter a WebSocket URL', 'error');
            return;
        }

        if (this.isConnected) {
            this.logMessage('Already connected', 'error');
            return;
        }

        try {
            this.logMessage(`Connecting to ${url}...`, 'sent');
            this.websocket = new WebSocket(url);
            
            this.websocket.onopen = () => this.onWebSocketOpen();
            this.websocket.onmessage = (event) => this.onWebSocketMessage(event);
            this.websocket.onclose = () => this.onWebSocketClose();
            this.websocket.onerror = (error) => this.onWebSocketError(error);
            
        } catch (error) {
            this.logMessage(`Connection failed: ${error.message}`, 'error');
        }
    }

    disconnect() {
        if (!this.isConnected || !this.websocket) {
            this.logMessage('Not connected', 'error');
            return;
        }

        this.websocket.close();
        this.logMessage('Disconnecting...', 'sent');
    }

    onWebSocketOpen() {
        this.isConnected = true;
        this.updateConnectionStatus(true);
        this.logMessage('Connected successfully!', 'received');
        
        // Enable controls
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('disconnectBtn').disabled = false;
        
        // Send initial handshake
        this.sendMessage({ type: 'handshake', message: 'Dashboard connected' });
    }

    onWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);
            this.logMessage(`Received: ${event.data}`, 'received');
            this.handleIncomingData(data);
        } catch (error) {
            this.logMessage(`Received (raw): ${event.data}`, 'received');
            // Handle non-JSON messages
            this.handleRawMessage(event.data);
        }
    }

    onWebSocketClose() {
        this.isConnected = false;
        this.updateConnectionStatus(false);
        this.logMessage('Connection closed', 'error');
        
        // Disable controls
        document.getElementById('connectBtn').disabled = false;
        document.getElementById('disconnectBtn').disabled = true;
        
        this.websocket = null;
    }

    onWebSocketError(error) {
        this.logMessage(`Connection error: ${error.message || 'Unknown error'}`, 'error');
        this.isConnected = false;
        this.updateConnectionStatus(false);
    }

    handleIncomingData(data) {
        // Handle sensor data
        if (data.sensors) {
            this.updateSensorData(data.sensors);
            this.updateChart(data.sensors);
        }
        
        // Handle device status updates
        if (data.devices) {
            this.updateDeviceStatus(data.devices);
        }
        
        // Handle system messages
        if (data.message) {
            this.logMessage(`ESP32: ${data.message}`, 'received');
        }
    }

    handleRawMessage(message) {
        // Handle simple string messages from ESP32
        // Try to parse common patterns
        
        // Pattern: "temp:25.5,humidity:60.2,light:850,voltage:3.3"
        const sensorMatch = message.match(/temp:([\d.]+),humidity:([\d.]+),light:([\d.]+),voltage:([\d.]+)/);
        if (sensorMatch) {
            const sensors = {
                temperature: parseFloat(sensorMatch[1]),
                humidity: parseFloat(sensorMatch[2]),
                light: parseFloat(sensorMatch[3]),
                voltage: parseFloat(sensorMatch[4])
            };
            this.updateSensorData(sensors);
            this.updateChart(sensors);
            return;
        }
        
        // Pattern: "led1:on,led2:off,fan:on"
        const deviceMatch = message.match(/led1:(on|off),led2:(on|off),fan:(on|off)/);
        if (deviceMatch) {
            const devices = {
                led1: deviceMatch[1] === 'on',
                led2: deviceMatch[2] === 'on',
                fan: deviceMatch[3] === 'on'
            };
            this.updateDeviceStatus(devices);
            return;
        }
    }

    updateSensorData(sensors) {
        if (sensors.temperature !== undefined) {
            document.getElementById('temperature').textContent = sensors.temperature.toFixed(1);
        }
        if (sensors.humidity !== undefined) {
            document.getElementById('humidity').textContent = sensors.humidity.toFixed(1);
        }
        if (sensors.light !== undefined) {
            document.getElementById('light').textContent = Math.round(sensors.light);
        }
        if (sensors.voltage !== undefined) {
            document.getElementById('voltage').textContent = sensors.voltage.toFixed(2);
        }
    }

    updateChart(sensors) {
        const now = new Date().toLocaleTimeString();
        
        // Keep only last 20 data points
        if (this.chartData.labels.length >= 20) {
            this.chartData.labels.shift();
            this.chartData.temperature.shift();
            this.chartData.humidity.shift();
            this.chartData.light.shift();
            this.chartData.voltage.shift();
        }
        
        this.chartData.labels.push(now);
        this.chartData.temperature.push(sensors.temperature || 0);
        this.chartData.humidity.push(sensors.humidity || 0);
        this.chartData.light.push(sensors.light || 0);
        this.chartData.voltage.push(sensors.voltage || 0);
        
        this.chart.update('none'); // Update without animation for real-time feel
    }

    updateDeviceStatus(devices) {
        if (devices.led1 !== undefined) {
            document.getElementById('led1').checked = devices.led1;
        }
        if (devices.led2 !== undefined) {
            document.getElementById('led2').checked = devices.led2;
        }
        if (devices.fan !== undefined) {
            document.getElementById('fan').checked = devices.fan;
        }
        if (devices.servo !== undefined) {
            document.getElementById('servo').value = devices.servo;
            document.getElementById('servoValue').textContent = devices.servo + '°';
        }
    }

    sendControl(device, value) {
        if (!this.isConnected) {
            this.logMessage('Not connected to ESP32', 'error');
            return;
        }

        const message = {
            type: 'control',
            device: device,
            value: value
        };

        this.sendMessage(message);
    }

    sendMessage(message) {
        if (!this.isConnected || !this.websocket) {
            this.logMessage('Not connected', 'error');
            return;
        }

        try {
            const jsonMessage = JSON.stringify(message);
            this.websocket.send(jsonMessage);
            this.logMessage(`Sent: ${jsonMessage}`, 'sent');
        } catch (error) {
            this.logMessage(`Send error: ${error.message}`, 'error');
        }
    }

    updateConnectionStatus(connected) {
        const statusIndicator = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        if (connected) {
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.classList.remove('connected');
            statusText.textContent = 'Disconnected';
        }
    }

    logMessage(message, type = 'info') {
        const logContainer = document.getElementById('messageLog');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `<span style="color: #666;">[${timestamp}]</span> ${message}`;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clearLog() {
        document.getElementById('messageLog').innerHTML = '';
        this.logMessage('Log cleared', 'system');
    }

    // Simulate data for demo purposes
    startDemo() {
        if (this.isConnected) {
            this.logMessage('Cannot start demo while connected to real device', 'error');
            return;
        }

        this.logMessage('Starting demo mode...', 'system');
        
        setInterval(() => {
            if (!this.isConnected) {
                const sensors = {
                    temperature: 20 + Math.random() * 15,
                    humidity: 40 + Math.random() * 40,
                    light: 200 + Math.random() * 600,
                    voltage: 3.0 + Math.random() * 0.6
                };
                
                this.updateSensorData(sensors);
                this.updateChart(sensors);
            }
        }, 2000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new ESP32Dashboard();
    
    // Add demo button for testing
    const demoBtn = document.createElement('button');
    demoBtn.textContent = '📊 Start Demo';
    demoBtn.className = 'btn-secondary';
    demoBtn.style.marginLeft = '10px';
    demoBtn.onclick = () => dashboard.startDemo();
    
    document.querySelector('.connection-controls').appendChild(demoBtn);
    
    // Make dashboard globally accessible for debugging
    window.dashboard = dashboard;
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D for demo mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        window.dashboard?.startDemo();
    }
    
    // Ctrl/Cmd + L for clear log
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        window.dashboard?.clearLog();
    }
});

// ESP32 Arduino Code Template (commented for reference)
/*
ESP32 WebSocket Server Example:

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
        }
        // Add more device controls...
    }
}
*/
