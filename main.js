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

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      bentoItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
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
  const itemArray = Array.from(bentoItems);

  const updateLightbox = (index) => {
    if (index < 0) index = itemArray.length - 1;
    if (index >= itemArray.length) index = 0;
    activeIndex = index;

    const item = itemArray[activeIndex];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || item.querySelector('h4').textContent;
    const desc = item.getAttribute('data-desc') || '';

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxCounter.textContent = (activeIndex + 1) + ' / ' + itemArray.length;
  };

  itemArray.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateLightbox(index);
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
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(activeIndex + 1);
  });

  // --- 6. Contact Form Processing ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = contactForm.nome.value.trim();
      const cognome = contactForm.cognome.value.trim();
      const email = contactForm.email.value.trim();
      const telefono = contactForm.telefono.value.trim();
      const servizio = contactForm.servizio.value;
      const messaggio = contactForm.messaggio.value.trim();

      if (!nome || !cognome || !email || !telefono || !messaggio) {
        alert('Per favore compila tutti i campi obbligatori (*).');
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent('Richiesta Preventivo: ' + servizio + ' - ' + nome + ' ' + cognome);
      const body = encodeURIComponent(
        'Nuova richiesta preventivo dal sito web:\n\n' +
        'Nome: ' + nome + ' ' + cognome + '\n' +
        'Email: ' + email + '\n' +
        'Telefono: ' + telefono + '\n' +
        'Tipologia Intervento: ' + servizio + '\n\n' +
        'Dettagli Progetto:\n' + messaggio
      );

      // Trigger mail client
      window.location.href = 'mailto:greenimpianti225@gmail.com?subject=' + subject + '&body=' + body;

      // Show toast
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }

      contactForm.reset();
    });
  }
});
