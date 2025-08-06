
// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoadingScreen();
    initializeThemeToggle();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeFAQ();
    initializeReviewsSlider();
    initializeContactForm();
    initializeStatistics();
    initializeBackToTop();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeParallaxEffects();
    initializeFormValidation();
    initializeAutoPlay();
    initializeLazyLoading();
    initializePerformanceOptimization();
    initializeAccessibility();
    initializeErrorHandling();
    initializeAnalytics();
});

// Loading Screen Management
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
    
    // Fallback: hide loading screen if it takes too long
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 5000);
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.className;
        const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        
        // Apply theme transition
        body.style.transition = 'all 0.3s ease';
        body.className = newTheme;
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Add click animation
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
        
        // Trigger custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
    
    // Add hover effects
    themeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    themeToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Navigation Functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Add click handlers for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update navigation on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Smooth Scrolling Functionality
function initializeSmoothScrolling() {
    // Global scroll to section function
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

// Animation Initialization
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
    
    // Custom animations for elements without AOS
    const animatedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
            
            // Add click animation
            question.style.transform = 'scale(0.98)';
            setTimeout(() => {
                question.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make question focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
}

// Reviews Slider Functionality
function initializeReviewsSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    const navButtons = document.querySelectorAll('.review-nav-btn');
    let currentSlide = 0;
    let autoPlayInterval;
    
    function showSlide(index) {
        // Hide all slides
        reviewCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all nav buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show current slide
        if (reviewCards[index]) {
            reviewCards[index].classList.add('active');
        }
        
        // Activate current nav button
        if (navButtons[index]) {
            navButtons[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % reviewCards.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + reviewCards.length) % reviewCards.length;
        showSlide(prevIndex);
    }
    
    // Add click handlers for navigation buttons
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider) {
        reviewsSlider.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        reviewsSlider.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    showNotification('پیام شما با موفقیت ارسال شد!', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Restore button
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
        
        // Add real-time validation
        const inputs = this.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Form Validation
function validateForm(data) {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'service'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'این فیلد الزامی است');
            isValid = false;
        }
    });
    
    // Validate phone number
    if (data.phone && !isValidPhoneNumber(data.phone)) {
        showFieldError('phone', 'شماره تلفن معتبر نیست');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'این فیلد الزامی است');
        return false;
    }
    
    if (fieldName === 'phone' && value && !isValidPhoneNumber(value)) {
        showFieldError(fieldName, 'شماره تلفن معتبر نیست');
        return false;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = '#ef4444';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidPhoneNumber(phone) {
    // Persian phone number validation
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Statistics Counter Animation
function initializeStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, targetValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('fa-IR');
    }, stepTime);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 100));
}

// Parallax Effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-background, .car-animation');
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', throttle(handleParallax, 16));
}

// Form Validation Enhancement
function initializeFormValidation() {
    // Add input masks
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0 && value[0] === '0') {
                value = value.substring(1);
            }
            if (value.length > 0 && value[0] === '9') {
                value = '0' + value;
            }
            e.target.value = value;
        });
    }
}

// Auto-play Features
function initializeAutoPlay() {
    // Auto-play for hero section animations
    const carAnimation = document.querySelector('.car-animation');
    if (carAnimation) {
        setInterval(() => {
            carAnimation.style.animation = 'none';
            setTimeout(() => {
                carAnimation.style.animation = 'float 6s ease-in-out infinite';
            }, 10);
        }, 6000);
    }
}

// Lazy Loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance Optimization
function initializePerformanceOptimization() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Perform heavy operations here
        }, 100);
    });
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Accessibility Features
function initializeAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                if (iconClass.includes('fa-car')) {
                    button.setAttribute('aria-label', 'ماشین');
                } else if (iconClass.includes('fa-phone')) {
                    button.setAttribute('aria-label', 'تماس');
                } else if (iconClass.includes('fa-tools')) {
                    button.setAttribute('aria-label', 'ابزار');
                }
            }
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Error Handling
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // You can send error reports to your analytics service here
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

