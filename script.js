// Vantage - small interactions
(function () {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    const btn = document.getElementById('back-to-top');
    if (btn) {
      if (window.scrollY > 600) btn.classList.add('show');
      else btn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      mobile.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobile.classList.remove('open');
      mobile.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // back to top
  const back = document.getElementById('back-to-top');
  if (back) back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // contact form mailto helper
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get('subject') || 'Contact');
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\n\n${data.get('message')}`
      );
      window.location.href = `mailto:hello@vantagecrm.com?subject=${subject}&body=${body}`;
    });
  }

  // animated counters
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const dur = 1600;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });
})();
