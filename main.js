/* ==========================================================================
   GREEN IMPIANTI SrlS - Official Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navbar & Scroll Top ---
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      scrollTopBtn.classList.add('show');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn.classList.remove('show');
    }

    // Active Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul a[href^="#"]');
    let currentId = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 2. Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // --- 3. Interactive Tabs: Chi Siamo ---
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabPanes = document.querySelectorAll('.about-tab-pane');

  aboutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      aboutTabBtns.forEach(b => b.classList.remove('active'));
      aboutTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --- 4. Bento Gallery Filtering & Lightbox ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const bentoItems = document.querySelectorAll('.bento-item');

  const getVisibleItems = () => {
    const visible = Array.from(bentoItems).filter(item => !item.classList.contains('hidden'));
    return visible.length > 0 ? visible : Array.from(bentoItems);
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      bentoItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        const cats = cat.split(/\s+/);
        if (filter === 'all' || cats.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- 5. Enhanced Lightbox (Modal + Prev/Next) ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeIndex = 0;

  const updateLightbox = (index) => {
    const currentItems = getVisibleItems();
    if (currentItems.length === 0) return;
    if (index < 0) index = currentItems.length - 1;
    if (index >= currentItems.length) index = 0;
    activeIndex = index;

    const item = currentItems[activeIndex];
    if (!item) return;
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || item.querySelector('h4').textContent;
    const desc = item.getAttribute('data-desc') || '';

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxCounter.textContent = (activeIndex + 1) + ' / ' + currentItems.length;
  };

  bentoItems.forEach((item) => {
    item.addEventListener('click', () => {
      const currentItems = getVisibleItems();
      const index = currentItems.indexOf(item);
      updateLightbox(index >= 0 ? index : 0);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightbox(activeIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightbox(activeIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(activeIndex + 1);
  });

  // --- 6. Contact Form Processing (Direct Delivery to greenimpianti225@gmail.com) ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const formStatus = document.getElementById('form-status-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.btn-form-submit');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      const nome = contactForm.nome.value.trim();
      const cognome = contactForm.cognome.value.trim();
      const email = contactForm.email.value.trim();
      const telefono = contactForm.telefono.value.trim();
      const servizio = contactForm.servizio.value;
      const messaggio = contactForm.messaggio.value.trim();
      const privacy = contactForm.privacy ? contactForm.privacy.checked : true;

      if (!nome || !cognome || !email || !telefono || !servizio || !messaggio) {
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status-alert error';
          formStatus.innerHTML = '<i class="fas fa-triangle-exclamation"></i><span>Per favore compila tutti i campi obbligatori contrassegnati con (*).</span>';
        } else {
          alert('Per favore compila tutti i campi obbligatori (*).');
        }
        return;
      }

      if (!privacy) {
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status-alert error';
          formStatus.innerHTML = '<i class="fas fa-triangle-exclamation"></i><span>È necessario autorizzare il trattamento dei dati personali (GDPR).</span>';
        }
        return;
      }

      // Set loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inoltro a greenimpianti225@gmail.com...';
      }

      if (formStatus) {
        formStatus.style.display = 'flex';
        formStatus.className = 'form-status-alert loading';
        formStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Invio della richiesta all\'indirizzo <strong>greenimpianti225@gmail.com</strong> in corso...</span>';
      }

      const mailtoLink = 'mailto:greenimpianti225@gmail.com?subject=' +
        encodeURIComponent('Richiesta Preventivo [' + servizio + '] - ' + nome + ' ' + cognome) +
        '&body=' + encodeURIComponent(
          'Nuova richiesta preventivo da sito web Green Impianti SrlS:\n\n' +
          'Nome: ' + nome + ' ' + cognome + '\n' +
          'Email Mittente: ' + email + '\n' +
          'Telefono: ' + telefono + '\n' +
          'Tipologia Intervento: ' + servizio + '\n\n' +
          'Dettagli del Progetto:\n' + messaggio + '\n\n' +
          'Destinazione: greenimpianti225@gmail.com'
        );

      try {
        const formData = new FormData(contactForm);
        formData.set('_subject', 'Nuova Richiesta Preventivo [' + servizio + '] - ' + nome + ' ' + cognome);
        formData.set('_replyto', email);

        // Send via AJAX to FormSubmit endpoint configured for greenimpianti225@gmail.com
        const response = await fetch('https://formsubmit.co/ajax/greenimpianti225@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.style.display = 'flex';
            formStatus.className = 'form-status-alert success';
            formStatus.innerHTML = '<i class="fas fa-circle-check" style="color:#10b981;font-size:1.3rem;"></i><span><strong>Richiesta inoltrata con successo!</strong> L\'email è stata recapitata all\'ufficio tecnico (<em>greenimpianti225@gmail.com</em>). Ti risponderemo con un\'analisi preliminare entro 24 ore.</span>';
          }
          if (toast) {
            const toastSpan = toast.querySelector('span');
            if (toastSpan) toastSpan.textContent = 'Richiesta inoltrata con successo a greenimpianti225@gmail.com!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 6000);
          }
          contactForm.reset();
        } else {
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        // Fallback for adblocker/offline/CORS restrictions: Open direct email client prefilled to greenimpianti225@gmail.com
        console.warn('Fallback email delivery:', err);
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status-alert fallback';
          formStatus.innerHTML = '<i class="fas fa-envelope-circle-check"></i><span>Apertura client di posta per l\'invio a <strong>greenimpianti225@gmail.com</strong>... Se il messaggio non si apre, puoi scrivere direttamente a <a href="' + mailtoLink + '" style="color:#007a33;text-decoration:underline;font-weight:700;">greenimpianti225@gmail.com</a>.</span>';
        }
        window.location.href = mailtoLink;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
  // Close mobile menu on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }
  });

  // --- 7. Background Lightning Atmospheric Canvas ---
  function initLightningBackground() {
    const canvas = document.getElementById('lightning-canvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = hero.offsetWidth);
    let height = (canvas.height = hero.offsetHeight);
    let animationFrameId = null;
    let isPaused = false;

    const resize = () => {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };
    window.addEventListener('resize', resize);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Ambient Ionized Electrical Particles
    const particleCount = Math.min(26, Math.max(12, Math.floor(width / 50)));
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI,
        color: Math.random() > 0.4 ? '#4ade80' : '#f59e0b'
      });
    }

    // Active Lightning Bolts Queue
    const activeBolts = [];
    let flashAlpha = 0;

    function createLightningBranch(x1, y1, x2, y2, displacement, iterations) {
      if (iterations === 0) {
        return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;
      const left = createLightningBranch(x1, y1, midX, midY, displacement / 1.85, iterations - 1);
      const right = createLightningBranch(midX, midY, x2, y2, displacement / 1.85, iterations - 1);
      return left.concat(right.slice(1));
    }

    function triggerLightning(startX, startY, endX, endY) {
      const x1 = startX !== undefined ? startX : Math.random() * width * 0.8 + width * 0.1;
      const y1 = startY !== undefined ? startY : 0;
      const x2 = endX !== undefined ? endX : x1 + (Math.random() - 0.5) * width * 0.5;
      const y2 = endY !== undefined ? endY : Math.random() * (height * 0.5) + height * 0.45;

      const mainPath = createLightningBranch(x1, y1, x2, y2, Math.min(width, height) * 0.18, 5);
      const childBranches = [];

      for (let i = 0; i < mainPath.length; i += 7) {
        if (Math.random() > 0.45 && i > 4 && i < mainPath.length - 4) {
          const p = mainPath[i];
          const angle = (Math.random() - 0.5) * 1.2 + Math.PI / 2;
          const forkLen = Math.random() * 110 + 50;
          const forkEndX = p.x + Math.sin(angle) * forkLen;
          const forkEndY = p.y + Math.cos(angle) * forkLen;
          childBranches.push(createLightningBranch(p.x, p.y, forkEndX, forkEndY, 35, 3));
        }
      }

      activeBolts.push({
        mainPath,
        childBranches,
        life: 1.0,
        decay: 0.05 + Math.random() * 0.03,
        color: Math.random() > 0.35 ? 'emerald' : 'gold'
      });

      flashAlpha = Math.min(0.18, flashAlpha + 0.12);
    }

    let lastBoltTime = performance.now();
    let nextBoltDelay = 4500 + Math.random() * 3000;

    // Interactive Strike when clicking or tapping in Hero area
    hero.addEventListener('pointerdown', (e) => {
      const rect = hero.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerLightning(clickX + (Math.random() - 0.5) * 200, 0, clickX, clickY);
    }, { passive: true });

    function loop(time) {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Flash
      if (flashAlpha > 0.005) {
        ctx.fillStyle = `rgba(16, 185, 129, ${flashAlpha * 0.6})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha *= 0.88;
      }

      // 2. Ionized Particles & Electrical Network Arcs
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.025;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const alpha = p.baseAlpha + Math.sin(p.pulse) * 0.15;
        ctx.fillStyle = p.color === '#4ade80' ? `rgba(74, 222, 128, ${alpha})` : `rgba(245, 158, 11, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * 0.16;
            ctx.strokeStyle = `rgba(74, 222, 128, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Periodic Trigger Check
      if (time - lastBoltTime > nextBoltDelay) {
        triggerLightning();
        lastBoltTime = time;
        nextBoltDelay = 4500 + Math.random() * 3500;
      }

      // 4. Render Active Lightning Bolts
      for (let b = activeBolts.length - 1; b >= 0; b--) {
        const bolt = activeBolts[b];
        const paths = [bolt.mainPath, ...bolt.childBranches];
        const flicker = (Math.sin(bolt.life * 18) > 0.2 ? 1 : 0.6) * bolt.life;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        paths.forEach((path, pathIdx) => {
          if (!path || path.length < 2) return;
          const isMain = pathIdx === 0;

          // Outer glow
          ctx.strokeStyle = bolt.color === 'emerald'
            ? `rgba(56, 189, 248, ${0.45 * flicker})`
            : `rgba(245, 158, 11, ${0.45 * flicker})`;
          ctx.lineWidth = isMain ? 7 : 3.5;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
          ctx.stroke();

          // Mid vibrant beam
          ctx.strokeStyle = bolt.color === 'emerald'
            ? `rgba(74, 222, 128, ${0.85 * flicker})`
            : `rgba(251, 191, 36, ${0.85 * flicker})`;
          ctx.lineWidth = isMain ? 2.8 : 1.5;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
          ctx.stroke();

          // Inner pure white electric core
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * flicker})`;
          ctx.lineWidth = isMain ? 1.2 : 0.7;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
          ctx.stroke();
        });

        ctx.restore();

        bolt.life -= bolt.decay;
        if (bolt.life <= 0) {
          activeBolts.splice(b, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isPaused = !entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(hero);
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  // --- 8. Global Electric Touch & Click Spark System ---
  function initElectricTouchAndClickSparks() {
    const canvas = document.getElementById('electric-spark-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const sparks = [];
    const rings = [];
    let isAnimating = false;

    function createSparkDischarge(x, y) {
      const numBranches = 5 + Math.floor(Math.random() * 3);
      const branchPoints = [];

      for (let b = 0; b < numBranches; b++) {
        const angle = (b / numBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const len = 25 + Math.random() * 35;
        const steps = 4;
        const pts = [{ x, y }];

        let currX = x;
        let currY = y;
        for (let s = 1; s <= steps; s++) {
          const segLen = len / steps;
          currX += Math.cos(angle) * segLen + (Math.random() - 0.5) * 12;
          currY += Math.sin(angle) * segLen + (Math.random() - 0.5) * 12;
          pts.push({ x: currX, y: currY });
        }
        branchPoints.push(pts);
      }

      const particles = [];
      const particleCount = 10;
      for (let p = 0; p < particleCount; p++) {
        const a = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1.0,
          decay: 0.06 + Math.random() * 0.04,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#f59e0b' : '#38bdf8'
        });
      }

      sparks.push({
        branchPoints,
        particles,
        life: 1.0,
        decay: 0.09
      });

      rings.push({
        x,
        y,
        r: 4,
        maxR: 30,
        alpha: 0.85
      });

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(renderSparks);
      }
    }

    // Both touchscreen taps on mobile and mouse clicks on desktop
    window.addEventListener('pointerdown', (e) => {
      createSparkDischarge(e.clientX, e.clientY);
    }, { passive: true });

    function renderSparks() {
      ctx.clearRect(0, 0, width, height);

      // Expanding rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += (ring.maxR - ring.r) * 0.22 + 1.2;
        ring.alpha *= 0.84;

        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${ring.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (ring.alpha < 0.02 || ring.r >= ring.maxR) {
          rings.splice(i, 1);
        }
      }

      // Branching electric sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        spark.branchPoints.forEach((pts) => {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.5 * spark.life})`;
          ctx.lineWidth = 4;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * spark.life})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
        });

        spark.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.life -= p.decay;

          if (p.life > 0) {
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();

        spark.life -= spark.decay;
        if (spark.life <= 0 && spark.particles.every(p => p.life <= 0)) {
          sparks.splice(s, 1);
        }
      }

      if (sparks.length > 0 || rings.length > 0) {
        requestAnimationFrame(renderSparks);
      } else {
        ctx.clearRect(0, 0, width, height);
        isAnimating = false;
      }
    }
  }

  // --- 9. Hero Background Video Controller ---
  function initHeroBackgroundVideo() {
    const video = document.getElementById('hero-bg-video');
    const toggleBtn = document.getElementById('hero-video-toggle');
    const hero = document.getElementById('hero');
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Autoplay trigger
    const startPlay = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay policy fallback on user interaction
          const unlock = () => {
            if (!toggleBtn || !toggleBtn.classList.contains('manual-paused')) {
              video.play().catch(() => {});
            }
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
      }
    };
    startPlay();

    // Toggle button handler
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          toggleBtn.classList.remove('manual-paused');
          video.play().catch(() => {});
          toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
          toggleBtn.setAttribute('aria-label', 'Metti in pausa video');
          toggleBtn.setAttribute('title', 'Pausa Video');
        } else {
          toggleBtn.classList.add('manual-paused');
          video.pause();
          toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
          toggleBtn.setAttribute('aria-label', 'Riproduci video');
          toggleBtn.setAttribute('title', 'Riproduci Video');
        }
      });
    }

    // Pause video when scrolled out of view to save battery and performance
    if ('IntersectionObserver' in window && hero) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!toggleBtn || !toggleBtn.classList.contains('manual-paused')) {
              video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(hero);
    }
  }

  // Initialize atmospheric background and interactive electric effects
  initLightningBackground();
  initElectricTouchAndClickSparks();
  initHeroBackgroundVideo();

});
