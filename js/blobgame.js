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
let quality = 'ultra'; // 'ultra', 'high', 'medium', 'low'
let sfxEnabled = true;
let musicEnabled = true;
let cinematicEnabled = true;
let fpsLimit = 60;
let fpsInterval = 1000 / 60;

// Audio
const bgmMusic = document.getElementById('bgm-music');

// Game State
let isPlaying = false;
let isPaused = false;
let animationFrameId;
let lastTime = 0;
let lastDrawTime = 0;
let spawnTimer = 0;
let spawnInterval = 1200;
let blobs = [];
let score = 0;
let combo = 1;
let misses = 0;
let timeScale = 1.0;

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

    // Options
    document.querySelectorAll('#quality-toggles .toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#quality-toggles .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            quality = btn.getAttribute('data-val');
            
            const desc = document.getElementById('quality-desc');
            if (quality === 'ultra') desc.textContent = 'Ultra: Maximum particles and effects.';
            if (quality === 'high') desc.textContent = 'High: Animated blobs, massive dot explosions.';
            if (quality === 'medium') desc.textContent = 'Med: Animated blobs, 25% fewer dots.';
            if (quality === 'low') desc.textContent = 'Low: Static blobs, 50% fewer dots.';
        });
    });

    document.querySelectorAll('#fps-toggles .toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#fps-toggles .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fpsLimit = parseInt(btn.getAttribute('data-val'));
            fpsInterval = 1000 / fpsLimit;
        });
    });

    document.getElementById('toggle-cinematic')?.addEventListener('change', (e) => cinematicEnabled = e.target.checked);

    document.getElementById('toggle-sfx').addEventListener('change', (e) => sfxEnabled = e.target.checked);
    document.getElementById('toggle-music').addEventListener('change', (e) => {
        musicEnabled = e.target.checked;
        if (musicEnabled && isPlaying && !isPaused) bgmMusic.play().catch(e => console.log('Audio play blocked:', e));
        else bgmMusic.pause();
    });

    // Pause functionality
    document.getElementById('btn-pause').addEventListener('click', pauseGame);
    const menuPause = document.getElementById('menu-pause');
    if (menuPause) {
        document.getElementById('btn-resume').addEventListener('click', resumeGame);
        document.getElementById('btn-retry').addEventListener('click', startGame);
        document.getElementById('btn-pause-menu').addEventListener('click', () => {
            isPlaying = false;
            isPaused = false;
            gameContainer.style.display = 'none';
            gameHud.classList.add('hidden');
            showMenu(menuMain);
        });
    }

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
            startGame();
        });
    }
}

function showMenu(menuEl) {
    const allMenus = [menuMain, menuTutorial, menuOptions, menuLeaderboard, menuGameover];
    const mPause = document.getElementById('menu-pause');
    if (mPause) allMenus.push(mPause);
    allMenus.forEach(m => m.classList.add('hidden'));
    menuEl.classList.remove('hidden');
}

// --- Game Logic ---

function pauseGame() {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    bgmMusic.pause();
    uiLayer.classList.remove('hidden');
    const mPause = document.getElementById('menu-pause');
    if (mPause) showMenu(mPause);
    
    const pauseScore = document.getElementById('pause-score');
    const pauseCombo = document.getElementById('pause-combo');
    if (pauseScore) pauseScore.textContent = score;
    if (pauseCombo) pauseCombo.textContent = combo;
}

function resumeGame() {
    if (!isPlaying || !isPaused) return;
    isPaused = false;
    uiLayer.classList.add('hidden');
    lastTime = performance.now();
    lastDrawTime = performance.now();
    if (musicEnabled) bgmMusic.play().catch(e => {});
    animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
    uiLayer.classList.add('hidden');
    gameHud.classList.remove('hidden');
    gameContainer.style.display = 'block'; // Reveal on play
    
    score = 0;
    combo = 1;
    misses = 0;
    spawnInterval = 1200;
    blobs.forEach(b => b.el.remove());
    blobs = [];
    updateHUD();

    isPlaying = true;
    isPaused = false;
    lastTime = performance.now();
    lastDrawTime = performance.now();
    
    if (musicEnabled) {
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
    gameContainer.style.display = 'none'; // Hide on game over
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
    if (!isPlaying || isPaused) return;

    animationFrameId = requestAnimationFrame(gameLoop);

    const elapsedDraw = currentTime - lastDrawTime;
    if (elapsedDraw < fpsInterval) return;
    lastDrawTime = currentTime - (elapsedDraw % fpsInterval);

    let dt = currentTime - lastTime;
    lastTime = currentTime;
    
    if (dt > 100) dt = 16; // Cap dt for lag
    
    dt *= timeScale;

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
        blob.y += blob.vy * (dt / 16); // Normalize speed to 60fps
        blob.el.style.transform = `translate(${blob.x}px, ${blob.y}px)`;

        // Check if fell off screen
        if (blob.y > height + blob.size) {
            blob.el.remove();
            blobs.splice(i, 1);
            stopPullSound(); // Stop any pull sound if it falls while dragging
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
        if (!isDragging || isPaused) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 5) {
            if (cinematicEnabled) timeScale = 0.75;
            
            const angle = Math.atan2(dy, dx);
            const scaleX = 1 + (dist / 150);
            const scaleY = Math.max(0.2, 1 - (dist / 300));
            
            el.style.transform = `translate(${blobObj.x}px, ${blobObj.y}px) rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;
            
            if (quality !== 'low') {
                el.style.boxShadow = `0 0 ${dist / 2}px #fff`;
            }

            startPullSound(sfxEnabled);
            updatePullSound(dist, sfxEnabled);

            if (dist > 150) {
                isDragging = false;
                timeScale = 1.0;
                stopPullSound();
                popBlob(blobObj);
            }
        }
    });

    el.addEventListener('pointerup', (e) => {
        if (isDragging) {
            isDragging = false;
            timeScale = 1.0;
            stopPullSound();
            popBlob(blobObj);
        }
    });
    
    el.addEventListener('pointercancel', (e) => {
        if (isDragging) {
            isDragging = false;
            timeScale = 1.0;
            stopPullSound();
            el.style.transform = `translate(${blobObj.x}px, ${blobObj.y}px)`;
            el.style.boxShadow = 'none';
        }
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
    }
}

function missBlob() {
    if (combo > 1) {
        // Combo shield: if they were in a combo, they just lose the combo, no miss counted
        combo = 1;
    } else {
        // Not in a combo, this is a real miss
        misses++;
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
