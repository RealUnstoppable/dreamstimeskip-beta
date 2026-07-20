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
    const orbElements = document.querySelectorAll('.orb, #siri-orb');
    
    orbElements.forEach(orb => {
        let isDragging = false;
        let startX = 0, startY = 0;
        let hoverCenterX = 0, hoverCenterY = 0;
        let isHovering = false;
        
        // Physics variables for LERP
        let currentAngle = 0;
        let targetAngle = 0;
        let currentStretch = 0;
        let targetStretch = 0;
        let isErratic = false;
        let erraticTimeout;
        const SNAP_DISTANCE = 300; 
        
        const baseShadow = orb.id === 'siri-orb' 
            ? `inset 0 0 10px 2px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.1), inset -2px -2px 5px rgba(0,0,0,0.2), 0 0 15px rgba(59, 130, 246, 0.4)`
            : `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 40px rgba(147, 51, 234, 0.4)`;
            
        const baseTransition = 'width 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        orb.style.transition = `${baseTransition}, box-shadow 0.3s ease`; // Preserve width transitions
        
        const physicsLoop = () => {
            if (orb.classList.contains('expanded')) {
                // When expanded, smoothly LERP the stretch back to 0 so it morphs into a perfect pill
                targetStretch = 0;
                // DO NOT return here, let the LERP engine mathematically settle it!
            }

            const actualTargetStretch = isErratic ? 0 : targetStretch;
            
            // Smoothly interpolate stretch
            currentStretch += (actualTargetStretch - currentStretch) * 0.15;
            
            if (currentStretch > 0.01) {
                // Smoothly interpolate angle
                let diff = targetAngle - currentAngle;
                while (diff > Math.PI) diff -= 2 * Math.PI;
                while (diff < -Math.PI) diff += 2 * Math.PI;
                currentAngle += diff * 0.25;
            } else {
                // When visually a circle, silently reset the angle to prevent infinite wrap-around limits
                currentAngle = currentAngle % (2 * Math.PI);
                targetAngle = currentAngle;
            }
            
            try {
                orb.style.transform = `rotate(${currentAngle}rad) translateX(${currentStretch * 100}px) scaleX(${1 + currentStretch}) scaleY(${1 - currentStretch * 0.3}) rotate(${-currentAngle}rad)`;
            } catch (e) {
                orb.style.transform = `rotate(${currentAngle}rad) translateX(${currentStretch * 50}px) scaleX(${1 + currentStretch}) scaleY(${1 - currentStretch * 0.3})`;
            }
            
            requestAnimationFrame(physicsLoop);
        };
        requestAnimationFrame(physicsLoop);

        const updateTarget = (dx, dy, isHover) => {
            if (orb.classList.contains('expanded')) {
                targetStretch = 0;
                return;
            }
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 1) {
                targetStretch = 0;
                return;
            }

            const rawAngle = Math.atan2(dy, dx);
            let angleDiff = rawAngle - targetAngle;
            
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Failsafe: if the user spins the mouse wildly (> ~30 deg per event), trigger erratic mode
            if (Math.abs(angleDiff) > 0.5) {
                isErratic = true;
                clearTimeout(erraticTimeout);
                erraticTimeout = setTimeout(() => { isErratic = false; }, 200); // 200ms of calm needed
            }
            
            targetAngle += angleDiff;
            
            if (isHover) {
                targetStretch = Math.min(distance / 300, 0.15); 
            } else {
                let nDist = Math.min(distance / SNAP_DISTANCE, 1);
                // Ease-out curve simulates physical resistance: 
                // it stretches easily at first, but resists (stretches less per pixel) as you pull further
                let resistanceDist = 1 - Math.pow(1 - nDist, 2);
                targetStretch = resistanceDist * 2.5; 
            }
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
            updateTarget(dx, dy, true);
        });
        
        orb.addEventListener('mouseleave', () => {
            isHovering = false;
            if (isDragging) return;
            targetStretch = 0;
        });
        
        let hasDragged = false;
        
        const handleDragStart = (clientX, clientY) => {
            if (orb.classList.contains('expanded')) return;
            isDragging = true;
            hasDragged = false;
            const rect = orb.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            orb.style.transition = `${baseTransition}, box-shadow 0.1s ease`;
        };
        
        orb.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY));
        orb.addEventListener('touchstart', (e) => {
            // Only handle single touch
            if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        
        const handleDragMove = (clientX, clientY) => {
            if (!isDragging) return;
            
            const dx = clientX - startX;
            const dy = clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) hasDragged = true; // distinguish drag from click
            
            const tension = Math.min(distance / SNAP_DISTANCE, 1);
            
            if (distance > SNAP_DISTANCE) {
                isDragging = false;
                targetStretch = 0;
                orb.style.transition = `${baseTransition}, box-shadow 0.5s ease`; 
                orb.style.boxShadow = baseShadow;
                return;
            }
            
            updateTarget(dx, dy, false);
            
            if (tension > 0.8) {
                orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 60}px rgba(255, 50, 50, 0.9)`;
            } else if (tension > 0.4) {
                orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 40}px rgba(255, 200, 50, 0.8)`;
            } else {
                orb.style.boxShadow = baseShadow;
            }
        };

        document.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault(); // Prevent scrolling while stretching orb
        }, { passive: false });
        
        const handleDragEnd = () => {
            if (isDragging) {
                isDragging = false;
                targetStretch = 0;
                orb.style.transition = `${baseTransition}, box-shadow 0.5s ease`;
                orb.style.boxShadow = baseShadow;
            }
        };

        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        
        // --- Click & Tap Logic ---
        let expandedAt = 0;
        let inactivityTimeout;
        let tapCount = 0;
        let tapTimeout;
        
        orb.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                return;
            }
            
            if (orb.id === 'siri-orb') {
                const link = orb.querySelector('a');
                const isLinkClick = (e.target === link);
                
                if (!orb.classList.contains('expanded')) {
                    if (isLinkClick) e.preventDefault(); // Don't navigate while expanding
                    
                    orb.classList.add('expanded');
                    expandedAt = Date.now();
                    
                    clearTimeout(inactivityTimeout);
                    inactivityTimeout = setTimeout(() => {
                        orb.classList.remove('expanded');
                    }, 5000);
                } else {
                    if (isLinkClick) {
                        if (Date.now() - expandedAt < 1000) {
                            e.preventDefault(); // Clicked too fast after expanding!
                        }
                    } else {
                        // Clicked the pill background, keep it open longer
                        clearTimeout(inactivityTimeout);
                        inactivityTimeout = setTimeout(() => {
                            orb.classList.remove('expanded');
                        }, 5000);
                    }
                }
            } else {
                // Main Blob Tap & Wave Easter Egg
                tapCount++;
                clearTimeout(tapTimeout);
                tapTimeout = setTimeout(() => {
                    tapCount = 0;
                    orb.style.boxShadow = baseShadow;
                }, 1000);
                
                const rect = orb.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                if (tapCount > 10) {
                    // Massive wave detonation
                    const wave = document.createElement('div');
                    wave.classList.add('orb-wave', 'massive-wave');
                    tapCount = 0; // reset after massive wave
                    orb.style.boxShadow = baseShadow;
                    
                    wave.style.left = `${centerX}px`;
                    wave.style.top = `${centerY}px`;
                    
                    document.body.appendChild(wave);
                    setTimeout(() => wave.remove(), 2000);
                } else {
                    // Particles effect
                    if (tapCount > 5) {
                        // Intensify outline leading up to massive wave
                        const intensity = (tapCount - 5) * 5; 
                        orb.style.boxShadow = `0 0 ${intensity * 2}px ${intensity}px rgba(255,255,255,0.8), inset 0 0 60px 10px rgba(0,0,0,0.2), 0 0 40px rgba(147, 51, 234, 0.4)`;
                    }
                    
                    const particleColors = ['#9333EA', '#2563EB', '#EC4899', '#3B82F6', '#8B5CF6'];
                    const numParticles = 8 + Math.floor(Math.random() * 6); // 8-13 particles
                    
                    for (let i = 0; i < numParticles; i++) {
                        const particle = document.createElement('div');
                        particle.classList.add('orb-particle');
                        
                        const angle = Math.random() * Math.PI * 2;
                        // Random spread distance from center
                        const distance = 120 + Math.random() * 200; 
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        
                        particle.style.left = `${centerX}px`;
                        particle.style.top = `${centerY}px`;
                        particle.style.setProperty('--tx', `${tx}px`);
                        particle.style.setProperty('--ty', `${ty}px`);
                        
                        // Random color and sizing
                        particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
                        particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
                        
                        const size = 4 + Math.random() * 6;
                        particle.style.width = `${size}px`;
                        particle.style.height = `${size}px`;
                        
                        // Random duration and delay for organic feel
                        const duration = 0.8 + Math.random() * 0.5;
                        particle.style.animationDuration = `${duration}s`;
                        
                        document.body.appendChild(particle);
                        setTimeout(() => particle.remove(), duration * 1000);
                    }
                }
            }
        });
    });

});