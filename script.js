
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
