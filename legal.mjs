// The legal pages, in the site's design. Their text is the approved text of the CRM's legal pages
// (deal-flow-crm/web/web/legal): when that project sits next to this one, each build copies the
// latest version into pages/legal/, so the website and the app always say the same thing.
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { icon } from './icons.mjs';

const CRM = '../deal-flow-crm/web/web/legal/';
const SNAP = 'pages/legal/';

// Website path for each CRM legal page.
export const LEGAL = [
  { src: 'privacy.html', name: 'privacy-policy', icon: 'shield-check' },
  { src: 'terms.html', name: 'terms-of-service', icon: 'file-text' },
  { src: 'refund.html', name: 'billing-refunds', icon: 'receipt-indian-rupee' },
  { src: 'shipping.html', name: 'shipping-delivery', icon: 'package' },
  { src: 'cookies.html', name: 'cookies', icon: 'sliders-horizontal' },
  { src: 'acceptable-use.html', name: 'acceptable-use', icon: 'list-checks' },
  { src: 'data-deletion.html', name: 'data-deletion', icon: 'folder-up' },
  { src: 'grievance.html', name: 'grievance', icon: 'headset' },
];
const PATHS = Object.fromEntries(LEGAL.map((l) => [l.src, '/' + l.name]));
PATHS['contact.html'] = '/contact';
PATHS['index.html'] = '/legal';

// The business details, from the CRM's info.js (given by the owner, never invented).
const readInfo = () => {
  const js = readFileSync(SNAP + 'info.js', 'utf8');
  const obj = js.slice(js.indexOf('window.LEGAL = {') + 15, js.indexOf('};') + 1);
  return Function(`return (${obj});`)();
};

const refresh = () => {
  if (!existsSync(SNAP)) mkdirSync(SNAP, { recursive: true });
  if (!existsSync(CRM)) return;
  for (const f of [...LEGAL.map((l) => l.src), 'index.html', 'info.js']) copyFileSync(CRM + f, SNAP + f);
};

const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fill = (html, info) => html
  .replace(/<span data-k="([a-zA-Z]+)"( data-link)?><\/span>/g, (_, key, link) => {
    const v = key === 'grievanceEmail' ? (info.grievanceEmail || info.email) : info[key];
    if (!v) throw new Error(`legal: no value for ${key}`);
    if (link && /email/i.test(key)) return `<a href="mailto:${v}">${v}</a>`;
    if (link && key === 'phone') return `<a href="tel:${v.replace(/[^+\d]/g, '')}">${v}</a>`;
    return v.replace(/&/g, '&amp;');
  })
  .replace(/href="\/legal\/([a-z-]+\.html)(#[^"]*)?"/g, (_, f, hash = '') => `href="${PATHS[f] || '/legal'}${hash}"`);

const mainOf = (file) => {
  const s = readFileSync(SNAP + file, 'utf8');
  return {
    title: (s.match(/<title>([^<·]+)/) || [])[1]?.trim(),
    description: (s.match(/<meta name="description" content="([^"]*)"/) || [])[1],
    main: s.slice(s.indexOf('<main>') + 6, s.indexOf('</main>')).trim(),
  };
};

/** Builds every legal page; returns the page list for the sitemap of the build. */
export function buildLegal({ head, footer, write }) {
  refresh();
  const info = readInfo();

  for (const l of LEGAL) {
    const { title, description, main } = mainOf(l.src);
    let body = fill(main, info);
    const h1 = (body.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || title;
    const updated = (body.match(/<p class="updated">([\s\S]*?)<\/p>/) || [])[1] || '';
    body = body.replace(/<h1>[\s\S]*?<\/h1>/, '').replace(/<p class="updated">[\s\S]*?<\/p>/, '');
    const toc = [];
    body = body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => {
      const id = slug(t);
      toc.push(`<a href="#${id}">${t}</a>`);
      return `<h2 id="${id}">${t}</h2>`;
    });
    const page = `<main id="main">
  <section class="page-hero legal-hero">
    <div class="glow g1"></div>
    <div class="container rel">
      <span class="kicker reveal"><a href="/legal">Legal</a></span>
      <h1 class="display words">${h1}</h1>
      <p class="sub reveal">${updated}</p>
    </div>
  </section>
  <section class="section legal-section">
    <div class="container legal-layout">
      ${toc.length > 2 ? `<aside class="legal-toc"><nav class="glass" aria-label="On this page"><b>On this page</b>${toc.join('')}</nav>
        <div class="glass legal-help"><span class="ibox">${icon('mail')}</span><div><b>Questions?</b><a href="mailto:${info.email}">${info.email}</a></div></div></aside>` : '<div></div>'}
      <article class="glass doc">
        ${body}
      </article>
    </div>
  </section>
</main>`;
    write(l.name, { path: '/' + l.name, title: `${title} · Deal Flow CRM`, description }, page);
  }

  // The hub page: every policy as a card.
  const hub = mainOf('index.html');
  const cards = [...hub.main.matchAll(/<a href="\/legal\/([a-z-]+\.html)"><strong>([\s\S]*?)<\/strong><span>([\s\S]*?)<\/span><\/a>/g)]
    .map(([, f, name, text]) => {
      const l = LEGAL.find((x) => x.src === f);
      return `<a class="glass feature legal-card" href="${PATHS[f]}">${`<span class="ibox lg">${icon(l ? l.icon : 'mail')}</span>`}<h3>${name}</h3><p>${text}</p></a>`;
    }).join('\n        ');
  write('legal', { path: '/legal', title: 'Legal · Deal Flow CRM', description: 'Privacy, terms, refunds, cookies, acceptable use, data deletion and grievance redressal for Deal Flow CRM.' }, `<main id="main">
  <section class="page-hero">
    <div class="glow g1"></div>
    <div class="container rel">
      <span class="kicker reveal">Legal</span>
      <h1 class="display words">Clear terms.<br><span class="gold-text">Plain words.</span></h1>
      <p class="sub reveal">Deal Flow CRM is provided by ${info.company.replace(/&/g, '&amp;')}. Effective ${info.effective}.</p>
    </div>
  </section>
  <section class="section" style="padding-top: 40px">
    <div class="glow g2"></div>
    <div class="container rel">
      <div class="fgrid stagger">
        ${cards}
      </div>
    </div>
  </section>
</main>`);
}
