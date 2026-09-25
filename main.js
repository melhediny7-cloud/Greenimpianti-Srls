const navbar=document.getElementById('navbar');
const scrollTopBtn=document.getElementById('scroll-top');
window.addEventListener('scroll',()=>{
  if(window.scrollY>60){navbar.classList.add('scrolled');scrollTopBtn.classList.add('show');}
  else{navbar.classList.remove('scrolled');scrollTopBtn.classList.remove('show');}
});
scrollTopBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const ham=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobile-menu');
ham.addEventListener('click',()=>{
  mobileMenu.classList.toggle('open');
  const spans=ham.querySelectorAll('span');
  if(mobileMenu.classList.contains('open')){
    spans[0].style.transform='rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity='0';
    spans[2].style.transform='rotate(-45deg) translate(5px,-5px)';
  }else{spans.forEach(s=>{s.style.transform='';s.style.opacity=''});}
});
mobileMenu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    ham.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
  });
});
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
document.querySelectorAll('.fade-up').forEach(el=>observer.observe(el));
const form=document.getElementById('contact-form');
const toast=document.getElementById('toast');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const nome=form.nome.value.trim();
  const email=form.email.value.trim();
  const msg=form.messaggio.value.trim();
  if(!nome||!email||!msg){alert('Per favore compila tutti i campi obbligatori (*).');return;}
  const subject=encodeURIComponent('Richiesta da '+nome+' - Green Impianti');
  const servizio=form.servizio.value||'Non specificato';
  const body=encodeURIComponent('Nome: '+nome+' '+form.cognome.value+'\nEmail: '+email+'\nTelefono: '+form.telefono.value+'\nServizio: '+servizio+'\n\n'+msg);
  window.location.href='mailto:greenimpianti225@gmail.com?subject='+subject+'&body='+body;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4000);
  form.reset();
});

// --- Gallery Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-grid .g-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// --- Lightbox Modal ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || item.querySelector('img').alt;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

const closeLightbox = () => {
  if (lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }
};

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});