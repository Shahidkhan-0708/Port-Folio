/* ==========================================================================
   GSAP + LENIS ANIMATION ENGINE — animations.js
   Cinematic animations for Shahid Khan's portfolio.
   ========================================================================== */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    gsap.registerPlugin(ScrollTrigger);

    // ========================================================================
    // 1. LOADING SCREEN — Cinematic Entrance
    // ========================================================================
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBtn = document.getElementById('loading-btn');
    const loadingWrap = document.getElementById('loading-wrap');
    const loadingCounter = document.getElementById('loading-counter');

    let pageReady = false;

    function revealPage() {
        if (pageReady) return;
        pageReady = true;

        document.body.classList.remove('loading');
        document.body.style.overflow = '';

        if (loadingScreen) {
            loadingScreen.classList.add('done');
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                }
            });
        }

        // Small delay then animate hero
        setTimeout(animateHeroEntrance, 200);
    }

    // Counter animation 0 → 100
    if (loadingCounter) {
        let count = { val: 0 };
        gsap.to(count, {
            val: 100,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                loadingCounter.textContent = Math.floor(count.val);
            }
        });
    }

    // Click button to enter
    if (loadingBtn && loadingWrap) {
        loadingBtn.addEventListener('click', () => {
            loadingWrap.classList.add('expanding');
            setTimeout(revealPage, 900);
        });
    }

    // SAFETY: auto-reveal after 5 seconds if user doesn't click
    setTimeout(() => {
        if (!pageReady) {
            if (loadingWrap) loadingWrap.classList.add('expanding');
            setTimeout(revealPage, 500);
        }
    }, 5000);

    // Lock scroll initially
    document.body.classList.add('loading');

    // ========================================================================
    // 2. NATIVE SCROLLING ENABLED
    // (Removed Lenis to fix severe input lag and ensure instantaneous response)
    // ========================================================================

    // ========================================================================
    // 3. HERO ENTRANCE ANIMATION
    // ========================================================================
    function animateHeroEntrance() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Navbar slides down
        tl.from('.navbar-container', {
            y: -80,
            opacity: 0,
            duration: 0.6,
        });

        // Subtitle
        tl.from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.6,
        }, '-=0.2');

        // Title word-by-word
        const heroTitle = document.getElementById('hero-headline');
        if (heroTitle && !heroTitle.dataset.split) {
            heroTitle.dataset.split = 'true';
            const text = heroTitle.textContent;
            const words = text.split(' ');
            heroTitle.innerHTML = words.map(w =>
                `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="hero-word" style="display:inline-block;">${w}</span></span>`
            ).join(' ');

            tl.from('.hero-word', {
                y: '100%',
                duration: 0.7,
                stagger: 0.05,
            }, '-=0.3');
        }

        // Description
        tl.from('.hero-description-card', {
            y: 25,
            opacity: 0,
            duration: 0.6,
        }, '-=0.4');

        // Buttons
        tl.from('.hero-actions .btn', {
            y: 15,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
        }, '-=0.3');

        // AI Core
        tl.from('.ai-core-container', {
            scale: 0.6,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.2)',
        }, '-=0.7');
    }

    // ========================================================================
    // 4. SCROLL-TRIGGERED ANIMATIONS (using gsap.from with ScrollTrigger)
    // ========================================================================

    // Helper: safe scroll animation
    function scrollAnim(selector, fromVars, stagger = false) {
        gsap.utils.toArray(selector).forEach((el, i) => {
            const vars = {
                ...fromVars,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            };
            if (stagger) vars.delay = i * 0.06;
            gsap.from(el, vars);
        });
    }

    // Section headers
    scrollAnim('.section-header', { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' });

    // Stat cards
    scrollAnim('.stat-card', { y: 50, opacity: 0, duration: 0.5, ease: 'power3.out' }, true);

    // Skill cards
    scrollAnim('.skill-card', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.3)' }, true);

    // Project cards — alternate directions
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            x: i % 2 === 0 ? -60 : 60,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
        });
    });

    // Achievement items
    scrollAnim('.achievement-item, .cert-card', { y: 35, opacity: 0, duration: 0.5, ease: 'power2.out' }, true);

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
        });
    });

    // Contact form
    const contactWrap = document.querySelector('.contact-wrapper');
    if (contactWrap) {
        gsap.from(contactWrap, {
            scrollTrigger: {
                trigger: contactWrap,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            scale: 0.92,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
        });
    }

    // Footer
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.from(footer, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 95%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
        });
    }

    // ========================================================================
    // 5. PARALLAX — Atmosphere orbs
    // ========================================================================
    gsap.utils.toArray('.glow-orb').forEach(orb => {
        gsap.to(orb, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
            },
            y: -150,
            ease: 'none',
        });
    });

    // ========================================================================
    // 6. MAGNETIC BUTTONS
    // ========================================================================
    document.querySelectorAll('.btn, .loading-btn, .ai-terminal-toggle').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    });

} else {
    console.warn('GSAP not loaded. Animations disabled.');
    // Fallback: hide loading screen immediately
    const ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';
    document.body.classList.remove('loading');
}
