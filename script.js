/**
 * PORTFOLIO - MUHAMMAD LUTHFIY FAKHRIY
 * Electrical Engineer & Industrial Control Specialist
 * Pure Vanilla JavaScript (Zero External Libraries)
 * Features: Dark/Light Mode Switcher, Background Lightning Engine,
 * Real Email Submission to luthfiyfakhriy24@gmail.com, Mobile Navbar & Modals.
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
  // 2. Dark Mode & Light Mode Theme Switcher
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('mlf_theme') || 'dark';

  const setTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('mlf_theme', theme);
  };

  // Initialize theme
  setTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Mode ${newTheme === 'dark' ? 'Gelap (Hitam & Merah)' : 'Terang (Putih & Biru)'} diaktifkan!`);
    });
  }

  // =========================================================================
  // 3. Electrical Lightning Arc Animation (Canvas Engine)
  // =========================================================================
  const canvas = document.getElementById('lightning-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    let bolts = [];
    let lastLightningTime = 0;

    class LightningBolt {
      constructor(isLightMode) {
        this.isLightMode = isLightMode;
        // Start from random point at top or top corners
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.15);
        this.segments = [];
        this.alpha = 1.0;
        this.fadeSpeed = 0.035;

        // Colors
        if (isLightMode) {
          this.color = '#0284c7';
          this.glowColor = 'rgba(2, 132, 199, 0.6)';
        } else {
          this.color = '#ff4d5a';
          this.glowColor = 'rgba(229, 9, 20, 0.8)';
        }

        this.generateSegments();
      }

      generateSegments() {
        let curX = this.x;
        let curY = this.y;
        const targetY = Math.min(height * 0.85, curY + 250 + Math.random() * 350);
        const steps = 18 + Math.floor(Math.random() * 14);

        for (let i = 0; i < steps; i++) {
          const nextY = curY + (targetY - curY) / (steps - i);
          const nextX = curX + (Math.random() - 0.5) * 55;
          this.segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });

          // Occasional sub-branch
          if (Math.random() < 0.25) {
            const branchLen = 40 + Math.random() * 70;
            const branchAngle = (Math.random() - 0.5) * Math.PI * 0.6;
            this.segments.push({
              x1: nextX,
              y1: nextY,
              x2: nextX + Math.sin(branchAngle) * branchLen,
              y2: nextY + Math.cos(branchAngle) * branchLen,
              isBranch: true
            });
          }

          curX = nextX;
          curY = nextY;
          if (curY >= targetY) break;
        }
      }

      update() {
        this.alpha -= this.fadeSpeed;
      }

      draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.strokeStyle = this.color;
        context.shadowColor = this.glowColor;
        context.shadowBlur = 15;
        context.lineWidth = 2;
        context.globalAlpha = Math.max(0, this.alpha);

        context.beginPath();
        this.segments.forEach(seg => {
          context.moveTo(seg.x1, seg.y1);
          context.lineTo(seg.x2, seg.y2);
        });
        context.stroke();
        context.restore();
      }
    }

    const animateLightning = (time) => {
      ctx.clearRect(0, 0, width, height);

      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const isLightMode = currentTheme === 'light';

      // Spawn lightning at interval (faster in dark mode, slower in light mode)
      const interval = isLightMode ? 6500 : 3800;
      if (time - lastLightningTime > interval && Math.random() < 0.4) {
        bolts.push(new LightningBolt(isLightMode));
        if (!isLightMode && Math.random() < 0.3) {
          // Double bolt for electric storm drama
          setTimeout(() => bolts.push(new LightningBolt(false)), 120);
        }
        lastLightningTime = time;
      }

      // Update & draw bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        bolts[i].update();
        bolts[i].draw(ctx);
        if (bolts[i].alpha <= 0) {
          bolts.splice(i, 1);
        }
      }

      requestAnimationFrame(animateLightning);
    };

    requestAnimationFrame(animateLightning);
  }

  // =========================================================================
  // 4. Sticky Navbar & Blur on Scroll
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const handleScrollNavbar = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // =========================================================================
  // 5. Mobile Navigation Menu Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-only-cv');

  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      const isExpanded = menuToggle.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // =========================================================================
  // 6. Scrollspy: Active Navigation Link Highlighting
  // =========================================================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const mainNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const handleScrollspy = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        mainNavLinks.forEach(link => {
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
  // 7. Animated Stats Number Counters
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }

  // =========================================================================
  // 8. Project Modals (Open, Close & Keyboard Accessibility)
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

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // =========================================================================
  // 9. Toast Notification Utility
  // =========================================================================
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  const showToast = (message, duration = 3800) => {
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
  // 10. One-Click Email Copier
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

        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `<span>✓ Tersalin!</span>`;
        showToast(`Email ${email} berhasil disalin ke clipboard!`);

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2500);

      } catch (err) {
        showToast(`Silakan salin manual: ${email}`);
      }
    });
  }

  // =========================================================================
  // 11. Download CV Notification Feedback
  // =========================================================================
  const cvButtons = document.querySelectorAll('a[download*="CV"]');
  cvButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Mengunduh Curriculum Vitae (PDF) Muhammad Luthfiy Fakhriy...');
    });
  });

  // =========================================================================
  // 12. REAL Email Submission to luthfiyfakhriy24@gmail.com (FormSubmit.co API)
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('btn-reset-form');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm && formSuccess && submitBtn) {
    const validateField = (input) => {
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

    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', async (e) => {
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

      // UI Loading state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span>Mengirim Pesan Nyata ke Email...</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
      `;

      const payload = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim(),
        _subject: `Pesan Portofolio Baru dari ${nameField.value.trim()}: ${subjectField.value.trim()}`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        // Send real HTTP POST to FormSubmit API for luthfiyfakhriy24@gmail.com
        const response = await fetch('https://formsubmit.co/ajax/luthfiyfakhriy24@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('active');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          contactForm.reset();
          showToast('Pesan Anda BERHASIL dikirim langsung ke luthfiyfakhriy24@gmail.com!');
        } else {
          throw new Error('Server FormSubmit merespons status non-OK.');
        }

      } catch (err) {
        console.warn('FormSubmit AJAX fallback:', err);
        // Fallback: direct mailto trigger so no communication is EVER lost
        const mailtoUrl = `mailto:luthfiyfakhriy24@gmail.com?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(
          `Nama: ${payload.name}\nEmail Pengirim: ${payload.email}\nTopik: ${payload.subject}\n\nPesan:\n${payload.message}`
        )}`;
        window.open(mailtoUrl, '_blank');

        contactForm.style.display = 'none';
        formSuccess.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();
        showToast('Pesan disiapkan di aplikasi email Anda menuju luthfiyfakhriy24@gmail.com!');
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        formSuccess.classList.remove('active');
        contactForm.style.display = 'flex';
      });
    }
  }

  // =========================================================================
  // 13. Back to Top Smooth Scroll
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
  // 14. Background Music Player (Stuck - LANY) Logic & Volume Control
  // =========================================================================
  const musicWidget = document.getElementById('music-player-widget');
  const bgAudio = document.getElementById('bg-audio');
  const musicPillBtn = document.getElementById('music-pill-btn');
  const musicMinimizeBtn = document.getElementById('music-minimize-btn');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const btnMute = document.getElementById('btn-mute');
  const iconVolumeHigh = document.getElementById('icon-volume-high');
  const iconVolumeMuted = document.getElementById('icon-volume-muted');
  const volumeSlider = document.getElementById('volume-slider');
  const volumePct = document.getElementById('volume-pct');
  const trackStatus = document.getElementById('track-status');

  if (musicWidget && bgAudio && btnPlayPause) {
    let isPlaying = false;
    let isMuted = false;
    let previousVolume = 0.7;

    // Initial audio volume setup
    bgAudio.volume = 0.7;

    // Toggle Expand / Collapse widget
    musicPillBtn.addEventListener('click', () => {
      musicWidget.classList.add('expanded');
    });

    if (musicMinimizeBtn) {
      musicMinimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        musicWidget.classList.remove('expanded');
      });
    }

    // Play & Pause Control
    const updatePlayState = (playing) => {
      isPlaying = playing;
      if (playing) {
        musicWidget.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        if (trackStatus) trackStatus.textContent = 'NOW PLAYING';
      } else {
        musicWidget.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        if (trackStatus) trackStatus.textContent = 'PAUSED';
      }
    };

    const togglePlay = async () => {
      try {
        if (!isPlaying) {
          await bgAudio.play();
          updatePlayState(true);
          showToast('🎵 Memutar: Stuck — LANY');
        } else {
          bgAudio.pause();
          updatePlayState(false);
          showToast('⏸️ Musik Dijeda');
        }
      } catch (err) {
        console.warn('Playback error or blocked by autoplay policy:', err);
      }
    };

    btnPlayPause.addEventListener('click', togglePlay);

    // Auto Play Immediately on Web Entry (Direct + First-Interaction fallback)
    const attemptAutoPlay = async () => {
      if (isPlaying) return;
      try {
        await bgAudio.play();
        updatePlayState(true);
        removeInteractionListeners();
      } catch (err) {
        // Modern browser policy: awaiting first interaction
      }
    };

    const onFirstUserAction = () => {
      if (!isPlaying) {
        attemptAutoPlay();
      }
    };

    const interactionEvents = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'];
    const addInteractionListeners = () => {
      interactionEvents.forEach(evt => {
        window.addEventListener(evt, onFirstUserAction, { once: true, passive: true });
      });
    };
    const removeInteractionListeners = () => {
      interactionEvents.forEach(evt => {
        window.removeEventListener(evt, onFirstUserAction);
      });
    };

    // Try immediately on load & add first interaction triggers
    attemptAutoPlay();
    window.addEventListener('load', attemptAutoPlay);
    addInteractionListeners();

    // Mute / Unmute Control
    if (btnMute && iconVolumeHigh && iconVolumeMuted) {
      btnMute.addEventListener('click', () => {
        if (!isMuted) {
          isMuted = true;
          previousVolume = bgAudio.volume > 0 ? bgAudio.volume : 0.7;
          bgAudio.volume = 0;
          if (volumeSlider) volumeSlider.value = 0;
          if (volumePct) volumePct.textContent = '0%';
          iconVolumeHigh.style.display = 'none';
          iconVolumeMuted.style.display = 'block';
          showToast('🔇 Musik Dimatikan (Mute)');
        } else {
          isMuted = false;
          bgAudio.volume = previousVolume;
          if (volumeSlider) volumeSlider.value = previousVolume;
          if (volumePct) volumePct.textContent = `${Math.round(previousVolume * 100)}%`;
          iconVolumeHigh.style.display = 'block';
          iconVolumeMuted.style.display = 'none';
          showToast(`🔊 Volume: ${Math.round(previousVolume * 100)}%`);
        }
      });
    }

    // Volume Slider Control
    if (volumeSlider && volumePct) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        bgAudio.volume = val;
        volumePct.textContent = `${Math.round(val * 100)}%`;

        if (val === 0) {
          isMuted = true;
          iconVolumeHigh.style.display = 'none';
          iconVolumeMuted.style.display = 'block';
        } else {
          isMuted = false;
          previousVolume = val;
          iconVolumeHigh.style.display = 'block';
          iconVolumeMuted.style.display = 'none';
        }
      });
    }

    // Keep state in sync if audio is paused by OS/system
    bgAudio.addEventListener('pause', () => updatePlayState(false));
    bgAudio.addEventListener('play', () => updatePlayState(true));
  }

});
