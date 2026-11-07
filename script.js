/**
 * PORTFOLIO - MUHAMMAD LUTHFIY FAKHRIY
 * Electrical Engineer & Industrial Control Specialist
 * Pure Vanilla JavaScript (No Frameworks or Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Current Year Setup
  // =========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 2. Sticky Navbar & Header Blur on Scroll
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const handleScrollNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // =========================================================================
  // 3. Mobile Navigation Menu Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      const isExpanded = menuToggle.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // =========================================================================
  // 4. Scrollspy: Active Navigation Link Highlighting
  // =========================================================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const handleScrollspy = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', handleScrollspy, { passive: true });

  // =========================================================================
  // 5. Animated Stats Number Counters
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // milliseconds
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic calculation
        const easeOutQuad = (t) => t * (2 - t);
        const currentValue = Math.floor(easeOutQuad(progress) * target);

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.stats-container');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }

  // =========================================================================
  // 6. Project Modals (Open, Close & Keyboard Accessibility)
  // =========================================================================
  const openModalBtns = document.querySelectorAll('[data-target-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal-backdrop');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target-modal');
      openModal(targetId);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  // Close when clicking modal backdrop
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // =========================================================================
  // 7. Toast Notification Utility
  // =========================================================================
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  const showToast = (message, duration = 3500) => {
    if (!toast || !toastText) return;
    
    toastText.textContent = message;
    toast.classList.add('active');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  };

  // =========================================================================
  // 8. One-Click Email Copier
  // =========================================================================
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const emailLink = document.getElementById('email-link');

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailLink.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual feedback on button
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `<span>✓ Tersalin!</span>`;
        copyEmailBtn.style.backgroundColor = 'var(--red-primary)';
        copyEmailBtn.style.color = '#ffffff';

        showToast(`Email ${email} berhasil disalin ke clipboard!`);

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
          copyEmailBtn.style.backgroundColor = '';
          copyEmailBtn.style.color = '';
        }, 2500);

      } catch (err) {
        console.error('Gagal menyalin email: ', err);
        showToast(`Silakan salin manual: ${email}`);
      }
    });
  }

  // =========================================================================
  // 9. Contact Form Simulation & Validation
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('btn-reset-form');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm && formSuccess) {
    const validateField = (input, errorId) => {
      const formGroup = input.closest('.form-group');
      const value = input.value.trim();
      let isValid = true;

      if (!value) {
        isValid = false;
      } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
      }

      if (!isValid) {
        formGroup.classList.add('has-error');
      } else {
        formGroup.classList.remove('has-error');
      }

      return isValid;
    };

    // Real-time input clearing of errors
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField = document.getElementById('sender-name');
      const emailField = document.getElementById('sender-email');
      const subjectField = document.getElementById('sender-subject');
      const messageField = document.getElementById('sender-message');

      const isNameValid = validateField(nameField);
      const isEmailValid = validateField(emailField);
      const isSubjectValid = validateField(subjectField);
      const isMessageValid = validateField(messageField);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('Mohon lengkapi seluruh field formulir dengan benar.');
        return;
      }

      // Simulate sending state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span>Mengirim Pesan...</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
      `;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();

        showToast('Pesan Anda telah berhasil dikirim kepada Muhammad Luthfiy Fakhriy!');
      }, 1200);
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        formSuccess.classList.remove('active');
        contactForm.style.display = 'flex';
      });
    }
  }

  // =========================================================================
  // 10. Back to Top Smooth Scroll
  // =========================================================================
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 11. Subtle Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.project-card, .highlight-item, .process-step, .channel-card, .stat-card');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      revealObserver.observe(el);
    });
  }

});