// Analytics and Tracking
function initializeAnalytics() {
    // Track page views
    function trackPageView() {
        // You can integrate with Google Analytics or other tracking services here
        console.log('Page viewed:', window.location.pathname);
    }
    
    // Track user interactions
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, a');
        if (target) {
            const action = target.textContent.trim() || target.getAttribute('aria-label') || 'Unknown action';
            console.log('User clicked:', action);
        }
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            console.log('Form submitted:', this.id || 'Unknown form');
        });
    });
    
    trackPageView();
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Advanced Animation System
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupClickAnimations();
        this.setupParallaxAnimations();
        this.setupTypingAnimations();
        this.setupParticleSystem();
        this.setupCarAnimations();
        this.setupServiceAnimations();
        this.setupContactAnimations();
        this.setupFooterAnimations();
    }
    
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll-animation]');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.scrollAnimation;
                    this.playAnimation(entry.target, animation);
                }
            });
        }, { threshold: 0.1 });
        
        scrollElements.forEach(el => scrollObserver.observe(el));
    }
    
    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('[data-hover-animation]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const animation = el.dataset.hoverAnimation;
                this.playAnimation(el, animation);
            });
            
            el.addEventListener('mouseleave', () => {
                const animation = el.dataset.hoverAnimation;
                this.reverseAnimation(el, animation);
            });
        });
    }
    
    setupClickAnimations() {
        const clickElements = document.querySelectorAll('[data-click-animation]');
        
        clickElements.forEach(el => {
            el.addEventListener('click', () => {
                const animation = el.dataset.clickAnimation;
                this.playAnimation(el, animation);
            });
        });
    }
    
    setupParallaxAnimations() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }
    
    setupTypingAnimations() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            el.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    el.style.borderRight = 'none';
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(el);
        });
    }
    
    setupParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 50%;
            opacity: 0.6;
            animation: float-particle 20s infinite linear;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container);
            }
        }, 20000);
    }
    
    setupCarAnimations() {
        const carElements = document.querySelectorAll('.car-animation, .service-icon i');
        
        carElements.forEach(car => {
            car.addEventListener('mouseenter', () => {
                car.style.animation = 'car-hover 0.5s ease-in-out';
            });
            
            car.addEventListener('mouseleave', () => {
                car.style.animation = '';
            });
        });
    }
    
    setupServiceAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(15deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
                
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
    
    setupContactAnimations() {
        const contactForm = document.querySelector('.contact-form');
        const inputs = contactForm?.querySelectorAll('input, textarea, select');
        
        inputs?.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
                input.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = '';
            });
        });
    }
    
    setupFooterAnimations() {
        const socialLinks = document.querySelectorAll('.social-links a');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-5px) scale(1.1)';
                link.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
                link.style.boxShadow = '';
            });
        });
    }
    
    playAnimation(element, animationName) {
        const animations = {
            'fade-in': { opacity: '1', transform: 'translateY(0)' },
            'slide-in-left': { transform: 'translateX(0)', opacity: '1' },
            'slide-in-right': { transform: 'translateX(0)', opacity: '1' },
            'scale-in': { transform: 'scale(1)', opacity: '1' },
            'rotate-in': { transform: 'rotate(0deg)', opacity: '1' },
            'bounce-in': { animation: 'bounceIn 0.6s ease-out' },
            'pulse': { animation: 'pulse 1s ease-in-out' },
            'shake': { animation: 'shake 0.5s ease-in-out' }
        };
        
        const animation = animations[animationName];
        if (animation) {
            Object.assign(element.style, animation);
            element.style.transition = 'all 0.6s ease';
        }
    }
    
    reverseAnimation(element, animationName) {
        const animations = {
            'fade-in': { opacity: '0.8', transform: 'translateY(10px)' },
            'slide-in-left': { transform: 'translateX(-20px)', opacity: '0.8' },
            'slide-in-right': { transform: 'translateX(20px)', opacity: '0.8' },
            'scale-in': { transform: 'scale(0.95)', opacity: '0.8' },
            'rotate-in': { transform: 'rotate(-5deg)', opacity: '0.8' }
        };
        
        const animation = animations[animationName];
        if (animation) {
            Object.assign(element.style, animation);
        }
    }
}

