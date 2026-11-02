// Builds the marketing pages: one shared head, header and footer around each page's content.
// Edit pages/<name>.main.html (and <name>.credits.html), then run: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { icon } from './icons.mjs';
import { buildLegal } from './legal.mjs';
import { jsonLd, sitemap, ROBOTS, LLMS } from './seo.mjs';
import { createHash } from 'node:crypto';

// Each release gets new file versions, so browsers never mix new pages with old styles or scripts.
const ver = (f) => createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 10);
const V = { css: ver('site.css'), js: ver('site.js'), audio: ver('assets/audio/rotiyana-call.mp3') };

const APP = 'https://app.dealflowcrm.co.in/signin';

const PAGES = [
  { name: 'index', path: '/', title: 'Deal Flow CRM | AI CRM with AI Calling Agent for Sales Teams in India',
    description: 'Deal Flow CRM is the AI sales CRM that tells your team who to call today, and its AI calling agent answers every missed call in Hindi, Hinglish and 40+ languages. GST quotes, WhatsApp, pipelines. Free to start.' },
  { name: 'features', path: '/features', nav: 'Features', crumb: 'Features', title: 'Deal Flow CRM Features: AI Calling, Lead Rescue, WhatsApp CRM, GST Quotes',
    description: 'All 48 Deal Flow CRM features: AI calling agent, bulk AI calls, Lead Rescue, Today\'s Work, pipelines, GST quotes and invoices, WhatsApp inbox, Gmail and Outlook, booking links, automations and reports.' },
  { name: 'ai-calling', path: '/ai-calling', nav: 'AI calling', crumb: 'AI calling agent', title: 'AI Calling Agent & AI Telecaller in Hindi, Hinglish, 40+ Languages | Deal Flow CRM',
    description: 'Deal Flow CRM\'s AI calling agent answers your missed calls and calls your lead lists from your own phone in Hindi, Hinglish and 40+ languages, records every call, and books the meeting. Hear a real call.' },
  { name: 'crm', path: '/crm', crumb: 'The CRM', title: 'Sales CRM Software for Small Businesses in India | Deal Flow CRM',
    description: 'Deal Flow CRM keeps leads, calls, WhatsApp chats, emails, GST quotes and follow-ups in one place, with a daily list of who to call and alerts when a lead is slipping.' },
  { name: 'use-cases', path: '/use-cases', nav: 'Use cases', crumb: 'Use cases', title: 'CRM for Real Estate, Education, Clinics, Food, Interiors & B2B | Deal Flow CRM',
    description: 'How real estate, education, clinics, tiffin and food services, interiors, manufacturers, retail, agencies and travel businesses use Deal Flow CRM and its AI calling agent.' },
  { name: 'integrations', path: '/integrations', crumb: 'Integrations', title: 'Deal Flow CRM Integrations: WhatsApp, Gmail, Outlook, Google Calendar, API',
    description: 'Deal Flow CRM works with WhatsApp Business, Gmail, Outlook, Google Calendar, Google Meet, Microsoft Teams, Google Drive, OneDrive, web forms, webhooks, a REST API and your own apps.' },
  { name: 'security', path: '/security', crumb: 'Security', title: 'Security and Data Privacy, Data Stored in India | Deal Flow CRM',
    description: 'Deal Flow CRM stores your data on Google Cloud in Mumbai, India, encrypted in transit and at rest, with team roles and private mailboxes. Your data is never used to train our AI.' },
  { name: 'pricing', path: '/pricing', nav: 'Pricing', crumb: 'Pricing', title: 'Deal Flow CRM Pricing: Free, ₹1,000 and ₹2,000 per User a Month',
    description: 'Deal Flow CRM is free for 5 leads and 5 deals. Basic ₹1,000 and Pro ₹2,000 per user a month, billed yearly, GST included. Pro adds the AI calling agent and WhatsApp. Buy online by UPI or card.' },
  { name: 'faq', path: '/faq', crumb: 'FAQ', title: 'Deal Flow CRM FAQ: AI Calling, Features, Pricing, Billing and Data',
    description: 'Answers to common questions about Deal Flow CRM: what it is, how the AI calling agent works, languages, pricing, billing, payments, imports and where your data is stored.' },
  { name: 'contact', path: '/contact', crumb: 'Contact', title: 'Contact Deal Flow CRM | Demo and Support',
    description: 'Talk to the Deal Flow CRM team for a demo or support: support@dealflowcrm.co.in, +91 74398 52955, Monday to Friday, 9 am to 5 pm IST.' },
];

