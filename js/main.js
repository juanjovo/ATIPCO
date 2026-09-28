/* ATIPCO · script compartido · Rendercode */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  document.documentElement.classList.remove('no-js');

  // Header: sombra al hacer scroll + logo pequeño en inicio
  const header = $('.site-header');
  const heroLogo = $('.hero-logo');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 10);
    if (heroLogo) header.classList.toggle('show-logo', heroLogo.getBoundingClientRect().bottom < 80);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menú móvil
  const burger = $('.burger');
  burger?.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
  });

  // Aparición al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));

  // Tarjeta de ruta jurídica (programas)
  const rc = $('.route-card');
  if (rc) new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { setTimeout(() => rc.classList.add('go'), 300); o.disconnect(); }
  }), { threshold: .4 }).observe(rc);

  // Contadores
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count;
    cio.unobserve(el);
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), d = 1600;
    const step = t => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // Modal legal
  const modal = $('#legalModal');
  let lastFocus;
  const titles = { privacidad: 'Política de privacidad', terminos: 'Términos y condiciones' };
  const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; lastFocus?.focus(); };
  $$('[data-legal]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); lastFocus = a;
    $('#legalTitle').textContent = titles[a.dataset.legal];
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(() => $('.close', modal).focus(), 50);
  }));
  modal?.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) close(); });

  // Formulario de contacto (demo, sin envío real)
  const form = $('#contactForm');
  if (form) {
    const motivo = new URLSearchParams(location.search).get('motivo');
    if (motivo && $(`#f-motivo option[value="${motivo}"]`)) $('#f-motivo').value = motivo;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.empresa_web.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      $('#formOk').classList.add('show');
    });
    $('#formReset').addEventListener('click', () => { form.reset(); $('#formOk').classList.remove('show'); });
  }

  // Filtro de galería (fotos / videos)
  $$('.media-filter').forEach(bar => {
    const grid = bar.nextElementSibling;
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      $$('.photo', grid).forEach(f => f.hidden = b.dataset.filter !== 'all' && f.dataset.type !== b.dataset.filter);
    });
  });

  // Lightbox para fotos de las galerías
  const gPhotos = $$('.gallery .photo:not(.video)');
  if (gPhotos.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt=""><p></p><button class="lb-close" aria-label="Cerrar">×</button><button class="lb-prev" aria-label="Anterior">‹</button><button class="lb-next" aria-label="Siguiente">›</button>';
    document.body.appendChild(lb);
    let list = [], idx = 0;
    const show = i => { idx = (i + list.length) % list.length; const im = $('img', list[idx]); $('img', lb).src = im.src; $('img', lb).alt = im.alt; $('p', lb).textContent = im.alt; };
    const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    gPhotos.forEach(f => f.addEventListener('click', () => {
      if (f.classList.contains('empty')) return;
      list = $$('.photo:not(.video):not(.empty)', f.closest('.gallery')).filter(x => !x.hidden);
      show(list.indexOf(f)); lb.classList.add('open'); document.body.style.overflow = 'hidden';
    }));
    lb.addEventListener('click', e => {
      if (e.target.closest('.lb-prev')) show(idx - 1);
      else if (e.target.closest('.lb-next')) show(idx + 1);
      else if (e.target === lb || e.target.closest('.lb-close')) closeLb();
    });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  $$('.year').forEach(y => y.textContent = new Date().getFullYear());
})();