// Advanced Form Validation System
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = new Map();
        this.errors = new Map();
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupFields();
        this.setupValidation();
        this.setupRealTimeValidation();
        this.setupCustomValidation();
    }
    
    setupFields() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldName = input.name;
            if (fieldName) {
                this.fields.set(fieldName, input);
                this.errors.set(fieldName, []);
            }
        });
    }
    
    setupValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateAll()) {
                this.submitForm();
            } else {
                this.showErrors();
            }
        });
    }
    
    setupRealTimeValidation() {
        this.fields.forEach((input, fieldName) => {
            input.addEventListener('blur', () => {
                this.validateField(fieldName);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(fieldName);
            });
        });
    }
    
    setupCustomValidation() {
        // Custom validation rules
        const customRules = {
            phone: {
                pattern: /^(\+98|0)?9\d{9}$/,
                message: 'شماره تلفن معتبر نیست'
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'ایمیل معتبر نیست'
            },
            name: {
                minLength: 2,
                message: 'نام باید حداقل ۲ کاراکتر باشد'
            }
        };
        
        this.customRules = customRules;
    }
    
    validateField(fieldName) {
        const input = this.fields.get(fieldName);
        if (!input) return true;
        
        const value = input.value.trim();
        const errors = [];
        
        // Required validation
        if (input.hasAttribute('required') && !value) {
            errors.push('این فیلد الزامی است');
        }
        
        // Custom validation
        if (value && this.customRules[fieldName]) {
            const rule = this.customRules[fieldName];
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(rule.message);
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(rule.message);
            }
        }
        
        this.errors.set(fieldName, errors);
        return errors.length === 0;
    }
    
    validateAll() {
        let isValid = true;
        
        this.fields.forEach((input, fieldName) => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showErrors() {
        this.errors.forEach((errors, fieldName) => {
            if (errors.length > 0) {
                this.showFieldError(fieldName, errors[0]);
            }
        });
    }
    
    showFieldError(fieldName, message) {
        const input = this.fields.get(fieldName);
        if (!input) return;
        
        input.style.borderColor = '#ef4444';
        
        // Remove existing error
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(fieldName) {
        const input = this.fields.get(fieldName);
        if (!input) return;
        
        input.style.borderColor = '';
        
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('پیام شما با موفقیت ارسال شد!', 'success');
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Advanced Statistics System
class StatisticsManager {
    constructor() {
        this.stats = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupStatistics();
        this.setupCounters();
        this.setupCharts();
        this.setupProgressBars();
    }
    
    setupStatistics() {
        const statElements = document.querySelectorAll('.stat-number');
        
        statElements.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = parseInt(stat.dataset.duration) || 2000;
            const delay = parseInt(stat.dataset.delay) || 0;
            
            this.stats.set(stat, { target, duration, delay, current: 0 });
        });
    }
    
    setupCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const statData = this.stats.get(stat);
                    
                    if (statData) {
                        setTimeout(() => {
                            this.animateCounter(stat, statData);
                        }, statData.delay);
                        
                        observer.unobserve(stat);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        this.stats.forEach((data, stat) => {
            observer.observe(stat);
        });
    }
    
    setupCharts() {
        const chartElements = document.querySelectorAll('[data-chart]');
        
        chartElements.forEach(chart => {
            const type = chart.dataset.chart;
            const data = JSON.parse(chart.dataset.chartData || '{}');
            
            this.createChart(chart, type, data);
        });
    }
    
    setupProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        progressBars.forEach(bar => {
            const target = parseInt(bar.dataset.progress);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateProgressBar(bar, target);
                        observer.unobserve(bar);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }
    
    animateCounter(element, data) {
        const { target, duration } = data;
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;
        
        const timer = setInterval(() => {
            data.current += increment;
            
            if (data.current >= target) {
                data.current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(data.current).toLocaleString('fa-IR');
        }, stepTime);
    }
    
    createChart(container, type, data) {
        // Simple chart implementation
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 200;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        if (type === 'bar') {
            this.drawBarChart(ctx, data);
        } else if (type === 'line') {
            this.drawLineChart(ctx, data);
        }
    }
    
    drawBarChart(ctx, data) {
        const { labels, values } = data;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const barWidth = width / labels.length * 0.8;
        const barSpacing = width / labels.length * 0.2;
        const maxValue = Math.max(...values);
        
        ctx.fillStyle = 'var(--primary-color)';
        
        labels.forEach((label, index) => {
            const barHeight = (values[index] / maxValue) * height * 0.8;
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const y = height - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }
    
    drawLineChart(ctx, data) {
        const { labels, values } = data;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const maxValue = Math.max(...values);
        
        ctx.strokeStyle = 'var(--primary-color)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        values.forEach((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - (value / maxValue) * height * 0.8;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
    
    animateProgressBar(bar, target) {
        const progress = bar.querySelector('.progress-fill');
        if (!progress) return;
        
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            progress.style.width = current + '%';
            progress.textContent = Math.floor(current) + '%';
        }, 20);
    }
}

// Advanced Theme System
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark-mode';
        this.themes = {
            'dark-mode': {
                name: 'تاریک',
                icon: 'fas fa-moon',
                colors: {
                    '--primary-color': '#3b82f6',
                    '--secondary-color': '#60a5fa',
                    '--accent-color': '#fbbf24',
                    '--text-primary': '#f9fafb',
                    '--text-secondary': '#d1d5db',
                    '--background-primary': '#111827',
                    '--background-secondary': '#1f2937',
                    '--background-tertiary': '#374151',
                    '--border-color': '#4b5563'
                }
            },
            'light-mode': {
                name: 'روشن',
                icon: 'fas fa-sun',
                colors: {
                    '--primary-color': '#2563eb',
                    '--secondary-color': '#1e40af',
                    '--accent-color': '#f59e0b',
                    '--text-primary': '#1f2937',
                    '--text-secondary': '#6b7280',
                    '--background-primary': '#ffffff',
                    '--background-secondary': '#f9fafb',
                    '--background-tertiary': '#f3f4f6',
                    '--border-color': '#e5e7eb'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.setupThemeToggle();
        this.setupThemeTransition();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark-mode';
        this.setTheme(savedTheme);
    }
    
    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        this.currentTheme = themeName;
        document.body.className = themeName;
        
        // Apply theme colors
        Object.entries(theme.colors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        localStorage.setItem('theme', themeName);
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, themeData: theme }
        }));
    }
    
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            this.setTheme(newTheme);
            
            // Add click animation
            toggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        });
    }
    
    setupThemeTransition() {
        document.addEventListener('themeChanged', (e) => {
            const { theme } = e.detail;
            
            // Update theme toggle icon
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.className = this.themes[theme].icon;
                }
            }
            
            // Add transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

// Initialize advanced systems
document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced systems
    window.animationController = new AnimationController();
    window.formValidator = new FormValidator('contactForm');
    window.statisticsManager = new StatisticsManager();
    window.themeManager = new ThemeManager();
    
    // Additional initialization
    initializeAdvancedFeatures();
    initializePerformanceMonitoring();
    initializeAccessibilityEnhancements();
    initializeSEOOptimization();
    initializeSocialSharing();
    initializePrintOptimization();
    initializeOfflineSupport();
    initializePushNotifications();
    initializeAnalyticsEnhancement();
    initializeSecurityFeatures();
});

