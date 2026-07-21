import { saveScore, getTopScores, getLocalUsername, setLocalUsername } from './leaderboard.js';
import { initAudio, playPopSound, startPullSound, updatePullSound, stopPullSound } from './audio-synth.js';

// Elements
const uiLayer = document.getElementById('ui-layer');
const menuMain = document.getElementById('menu-main');
const menuTutorial = document.getElementById('menu-tutorial');
const menuOptions = document.getElementById('menu-options');
const menuLeaderboard = document.getElementById('menu-leaderboard');
const menuGameover = document.getElementById('menu-gameover');

const gameHud = document.getElementById('game-hud');
const gameContainer = document.getElementById('game-container');
const scoreVal = document.getElementById('score-val');
const comboVal = document.getElementById('combo-val');
const missesVal = document.getElementById('misses-val');

// Options State
let quality = 'high'; // 'high', 'medium', 'low'
let sfxEnabled = true;
let musicEnabled = true;

// Audio
const bgmMusic = document.getElementById('bgm-music');
const bgmMenu = document.getElementById('bgm-menu');
let fpsLimit = 60;
let lastDrawTime = 0;

// Game State
let isPlaying = false;
let animationFrameId;
let lastTime = 0;
let spawnTimer = 0;
let spawnInterval = 1200;
let blobs = [];
let score = 0;
let combo = 1;
let misses = 0;

// Setup Event Listeners
function setupUI() {
    // Menu Navigation
    document.getElementById('btn-play').addEventListener('click', startGame);
    
    document.getElementById('btn-tutorial').addEventListener('click', () => showMenu(menuTutorial));
    document.getElementById('btn-tut-back').addEventListener('click', () => showMenu(menuMain));
    
    document.getElementById('btn-options').addEventListener('click', () => showMenu(menuOptions));
    document.getElementById('btn-opt-back').addEventListener('click', () => showMenu(menuMain));
    
    document.getElementById('btn-leaderboard').addEventListener('click', () => {
        showMenu(menuLeaderboard);
        loadLeaderboard();
    });
    document.getElementById('btn-lb-back').addEventListener('click', () => showMenu(menuMain));
    
    document.getElementById('btn-replay').addEventListener('click', startGame);
    document.getElementById('btn-go-menu').addEventListener('click', () => showMenu(menuMain));

    // Options - Quality
    document.querySelectorAll('.qual-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.qual-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            quality = btn.getAttribute('data-val');
            
            const desc = document.getElementById('quality-desc');
            if (quality === 'high') desc.textContent = 'High: Animated blobs, massive dot explosions.';
            if (quality === 'medium') desc.textContent = 'Med: Animated blobs, 25% fewer dots.';
            if (quality === 'low') desc.textContent = 'Low: Static blobs, 50% fewer dots.';
        });
    });

    // Options - FPS
    document.querySelectorAll('.fps-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.fps-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fpsLimit = parseInt(btn.getAttribute('data-val'), 10);
        });
    });

    // Options - Audio Sliders
    const sfxSlider = document.getElementById('sfx-vol');
    const musicSlider = document.getElementById('music-vol');

    sfxSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        sfxEnabled = vol > 0;
        // The synth could be updated to actually use 'vol' instead of boolean, but for now we'll just toggle off if 0.
    });

    musicSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        musicEnabled = vol > 0;
        bgmMusic.volume = vol;
        bgmMenu.volume = vol;
        if (!musicEnabled) {
            bgmMusic.pause();
            bgmMenu.pause();
        } else if (isPlaying) {
            bgmMusic.play().catch(() => {});
        } else {
            bgmMenu.play().catch(() => {});
        }
    });

    // Initial play attempt for menu music
    document.body.addEventListener('pointerdown', () => {
        if (!isPlaying && musicEnabled && bgmMenu.paused) {
            bgmMenu.play().catch(() => {});
        }
    }, { once: true });

    // Leaderboard Username Binding
    const usernameInput = document.getElementById('username-input');
    const btnSaveUser = document.getElementById('btn-save-username');
    const btnGuest = document.getElementById('btn-guest');
    const bindingSection = document.getElementById('username-binding');

    if (getLocalUsername()) {
        bindingSection.classList.add('hidden');
    }

    btnSaveUser.addEventListener('click', () => {
        if (setLocalUsername(usernameInput.value)) {
            bindingSection.classList.add('hidden');
            loadLeaderboard(); // refresh in case it affects display
        }
    });
    
    if (btnGuest) {
        btnGuest.addEventListener('click', () => {
            setLocalUsername('Guest');
            bindingSection.classList.add('hidden');
            loadLeaderboard();
        });
    }
}

