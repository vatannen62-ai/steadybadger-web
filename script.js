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
    document.documentElement.classList.toggle('motion-on', enabled);
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
  const ENDPOINT = 'https://formsubmit.co/ajax/a5cadceb49f8aadf18f652f8995d613d';
  const form = document.getElementById('signup');
  let submitting = false;
  const status = document.getElementById('form-status');
  const say = (e, c) => { if (status) status.textContent = en ? e : c; };
  document.querySelectorAll('[data-interest="drop"]').forEach(a => a.addEventListener('click', () => { const s = document.getElementById('interest'); if (s) s.value = 'DROP 01'; }));
  form?.addEventListener('submit', async ev => {
    ev.preventDefault();
    if (submitting) return;
    if (!form.reportValidity()) return;
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address.', 'Zadej prosím platný e-mail.'); form.email.focus(); return; }
    if (!form.consent.checked) { say('Please tick the consent box first.', 'Nejdřív prosím zaškrtni souhlas.'); form.consent.focus(); return; }
    if (form._honey.value) return;
    const btn = document.getElementById('notify'); btn.disabled = true; submitting = true;
    say('Sending…', 'Odesílám…');
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, product: form.product?.value || '-', color: form.color?.value || '-', country: form.country?.value || '-', interest: form.interest.value, size: form.size.value || '-', language: en ? 'EN' : 'CZ', page: location.href, _subject: 'Steady Badger – new signup (' + form.interest.value + ')', _template: 'table', _captcha: 'false' }) });
      if (!r.ok) throw new Error(r.status);
      const result = await r.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Submission not confirmed');
      form.reset();
      if (form.elements.namedItem('product')) chooseProduct(form.elements.namedItem('product').value);
      say('You are on the list. Thank you — nobody lifts alone. 🦡', 'Jsi na seznamu. Díky — nikdo nezvedá sám. 🦡');
    } catch (_) { say('Something went wrong. Please try again later.', 'Něco se pokazilo. Zkus to prosím později.'); }
    finally { btn.disabled = false; submitting = false; }
  });
  const merchDialog = document.getElementById('merch-dialog');
  const productNames = {'tee-forest':"Forest Tee",'tee-sand':"Sand Tee",'tee-black':"Black Tee · Small Badger",'tee-black-big':"Black Tee · Lifting Badger",'tee-training':"Training Tech Tee",'polo-navy':"Navy Polo",'hoodie-charcoal':"Hoodie · Small Badger",'hoodie-black-big':"Black Hoodie · Lifting Badger",'hoodie-camo':"Midnight Camo Hoodie",'bomber':"Black Bomber",'bomber-back':"Bomber · Badger on the Back",'windbreaker':"Olive Windbreaker",'work-jacket':"Olive Work Jacket",'vest':"Quilted Vest",'chino':"Khaki Chinos",'shorts-mesh':"Mesh Shorts",'shorts-athletic':"Athletic Shorts",'shorts-cargo':"Cargo Shorts",'beanie':"Forest Beanie",'cap-black':"Black Cap",'cap-dad':"Washed Dad Cap",'cap-camo':"Camo Cap",'socks':"Crew Socks",'duffel':"Duffel Bag",'tote':"Canvas Tote"};
  const colors = {'tee-forest':en?"Forest green":"Lesní zelená",'tee-sand':en?"Sand":"Písková",'tee-black':en?"Black":"Černá",'tee-black-big':en?"Black":"Černá",'tee-training':en?"Black":"Černá",'polo-navy':en?"Navy":"Tmavě modrá",'hoodie-charcoal':en?"Charcoal":"Antracitová",'hoodie-black-big':en?"Black":"Černá",'hoodie-camo':en?"Midnight camo":"Noční maskáč",'bomber':en?"Black":"Černá",'bomber-back':en?"Black":"Černá",'windbreaker':en?"Olive":"Olivová",'work-jacket':en?"Olive":"Olivová",'vest':en?"Navy":"Tmavě modrá",'chino':en?"Khaki":"Khaki",'shorts-mesh':en?"Black":"Černá",'shorts-athletic':en?"Black":"Černá",'shorts-cargo':en?"Sand":"Písková",'beanie':en?"Forest green":"Lesní zelená",'cap-black':en?"Black":"Černá",'cap-dad':en?"Charcoal":"Antracitová",'cap-camo':en?"Camouflage":"Maskáčová",'socks':en?"Black":"Černá",'duffel':en?"Black / brown leather":"Černá / hnědá kůže",'tote':en?"Sand":"Písková"};
  const oneSize = ['beanie','cap-black','cap-dad','cap-camo','socks','duffel','tote'];
  function chooseProduct(key) {
    if (!form?.product || !productNames[key]) return;
    form.product.value=key; form.color.value=colors[key];
    const size=form.size; size.innerHTML='';
    (oneSize.includes(key) ? [en?'One size':'Univerzální'] : ['', 'S','M','L','XL','2XL']).forEach(v=>size.add(new Option(v||'—',v)));
    size.required=true; form.interest.value='DROP 01 / '+productNames[key];
  }
  document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{chooseProduct(b.dataset.product);merchDialog?.showModal();}));
  form?.product?.addEventListener('change',()=>chooseProduct(form.product.value));
  merchDialog?.querySelector('.dialog-close')?.addEventListener('click',()=>merchDialog.close());
  const selected=new URLSearchParams(location.search).get('product');
  if (merchDialog && productNames[selected]) { chooseProduct(selected); merchDialog.showModal(); }
  else if(merchDialog) chooseProduct('tee-forest');
  document.querySelectorAll('.product-views').forEach(a=>{
    a.setAttribute('role','button');a.setAttribute('aria-pressed','false');
    const flip=()=>{const on=a.classList.toggle('flipped');a.setAttribute('aria-pressed',String(on));};
    a.addEventListener('click',ev=>{ev.preventDefault();flip();});
    a.addEventListener('keydown',ev=>{if(ev.key===' '){ev.preventDefault();flip();}});
  });
  if (form) {
    const fields = form.querySelector('fieldset.form-fields');
    if (fields) fields.disabled = false;
  }

})();
