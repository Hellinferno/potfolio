// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Link Lenis to GSAP ScrollTrigger
// This ensures that GSAP animations are synced with the smooth scroll
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor Logic ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, .skill-category, .edu-block');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let followerX = window.innerWidth / 2;
let followerY = window.innerHeight / 2;

// Track mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
});

// Ease follower
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    }
});

// Hover Effects
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('active');
        if (cursorFollower) cursorFollower.classList.add('active');
    });
    
    target.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('active');
        if (cursorFollower) cursorFollower.classList.remove('active');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = 0;
    if (cursorFollower) cursorFollower.style.opacity = 0;
});

document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = 1;
    if (cursorFollower) cursorFollower.style.opacity = 1;
});


// --- Scroll Animations (GSAP) ---
const fadeUpElements = document.querySelectorAll('.fade-up');

fadeUpElements.forEach((element) => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%", // Animation starts when top of element hits 85% of viewport height
            toggleActions: "play none none reverse" 
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    });
});

// Magnetic effect on Project Cards (Parallax on hover)
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        // Move the glow to follow the mouse
        const glow = card.querySelector('.project-glow');
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        }
    });

    // Reset glow when leaving
    card.addEventListener('mouseleave', () => {
        const glow = card.querySelector('.project-glow');
        if (glow) {
            glow.style.left = `50%`;
            glow.style.top = `50%`;
        }
    });
});

// Navbar blending effect on scroll
const navbar = document.querySelector('.navbar');
if(navbar) {
    ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {className: 'navbar-scrolled', targets: '.navbar'}
    });
}