const navLinks = (current) => [['/features', 'Features'], ['/ai-calling', 'AI calling'], ['/use-cases', 'Use cases'], ['/pricing', 'Pricing']]
  .map(([href, label]) => `<a href="${href}"${label === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');

// Every feature with its icon, for the two moving ribbons.
const ROW1 = [['life-buoy', 'Lead Rescue'], ['list-checks', "Today's Work"], ['phone-call', 'AI calling agent'], ['phone-incoming', 'AI answers missed calls'],
  ['phone-outgoing', 'Bulk AI calling'], ['wand-sparkles', 'AI campaign builder'], ['calendar-check', 'AI books meetings'], ['audio-lines', 'Call recordings'],
  ['file-text', 'Call transcripts'], ['notebook-pen', 'Call summaries'], ['gauge', 'Lead scoring'], ['mic', 'Ask AI by voice'], ['sparkles', 'AI WhatsApp drafts'],
  ['scroll-text', 'Lead summary'], ['book-open', 'Deal notebook'], ['notepad-text', 'Meeting notes'], ['scan-line', 'Card scanner'], ['message-circle', 'WhatsApp inbox'],
  ['mail', 'Gmail and Outlook'], ['calendar-sync', 'Calendar sync'], ['link', 'Booking links'], ['bell-ring', 'Meeting reminders'], ['languages', '40+ languages']];
const ROW2 = [['receipt-indian-rupee', 'GST quotes'], ['receipt', 'Invoices'], ['repeat', 'Recurring billing'], ['package', 'Product catalogue'], ['kanban', 'Pipelines'],
  ['sliders-horizontal', 'Custom fields'], ['coins', 'Multi-currency'], ['refresh-cw', 'Round-robin leads'], ['users', 'Auto-reassign leads'], ['bell-dot', 'Quiet deal alerts'],
  ['handshake', 'Promise tracking'], ['target', 'Sales targets'], ['chart-column', 'Reports'], ['zap', 'Automations'], ['clipboard-list', 'Web forms'],
  ['webhook', 'API and webhooks'], ['plug', 'App connector'], ['upload', 'Import from any CRM'], ['folder-up', 'Document requests'], ['ticket', 'Support tickets'],
  ['shield-check', 'Team roles'], ['wifi-off', 'Works offline'], ['smartphone', 'Phone app'], ['mail-plus', 'Email templates'], ['map-pin', 'Data in India']];
const cards = (list) => list.map(([ic, f]) => `<div class="fcard"><span class="ibox">${icon(ic)}</span><b>${f}</b></div>`).join('');
const RIBBONS = `<section class="ribbons" aria-label="Every feature">
    <div class="ribbon"><div class="mover"><div class="track">${cards(ROW1)}</div><div class="track" aria-hidden="true">${cards(ROW1)}</div></div></div>
    <div class="ribbon rev"><div class="mover"><div class="track">${cards(ROW2)}</div><div class="track" aria-hidden="true">${cards(ROW2)}</div></div></div>
  </section>`;

const head = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.description}">
  <meta name="theme-color" content="#050505">
  <link rel="canonical" href="https://dealflowcrm.co.in${p.path}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://dealflowcrm.co.in${p.path}">
  <meta property="og:image" content="https://dealflowcrm.co.in/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Deal Flow CRM">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.description}">
  <meta name="twitter:image" content="https://dealflowcrm.co.in/assets/og-image.jpg">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="application-name" content="Deal Flow CRM">
  <link rel="apple-touch-icon" href="/assets/logo-512.png">
  ${p.ld || ''}
  <link rel="icon" href="/assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/site.css?v=${V.css}">
  <script>document.documentElement.classList.add('js')</script>
  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1013590691784682');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none" alt=""
  src="https://www.facebook.com/tr?id=1013590691784682&ev=PageView&noscript=1"></noscript>
  <!-- End Meta Pixel Code -->
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<div class="nav-wrap">
  <header class="nav">
    <a class="brand" href="/" aria-label="Deal Flow CRM home"><img src="/assets/img/mark.png" alt="" width="56" height="22"><b>Deal Flow <i>CRM</i></b></a>
    <nav class="nav-links" aria-label="Main">${navLinks(p.nav)}</nav>
    <div class="nav-cta">
      <a class="login" href="${APP}">Log in</a>
      <a class="btn btn-gold btn-sm" href="${APP}">Start free</a>
      <button class="menu-btn" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu"><i></i><i></i></button>
    </div>
  </header>
  <nav class="mobile-menu" id="mobile-menu" hidden aria-label="Main">
    ${navLinks(p.nav)}
    <a href="${APP}">Log in</a>
    <a class="btn btn-gold" href="${APP}">Start free</a>
  </nav>
</div>
`;

const footer = () => `
<footer class="footer">
  <div class="container">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="brand" href="/"><img src="/assets/img/mark.png" alt="" width="76" height="30"><b>Deal Flow <i>CRM</i></b></a>
        <p>The CRM that tells your team what to do next, with an AI that answers every call.</p>
        <div class="foot-contact">
          <a href="mailto:support@dealflowcrm.co.in">${icon('mail')}support@dealflowcrm.co.in</a>
          <a href="tel:+917439852955">${icon('phone-call')}+91 74398 52955</a>
          <span>${icon('map-pin')}Made in India · data stored in Mumbai</span>
        </div>
      </div>
      <div class="foot-cols">
        <div><h4>Product</h4><a href="/features">Features</a><a href="/ai-calling">AI calling</a><a href="/crm">CRM</a><a href="/integrations">Integrations</a></div>
        <div><h4>Solutions</h4><a href="/use-cases">Use cases</a><a href="/pricing">Pricing</a><a href="/security">Security</a><a href="/faq">Questions</a></div>
        <div><h4>Company</h4><a href="/contact">Contact us</a><a href="${APP}">Log in</a><a href="${APP}">Start free</a><a href="/grievance">Grievance officer</a></div>
        <div><h4>Legal</h4><a href="/privacy-policy">Privacy</a><a href="/terms-of-service">Terms</a><a href="/billing-refunds">Refunds</a><a href="/legal">All policies</a></div>
      </div>
    </div>
    <div class="foot-word" aria-hidden="true">Deal Flow</div>
    <div class="foot-bottom"><span>© 2026 Momentum Marketing &amp; Software Technologies</span><span class="legal"><a href="/cookies">Cookies</a><a href="/shipping-delivery">Shipping</a><a href="/acceptable-use">Acceptable use</a><a href="/data-deletion">Data deletion</a></span></div>
  </div>
</footer>
<script src="/site.js?v=${V.js}" defer></script>
</body>
</html>
`;

const built = [];
for (const p of PAGES) {
  const main = readFileSync(`pages/${p.name}.main.html`, 'utf8');
  p.ld = jsonLd(p, main);
  built.push(p);
  writeFileSync(`${p.name}.html`, head(p) + '\n' + main.trim().split('<!--RIBBONS-->').join(RIBBONS).split('<!--CALL-->').join(readFileSync('pages/call.partial.html', 'utf8').split('rotiyana-call.mp3').join('rotiyana-call.mp3?v=' + V.audio)).replace(/\{\{icon(-lg)?:([a-z0-9-]+)\}\}/g, (_, lg, n) => `<span class="ibox${lg ? ' lg' : ''}">${icon(n)}</span>`).replace(/\{\{svg:([a-z0-9-]+)\}\}/g, (_, n) => icon(n)) + '\n' + footer());
  console.log('built', `${p.name}.html`);
}

// Legal pages: the CRM's approved text in the site's design.
buildLegal({
  write: (name, meta, main) => {
    const p = { name, legal: true, parent: name === 'legal' ? null : ['/legal', 'Legal'], crumb: meta.title.split('·')[0].trim(), ...meta };
    p.ld = jsonLd(p, main);
    built.push(p);
    writeFileSync(`${name}.html`, head(p) + '\n' + main + '\n' + footer());
    console.log('built', `${name}.html`);
  },
});

// For search engines and AI assistants.
writeFileSync('sitemap.xml', sitemap(built, new Date().toISOString().slice(0, 10)));
writeFileSync('robots.txt', ROBOTS);
writeFileSync('llms.txt', LLMS);
console.log('built sitemap.xml, robots.txt, llms.txt');
