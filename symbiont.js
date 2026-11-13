/**
 * SYMBIONT — Theme-Aware Generative Particle Constellation
 * Optimized for low CPU/GPU overhead, prefers-reduced-motion, and tab visibility.
 */

(function () {
    'use strict';

    const canvas = document.getElementById('symbiont-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const THEME_CONFIG = {
        obsidian: {
            bgHex: '#06080d',
            trailFill: 'rgba(6, 8, 13, 0.22)',
            lineOpacity: 0.12,
            particleAlpha: 0.62,
            glowAlpha: 0.045,
            palette: [
                { r: 16, g: 185, b: 129 },  // Emerald
                { r: 6, g: 182, b: 212 },   // Cyan
                { r: 99, g: 102, b: 241 },  // Indigo
                { r: 52, g: 211, b: 153 },  // Mint
            ],
        },
        editorial: {
            bgHex: '#09090b',
            trailFill: 'rgba(9, 9, 11, 0.24)',
            lineOpacity: 0.11,
            particleAlpha: 0.56,
            glowAlpha: 0.04,
            palette: [
                { r: 245, g: 158, b: 11 },  // Amber
                { r: 217, g: 119, b: 6 },   // Deep Gold
                { r: 250, g: 250, b: 249 }, // Ivory
                { r: 251, g: 191, b: 36 },  // Warm Gold
            ],
        },
        daylight: {
            bgHex: '#f8fafc',
            trailFill: 'rgba(248, 250, 252, 0.28)',
            lineOpacity: 0.14,
            particleAlpha: 0.42,
            glowAlpha: 0.055,
            palette: [
                { r: 37, g: 99, b: 235 },   // Royal Cobalt
                { r: 13, g: 148, b: 136 },  // Teal
                { r: 71, g: 85, b: 105 },   // Slate
                { r: 59, g: 130, b: 246 },  // Sky Blue
            ],
        },
    };

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'obsidian';
    if (!THEME_CONFIG[currentTheme]) currentTheme = 'obsidian';

    const storedMotion = localStorage.getItem('ravi_motion');
    let isPausedByUser = storedMotion === 'paused';
    let running = !reducedMotionQuery.matches && !isPausedByUser;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationId = null;
    let time = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    function getCounts() {
        const isMobile = window.innerWidth < 768;
        return {
            count: isMobile ? 55 : 140,
            connDist: isMobile ? 55 : 85,
            mouseRadius: isMobile ? 110 : 160,
        };
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.34;
            this.vy = (Math.random() - 0.5) * 0.34;
            this.baseSize = 1.1 + Math.random() * 1.9;
            this.size = this.baseSize;
            this.colorIndex = Math.floor(Math.random() * 4);
            this.phase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.015 + Math.random() * 0.02;
            this.life = initial ? 0.5 + Math.random() * 0.5 : 1;
        }

        update(mouseRadius) {
            const angle = Math.sin(this.x * 0.0028 + time * 0.003) + Math.cos(this.y * 0.0028 + time * 0.002);
            this.vx += Math.cos(angle) * 0.006;
            this.vy += Math.sin(angle) * 0.006;

            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < mouseRadius * mouseRadius && distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / mouseRadius) * 0.035;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                    this.size = this.baseSize * (1 + (1 - dist / mouseRadius) * 0.85);
                } else {
                    this.size += (this.baseSize - this.size) * 0.08;
                }
            } else {
                this.size += (this.baseSize - this.size) * 0.08;
            }

            this.vx *= 0.985;
            this.vy *= 0.985;
            this.x += this.vx;
            this.y += this.vy;
            this.phase += this.pulseSpeed;

            if (this.x < -40) this.x = width + 40;
            if (this.x > width + 40) this.x = -40;
            if (this.y < -40) this.y = height + 40;
            if (this.y > height + 40) this.y = -40;
        }
    }

    function drawFrame(clearFully) {
        const theme = THEME_CONFIG[currentTheme] || THEME_CONFIG.obsidian;
        const { connDist, mouseRadius } = getCounts();
        const connDistSq = connDist * connDist;

        if (clearFully) {
            ctx.fillStyle = theme.bgHex;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = theme.trailFill;
            ctx.fillRect(0, 0, width, height);
        }

        // Subtle ambient center glow
        const cx = width * 0.5;
        const cy = height * 0.35;
        const glowRadius = Math.min(width, height) * 0.45;
        const primary = theme.palette[0];
        const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        bgGlow.addColorStop(0, `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${theme.glowAlpha})`);
        bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        // Draw lightweight connections
        ctx.lineWidth = 0.7;
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < connDistSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / connDist) * theme.lineOpacity;
                    if (alpha < 0.01) continue;
                    const c = theme.palette[a.colorIndex];
                    ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (running && !clearFully) {
                p.update(mouseRadius);
            }
            const pulse = 0.72 + 0.28 * Math.sin(p.phase);
            const c = theme.palette[p.colorIndex];
            const alpha = theme.particleAlpha * pulse;
            ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop() {
        if (!running || document.hidden) {
            animationId = null;
            return;
        }
        time += 1;
        drawFrame(false);
        animationId = requestAnimationFrame(loop);
    }

    function startLoop() {
        if (animationId) cancelAnimationFrame(animationId);
        if (running && !document.hidden) {
            animationId = requestAnimationFrame(loop);
        } else {
            drawFrame(true);
        }
    }

    function populate() {
        const { count } = getCounts();
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function init() {
        resize();
        populate();
        drawFrame(true);
        if (running) {
            startLoop();
        }
    }

    window.addEventListener('resize', () => {
        const prevCount = particles.length;
        resize();
        const { count } = getCounts();
        if (Math.abs(count - prevCount) > 20) {
            populate();
        }
        if (!running) drawFrame(true);
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else if (running) {
            startLoop();
        }
    });

    reducedMotionQuery.addEventListener('change', (e) => {
        if (e.matches) {
            running = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            drawFrame(true);
        } else if (!isPausedByUser) {
            running = true;
            startLoop();
        }
    });

    window.SymbiontControl = {
        toggleMotion() {
            if (reducedMotionQuery.matches && !running) {
                // Allow explicit user override if they click Play Motion
                isPausedByUser = false;
                running = true;
            } else {
                running = !running;
                isPausedByUser = !running;
            }
            localStorage.setItem('ravi_motion', running ? 'active' : 'paused');
            if (running) {
                startLoop();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                drawFrame(true);
            }
            return running;
        },
        isRunning() {
            return running;
        },
        setTheme(themeName) {
            if (THEME_CONFIG[themeName]) {
                currentTheme = themeName;
                drawFrame(true);
            }
        },
    };

    init();
})();
