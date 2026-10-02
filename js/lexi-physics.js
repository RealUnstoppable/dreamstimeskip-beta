export function initLexiPhysics() {
    const wrappers = document.querySelectorAll('.lexi-mixer-wrapper');
    const dragMenu = document.getElementById('lexi-drag-menu');
    const dragCart = document.getElementById('lexi-drag-cart');
    const dragChat = document.getElementById('lexi-drag-chat');
    
    // Setup Entry Animation
    const bottomBar = document.querySelector('.music-player-bar');
    const mixerBtn = document.getElementById('mixer-btn');
    if (bottomBar && mixerBtn) {
        const glow = document.createElement('div');
        glow.className = 'player-glow-overlay';
        bottomBar.appendChild(glow);
        
        // Player glow overlay for when the sitewide Lexi orb lands into mixer-btn
    }

    wrappers.forEach(wrapper => {
        const blob = wrapper.querySelector('.lexi-mixxer-blob');
        if (!blob) return;
        
        let isDragging = false;
        let startX = 0, startY = 0;
        let currentX = 0, currentY = 0;
        let startTime = 0;

        const onStart = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = false;
            startTime = Date.now();
            blob.style.transition = 'none'; // Disable transition for direct follow
            
            document.addEventListener('mousemove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging = true;
                blob.classList.add('dragging');
                e.preventDefault(); // Stop scrolling if dragging
            }
            
            if (isDragging) {
                // Apply springy resistance
                currentX = dx * 0.4;
                currentY = dy * 0.4;
                blob.style.transform = `translate(${currentX}px, ${currentY}px)`;

                // If pulled far enough, show menu
                const dist = Math.sqrt(currentX*currentX + currentY*currentY);
                if (dist > 30) {
                    const rect = blob.getBoundingClientRect();
                    dragMenu.style.left = `${rect.left - 50}px`;
                    dragMenu.style.top = `${rect.top - 100}px`;
                    dragMenu.classList.remove('hidden');
                } else {
                    dragMenu.classList.add('hidden');
                }
            }
        };

        const onEnd = (e) => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);

            blob.classList.remove('dragging');
            blob.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            blob.style.transform = 'translate(0px, 0px)';
            setTimeout(() => {
                if (!isDragging) {
                    blob.style.transform = '';
                    blob.style.transition = '';
                }
            }, 400);
            
            const duration = Date.now() - startTime;
            if (!isDragging || duration < 200) {
                // Treat as Tap -> Toggle Mixxer
                // We dispatch a custom event or trigger click on wrapper
                // But the wrapper click might bubble, so we just handle state classes here and click wrapper
                const isMixxing = wrapper.classList.contains('state-mixxing');
                
                // Toggle state
                if (isMixxing) {
                    // Turn OFF
                    document.querySelectorAll('.lexi-mixer-wrapper').forEach(w => {
                        w.classList.remove('state-mixxing');
                        w.classList.add('state-deactivated');
                    });
                } else {
                    // Turn ON
                    document.querySelectorAll('.lexi-mixer-wrapper').forEach(w => {
                        w.classList.remove('state-deactivated');
                        w.classList.remove('state-listening');
                        w.classList.add('state-mixxing');
                    });
                }
                
                // Trigger original mixer logic
                if (typeof window.toggleMixerMode === 'function') {
                    window.toggleMixerMode();
                } else {
                    // Simulate click for harmonytunes.js logic if window func isn't exported
                    const evt = new Event('click', { bubbles: true });
                    wrapper.dispatchEvent(evt);
                }
            } else {
                // It was a drag. Keep menu open.
                // We'll hide it if they click outside.
                const outsideClickListener = (e) => {
                    if (!dragMenu.contains(e.target) && !blob.contains(e.target)) {
                        dragMenu.classList.add('hidden');
                        document.removeEventListener('click', outsideClickListener);
                    }
                };
                setTimeout(() => {
                    document.addEventListener('click', outsideClickListener);
                }, 100);
            }
            
            currentX = 0; currentY = 0;
        };

        blob.addEventListener('mousedown', onStart);
        blob.addEventListener('touchstart', onStart, { passive: true });
    });

    if (dragCart) {
        dragCart.addEventListener('click', () => {
            window.location.href = 'shop.html#cart';
        });
    }
    if (dragChat) {
        dragChat.addEventListener('click', () => {
            if (typeof window.openLexiChat === 'function') {
                window.openLexiChat();
            }
            dragMenu.classList.add('hidden');
        });
    }
}

// Auto init
document.addEventListener('DOMContentLoaded', initLexiPhysics);
