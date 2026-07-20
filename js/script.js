// js/script.js
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle logic is now handled in js/navbar.js

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Parallax for Brand Sections ---
    const brandSections = document.querySelectorAll('.brand-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.2 });

    brandSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Dynamic Greeting & New Year Video Background ---
    const greetingElement = document.getElementById('dynamic-greeting');
    const heroSection = document.querySelector('.hero');

    if (greetingElement && heroSection) {
        
        // Helper function to manage the video element
        const manageVideoBackground = (shouldPlay) => {
            let videoBg = document.getElementById('new-year-video');
            
            if (shouldPlay) {
                if (!videoBg) {
                    videoBg = document.createElement('video');
                    videoBg.id = 'new-year-video';
                    videoBg.src = '/fireworks-bg.mp4'; // Points to root based on your path
                    videoBg.autoplay = true;
                    videoBg.loop = true;
                    videoBg.muted = true; // Required for autoplay
                    videoBg.playsInline = true;
                    videoBg.classList.add('new-year-video');
                    
                    // Prepend to ensure it sits behind content but follows z-index rules
                    heroSection.appendChild(videoBg);
                }
                // Ensure it's playing
                if (videoBg.paused) videoBg.play().catch(e => console.log("Autoplay blocked:", e));
                
            } else {
                if (videoBg) {
                    videoBg.remove();
                }
            }
        };

        const updateGreeting = () => {
            const now = new Date();
            
            // Define key dates for the event
            const newYear2026 = new Date('January 1, 2026 00:00:00');
            const endOfCelebration = new Date('January 1, 2026 23:59:59');
            const revertDate = new Date('January 2, 2026 00:00:00');

            // STATE 1: Revert to normal after Jan 1st, 2026 (Jan 2nd onwards)
            if (now >= revertDate) {
                 const currentHour = now.getHours();
                 if (currentHour < 12) {
                     greetingElement.textContent = "Good Morning.";
                 } else if (currentHour < 18) {
                     greetingElement.textContent = "Good Afternoon.";
                 } else {
                     greetingElement.textContent = "Good Evening.";
                 }
                 manageVideoBackground(false);
            } 
            // STATE 2: New Year's Day Celebration (Jan 1st, 2026)
            else if (now >= newYear2026 && now <= endOfCelebration) {
                greetingElement.textContent = "Happy New Year!";
                manageVideoBackground(true);
            } 
            // STATE 3: Countdown to 2026 (Right Now)
            else {
                const diff = newYear2026 - now;
                
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    greetingElement.textContent = `New Years Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;
                }
                manageVideoBackground(false);
            }
        };

        // Initialize immediately and update every second
        updateGreeting();
        setInterval(updateGreeting, 1000);
    }

    // --- Bento Card 3D Tilt Effect ---
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        // ⚡ Bolt: Throttle mousemove events with requestAnimationFrame
        // to prevent main-thread blocking from high-frequency polling.
        let isTicking = false;
        let latestEvent = null;

        card.addEventListener('mousemove', (e) => {
            latestEvent = { clientX: e.clientX, clientY: e.clientY };

            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    if (!latestEvent) {
                        isTicking = false;
                        return;
                    }

                    const rect = card.getBoundingClientRect();
                    const x = latestEvent.clientX - rect.left;
                    const y = latestEvent.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
                    const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg rotation

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        card.addEventListener('mouseleave', () => {
            latestEvent = null; // Clear pending updates
            isTicking = false; // Reset ticking state if leave occurs before frame
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // --- Cookie Consent Banner ---
    const cookieConsentBanner = document.getElementById('cookie-consent-banner');
    const cookieConsentButton = document.getElementById('cookie-consent-button');

    if (cookieConsentBanner && cookieConsentButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieConsentBanner.style.display = 'block';
        }

        cookieConsentButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieConsentBanner.style.display = 'none';
        });
    }

    // --- Orb Physics & Easter Egg ---
    const orbElements = document.querySelectorAll('.orb');
    
    orbElements.forEach(orb => {
        let isDragging = false;
        let startX = 0, startY = 0;
        let hoverCenterX = 0, hoverCenterY = 0;
        let isHovering = false;
        const SNAP_DISTANCE = 300; // Distance at which it "snaps" off
        
        // Base shadow to return to
        const baseShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 40px rgba(147, 51, 234, 0.4)`;
        
        // Helper to stretch orb
        const applyStretch = (dx, dy, isHover) => {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 1) return;

            const angle = Math.atan2(dy, dx);
            let stretch = 0;
            
            if (isHover) {
                stretch = Math.min(distance / 300, 0.15); // max 15% stretch on hover
            } else {
                stretch = Math.min(distance / SNAP_DISTANCE, 1) * 1.5; // up to 150% stretch on drag
            }
            
            // rotate to face mouse, scaleX to stretch, scaleY to squish, translateX to anchor the back edge
            orb.style.transform = `rotate(${angle}rad) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.3}) translateX(${stretch * 50}px)`;
        };

        orb.addEventListener('mouseenter', () => {
            if (isDragging) return;
            const rect = orb.getBoundingClientRect();
            hoverCenterX = rect.left + rect.width / 2;
            hoverCenterY = rect.top + rect.height / 2;
            isHovering = true;
        });

        orb.addEventListener('mousemove', (e) => {
            if (isDragging || !isHovering) return;
            
            let dx = e.clientX - hoverCenterX;
            let dy = e.clientY - hoverCenterY;
            
            applyStretch(dx, dy, true);
            orb.style.transition = 'transform 0.2s ease-out, box-shadow 0.3s ease';
        });
        
        orb.addEventListener('mouseleave', () => {
            isHovering = false;
            if (isDragging) return;
            orb.style.transform = 'rotate(0rad) scale(1) translate(0px, 0px)';
            orb.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        
        orb.addEventListener('mousedown', (e) => {
            isDragging = true;
            // Record the initial center of the orb to calculate true drag distance
            const rect = orb.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            orb.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease'; // responsive drag
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const tension = Math.min(distance / SNAP_DISTANCE, 1);
            
            if (distance > SNAP_DISTANCE) {
                // SNAPS OFF!
                isDragging = false;
                orb.style.transform = 'rotate(0rad) scale(1) translate(0px, 0px)';
                orb.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease'; // elastic return
                orb.style.boxShadow = baseShadow;
                return;
            }
            
            applyStretch(dx, dy, false);
            
            if (tension > 0.8) {
                // Red glow near snapping
                orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 60}px rgba(255, 50, 50, 0.9)`;
            } else if (tension > 0.4) {
                // Yellow glow as it stretches
                orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 40}px rgba(255, 200, 50, 0.8)`;
            } else {
                orb.style.boxShadow = baseShadow;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                orb.style.transform = 'rotate(0rad) scale(1) translate(0px, 0px)';
                orb.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease';
                orb.style.boxShadow = baseShadow;
            }
        });
    });

});