function showMenu(menuEl) {
    [menuMain, menuTutorial, menuOptions, menuLeaderboard, menuGameover].forEach(m => m.classList.add('hidden'));
    menuEl.classList.remove('hidden');
    
    // Crossfade to menu music
    if (musicEnabled) {
        bgmMusic.pause();
        bgmMenu.play().catch(() => {});
    }
}

// --- Game Logic ---

function startGame() {
    uiLayer.classList.add('hidden');
    gameHud.classList.remove('hidden');
    
    score = 0;
    combo = 1;
    misses = 0;
    spawnInterval = 1200;
    blobs.forEach(b => b.el.remove());
    blobs = [];
    updateHUD();

    isPlaying = true;
    lastTime = performance.now();
    
    if (musicEnabled) {
        // Crossfade to game music
        bgmMenu.pause();
        bgmMusic.currentTime = 0;
        bgmMusic.play().catch(e => console.log('Audio play blocked:', e));
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    bgmMusic.pause();

    gameHud.classList.add('hidden');
    uiLayer.classList.remove('hidden');
    showMenu(menuGameover);

    document.getElementById('go-score').textContent = score;
    
    let bestScore = parseInt(localStorage.getItem('blobgame_best')) || 0;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('blobgame_best', bestScore);
    }
    document.getElementById('go-best').textContent = bestScore;

    // Save to leaderboard if they have a bound username
    saveScore(score);
}

function updateHUD() {
    scoreVal.textContent = score;
    comboVal.textContent = combo;
    missesVal.textContent = misses;
}

function gameLoop(currentTime) {
    if (!isPlaying) return;

    animationFrameId = requestAnimationFrame(gameLoop);

    // Enforce FPS limit
    const minFrameTime = 1000 / fpsLimit;
    if (currentTime - lastDrawTime < minFrameTime) return;
    lastDrawTime = currentTime;

    const dt = currentTime - lastTime;
    lastTime = currentTime;
    spawnTimer += dt;

    // Spawn new blob
    if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        spawnInterval = Math.max(400, spawnInterval - 10); // Slowly increase difficulty
        spawnBlob();
    }

    // Update blobs
    const height = window.innerHeight;
    for (let i = blobs.length - 1; i >= 0; i--) {
        const blob = blobs[i];
        const effectiveVy = blob.isStretching ? blob.vy * 0.75 : blob.vy; // 25% slowdown
        blob.y += effectiveVy * (dt / 16); // Normalize speed to 60fps
        blob.el.style.transform = `translate(${blob.x}px, ${blob.y}px)`;

        // Check if fell off screen
        if (blob.y > height + blob.size) {
            blob.el.remove();
            blobs.splice(i, 1);
            if (blob.isStretching) {
                stopPullSound(); // Stop any pull sound if it falls while dragging
            }
            missBlob();
        }
    }
}

function spawnBlob() {
    const size = 60 + Math.random() * 60; // 60px to 120px
    const x = Math.random() * (window.innerWidth - size);
    const y = -size;
    const vy = 2 + Math.random() * 3 + (1200 - spawnInterval) / 200; // Speed increases with difficulty

    const el = document.createElement('div');
    el.classList.add('game-blob');
    if (quality === 'low') el.classList.add('low-quality');
    
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.transform = `translate(${x}px, ${y}px)`;

    gameContainer.appendChild(el);

    const blobObj = { el, x, y, vy, size };
    blobs.push(blobObj);

    // Interaction
    let startX, startY;
    let isDragging = false;
    
    el.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        el.setPointerCapture(e.pointerId);
        initAudio(); // Initialize Web Audio Context on first interaction
    });

    el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // If dragging more than a tiny threshold, start/modulate pull sound
        if (dist > 5) {
            blobObj.isStretching = true;
            startPullSound(sfxEnabled);
            updatePullSound(dist, sfxEnabled);
        }
    });

    el.addEventListener('pointerup', (e) => {
        isDragging = false;
        blobObj.isStretching = false;
        stopPullSound();
        popBlob(blobObj);
    });
    
    el.addEventListener('pointercancel', (e) => {
        isDragging = false;
        blobObj.isStretching = false;
        stopPullSound();
    });
}