// Advanced Features
function initializeAdvancedFeatures() {
    // Add advanced hover effects
    const advancedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    
    advancedElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`${entry.name}: ${entry.value}`);
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        }
    });
}

// Accessibility Enhancements
function initializeAccessibilityEnhancements() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'پرش به محتوای اصلی';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// SEO Optimization
function initializeSEOOptimization() {
    // Add structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "name": "ویزیت کار",
        "description": "مرکز خدمات خودرو در مشهد",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "مشهد",
            "addressCountry": "IR"
        },
        "telephone": "+98-51-38765432",
        "openingHours": "Mo-Fr 08:00-20:00, Sa 08:00-16:00"
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Social Sharing
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('ویزیت کار - بهترین خدمات خودرو در مشهد');
            
            let shareUrl;
            switch (platform) {
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Print Optimization
function initializePrintOptimization() {
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.className = 'print-button';
    printButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    printButton.addEventListener('click', () => {
        window.print();
    });
    
    document.body.appendChild(printButton);
}

// Offline Support
function initializeOfflineSupport() {
    // Add offline indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.textContent = 'شما آفلاین هستید';
    offlineIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ef4444;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 10000;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(offlineIndicator);
    
    // Monitor online/offline status
    window.addEventListener('online', () => {
        offlineIndicator.style.transform = 'translateY(-100%)';
    });
    
    window.addEventListener('offline', () => {
        offlineIndicator.style.transform = 'translateY(0)';
    });
}

// Push Notifications
function initializePushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const notificationButton = document.createElement('button');
        notificationButton.innerHTML = '<i class="fas fa-bell"></i>';
        notificationButton.className = 'notification-button';
        notificationButton.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--gradient-secondary);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            z-index: 1000;
            box-shadow: var(--shadow-medium);
        `;
        
        notificationButton.addEventListener('click', () => {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('اعلان‌ها فعال شدند!', 'success');
                }
            });
        });
        
        document.body.appendChild(notificationButton);
    }
}

// Analytics Enhancement
function initializeAnalyticsEnhancement() {
    // Enhanced event tracking
    const trackEvent = (category, action, label) => {
        console.log(`Event: ${category} - ${action} - ${label}`);
        // Integrate with Google Analytics or other tracking services
    };
    
    // Track page views
    trackEvent('Page', 'View', window.location.pathname);
    
    // Track user interactions
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (target) {
            const action = target.textContent.trim() || target.getAttribute('aria-label');
            trackEvent('Interaction', 'Click', action);
        }
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            trackEvent('Form', 'Submit', form.id);
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) {
                trackEvent('Engagement', 'Scroll', `${maxScroll}%`);
            }
        }
    }, 1000));
}

// Security Features
function initializeSecurityFeatures() {
    // Add security headers
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com;";
    document.head.appendChild(meta);
    
    // Add XSS protection
    const xssMeta = document.createElement('meta');
    xssMeta.httpEquiv = 'X-XSS-Protection';
    xssMeta.content = '1; mode=block';
    document.head.appendChild(xssMeta);
    
    // Sanitize user inputs
    const sanitizeInput = (input) => {
        return input.replace(/[<>]/g, '');
    };
    
    // Apply to all inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = sanitizeInput(e.target.value);
        });
    });
}

// Export functions for global access
window.visitCarApp = {
    scrollToSection,
    showNotification,
    validateForm,
    animateCounter,
    animationController: window.animationController,
    formValidator: window.formValidator,
    statisticsManager: window.statisticsManager,
    themeManager: window.themeManager
};
