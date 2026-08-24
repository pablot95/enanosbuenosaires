document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168200703';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const CATS = { famosos: 'Famosos', terror: 'Terror', cine: 'Cine y series', politica: 'Política', clasicos: 'Clásicos' };

const PERSONAJES = [
  { n: 'Bad Bunny', cat: 'famosos', img: 'badbunny', w: 205, h: 365 },
  { n: 'Chucky', cat: 'terror', img: 'chucky', w: 247, h: 527 },
  { n: 'Ricky Fort', cat: 'famosos', img: 'rickyfort-cut', w: 548, h: 612 },
  { n: 'El Padrino', cat: 'cine' },
  { n: 'Terminator', cat: 'cine' },
  { n: 'Saw', cat: 'terror' },
  { n: 'Tony Montana', cat: 'cine' },
  { n: 'Bizarrap', cat: 'famosos' },
  { n: 'Maradona', cat: 'famosos', img: 'maradona', w: 448, h: 607 },
  { n: 'Messi', cat: 'famosos', img: 'messi', w: 495, h: 543 },
  { n: 'Joker', cat: 'cine' },
  { n: 'Yoda', cat: 'cine' },
  { n: 'Francisco', cat: 'famosos' },
  { n: 'Mario Bros', cat: 'cine' },
  { n: 'Policía', cat: 'clasicos' },
  { n: 'Médico', cat: 'clasicos' },
  { n: 'IT', cat: 'terror' },
  { n: 'Casa de Papel', cat: 'cine' },
  { n: 'Milei', cat: 'politica' },
  { n: 'Macri', cat: 'politica', img: 'macri', w: 316, h: 493 },
  { n: 'Alberto', cat: 'politica', img: 'albertofernandez', w: 556, h: 591 },
  { n: 'Perón', cat: 'politica' },
  { n: 'Cristina', cat: 'politica' },
  { n: 'Trump', cat: 'politica' },
  { n: 'Baywatch', cat: 'clasicos' },
  { n: 'Obrero', cat: 'clasicos' },
  { n: 'Duende', cat: 'clasicos' },
  { n: 'Marinero', cat: 'clasicos' },
  { n: 'Smoking y Galera', cat: 'clasicos' },
  { n: 'Novia de Chucky', cat: 'terror' },
];

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
  gsap.registerPlugin(Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  document.querySelectorAll('[data-hero]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  document.getElementById('stage')?.classList.add('is-static');
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const host = document.querySelector('.site-header');
  if (!toggle || !nav || !host) return;
  let bd = host.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; host.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${Math.min(100, (window.scrollY / h) * 100)}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const bloque = PERSONAJES.map(p => `<span>${esc(p.n)}</span>`).join('');
  track.innerHTML = bloque + bloque;
}

function renderElenco() {
  const grid = document.getElementById('gridElenco');
  if (!grid) return;
  grid.innerHTML = PERSONAJES.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const href = wa(`Hola! Quiero contratar a ${p.n} para mi evento. ¿Me pasan disponibilidad y precio?`);
    const visual = p.img
      ? `<span class="pieza-foto"><img src="images/${p.img}.webp" alt="Artista caracterizado de ${esc(p.n)}" width="${p.w}" height="${p.h}" loading="lazy"></span>`
      : `<span class="pieza-tipo">${esc(p.n)}</span>`;
    const pie = p.img
      ? `<span class="pieza-nombre">${esc(p.n)}</span><span class="pieza-cat">${CATS[p.cat]}</span>`
      : `<span class="pieza-cat">${CATS[p.cat]}</span>`;
    return `<li class="pieza" data-cat="${p.cat}">
      <a class="pieza-link" href="${href}" target="_blank" rel="noopener" aria-label="Consultar por ${esc(p.n)} por WhatsApp">
        <span class="pieza-num">${num}</span>
        ${visual}
        <span class="pieza-pie">${pie}</span>
        <span class="pieza-cta">Pedirlo</span>
      </a>
    </li>`;
  }).join('');
}

function initFiltros() {
  const btns = Array.from(document.querySelectorAll('.filtro'));
  const items = Array.from(document.querySelectorAll('.pieza'));
  if (!btns.length || !items.length) return;
  btns.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    btns.forEach(b => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    const usaFlip = typeof Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion;
    const state = usaFlip ? Flip.getState(items) : null;
    items.forEach(li => li.classList.toggle('oculto', cat !== 'todos' && li.dataset.cat !== cat));
    if (state) {
      Flip.from(state, {
        duration: 0.55, ease: 'power2.out', stagger: 0.012, absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.22 }),
      });
    }
    if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 620);
  }));
}

