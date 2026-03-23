// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
});

// Animated counter for streak and gems
const animateCounter = (element, target, duration = 1000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Initialize counters when page loads
window.addEventListener('load', () => {
    const streakElement = document.querySelector('.streak-display span');
    const gemsElement = document.querySelector('.gems-display span');
    
    if (streakElement) {
        const targetStreak = parseInt(streakElement.textContent) || 0;
        animateCounter(streakElement, targetStreak);
    }
    if (gemsElement) {
        const targetGems = parseInt(gemsElement.textContent) || 0;
        animateCounter(gemsElement, targetGems);
    }
});

// Button click effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .btn-primary, .btn-secondary {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--light-green)';
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }, 1500);
});

// Social media hover effects
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Parallax effect for hero graphics
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingOwl = document.querySelector('.floating-owl');
    const floatingStars = document.querySelectorAll('.floating-star');
    
    if (floatingOwl) {
        floatingOwl.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    floatingStars.forEach((star, index) => {
        const speed = 0.1 + (index * 0.05);
        star.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover sound effect (optional - requires audio file)
/*
const hoverSound = new Audio('hover.mp3');
document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link, .social-icon').forEach(element => {
    element.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 0.1;
        hoverSound.play().catch(e => console.log('Audio play failed:', e));
    });
});
*/

// Easter egg: Konami Code for fun animations
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Add rainbow animation to the logo
    const logo = document.querySelector('.logo');
    logo.style.animation = 'rainbow 2s ease';
    
    // Make floating elements dance
    const floatingElements = document.querySelectorAll('.floating-owl, .floating-star');
    floatingElements.forEach((element, index) => {
        element.style.animation = `dance 1s ease ${index * 0.1}s`;
    });
    
    setTimeout(() => {
        logo.style.animation = '';
        floatingElements.forEach(element => {
            element.style.animation = '';
        });
    }, 2000);
    
    // Add animations if not exists
    if (!document.querySelector('#easter-egg-styles')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-styles';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            @keyframes dance {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(5deg); }
                50% { transform: translateY(0) rotate(-5deg); }
                75% { transform: translateY(-5px) rotate(3deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth scroll for navigation links
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

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based animations here
    });
});

// Automatically connect the student to their next active chapter
function continueLearning() {
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            for (let i = 1; i <= 13; i++) {
                if (!user.completedChapters.includes(i)) {
                    window.location.href = `chapter${i}.html`;
                    return;
                }
            }
        }
    }
    // If all are completed or user not found, fallback to the learning map
    window.location.href = 'Learn.html';
}
