/**
 * SYMBIONT — Generative Organic Particle System
 * Inspired by biodata sonification audio-visual experiences.
 * Creates flowing, bioluminescent spore-like structures on a dark canvas.
 */

(function () {
    'use strict';

    const canvas = document.getElementById('symbiont-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let animationId;
    let time = 0;

    // ── Configuration ──
    const CONFIG = {
        particleCount: 600,
        baseRadius: 1.8,
        maxRadius: 4,
        speed: 0.3,
        turbulence: 1.2,
        mouseRadius: 180,
        mouseForce: 0.08,
        fadeSpeed: 0.012,
        connectionDistance: 90,
        connectionOpacity: 0.06,
        // Color palettes that evolve over time
        palettes: [
            // Pink / Magenta nebula
            [
                { r: 200, g: 50, b: 150 },
                { r: 255, g: 80, b: 180 },
                { r: 180, g: 30, b: 120 },
                { r: 255, g: 120, b: 200 },
            ],
            // Cyan / Teal bioluminescence
            [
                { r: 30, g: 200, b: 200 },
                { r: 50, g: 255, b: 220 },
                { r: 20, g: 160, b: 180 },
                { r: 80, g: 230, b: 255 },
            ],
            // Golden / Amber spores
            [
                { r: 255, g: 180, b: 50 },
                { r: 200, g: 140, b: 30 },
                { r: 255, g: 220, b: 100 },
                { r: 180, g: 120, b: 20 },
            ],
            // Violet / Purple drift
            [
                { r: 120, g: 60, b: 220 },
                { r: 180, g: 80, b: 255 },
                { r: 100, g: 40, b: 200 },
                { r: 200, g: 120, b: 255 },
            ],
        ],
        paletteTransitionDuration: 8000, // ms per palette
    };

    // ── Resize ──
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // ── Noise functions (Simplex-like) ──
    function noise2D(x, y) {
        const sin1 = Math.sin(x * 0.8 + y * 0.6);
        const sin2 = Math.sin(y * 1.2 - x * 0.4 + 2.1);
        const sin3 = Math.sin(x * 0.3 + y * 0.9 + 4.2);
        return (sin1 + sin2 + sin3) / 3;
    }

    function flowFieldAngle(x, y, t) {
        const scale = 0.003;
        const n = noise2D(x * scale + t * 0.2, y * scale + t * 0.15);
        return n * Math.PI * 2 * CONFIG.turbulence;
    }

    // ── Get current color palette (interpolated) ──
    function getCurrentPalette() {
        const totalPalettes = CONFIG.palettes.length;
        const elapsed = time * 16; // approximate ms
        const progress = (elapsed % (CONFIG.paletteTransitionDuration * totalPalettes));
        const currentIndex = Math.floor(progress / CONFIG.paletteTransitionDuration) % totalPalettes;
        const nextIndex = (currentIndex + 1) % totalPalettes;
        const t = (progress % CONFIG.paletteTransitionDuration) / CONFIG.paletteTransitionDuration;

        const current = CONFIG.palettes[currentIndex];
        const next = CONFIG.palettes[nextIndex];

        return current.map((c, i) => ({
            r: c.r + (next[i].r - c.r) * t,
            g: c.g + (next[i].g - c.g) * t,
            b: c.b + (next[i].b - c.b) * t,
        }));
    }

    // ── Particle class ──
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Spawn across the full viewport
            this.x = Math.random() * width;
            this.y = Math.random() * height;

            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;

            this.baseSize = CONFIG.baseRadius + Math.random() * (CONFIG.maxRadius - CONFIG.baseRadius);
            this.size = this.baseSize;
            this.life = 1;
            this.decay = CONFIG.fadeSpeed * (0.5 + Math.random() * 0.5);
            this.colorIndex = Math.floor(Math.random() * 4);
            this.phase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;

            // Orbital motion parameters — wider spread for fullscreen
            this.orbitRadius = 30 + Math.random() * 150;
            this.orbitSpeed = (0.0008 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
            this.orbitAngle = Math.random() * Math.PI * 2;
            this.orbitCenterX = this.x;
            this.orbitCenterY = this.y;
        }

        update() {

            // Flow field influence
            const angle = flowFieldAngle(this.x, this.y, time * 0.001);
            const flowX = Math.cos(angle) * CONFIG.speed * 0.4;
            const flowY = Math.sin(angle) * CONFIG.speed * 0.4;

            // Orbital motion
            this.orbitAngle += this.orbitSpeed;
            const targetX = this.orbitCenterX + Math.cos(this.orbitAngle) * this.orbitRadius;
            const targetY = this.orbitCenterY + Math.sin(this.orbitAngle) * this.orbitRadius;

            this.vx += (targetX - this.x) * 0.0005 + flowX * 0.1;
            this.vy += (targetY - this.y) * 0.0005 + flowY * 0.1;

            // Mouse interaction
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.mouseRadius) {
                    const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
                    this.vx += dx * force * 0.5;
                    this.vy += dy * force * 0.5;
                    // Particles glow brighter near mouse
                    this.size = this.baseSize * (1 + (1 - dist / CONFIG.mouseRadius) * 1.5);
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                }
            } else {
                this.size += (this.baseSize - this.size) * 0.05;
            }

            // Damping
            this.vx *= 0.97;
            this.vy *= 0.97;

            this.x += this.vx;
            this.y += this.vy;

            // Pulse
            this.phase += this.pulseSpeed;
            const pulse = 0.7 + 0.3 * Math.sin(this.phase);

            // Life decay
            this.life -= this.decay * 0.3;

            // Reset if dead or off-screen
            if (this.life <= 0 ||
                this.x < -100 || this.x > width + 100 ||
                this.y < -100 || this.y > height + 100) {
                this.reset();
            }

            return pulse;
        }

        draw(palette, pulse) {
            const color = palette[this.colorIndex];
            const alpha = this.life * pulse * 0.6;

            if (alpha <= 0.01) return;

            // Outer glow
            const glowSize = this.size * 4;
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, glowSize
            );
            gradient.addColorStop(0, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha * 0.3})`);
            gradient.addColorStop(0.4, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha * 0.1})`);
            gradient.addColorStop(1, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core bright point
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255, Math.round(color.r + 60))}, ${Math.min(255, Math.round(color.g + 60))}, ${Math.min(255, Math.round(color.b + 60))}, ${alpha * 0.8})`;
            ctx.fill();
        }
    }

    // ── Draw connections between nearby particles ──
    function drawConnections(palette) {
        const maxDist = CONFIG.connectionDistance;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            if (a.life < 0.3) continue;

            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                if (b.life < 0.3) continue;

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / maxDist) * CONFIG.connectionOpacity * a.life * b.life;

                    if (alpha < 0.005) continue;

                    const colorA = palette[a.colorIndex];
                    const colorB = palette[b.colorIndex];
                    const midR = Math.round((colorA.r + colorB.r) / 2);
                    const midG = Math.round((colorA.g + colorB.g) / 2);
                    const midB = Math.round((colorA.b + colorB.b) / 2);

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${midR}, ${midG}, ${midB}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // ── Central glow (nebula core) ──
    function drawCentralGlow(palette) {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.35;
        const breathe = 1 + 0.08 * Math.sin(time * 0.0008);
        const r = baseRadius * breathe;

        const color = palette[0];
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.04)`);
        gradient.addColorStop(0.5, `rgba(${Math.round(color.r * 0.5)}, ${Math.round(color.g * 0.5)}, ${Math.round(color.b * 0.5)}, 0.02)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // ── Mouse glow effect ──
    function drawMouseGlow(palette) {
        if (!mouse.active) return;

        const color = palette[1];
        const gradient = ctx.createRadialGradient(
            mouse.x, mouse.y, 0,
            mouse.x, mouse.y, CONFIG.mouseRadius
        );
        gradient.addColorStop(0, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.06)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CONFIG.mouseRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // ── Main animation loop ──
    function animate() {
        // Semi-transparent clear for motion trails
        ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
        ctx.fillRect(0, 0, width, height);

        time++;

        const palette = getCurrentPalette();

        // Draw central glow
        drawCentralGlow(palette);

        // Draw mouse glow
        drawMouseGlow(palette);

        // Draw connections (only check a subset for performance)
        drawConnections(palette);

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            const pulse = particles[i].update();
            particles[i].draw(palette, pulse);
        }

        animationId = requestAnimationFrame(animate);
    }

    // ── Initialize ──
    function init() {
        resize();

        // Clear canvas fully initially
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }

        animate();
    }

    // ── Event Listeners ──
    window.addEventListener('resize', () => {
        resize();
    });

    // Listen on window since canvas has pointer-events: none
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Reduce particles on mobile for performance
    if (window.innerWidth < 768) {
        CONFIG.particleCount = 250;
        CONFIG.connectionDistance = 60;
    }

    // Start
    init();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
})();
