(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const button = document.getElementById('motion');
  const system = window.matchMedia('(prefers-reduced-motion: reduce)');
  let explicit = null, enabled = false, lenis = null, context = null, raf = null, observer = null;
  try { const saved = localStorage.getItem('sb-motion'); if (saved === 'on' || saved === 'off') explicit = saved === 'on'; } catch (_) {}
  function stop() {
    if (observer) { observer.disconnect(); observer = null; }
    if (raf) { gsap.ticker.remove(raf); raf = null; }
    if (lenis) { lenis.destroy(); lenis = null; }
    if (context) { context.revert(); context = null; }
  }
  function render(next) {
    stop(); enabled = next;
    document.documentElement.classList.toggle('motion-off', !enabled);
    if (button) { button.hidden = false; button.setAttribute('aria-pressed', String(enabled)); button.textContent = en ? `Motion: ${enabled ? 'on' : 'off'}` : `Pohyb: ${enabled ? 'zapnuto' : 'vypnuto'}`; }
    if (!enabled || !window.gsap) return;
    context = gsap.context(() => {
      if (matchMedia('(pointer:fine)').matches) gsap.to('.orbit', { rotation: 12, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      else gsap.to('.hero .button span', { y: -3, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting && context) { context.add(() => gsap.from(entry.target, { y: 24, duration: .7, ease: 'power2.out' })); observer.unobserve(entry.target); }
      }), { rootMargin: '0px 0px -6% 0px' });
      document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    }
    if (window.Lenis && matchMedia('(pointer:fine)').matches) {
      lenis = new Lenis({ duration: .85, anchors: true });
      raf = time => lenis.raf(time * 1000); gsap.ticker.add(raf);
    }
  }
  if (button) button.addEventListener('click', () => { explicit = !enabled; try { localStorage.setItem('sb-motion', explicit ? 'on' : 'off'); } catch (_) {} render(explicit); });
  system.addEventListener('change', () => { if (explicit === null) render(!system.matches); });
  render(explicit === null ? !system.matches : explicit);
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => { if (!enabled || !window.gsap || e.pointerType !== 'mouse') return; const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .08, y: (e.clientY - r.top - r.height / 2) * .1, duration: .3 }); });
    el.addEventListener('pointerleave', () => { if (window.gsap) gsap.to(el, { x: 0, y: 0, duration: enabled ? .3 : 0 }); });
  });
  const ENDPOINT = 'https://formsubmit.co/ajax/vatannen62@gmail.com';
  const form = document.getElementById('signup');
  const status = document.getElementById('form-status');
  const say = (e, c) => { if (status) status.textContent = en ? e : c; };
  document.querySelectorAll('[data-interest="drop"]').forEach(a => a.addEventListener('click', () => { const s = document.getElementById('interest'); if (s) s.value = 'DROP 01'; }));
  form?.addEventListener('submit', async ev => {
    ev.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address.', 'Zadej prosím platný e-mail.'); form.email.focus(); return; }
    if (!form.consent.checked) { say('Please tick the consent box first.', 'Nejdřív prosím zaškrtni souhlas.'); form.consent.focus(); return; }
    if (form._honey.value) return;
    const btn = document.getElementById('notify'); btn.disabled = true;
    say('Sending…', 'Odesílám…');
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, interest: form.interest.value, size: form.size.value || '-', language: en ? 'EN' : 'CZ', page: location.href, _subject: 'Steady Badger – new signup (' + form.interest.value + ')', _template: 'table', _captcha: 'false' }) });
      if (!r.ok) throw new Error(r.status);
      form.reset(); say('You are on the list. Thank you — nobody lifts alone. 🦡', 'Jsi na seznamu. Díky — nikdo nezvedá sám. 🦡');
    } catch (_) { say('Something went wrong. Please try again later.', 'Něco se pokazilo. Zkus to prosím později.'); }
    finally { btn.disabled = false; }
  });
})();