function popBlob(blobObj) {
    const index = blobs.indexOf(blobObj);
    if (index > -1) {
        blobs.splice(index, 1);
        blobObj.el.remove();

        // Audio
        playPopSound(sfxEnabled);

        // VFX
        spawnExplosion(blobObj.x + blobObj.size/2, blobObj.y + blobObj.size/2, blobObj.size);

        // Score & Combo
        score += 10 * combo;
        combo++;
        updateHUD();

        // Fortnite-style floating combo text
        if (combo > 2) {
            const floatText = document.createElement('div');
            floatText.textContent = `x${combo - 1}!`;
            floatText.style.position = 'absolute';
            floatText.style.left = `${blobObj.x + blobObj.size/2}px`;
            floatText.style.top = `${blobObj.y}px`;
            floatText.style.color = '#fff';
            floatText.style.fontWeight = '900';
            floatText.style.fontSize = '24px';
            floatText.style.textShadow = '0 0 5px #00ffcc, 0 0 10px #00ffcc';
            floatText.style.pointerEvents = 'none';
            floatText.style.transform = 'translate(-50%, -50%)';
            floatText.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            floatText.style.zIndex = '100';
            gameContainer.appendChild(floatText);
            
            requestAnimationFrame(() => {
                floatText.style.transform = 'translate(-50%, -150%) scale(1.5)';
                floatText.style.opacity = '0';
            });
            setTimeout(() => floatText.remove(), 800);
        }
    }
}

function missBlob() {
    if (combo > 1) {
        // Combo shield: if they were in a combo, they just lose the combo, no miss counted
        combo = 1;
    } else {
        // Not in a combo, this is a real miss
        misses++;
        
        // Red glow effect on bottom only for real misses
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.bottom = '0';
        glow.style.left = '0';
        glow.style.width = '100%';
        glow.style.height = '100px';
        glow.style.background = 'linear-gradient(to top, rgba(255, 0, 0, 0.6), transparent)';
        glow.style.pointerEvents = 'none';
        glow.style.transition = 'opacity 0.3s ease-out';
        gameContainer.appendChild(glow);
        
        requestAnimationFrame(() => {
            glow.style.opacity = '0';
            setTimeout(() => glow.remove(), 300);
        });
    }
    
    updateHUD();

    if (misses >= 5) {
        gameOver();
    }
}

function spawnExplosion(x, y, size) {
    let baseParticles = size / 2; // e.g. 80px blob = 40 particles
    
    let multiplier = 1.0;
    if (quality === 'medium') multiplier = 0.75;
    if (quality === 'low') multiplier = 0.50;

    const numParticles = Math.floor(baseParticles * multiplier);
    const particleColors = ['#9333EA', '#2563EB', '#EC4899', '#3B82F6', '#8B5CF6'];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('game-particle');
        
        const angle = Math.random() * Math.PI * 2;
        const distance = (size / 2) + Math.random() * size; 
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        if (quality !== 'low') {
            particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
        }
        
        const pSize = 4 + Math.random() * 8;
        particle.style.width = `${pSize}px`;
        particle.style.height = `${pSize}px`;
        
        const duration = 0.8 + Math.random() * 0.5;
        particle.style.animationDuration = `${duration}s`;
        
        gameContainer.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }
}

// --- Leaderboard UI ---
async function loadLeaderboard() {
    const listEl = document.getElementById('lb-scores');
    const loadingEl = document.getElementById('lb-loading');
    
    listEl.innerHTML = '';
    loadingEl.style.display = 'block';

    const scores = await getTopScores();
    loadingEl.style.display = 'none';

    scores.forEach((entry, i) => {
        const li = document.createElement('li');
        
        const rank = document.createElement('span');
        rank.classList.add('lb-rank');
        rank.textContent = `#${i + 1}`;
        
        const name = document.createElement('span');
        name.classList.add('lb-name');
        name.textContent = entry.username;
        
        const scoreVal = document.createElement('span');
        scoreVal.classList.add('lb-score');
        scoreVal.textContent = entry.score;

        li.appendChild(rank);
        li.appendChild(name);
        li.appendChild(scoreVal);
        listEl.appendChild(li);
    });
}

// Init
setupUI();
