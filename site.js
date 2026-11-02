// Deal Flow CRM — marketing site behaviour. The page reads fine without it.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Glass bar darkens once the page scrolls; a thin gold line shows how far you've read.
  const nav = $('.nav');
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Phone menu.
  const menuBtn = $('.menu-btn');
  const menu = $('#mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // Headlines marked .words rise in word by word.
  $$('.words').forEach((h) => {
    let i = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.transitionDelay = (i++ * 70) + 'ms';
          w.textContent = part;
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(h);
    // Gold words keep their gradient when split.
    $$('.gold-text .w', h).forEach((w) => w.classList.add('gold-text'));
  });

  // Reveal on scroll.
  const items = $$('.reveal, .stagger, .words');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add('in'));

  // Glass catches the pointer light; cards tilt a little toward it.
  if (fine && !reduce) {
    $$('.glass').forEach((g) => {
      g.classList.add('lit');
      const tilt = g.matches('.tile, .plan, .feature, .ucase');
      if (tilt) g.classList.add('tilt');
      g.addEventListener('pointermove', (e) => {
        const r = g.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        g.style.setProperty('--mx', (x * 100) + '%');
        g.style.setProperty('--my', (y * 100) + '%');
        if (tilt) g.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
      });
      g.addEventListener('pointerleave', () => { if (tilt) g.style.transform = ''; });
    });
  }

  // Count up numbers marked data-count.
  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count), suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = to + suffix; return; }
    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
  });

  // ---------- The real call: plays by itself while it's on screen ----------
  const call = $('[data-call]');
  const audio = call && $('audio', call);
  if (call && audio) {
    const lines = $$('.line', call);
    const stats = $$('.facts .stat[data-t]', call);
    const steps = $$('.steps span', call);
    const stepAt = (call.dataset.steps || '').split(',').map(Number);
    const bars = $$('.player .wave i', call);
    const time = $('.player .time', call);
    const status = $('.live', call);
    const orb = $('.orb', call);
    const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    let userPaused = false, visible = false;

    const render = () => {
      const t = audio.currentTime, d = audio.duration || 81;
      lines.forEach((l) => l.classList.toggle('show', Number(l.dataset.t) <= t));
      stats.forEach((s) => s.classList.toggle('on', Number(s.dataset.t) <= t));
      let st = 0; stepAt.forEach((at, i) => { if (t >= at) st = i; });
      steps.forEach((s, i) => s.classList.toggle('on', i === st));
      const done = Math.round((t / d) * bars.length);
      bars.forEach((b, i) => b.classList.toggle('done', i < done));
      if (time) time.textContent = `${fmt(t)} / ${fmt(d)}`;
      if (status) status.textContent = audio.ended ? 'Meeting booked' : (audio.paused ? (t > 0 ? 'Paused' : 'Ready') : 'On a call');
    };

    // The orb and waveform follow the voice: the real loudness once sound is on, a gentle pulse before.
    let analyser, data, ctx;
    const setupAnalyser = () => {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
      if (!window.AudioContext) return;
      try {
        ctx = new AudioContext();
        const src = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        data = new Uint8Array(analyser.frequencyBinCount);
        src.connect(analyser); analyser.connect(ctx.destination);
        if (ctx.state === 'suspended') ctx.resume();
      } catch (_) { analyser = null; }
    };
    const draw = () => {
      if (audio.paused) { bars.forEach((b) => { b.style.transform = ''; }); if (orb) orb.style.setProperty('--lvl', 0); return; }
      const now = performance.now();
      let sum = 0;
      if (analyser && !audio.muted) analyser.getByteFrequencyData(data);
      bars.forEach((b, i) => {
        const v = analyser && !audio.muted ? data[(i * 2) % data.length] / 255 : 0.25 + 0.45 * Math.abs(Math.sin(now / 170 + i * 0.7));
        sum += v;
        b.style.transform = `scaleY(${Math.max(0.12, Math.min(1, v * 1.3))})`;
      });
      if (orb) orb.style.setProperty('--lvl', Math.min(1, (sum / bars.length) * 1.4).toFixed(3));
      requestAnimationFrame(draw);
    };

    // Browsers allow sound only after the visitor touches the page, so the call starts muted,
    // with captions running, and the first tap anywhere turns the sound on.
    const unmute = () => {
      if (!audio.muted) return;
      audio.muted = false;
      call.classList.remove('muted');
      setupAnalyser();
    };
    const start = (gesture) => {
      if (audio.ended && gesture) audio.currentTime = 0;
      if (gesture) { setupAnalyser(); unmute(); }
      return audio.play().catch(() => {
        audio.muted = true;
        call.classList.add('muted');
        return audio.play().catch(() => {});
      });
    };
    audio.addEventListener('play', () => { call.classList.add('playing'); requestAnimationFrame(draw); });
    audio.addEventListener('pause', () => { call.classList.remove('playing'); render(); });
    audio.addEventListener('ended', render);
    audio.addEventListener('timeupdate', render);
    audio.addEventListener('loadedmetadata', render);

    $('.play', call).addEventListener('click', () => {
      if (audio.paused) { userPaused = false; start(true); } else { userPaused = true; audio.pause(); }
    });
    $('.sound', call).addEventListener('click', () => { unmute(); if (audio.paused) start(true); });
    $('.player .wave', call).addEventListener('click', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
      userPaused = false; start(true);
    });

    // Plays while on screen, stops when you scroll past.
    const io = new IntersectionObserver((e) => {
      const en = e[0];
      visible = en.isIntersecting && (en.intersectionRatio >= 0.5 || en.intersectionRect.height >= innerHeight * 0.4);
      if (visible && !userPaused && !audio.ended && audio.paused) start(false);
      if (!visible && !audio.paused) audio.pause();
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] });
    io.observe(call);
    const firstTouch = (e) => {
      if (e.target.closest && e.target.closest('.play')) return;
      if (audio.muted && !audio.paused) unmute();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, firstTouch, { passive: true }));
    render();
  }

  // ---------- Currency: rupees in India, US dollars everywhere else ----------
  // Paying in US dollars needs Cashfree's international payments; until they're on, dollar
  // buyers are sent to talk to us instead of to a checkout that would fail.
  const USD_CHECKOUT = false;
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  let cur = 'usd';
  try { cur = localStorage.getItem('df-cur') || (/^Asia\/(Kolkata|Calcutta)$/.test(tz) ? 'inr' : 'usd'); } catch (_) { cur = /^Asia\/(Kolkata|Calcutta)$/.test(tz) ? 'inr' : 'usd'; }
  const onCurrency = [];
  const setCurrency = (c, save) => {
    cur = c;
    if (save) { try { localStorage.setItem('df-cur', c); } catch (_) { /* private mode */ } }
    $$('.money').forEach((m) => { m.textContent = m.dataset[c]; });
    $$('[data-cur]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === c)));
    $$('.tax-note').forEach((n) => { n.hidden = c !== 'inr'; });
    onCurrency.forEach((f) => f());
  };
  $$('[data-cur]').forEach((b) => b.addEventListener('click', () => setCurrency(b.dataset.cur, true)));

  // ---------- Pricing: choose a plan and seats, then pay ----------
  const co = $('[data-checkout]');
  if (co) {
    const prices = { inr: { basic: 12000, pro: 24000 }, usd: { basic: 228, pro: 588 } };
    let tier = 'pro', seats = 1;
    const out = $('output', co), amt = $('.amt', co), per = $('.per', co), pay = $('.pay', co);
    const money = (n) => (cur === 'inr' ? '₹' + n.toLocaleString('en-IN') : '$' + n.toLocaleString('en-US'));
    const show = () => {
      $$('.seg button[data-tier]', co).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tier === tier)));
      const year = prices[cur][tier];
      out.textContent = seats;
      amt.textContent = money(year * seats);
      per.textContent = `a year for ${seats} ${seats === 1 ? 'seat' : 'seats'} · ${money(year / 12)} per seat a month`;
      if (cur === 'inr' || USD_CHECKOUT) {
        pay.href = `https://app.dealflowcrm.co.in/settings/plan?buy=${tier}&seats=${seats}`;
        pay.textContent = `Pay ${money(year * seats)}`;
      } else {
        pay.href = `/contact?buy=${tier}&seats=${seats}`;
        pay.textContent = 'Talk to us to buy';
      }
    };
    $$('.seg button[data-tier]', co).forEach((b) => b.addEventListener('click', () => { tier = b.dataset.tier; show(); }));
    $('[data-minus]', co).addEventListener('click', () => { seats = Math.max(1, seats - 1); show(); });
    $('[data-plus]', co).addEventListener('click', () => { seats = Math.min(500, seats + 1); show(); });
    $$('[data-pick]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); tier = a.dataset.pick; show(); co.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }));
    const fromUrl = new URLSearchParams(location.search).get('plan');
    if (fromUrl === 'basic' || fromUrl === 'pro') tier = fromUrl;
    onCurrency.push(show);
  }
  setCurrency(cur, false);

  // A plan chosen on the pricing page arrives in the contact message.
  const buy = new URLSearchParams(location.search);
  const msg = $('[data-contact] textarea[name="message"]');
  if (msg && (buy.get('buy') === 'basic' || buy.get('buy') === 'pro')) {
    msg.value = `We'd like to buy the ${buy.get('buy') === 'pro' ? 'Pro' : 'Basic'} plan for ${buy.get('seats') || 1} seat(s), paying in US dollars.`;
  }

  // ---------- Contact form: opens an email with the details filled in ----------
  const form = $('[data-contact]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const body = `Name: ${f.get('name')}\nBusiness: ${f.get('business')}\nPhone: ${f.get('phone')}\nTeam size: ${f.get('team')}\n\n${f.get('message')}`;
      location.href = `mailto:support@dealflowcrm.co.in?subject=${encodeURIComponent('Deal Flow CRM enquiry from ' + (f.get('business') || f.get('name')))}&body=${encodeURIComponent(body)}`;
    });
  }
  // Legal pages: highlight the section being read in the side menu.
  const tocLinks = $$('.legal-toc nav a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      tocLinks.forEach((a) => a.classList.remove('on'));
      const a = byId.get(e.target.id);
      if (a) a.classList.add('on');
    }), { rootMargin: '-15% 0px -70% 0px' });
    $$('.doc h2[id]').forEach((h) => spy.observe(h));
  }
  // ---------- Meta Pixel events for ads: the steps before sign-up ----------
  const track = (name, params) => { try { if (window.fbq) window.fbq('track', name, params || {}); } catch (_) { /* blocked */ } };
  if (location.pathname === '/pricing') track('ViewContent', { content_name: 'Pricing' });
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.includes('app.dealflowcrm.co.in/settings/plan?buy=')) {
      const p = new URL(href).searchParams;
      const tier = p.get('buy'), seats = Number(p.get('seats') || 1);
      track('InitiateCheckout', { content_name: tier, num_items: seats, value: (tier === 'pro' ? 24000 : 12000) * seats, currency: 'INR' });
    } else if (href.includes('app.dealflowcrm.co.in/signin')) {
      track('Lead', { content_name: (a.textContent || '').trim().slice(0, 40) });
    }
  }, true);
  const contactForm = $('[data-contact]');
  if (contactForm) contactForm.addEventListener('submit', () => track('Contact'));
})();