function initContador() {
  const el = document.getElementById('cifraPersonajes');
  if (!el || !('IntersectionObserver' in window) || reduceMotion) return;
  const destino = 40;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const inicio = performance.now();
      const paso = ahora => {
        const t = Math.min(1, (ahora - inicio) / 1100);
        el.textContent = `+${Math.round(destino * (1 - Math.pow(1 - t, 3)))}`;
        if (t < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }, { threshold: 0.4 });
  io.observe(el);
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  const select = document.getElementById('pedidoPersonaje');
  if (!form || !select) return;
  select.innerHTML = '<option value="">Todavía no lo decidí</option>' + PERSONAJES.map(p => `<option value="${esc(p.n)}">${esc(p.n)}</option>`).join('');
  const hoy = new Date();
  const fechaInput = document.getElementById('pedidoFecha');
  if (fechaInput) fechaInput.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const evento = document.getElementById('pedidoEvento')?.value || 'un evento';
    const personaje = select.value;
    const zona = document.getElementById('pedidoZona')?.value || 'CABA';
    const fecha = fechaInput?.value || '';
    let msg = personaje
      ? `Hola! Quiero contratar a ${personaje} para ${evento} en ${zona}`
      : `Hola! Quiero contratar un personaje para ${evento} en ${zona}`;
    if (fecha) {
      const [a, m, d] = fecha.split('-');
      msg += `, el ${d}/${m}/${a}`;
    }
    msg += `. ¿Me pasan disponibilidad y precio?`;
    window.open(wa(msg), '_blank', 'noopener');
    showToast('Listo: te abrimos WhatsApp con el pedido escrito.');
  });
}

function initMagnetico() {
  if (reduceMotion || typeof gsap === 'undefined' || !window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.22, duration: 0.45, ease: 'power3.out' });
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
  });
}

function initHero() {
  const heroItems = document.querySelectorAll('[data-hero]');
  if (typeof gsap === 'undefined' || !heroItems.length) return;
  if (reduceMotion) {
    gsap.set(heroItems, { opacity: 1, clearProps: 'transform' });
    return;
  }
  const title = document.querySelector('.hero-title');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  gsap.set('.escenario, .escenario-grain', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('.escenario', { opacity: 1 });

  tl.to('.escenario, .escenario-grain', { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut' }, 0)
    .fromTo('.hero-eyebrow', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.05);

  let lineas = null;
  if (typeof SplitText !== 'undefined' && title) {
    try {
      const split = new SplitText(title, { type: 'lines', mask: 'lines' });
      lineas = split.lines;
    } catch (err) { lineas = null; }
  }
  if (lineas && lineas.length) {
    gsap.set(title, { opacity: 1 });
    tl.from(lineas, { yPercent: 115, opacity: 0, duration: 0.95, stagger: 0.1, ease: 'power4.out' }, 0.2);
  } else if (title) {
    tl.fromTo(title, { clipPath: 'inset(0 0 100% 0)', y: 22 }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1 }, 0.2);
  }

  tl.fromTo('.hero-lead', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5)
    .fromTo('.hero-cta', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8 }, 0.62)
    .fromTo('.hero-chips', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8 }, 0.74)
    .fromTo('.hero-fig-b', { opacity: 0, y: 46, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.34)
    .fromTo('.hero-fig-c', { opacity: 0, y: 46, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.44)
    .fromTo('.hero-fig-a', { opacity: 0, y: 74, rotation: -7, scale: 0.96 }, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 1.15, ease: 'power4.out' }, 0.4)
    .fromTo('.sello', { opacity: 0, scale: 0.45, rotation: -70 }, { opacity: 1, scale: 1, rotation: -11, duration: 0.9, ease: 'back.out(1.7)' }, 0.9)
    .fromTo('.hero-scene .cartel', { opacity: 0, y: 34, rotation: 13 }, { opacity: 1, y: 0, rotation: 3.5, duration: 0.9 }, 0.78)
    .fromTo('.papel', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.07 }, 0.95);

  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      gsap.to(el, {
        yPercent: -Number(el.dataset.parallax || 4),
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    });
  }
}

