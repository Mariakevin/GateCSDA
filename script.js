/* ========================================
   GATE CS & DA 2027 Study Plan - Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === COUNTDOWN TIMER ===
    function updateCountdown() {
        const examDate = new Date('2027-02-06');
        const today = new Date();
        const diff = examDate - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const el = document.getElementById('countdownNumber');
        if (el) {
            el.textContent = days > 0 ? days : 0;
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // === THEME TOGGLE ===
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('gate-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('gate-theme', next);
    });

    // === COLLAPSIBLE PHASES ===
    document.querySelectorAll('.phase-header').forEach(header => {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');

        const togglePhase = () => {
            const targetId = header.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const block = header.closest('.phase-block');

            if (content.classList.contains('open')) {
                content.classList.remove('open');
                block.classList.add('collapsed');
            } else {
                content.classList.add('open');
                block.classList.remove('collapsed');
            }
        };

        header.addEventListener('click', togglePhase);
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePhase();
            }
        });
    });

    // === CHECKLIST WITH LOCALSTORAGE ===
    function loadCheckboxes() {
        document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
            const key = cb.getAttribute('data-key');
            if (key && localStorage.getItem('gate-check-' + key) === 'true') {
                cb.checked = true;
            }

            cb.addEventListener('change', () => {
                const k = cb.getAttribute('data-key');
                if (k) {
                    localStorage.setItem('gate-check-' + k, cb.checked ? 'true' : 'false');
                }
                // Animate the check item
                const label = cb.closest('.check-item');
                if (label) {
                    label.style.transform = 'scale(0.97)';
                    setTimeout(() => { label.style.transform = ''; }, 150);
                }
                updateProgress();
            });
        });
    }
    loadCheckboxes();

    // === PROGRESS TRACKER ===
    function updateProgress() {
        const allCheckboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
        const total = allCheckboxes.length;
        const checked = document.querySelectorAll('.check-item input[type="checkbox"]:checked').length;
        const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

        const bar = document.getElementById('progressBar');
        const text = document.getElementById('progressText');
        if (bar) bar.style.width = percent + '%';
        if (text) text.textContent = percent + '% (' + checked + '/' + total + ')';

        // Update progress ring
        const ring = document.querySelector('.progress-ring-fill');
        const ringText = document.getElementById('progressRingText');
        if (ring) {
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (percent / 100) * circumference;
            ring.style.strokeDashoffset = offset;
        }
        if (ringText) ringText.textContent = percent + '%';
    }
    updateProgress();

    // === SIDEBAR ACTIVE STATE (Intersection Observer) ===
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // === HAMBURGER MENU ===
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const scrim = document.getElementById('sidebarScrim');

    function closeSidebar() {
        hamburger.classList.remove('open');
        sidebar.classList.remove('open');
        scrim.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        sidebar.classList.toggle('open');
        scrim.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        if (window.innerWidth <= 900) {
            sidebar.setAttribute('aria-hidden', !isOpen);
        }
    });

    scrim.addEventListener('click', closeSidebar);

    // Close sidebar when clicking a nav link on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                closeSidebar();
            }
            // Scroll with offset for fixed sidebar
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // Close sidebar when clicking outside on mobile (scrim handles most cases)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && !scrim.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Reset sidebar state on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            sidebar.setAttribute('aria-hidden', 'false');
            scrim.classList.remove('active');
        } else if (!sidebar.classList.contains('open')) {
            sidebar.setAttribute('aria-hidden', 'true');
        }
    });

    // === BACK TO TOP ===
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
