/**
 * Medixly Apple-Style 2D Visual Frequency Curve Graph
 * 
 * Provides an interactive Apple Settings-style 2D EQ Frequency Graph:
 * - Frequency range: 20 Hz to 20 kHz (Logarithmic scale)
 * - Gain range: -12 dB to +12 dB (0 dB center reference)
 * - Draggable nodes at Bass (60 Hz), Mid (1 kHz), Treble (8 kHz)
 * - Smooth Cubic Bézier curve with dynamic glowing accent fill
 * - Real-time synchronization with Web Audio BiquadFilterNodes and UI sliders
 */

(function (root, factory) {
    const exported = factory();
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = exported;
    } else if (typeof define === 'function' && define.amd) {
        define([], () => exported);
    }
    const g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : root || {}));
    g.MedixlyEQGraph = exported;
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {

    const MIN_FREQ = 20;
    const MAX_FREQ = 20000;
    const MIN_DB = -12;
    const MAX_DB = 12;

    const LOG_MIN = Math.log10(MIN_FREQ);
    const LOG_MAX = Math.log10(MAX_FREQ);

    function freqToX(freq, width) {
        const logF = Math.log10(Math.max(MIN_FREQ, Math.min(MAX_FREQ, freq)));
        const norm = (logF - LOG_MIN) / (LOG_MAX - LOG_MIN);
        return norm * width;
    }

    function dbToY(db, height) {
        const padding = 20;
        const usableH = height - (padding * 2);
        const clamped = Math.max(MIN_DB, Math.min(MAX_DB, db));
        const norm = (clamped - MIN_DB) / (MAX_DB - MIN_DB); // 0 (at -12dB) to 1 (at +12dB)
        return height - padding - (norm * usableH);
    }

    function yToDb(y, height) {
        const padding = 20;
        const usableH = height - (padding * 2);
        const clampedY = Math.max(padding, Math.min(height - padding, y));
        const norm = 1 - ((clampedY - padding) / usableH);
        const db = MIN_DB + (norm * (MAX_DB - MIN_DB));
        return Math.round(Math.max(MIN_DB, Math.min(MAX_DB, db)));
    }

    class AppleEQGraph {
        constructor(canvasId = 'medixly-eq-canvas') {
            this.canvasId = canvasId;
            this.canvas = null;
            this.ctx = null;
            this.nodes = {
                bass: { freq: 60, db: 0, label: 'Bass (60Hz)' },
                mid: { freq: 1000, db: 0, label: 'Mid (1kHz)' },
                treble: { freq: 8000, db: 0, label: 'Treble (8kHz)' }
            };
            this.draggingNode = null;
            this.accentColor = '#6366f1';
            this.onChangeCallback = null;
            this.animationFrameId = null;
        }

        init(containerSelector = '#medixly-eq-graph-container', onChange = null) {
            this.canvas = document.getElementById(this.canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.onChangeCallback = onChange;

            this.resizeCanvas();
            this.bindEvents();
            this.render();

            if (typeof window !== 'undefined') {
                window.addEventListener('resize', () => {
                    this.resizeCanvas();
                    this.render();
                });
            }
        }

        resizeCanvas() {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
            const w = rect.width || 560;
            const h = rect.height || 160;

            this.canvas.width = w * dpr;
            this.canvas.height = h * dpr;
            if (this.ctx) {
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            this.displayW = w;
            this.displayH = h;
        }

        setValues(bass = 0, mid = 0, treble = 0) {
            this.nodes.bass.db = Math.max(MIN_DB, Math.min(MAX_DB, bass));
            this.nodes.mid.db = Math.max(MIN_DB, Math.min(MAX_DB, mid));
            this.nodes.treble.db = Math.max(MIN_DB, Math.min(MAX_DB, treble));
            this.render();
        }

        getValues() {
            return {
                bass: this.nodes.bass.db,
                mid: this.nodes.mid.db,
                treble: this.nodes.treble.db
            };
        }

        setAccentColor(color) {
            if (color) this.accentColor = color;
            this.render();
        }

        bindEvents() {
            if (!this.canvas) return;

            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - rect.left,
                    y: clientY - rect.top
                };
            };

            const startDrag = (pos) => {
                const w = this.displayW || this.canvas.width;
                const h = this.displayH || this.canvas.height;
                const threshold = 28;

                for (const [key, node] of Object.entries(this.nodes)) {
                    const nx = freqToX(node.freq, w);
                    const ny = dbToY(node.db, h);
                    const dist = Math.hypot(pos.x - nx, pos.y - ny);
                    if (dist <= threshold) {
                        this.draggingNode = key;
                        this.canvas.style.cursor = 'ns-resize';
                        return true;
                    }
                }
                return false;
            };

            const doDrag = (pos) => {
                if (!this.draggingNode) return;
                const h = this.displayH || this.canvas.height;
                const newDb = yToDb(pos.y, h);
                this.nodes[this.draggingNode].db = newDb;
                this.render();

                if (typeof this.onChangeCallback === 'function') {
                    this.onChangeCallback(this.getValues(), this.draggingNode);
                }
            };

            const endDrag = () => {
                if (this.draggingNode) {
                    this.draggingNode = null;
                    this.canvas.style.cursor = 'default';
                    this.render();
                }
            };

            this.canvas.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startDrag(getPos(e));
            });

            window.addEventListener('mousemove', (e) => {
                if (this.draggingNode) {
                    e.preventDefault();
                    doDrag(getPos(e));
                }
            });

            window.addEventListener('mouseup', endDrag);

            this.canvas.addEventListener('touchstart', (e) => {
                if (startDrag(getPos(e))) {
                    e.preventDefault();
                }
            }, { passive: false });

            window.addEventListener('touchmove', (e) => {
                if (this.draggingNode) {
                    e.preventDefault();
                    doDrag(getPos(e));
                }
            }, { passive: false });

            window.addEventListener('touchend', endDrag);
        }

        render() {
            if (!this.ctx || !this.canvas) return;
            const ctx = this.ctx;
            const w = this.displayW || this.canvas.width;
            const h = this.displayH || this.canvas.height;

            ctx.clearRect(0, 0, w, h);

            // 1. Background grid
            ctx.fillStyle = '#0f1117';
            ctx.fillRect(0, 0, w, h);

            // Horizontal reference lines (-12dB, -6dB, 0dB, +6dB, +12dB)
            const dbMarks = [-12, -6, 0, 6, 12];
            ctx.lineWidth = 1;
            dbMarks.forEach(db => {
                const y = dbToY(db, h);
                ctx.beginPath();
                if (db === 0) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
                    ctx.setLineDash([]);
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
                    ctx.setLineDash([4, 4]);
                }
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();

                // dB text label
                ctx.fillStyle = db === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.25)';
                ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText((db > 0 ? '+' : '') + db + 'dB', w - 8, y + 3);
            });
            ctx.setLineDash([]);

            // Vertical frequency markers (100 Hz, 1 kHz, 10 kHz)
            const freqMarks = [
                { f: 60, l: '60Hz' },
                { f: 100, l: '100Hz' },
                { f: 1000, l: '1kHz' },
                { f: 8000, l: '8kHz' },
                { f: 15000, l: '15kHz' }
            ];
            freqMarks.forEach(m => {
                const x = freqToX(m.f, w);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h - 8);
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(m.l, x, h - 4);
            });

            // 2. Compute curve points
            const bx = freqToX(this.nodes.bass.freq, w);
            const by = dbToY(this.nodes.bass.db, h);
            const mx = freqToX(this.nodes.mid.freq, w);
            const my = dbToY(this.nodes.mid.db, h);
            const tx = freqToX(this.nodes.treble.freq, w);
            const ty = dbToY(this.nodes.treble.db, h);

            // Left anchor & Right anchor
            const lx = 0;
            const ly = dbToY(this.nodes.bass.db * 0.75, h);
            const rx = w;
            const ry = dbToY(this.nodes.treble.db * 0.75, h);

            const zeroY = dbToY(0, h);

            // 3. Draw Gradient Fill Under Curve
            const fillGradient = ctx.createLinearGradient(0, 0, 0, h);
            fillGradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
            fillGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
            fillGradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

            ctx.beginPath();
            ctx.moveTo(lx, ly);
            // Spline through anchor -> bass -> mid -> treble -> anchor
            ctx.bezierCurveTo(lx + (bx - lx) * 0.5, ly, bx - (mx - bx) * 0.25, by, bx, by);
            ctx.bezierCurveTo(bx + (mx - bx) * 0.35, by, mx - (mx - bx) * 0.35, my, mx, my);
            ctx.bezierCurveTo(mx + (tx - mx) * 0.35, my, tx - (tx - mx) * 0.35, ty, tx, ty);
            ctx.bezierCurveTo(tx + (rx - tx) * 0.5, ty, rx - (rx - tx) * 0.5, ry, rx, ry);

            // Close fill to baseline zeroY
            ctx.lineTo(w, zeroY);
            ctx.lineTo(0, zeroY);
            ctx.closePath();
            ctx.fillStyle = fillGradient;
            ctx.fill();

            // 4. Draw Smooth Acoustic Curve Stroke
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.bezierCurveTo(lx + (bx - lx) * 0.5, ly, bx - (mx - bx) * 0.25, by, bx, by);
            ctx.bezierCurveTo(bx + (mx - bx) * 0.35, by, mx - (mx - bx) * 0.35, my, mx, my);
            ctx.bezierCurveTo(mx + (tx - mx) * 0.35, my, tx - (tx - mx) * 0.35, ty, tx, ty);
            ctx.bezierCurveTo(tx + (rx - tx) * 0.5, ty, rx - (rx - tx) * 0.5, ry, rx, ry);

            ctx.strokeStyle = this.accentColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = this.accentColor;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // 5. Render Draggable Control Nodes
            const renderNode = (key, node, nx, ny) => {
                const isHoveredOrDragged = this.draggingNode === key;
                const radius = isHoveredOrDragged ? 8 : 6;

                // Outer halo
                ctx.beginPath();
                ctx.arc(nx, ny, radius + 4, 0, Math.PI * 2);
                ctx.fillStyle = isHoveredOrDragged ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)';
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(nx, ny, radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = this.accentColor;
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Value tooltip / label above node
                const dbStr = (node.db > 0 ? '+' : '') + node.db + ' dB';
                ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(dbStr, nx, Math.max(14, ny - 12));
            };

            renderNode('bass', this.nodes.bass, bx, by);
            renderNode('mid', this.nodes.mid, mx, my);
            renderNode('treble', this.nodes.treble, tx, ty);
        }
    }

    let globalInstance = null;

    return {
        AppleEQGraph,
        getInstance: (canvasId = 'medixly-eq-canvas') => {
            if (!globalInstance) {
                globalInstance = new AppleEQGraph(canvasId);
            }
            return globalInstance;
        },
        init: (canvasId = 'medixly-eq-canvas', onChange = null) => {
            const inst = new AppleEQGraph(canvasId);
            inst.init('#medixly-eq-graph-container', onChange);
            globalInstance = inst;
            return inst;
        }
    };
}));
