/* ==========================================================================
   OQLO.AI - Main Application Logic (Optimized, High-Performance)
   Loading Screen, Navigation Spy, L2 Lexical Links, Hand Tool Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Minimal Loading Screen Animation
  const loadingScreen = document.getElementById('loading-screen');
  const progressFill = document.querySelector('.loader-progress-fill');
  const loaderDrone = document.querySelector('.loader-drone');
  const loaderPercent = document.getElementById('loader-percent');

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 3.5;
    if (progress > 100) progress = 100;

    if (progressFill) progressFill.style.width = progress + '%';
    if (loaderDrone) loaderDrone.style.left = progress + '%';
    if (loaderPercent) loaderPercent.textContent = Math.round(progress) + '%';

    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }
      }, 300);
    }
  }, 25);

  // 2. Navigation Active State & One-Click Smooth Scrolling
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (isScrolling) return;

    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (current === 'hero' && href === '#hero')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Persistent Dropdown State Manager:
  // Dropdown stays open until the pointer moves to another nav option or leaves navbar
  let activeDropdownItem = null;
  let closeTimer = null;

  function setActiveDropdown(item) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (activeDropdownItem && activeDropdownItem !== item) {
      activeDropdownItem.classList.remove('active-dropdown', 'open');
    }

    activeDropdownItem = item;
    if (activeDropdownItem) {
      activeDropdownItem.classList.add('active-dropdown');
    }
  }

  function closeAllDropdowns() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    navItems.forEach(item => item.classList.remove('active-dropdown', 'open'));
    activeDropdownItem = null;
  }

  // Bind pointer & click events on nav-items
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const chevron = item.querySelector('.nav-chevron');
    const dropdown = item.querySelector('.l2-dropdown');

    if (dropdown) {
      // When pointer enters: immediately open and stay open
      item.addEventListener('mouseenter', () => {
        setActiveDropdown(item);
      });

      // When pointer is inside dropdown: stay active
      dropdown.addEventListener('mouseenter', () => {
        setActiveDropdown(item);
      });
    } else {
      // Hovering an item without a dropdown (e.g. Home) closes any other dropdown
      item.addEventListener('mouseenter', () => {
        setActiveDropdown(null);
      });
    }

    if (link) {
      link.addEventListener('click', function (e) {
        // Clicking chevron toggles this dropdown
        if (e.target === chevron || e.target.classList.contains('nav-chevron')) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.contains('active-dropdown');
          if (isOpen) {
            closeAllDropdowns();
          } else {
            setActiveDropdown(item);
          }
          return;
        }

        // 1-Click section navigation
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            isScrolling = true;
            closeAllDropdowns();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const yOffset = -90;
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            setTimeout(() => {
              isScrolling = false;
            }, 700);
          }
        }
      });
    }
  });

  // Handle pointer leaving the entire navbar wrapper
  const navContainer = document.querySelector('.navbar-container');
  if (navContainer) {
    navContainer.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        closeAllDropdowns();
      }, 350); // Grace period before closing
    });

    navContainer.addEventListener('mouseenter', () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });
  }

  // Handle L2 sub-links (1-click navigation & instant close)
  const l2Links = document.querySelectorAll('.l2-link');
  l2Links.forEach(l2 => {
    l2.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          isScrolling = true;
          closeAllDropdowns();

          const parentNavItem = this.closest('.nav-item');
          if (parentNavItem) {
            const parentLink = parentNavItem.querySelector('.nav-link');
            if (parentLink) {
              navLinks.forEach(l => l.classList.remove('active'));
              parentLink.classList.add('active');
            }
          }

          const yOffset = -90;
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });

          setTimeout(() => {
            isScrolling = false;
          }, 700);
        }
      }
    });
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
      closeAllDropdowns();
    }
  });

  // 4. L2 Hand Tool Gesture Interactions (Fade hint on user touch/drag)
  const heroCardWrap = document.getElementById('hero-card-wrap');
  const heroHandIndicator = document.getElementById('hero-hand-indicator');
  if (heroCardWrap && heroHandIndicator) {
    heroCardWrap.addEventListener('pointerdown', () => {
      heroHandIndicator.classList.add('fade-out');
    }, { once: true });
  }

  const twinCardWrap = document.getElementById('twin-card-wrap');
  const twinHandIndicator = document.getElementById('twin-hand-indicator');
  if (twinCardWrap && twinHandIndicator) {
    twinCardWrap.addEventListener('pointerdown', () => {
      twinHandIndicator.classList.add('fade-out');
    }, { once: true });
  }

  // 5. L2 Spatial Toolbar Button Handling
  // 5. L2 Spatial Toolbar Button Handling (Item 3)
  const spatialToolBtns = document.querySelectorAll('.spatial-tool-btn');
  const toolIndicatorText = document.getElementById('hero-hand-indicator-text');
  spatialToolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      spatialToolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const toolId = btn.id; // 'tool-hand', 'tool-measure', 'tool-pin'
      if (window.setHeroToolMode) {
        if (toolId === 'tool-hand') {
          window.setHeroToolMode('hand');
          if (toolIndicatorText) toolIndicatorText.textContent = 'Pan & Rotate with L2 Hand Tool';
        } else if (toolId === 'tool-measure') {
          window.setHeroToolMode('measure');
          if (toolIndicatorText) toolIndicatorText.textContent = '3D Laser Measure Active: Click to Dimension';
        } else if (toolId === 'tool-pin') {
          window.setHeroToolMode('pin');
          if (toolIndicatorText) toolIndicatorText.textContent = 'Survey Marker Pin Active: Click to Drop Benchmark';
        }
      }
    });
  });

  // 6. Section 1: Drone Survey Dual-Layer Scanner Wipe (Item 2)
  const layerTabs = document.querySelectorAll('.layer-tab-btn');
  const layerImg = document.getElementById('survey-layer-image');
  const baseImg = document.getElementById('survey-layer-base');
  const layerMeta = document.getElementById('layer-meta-text');
  const baseMeta = document.getElementById('layer-meta-base');
  const stageViewer = document.getElementById('layer-stage-viewer');

  const layerData = {
    ortho: {
      baseSrc: 'assets/constn_ortho.png?v=5',
      revealSrc: 'assets/constn_ortho.png?v=5',
      isRaw: true,
      baseMeta: 'Raw Aerial Capture (Standard Uncalibrated)',
      revealMeta: 'Scanned: True Orthomosaic (Below 5 cm GSD)'
    },
    pointcloud: {
      baseSrc: 'assets/constn_mesh.png?v=5',
      revealSrc: 'assets/constn_pointcloud.png?v=5',
      isRaw: false,
      baseMeta: 'Base: 3D Textured Surface Mesh',
      revealMeta: 'Scanned: Dense 3D Point Cloud (LiDAR / Photogrammetry)'
    },
    dsm: {
      baseSrc: 'assets/constn_ortho.png?v=5',
      revealSrc: 'assets/constn_dsm.png?v=5',
      isRaw: false,
      baseMeta: 'Base: True Orthomosaic (Below 5 cm GSD)',
      revealMeta: 'Scanned: DSM Elevation Hypsometry Heatmap'
    },
    contours: {
      baseSrc: 'assets/constn_ortho.png?v=5',
      revealSrc: 'assets/constn_contours.png?v=5',
      isRaw: false,
      baseMeta: 'Base: True Orthomosaic (Below 5 cm GSD)',
      revealMeta: 'Scanned: Topographic Elevation Contours (0.5m Intervals)'
    },
    mesh: {
      baseSrc: 'assets/constn_ortho.png?v=6',
      revealSrc: 'assets/constn_mesh.png?v=6',
      isRaw: false,
      baseMeta: 'Base: True Orthomosaic (Below 5 cm GSD)',
      revealMeta: 'Scanned: 3D Textured Mesh (Digital Twin)'
    }
  };

  function applyLayer(layerKey) {
    const data = layerData[layerKey];
    if (!data) return;

    if (layerImg) {
      layerImg.style.opacity = '0.5';
    }
    if (baseImg) {
      baseImg.style.opacity = '0.5';
    }

    setTimeout(() => {
      if (baseImg) {
        baseImg.src = data.baseSrc;
        if (data.isRaw) {
          baseImg.classList.add('raw-filter');
        } else {
          baseImg.classList.remove('raw-filter');
        }
        baseImg.style.opacity = '1';
      }

      if (layerImg) {
        layerImg.src = data.revealSrc;
        layerImg.style.opacity = '1';
      }

      if (baseMeta) {
        const spanText = baseMeta.querySelector('span:last-child') || baseMeta;
        spanText.textContent = data.baseMeta;
      }

      if (layerMeta) {
        const spanText = layerMeta.querySelector('span:last-child') || layerMeta;
        spanText.textContent = data.revealMeta;
      }
    }, 120);
  }

  layerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      layerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const layerKey = tab.getAttribute('data-layer');
      applyLayer(layerKey);
    });
  });

  // Initialize with the currently active tab
  const initialActiveTab = document.querySelector('.layer-tab-btn.active');
  if (initialActiveTab) {
    const initialKey = initialActiveTab.getAttribute('data-layer') || 'ortho';
    applyLayer(initialKey);
  }

  // Smooth, Lightweight Laser Scanner Sweeping Loop (Item 2)
  if (stageViewer) {
    let scanPos = 20;
    let scanDir = 1;
    let isUserHovering = false;
    let lastScanTick = performance.now();

    function updateScanSweep(now) {
      requestAnimationFrame(updateScanSweep);
      if (isUserHovering) return; // Allow manual hover inspection

      const dt = Math.min((now - lastScanTick) / 1000, 0.1);
      lastScanTick = now;

      scanPos += scanDir * (dt * 22); // smooth 22%/sec sweep speed
      if (scanPos >= 92) {
        scanPos = 92;
        scanDir = -1;
      } else if (scanPos <= 8) {
        scanPos = 8;
        scanDir = 1;
      }
      stageViewer.style.setProperty('--scanner-x', scanPos.toFixed(1) + '%');
    }
    requestAnimationFrame(updateScanSweep);

    // Interactive pointer inspection: user can move cursor to wipe between raw building and 3D mesh
    stageViewer.addEventListener('pointermove', (e) => {
      isUserHovering = true;
      const rect = stageViewer.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      stageViewer.style.setProperty('--scanner-x', pct.toFixed(1) + '%');
      scanPos = pct;
    });

    stageViewer.addEventListener('pointerleave', () => {
      isUserHovering = false;
      lastScanTick = performance.now();
    });
  }

  // 7. Hero 3D Mode Pills
  const heroModePills = document.querySelectorAll('.mode-pill-btn');
  heroModePills.forEach(pill => {
    pill.addEventListener('click', () => {
      heroModePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mode = pill.getAttribute('data-mode');
      if (window.setHero3DMode) {
        window.setHero3DMode(mode);
      }
    });
  });

  // 8. Get A Demo Modal Handling
  const demoModal = document.getElementById('demo-modal');
  const openDemoBtns = document.querySelectorAll('.open-demo-btn');
  const closeDemoBtn = document.getElementById('close-demo-modal');
  const demoForm = document.getElementById('demo-form');
  const formSuccess = document.getElementById('form-success-msg');

  function openModal() {
    if (demoModal) {
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (demoModal) {
      demoModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeDemoBtn) {
    closeDemoBtn.addEventListener('click', closeModal);
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      demoForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';

      setTimeout(() => {
        closeModal();
        setTimeout(() => {
          demoForm.reset();
          demoForm.style.display = 'block';
          if (formSuccess) formSuccess.style.display = 'none';
        }, 500);
      }, 2500);
    });
  }

  // 9. Privacy Policy & Terms & Conditions Modals (Item 6)
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const closePrivacyBtn = document.getElementById('close-privacy-modal');
  const closeTermsBtn = document.getElementById('close-terms-modal');

  function openLegalModal(m) {
    if (m) {
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLegalModal(m) {
    if (m) {
      m.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(privacyModal);
    });
  }

  if (closePrivacyBtn) {
    closePrivacyBtn.addEventListener('click', () => closeLegalModal(privacyModal));
  }

  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeLegalModal(privacyModal);
    });
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(termsModal);
    });
  }

  if (closeTermsBtn) {
    closeTermsBtn.addEventListener('click', () => closeLegalModal(termsModal));
  }

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeLegalModal(termsModal);
    });
  }
});
