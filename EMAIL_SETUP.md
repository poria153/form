
# راهنمای تنظیم EmailJS

برای فعال کردن ارسال ایمیل، باید مراحل زیر را انجام دهید:

## 1. ایجاد حساب EmailJS
- به سایت [emailjs.com](https://www.emailjs.com) بروید
- یک حساب رایگان ایجاد کنید

## 2. اضافه کردن Email Service
- در پنل EmailJS، یک Email Service اضافه کنید (مثل Gmail)
- Gmail را به عنوان فرستنده تنظیم کنید
- Service ID را یادداشت کنید

## 3. ایجاد Email Template
یک Template با محتوای زیر ایجاد کنید:

```
موضوع: درخواست خدمات خودرو - {{customer_name}}

نام مشتری: {{customer_name}}
شماره تماس: {{customer_phone}}
برند خودرو: {{car_brand}}
مدل خودرو: {{car_model}}
آدرس محل: {{location}}
خدمات درخواستی: {{services}}
توضیحات: {{description}}
زمان ترجیحی: {{preferred_time}}
میزان فوریت: {{urgency}}
تاریخ ارسال: {{date}}
ساعت ارسال: {{time}}
```

Template ID را یادداشت کنید.

## 4. تنظیم کلیدها در کد
در نهایت Template را به آدرس `kavehahangar8778@gmail.com` ارسال کنید.

در فایل `script.js` موارد زیر را جایگزین کنید:
- `YOUR_PUBLIC_KEY` با Public Key
- `YOUR_SERVICE_ID` با Service ID  
- `YOUR_TEMPLATE_ID` با Template ID

مثال:
```javascript
const EMAILJS_PUBLIC_KEY = "your_actual_public_key";
const EMAILJS_SERVICE_ID = "your_service_id";
const EMAILJS_TEMPLATE_ID = "your_template_id";
```

## 5. تست
پس از تنظیم، فرم را تست کنید تا مطمئن شوید ایمیل‌ها به `kavehahangar8778@gmail.com` ارسال می‌شوند.

## مزایای EmailJS:
- رایگان تا 200 ایمیل در ماه
- مستقیماً از مرورگر کار می‌کند
- بدون نیاز به سرور
- قابل تنظیم و سفارشی‌سازی
