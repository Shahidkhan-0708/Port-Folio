/* ==========================================================================
   CYBERGLASS SPACE DESIGN SYSTEM - INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Nav Toggle
    const navLinks = document.querySelector('.nav-links');
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('mobile-nav-toggle');
    toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
    const nav = document.querySelector('.navbar');
    const actions = document.querySelector('.nav-actions');
    nav.insertBefore(toggleBtn, actions ? actions : null);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            attrs: {
                class: 'lucide'
            },
            nameAttr: 'data-lucide'
        });
    }

    toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isOpened = navLinks.classList.contains('active');
        toggleBtn.innerHTML = isOpened ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // 3. Theme Toggle Implementation
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        showToast(`Visual array shifted: ${newTheme.toUpperCase()} MODE`, 'success');
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // 4. Typewriter Effect (Professional Titles)
    const words = [
        "Backend Developer",
        "Full Stack Developer",
        "AI Application Developer",
        "Software Engineer",
        "AI & ML Engineering Student"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');
    
    if (typewriterEl) {
        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Delay before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 300; // Delay before typing next word
            }

            setTimeout(type, typeSpeed);
        };
        type();
    }

    // 5. Scroll Active Link & Navbar glass tint
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });

        // Navbar scroll glass intensify
        const navbarContainer = document.querySelector('.navbar-container');
        if (window.scrollY > 80) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }
    });

    // 6. Scroll Triggered Entrance Animations (Reveal)
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 120;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 7. Stat Counters Animation
    const statCards = document.querySelectorAll('.stat-card');
    let animatedStats = false;

    const animateStats = () => {
        if (animatedStats) return;
        
        statCards.forEach(card => {
            const numEl = card.querySelector('.stat-number');
            const targetVal = parseFloat(card.getAttribute('data-target'));
            const suffix = card.getAttribute('data-suffix') || '';
            const prefix = card.getAttribute('data-prefix') || '';
            
            let currentVal = 0;
            const duration = 1500;
            const startTime = performance.now();

            const updateCount = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                currentVal = easeProgress * targetVal;

                if (suffix.includes('/10')) {
                    numEl.textContent = prefix + currentVal.toFixed(1) + suffix;
                } else {
                    numEl.textContent = prefix + Math.floor(currentVal) + (targetVal === 5 ? '+' : targetVal === 3 && prefix === '' ? '+' : '');
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    if (suffix.includes('/10')) {
                        numEl.textContent = prefix + targetVal.toFixed(1) + suffix;
                    } else {
                        numEl.textContent = prefix + targetVal + (targetVal === 5 ? '+' : targetVal === 3 && prefix === '' ? '+' : '');
                    }
                }
            };
            requestAnimationFrame(updateCount);
        });
        animatedStats = true;
    };

    // Trigger stats counter when visible
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        window.addEventListener('scroll', () => {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                animateStats();
            }
        });
    }

    // 8. Interactive 3D Card Hover Effect (Smooth - No Flutter)
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let rafId = null;
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;
        
        const lerp = (start, end, factor) => start + (end - start) * factor;
        
        const animateTilt = () => {
            currentTiltX = lerp(currentTiltX, targetTiltX, 0.08);
            currentTiltY = lerp(currentTiltY, targetTiltY, 0.08);
            
            card.style.transform = `perspective(1000px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;
            
            if (Math.abs(currentTiltX - targetTiltX) > 0.01 || Math.abs(currentTiltY - targetTiltY) > 0.01) {
                rafId = requestAnimationFrame(animateTilt);
            }
        };
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            targetTiltX = ((yc - y) / yc) * 6;
            targetTiltY = ((x - xc) / xc) * 6;
            
            if (!rafId) {
                rafId = requestAnimationFrame(animateTilt);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            // Smoothly return to original position
            card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            currentTiltX = 0;
            currentTiltY = 0;
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = '';
        });
    });

    // 9. Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 10. Project Modal Launcher
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.querySelector('.modal-img');
    const modalTitle = document.querySelector('.modal-title');
    const modalTags = document.querySelector('.modal-tags');
    const modalDesc = document.querySelector('.modal-description');
    const modalClient = document.getElementById('modal-client');
    const modalTimeline = document.getElementById('modal-timeline');
    const modalUrl = document.getElementById('modal-url');

    const projectsData = {
        'growcus': {
            title: 'PROJECT: GROWCUS',
            image: 'assets/project_dashboard.png',
            tags: ['NEXT.JS', 'FASTAPI', 'MONGODB', 'AI AGENT'],
            desc: 'Growcus is a complete AI-driven student tracking platform. Built with a Next.js frontend and an Express backend, it combines predictive drop-out analysis with an embedded chatbot interface powered by Llama models. Supports granular multi-role authentication workflows for Parents, Admins, and Teachers.',
            client: 'Google Built with AI Hackathon',
            timeline: 'Student Dropout Prediction'
        },
        'trustlens': {
            title: 'PROJECT: TRUSTLENS',
            image: 'assets/project_fintech.png',
            tags: ['PYTHON', 'OCR', 'POSTGRESQL', 'REDIS'],
            desc: 'TrustLens is an automated document validation framework. Using advanced OCR parsing and text heuristics, it scores documents for authenticity, caches active verification queries in Redis, and exports real-time trust matrices to a secure PostgreSQL database.',
            client: 'Document Authentication Hub',
            timeline: 'Fake-Score Analysis'
        },
        'clientfinder': {
            title: 'PROJECT: CLIENTFINDER',
            image: 'assets/project_ecommerce.png',
            tags: ['GEMINI AI', 'OPENSTREETMAP', 'EXPRESS'],
            desc: 'ClientFinder automates local market inspections. It correlates geographic nodes from OpenStreetMap with query matrices fed to Gemini AI, compiling ranked leads and commercial opportunities based on user proximity parameters.',
            client: 'Market Prospecting Tool',
            timeline: 'Lead Generation Node'
        },
        'society_system': {
            title: 'PROJECT: SOCIETY SYSTEM',
            image: 'assets/project_dashboard.png',
            tags: ['EXPRESS', 'MONGODB', 'REST API'],
            desc: 'A complete billing transparency portal designed for multi-family residential complexes. Implements resident directories, complaint queues, payment status ledger auditing, and automatic announcement distributions.',
            client: 'Apartment Management Suite',
            timeline: 'Community Transparency'
        },
        'shortlink': {
            title: 'PROJECT: SHORTLINK',
            image: 'assets/project_fintech.png',
            tags: ['REDIS', 'DOCKER', 'NODE.JS'],
            desc: 'ShortLink is a high-speed URL reduction API. Employs memory-backed Redis caching to ensure redirection latency under 15ms. Features secure user authentication tables and exports real-time click analytics.',
            client: 'Traffic Analytics Daemon',
            timeline: 'API Redirection Layer'
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const pId = card.getAttribute('data-project');
            const data = projectsData[pId];
            if (!data) return;

            modalTitle.textContent = data.title;
            modalImg.src = data.image;
            modalDesc.textContent = data.desc;
            modalClient.textContent = data.client;
            modalTimeline.textContent = data.timeline;

            // Render tags
            modalTags.innerHTML = '';
            data.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.classList.add('project-tag');
                tagSpan.textContent = tag;
                modalTags.appendChild(tagSpan);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    };

    modalClose.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 11. Toast Notifications Utility
    const toastContainer = document.querySelector('.toast-container');
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast glass ${type}`;
        
        const icon = type === 'success' ? 'check-circle-2' : 'alert-triangle';
        toast.innerHTML = `
            <i class="toast-icon" data-lucide="${icon}"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastIn var(--transition-normal) reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    };

    // 12. Contact Form Handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            // Get form values
            const name = document.getElementById('identity').value;
            const email = document.getElementById('frequency').value;
            const message = document.getElementById('transmission').value;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Connecting to WhatsApp... <i data-lucide="loader-2" class="animate-spin"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            setTimeout(() => {
                // ==========================================
                // PUT YOUR WHATSAPP NUMBER HERE
                // Format: Country code + number (e.g., 91 for India, no + sign, no spaces)
                const myWhatsAppNumber = "916305235077"; 
                // ==========================================

                // Format the message for WhatsApp
                const waText = encodeURIComponent(`Hi Shahid!\n\nI am ${name} (${email}).\n\n${message}`);
                const waUrl = `https://wa.me/${myWhatsAppNumber}?text=${waText}`;
                
                // Open WhatsApp in a new tab
                window.open(waUrl, '_blank');
                
                showToast('Redirecting to WhatsApp...', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 800);
        });

        // Add subtle glow on input focus
        contactForm.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = 'var(--secondary)';
                input.style.boxShadow = '0 0 10px rgba(0, 245, 255, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = 'var(--border-color)';
                input.style.boxShadow = 'none';
            });
        });
    }

    // 13. Hero Floating Particle Field Effect
    const initParticles = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
        const heroSection = document.getElementById('home');
        if (!heroSection) return;
        heroSection.style.position = 'relative';
        heroSection.insertBefore(canvas, heroSection.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const NUM = 90;

        const resize = () => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const rand = (min, max) => Math.random() * (max - min) + min;

        const spawn = () => ({
            x: rand(0, canvas.width),
            y: rand(0, canvas.height),
            r: rand(0.5, 2.8),
            vx: rand(-0.4, 0.4),
            vy: rand(-0.6, -0.2),
            alpha: rand(0.3, 1),
            color: Math.random() > 0.5 ? '138,43,226' : '0,245,255'
        });

        for (let i = 0; i < NUM; i++) particles.push(spawn());

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.0025;

                if (p.alpha <= 0 || p.y < 0) {
                    particles[i] = spawn();
                    particles[i].y = canvas.height + 5;
                }
            });

            // Faint network connection lines
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        };
        draw();
    };
    initParticles();

    // 14. Section Scroll Reveal Animations
    const sectionElements = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly for sections appearing together
                setTimeout(() => {
                    entry.target.classList.add('section-visible');
                }, index * 100);
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    sectionElements.forEach(section => {
        sectionObserver.observe(section);
    });

    // Also make the hero section visible immediately
    const heroSection2 = document.getElementById('home');
    if (heroSection2) {
        heroSection2.style.opacity = '1';
        heroSection2.style.transform = 'none';
    }
});
