/* ========================================
   SCRIPT.JS - Animations et Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVIGATION
    // ========================================
    
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load
    
    // Mobile menu toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // CAROUSEL
    // ========================================
    
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    
    if (carouselTrack && carouselPrev && carouselNext && carouselDotsContainer) {
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        let currentIndex = 0;
        let slidesPerView = getSlidesPerView();
        let maxIndex = Math.max(0, slides.length - slidesPerView);
        
        // Get slides per view based on screen width
        function getSlidesPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }
        
        // Create dots
        function createDots() {
            carouselDotsContainer.innerHTML = '';
            const numDots = Math.ceil(slides.length / slidesPerView);
            
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i * slidesPerView));
                carouselDotsContainer.appendChild(dot);
            }
        }
        
        // Update carousel position
        function updateCarousel() {
            const slideWidth = slides[0].offsetWidth;
            const gap = parseInt(getComputedStyle(carouselTrack).gap) || 24;
            const offset = currentIndex * (slideWidth + gap);
            
            carouselTrack.style.transform = `translateX(-${offset}px)`;
            
            // Update dots
            const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            const activeDotIndex = Math.floor(currentIndex / slidesPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
            
            // Update buttons
            carouselPrev.disabled = currentIndex === 0;
            carouselNext.disabled = currentIndex >= maxIndex;
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateCarousel();
        }
        
        // Event listeners
        carouselPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
        carouselNext.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                slidesPerView = getSlidesPerView();
                maxIndex = Math.max(0, slides.length - slidesPerView);
                currentIndex = Math.min(currentIndex, maxIndex);
                createDots();
                updateCarousel();
            }, 100);
        });
        
        // Initialize
        createDots();
        updateCarousel();
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    goToSlide(currentIndex + 1);
                } else {
                    // Swipe right - prev
                    goToSlide(currentIndex - 1);
                }
            }
        }
    }
    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .specialty-item,
        .value-item,
        .additional-service-card,
        .stat
    `);
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.03}s, transform 0.6s ease ${index * 0.1}s`;
        animateOnScroll.observe(el);
    });
    
    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ========================================
    // PARALLAX EFFECT (subtle)
    // ========================================
    
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function setActiveNavLink() {
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
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // ========================================
    // FORM VALIDATION (if forms added later)
    // ========================================
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // ========================================
    // COUNTER ANIMATION
    // ========================================
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Animate stats when in view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    const prefix = text.match(/^\D+/)?.[0] || '';
                    const suffix = text.match(/\D+$/)?.[0] || '';
                    
                    if (!isNaN(number)) {
                        statNumber.classList.add('counted');
                        let current = 0;
                        const increment = number / 50;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                statNumber.textContent = prefix + number + suffix;
                                clearInterval(timer);
                            } else {
                                statNumber.textContent = prefix + Math.floor(current) + suffix;
                            }
                        }, 30);
                    }
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    console.log('🏋️ Yoann Coaching - Site initialisé');

    // MODAL TEMOIGNAGE
    var modal = document.getElementById('modal');
    var modalClose = document.getElementById('modal-close');
    var modalText = document.getElementById('modal-text');
    var modalName = document.getElementById('modal-name');
    var modalMeta = document.getElementById('modal-meta');
    var modalAvatar = document.getElementById('modal-avatar');
    var modalStats = document.getElementById('modal-stats');
    
    document.querySelectorAll('.read-more-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var card = this.closest('.result-card');
            var quote = card.querySelector('.result-quote').textContent;
            var name = card.querySelector('.result-name').textContent;
            var stats = card.querySelectorAll('.result-stat');
            
            var cleanName = name.replace('—', '').trim();
            var nameParts = cleanName.split(',');
            var firstName = nameParts[0] ? nameParts[0].trim() : '';
            var objective = nameParts[1] ? nameParts[1].trim() : '';
            
            modalText.textContent = quote;
            modalName.textContent = firstName;
            modalMeta.textContent = objective;
            modalAvatar.textContent = firstName.charAt(0).toUpperCase();
            
            var statsHTML = '';
            stats.forEach(function(stat) {
                var val = stat.querySelector('.result-stat-value').textContent;
                var lab = stat.querySelector('.result-stat-label').textContent;
                statsHTML += '<div><div class="modal-stat-value">' + val + '</div><div class="modal-stat-label">' + lab + '</div></div>';
            });
            modalStats.innerHTML = statsHTML;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