function initEntrada() {
  const stage = document.getElementById('stage');
  const escena = document.getElementById('escena');
  const entrante = document.getElementById('entrante');
  const flashBlanco = document.getElementById('flashBlanco');
  const pasos = Array.from(document.querySelectorAll('#pasos li'));
  if (!stage || !escena || !entrante) return;

  const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

  const gente = document.getElementById('gente');
  if (gente) {
    let html = '';
    for (let i = 0; i < 11; i++) {
      const ancho = 9 + rnd(i, 8) * 7;
      html += `<b style="left:${(-3 + i * 9.6 + rnd(i, 9) * 2.4).toFixed(1)}%;width:${ancho.toFixed(1)}%;height:${(46 + rnd(i, 10) * 40).toFixed(0)}%"></b>`;
    }
    gente.innerHTML = html;
  }

  const flashes = document.getElementById('flashes');
  if (flashes) {
    let html = '';
    for (let i = 0; i < 14; i++) {
      html += `<b style="left:${(5 + rnd(i, 1) * 90).toFixed(1)}%;top:${(52 + rnd(i, 2) * 30).toFixed(1)}%;animation-delay:${(rnd(i, 3) * 1.9).toFixed(2)}s"></b>`;
    }
    flashes.innerHTML = html;
  }

  const papelitos = document.getElementById('papelitos');
  const piezas = [];
  if (papelitos) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('i');
      p.className = 'papelito';
      p.style.background = i % 3 === 0 ? '#e30022' : (i % 3 === 1 ? '#ffffff' : '#ffd489');
      p.style.left = `${(12 + rnd(i, 4) * 74).toFixed(1)}%`;
      p.dataset.dx = ((rnd(i, 5) - 0.5) * 240).toFixed(0);
      p.dataset.dy = (70 + rnd(i, 6) * 210).toFixed(0);
      p.dataset.dr = ((rnd(i, 7) - 0.5) * 700).toFixed(0);
      papelitos.appendChild(p);
      piezas.push(p);
    }
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { stage.classList.add('is-static'); return; }

  const CORTES = [0, 0.2, 0.5, 0.74];
  const setStep = p => {
    let idx = 0;
    for (let i = 0; i < CORTES.length; i++) if (p >= CORTES[i]) idx = i;
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === idx));
    escena.classList.toggle('is-live', p >= 0.5);
  };

  const armar = scrollTrigger => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger });
    tl.set(entrante, { xPercent: -62, scale: 0.22, opacity: 0, filter: 'brightness(0) contrast(2)' }, 0)
      .set('.sala', { filter: 'brightness(1)' }, 0)
      .set(piezas, { opacity: 0, x: 0, y: 0, rotation: 0 }, 0)
      .to('.hoja-l', { xPercent: -104, duration: 0.2 }, 0.02)
      .to('.hoja-r', { xPercent: 104, duration: 0.2 }, 0.02)
      .to('.luz-puerta', { opacity: 1, duration: 0.16 }, 0.02)
      .to('.resplandor', { opacity: 1, duration: 0.22 }, 0.04)
      .to('.luz-piso', { opacity: 0.9, scaleY: 1, duration: 0.24 }, 0.06)
      .to(entrante, { opacity: 1, duration: 0.06 }, 0.16)
      .to(entrante, { scale: 0.55, duration: 0.3 }, 0.16)
      .to(entrante, { scale: 1, duration: 0.14 }, 0.46)
      .to(flashBlanco, { opacity: 1, duration: 0.02 }, 0.52)
      .to(entrante, { filter: 'brightness(1) contrast(1)', duration: 0.01 }, 0.535)
      .to(flashBlanco, { opacity: 0, duration: 0.16 }, 0.545)
      .to('.sala', { filter: 'brightness(1.18)', duration: 0.2 }, 0.55)
      .to('.resplandor', { opacity: 0.55, duration: 0.2 }, 0.55)
      .to(entrante, { scale: 1.08, duration: 0.3 }, 0.7);
    if (piezas.length) {
      tl.to(piezas, { opacity: 1, duration: 0.03 }, 0.53)
        .to(piezas, {
          x: (i, t) => Number(t.dataset.dx), y: (i, t) => Number(t.dataset.dy), rotation: (i, t) => Number(t.dataset.dr),
          duration: 0.42, ease: 'power1.out',
        }, 0.53)
        .to(piezas, { opacity: 0, duration: 0.18 }, 0.84);
    }
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    stage.classList.add('is-static');
    return () => stage.classList.remove('is-static');
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    armar({ trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: 0.6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) });
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    armar({ trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) });
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initAnio() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

document.documentElement.classList.add('js-ready');
initNav();
initMarquee();
renderElenco();
initFiltros();
initContador();
initPedido();
initProgress();
initWspFloat();
initReveals();
initMagnetico();
initEntrada();
initAnio();

const fuentesListas = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
Promise.race([fuentesListas, new Promise(r => setTimeout(r, 900))]).then(() => {
  initHero();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
