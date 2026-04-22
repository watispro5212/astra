/* ============================================
   ASTRA — main.js
   Mobile nav, scroll effects, animations, accordion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile toggle ── */
  const toggle = document.querySelector('.navbar__toggle');
  const navLinks = document.querySelector('.navbar__links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll animations (IntersectionObserver) ── */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion__item');
      const body = item.querySelector('.accordion__body');
      const content = item.querySelector('.accordion__content');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.accordion__item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion__body').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Stats Counter Animation ── */
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000; // 2 seconds
          const startTime = performance.now();
          
          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * target);
            
            counter.innerText = currentCount + (counter.innerText.includes('+') ? '+' : '');
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
            }
          };
          
          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 1.0 });

    counters.forEach(c => counterObserver.observe(c));
  }

});
