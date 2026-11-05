// Search engines and AI assistants: structured data, sitemap, robots.txt and llms.txt.
// Facts only: no ratings, reviews or customer numbers that don't exist.

export const SITE = 'https://dealflowcrm.co.in';
const LOGO = `${SITE}/assets/logo-512.png`;

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Deal Flow CRM',
  alternateName: ['DealFlow CRM', 'Dealflow CRM', 'dealflowcrm', 'Deal Flow'],
  legalName: 'Momentum Marketing & Software Technologies',
  url: `${SITE}/`,
  logo: LOGO,
  email: 'support@dealflowcrm.co.in',
  telephone: '+91-7439852955',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  areaServed: 'Worldwide',
  // Populate with your social profile URLs (LinkedIn, X, Facebook, YouTube, Crunchbase, Product Hunt, G2, Capterra) for Organization sameAs
  sameAs: [],
  contactPoint: [{
    '@type': 'ContactPoint', contactType: 'customer support', email: 'support@dealflowcrm.co.in', telephone: '+91-7439852955',
    areaServed: 'Worldwide', availableLanguage: ['English', 'Hindi'],
    hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
  }],
};

const WEBSITE = {
  '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Deal Flow CRM', alternateName: 'dealflowcrm.co.in',
  url: `${SITE}/`, inLanguage: 'en-IN', publisher: { '@id': `${SITE}/#organization` },
};

const offer = (name, price, unit, cur = 'INR') => ({
  '@type': 'Offer', name, price: String(price), priceCurrency: cur, url: `${SITE}/pricing`, availability: 'https://schema.org/InStock',
  ...(unit ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: String(price), priceCurrency: cur, unitText: unit, referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' } } } : {}),
});

export const APP = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE}/#software`,
  name: 'Deal Flow CRM',
  alternateName: ['DealFlow CRM', 'Deal Flow AI CRM'],
  description: 'Deal Flow CRM is an AI sales CRM for small and growing businesses worldwide. It tells each salesperson who to call today, keeps leads, WhatsApp chats, emails and quotes in one place, and includes an AI calling agent that answers missed calls and calls lead lists in 40+ languages and local accents.',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Customer relationship management (CRM)',
  operatingSystem: 'Web browser, Android, iOS, Windows',
  url: `${SITE}/`,
  image: `${SITE}/assets/og-image.jpg`,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE}/#organization` },
  featureList: [
    'AI calling agent that answers missed calls', 'Bulk AI calling of lead lists', 'AI campaign builder', 'AI books meetings on calls',
    'Calls in 40+ languages and local accents', 'Call recordings, transcripts and summaries', "Today's Work daily task list",
    'Lead Rescue alerts for slipping leads', 'Sales pipelines and deals', 'Quotes and invoices with GST, VAT or sales tax', 'WhatsApp Business inbox',
    'Gmail and Outlook email sync', 'Google and Microsoft calendar sync', 'Booking links with Google Meet and Microsoft Teams',
    'Meeting notes and minutes', 'Round-robin lead assignment', 'Automations', 'Reports and sales targets', 'Web forms, API and webhooks',
    'Import from Zoho, HubSpot, Odoo, Pipedrive and Salesforce', 'Multi-currency and regional settings',
  ],
  offers: [offer('Free', 0), offer('Basic, per user per year', 228, 'per user per year', 'USD'), offer('Pro, per user per year', 588, 'per user per year', 'USD'), offer('Basic, per user per year (India)', 12000, 'per user per year'), offer('Pro, per user per year (India)', 24000, 'per user per year')],
};

const clean = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").trim();

/** Questions and answers found in <details> on the page, for FAQPage. */
export function faqsOf(html) {
  return [...html.matchAll(/<summary>([\s\S]*?)<i><\/i><\/summary><p>([\s\S]*?)<\/p>/g)]
    .map(([, q, a]) => ({ '@type': 'Question', name: clean(q), acceptedAnswer: { '@type': 'Answer', text: clean(a) } }));
}

/** The JSON-LD graph for a page. */
export function jsonLd(p, html) {
  const graph = [ORG, WEBSITE];
  const url = SITE + p.path;
  graph.push({
    '@type': p.name === 'faq' ? 'FAQPage' : 'WebPage', '@id': `${url}#page`, url, name: p.title, description: p.description,
    isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#software` }, inLanguage: 'en-IN',
    ...(p.name === 'faq' ? { mainEntity: faqsOf(html) } : {}),
  });
  if (['index', 'pricing', 'features', 'ai-calling', 'crm'].includes(p.name)) graph.push(APP);
  if (p.name !== 'faq') {
    const faqs = faqsOf(html);
    if (faqs.length && (p.name === 'index' || p.name === 'pricing')) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faqs });
  }
  if (p.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Deal Flow CRM', item: `${SITE}/` },
        ...(p.parent ? [{ '@type': 'ListItem', position: 2, name: p.parent[1], item: SITE + p.parent[0] }] : []),
        { '@type': 'ListItem', position: p.parent ? 3 : 2, name: p.crumb || p.title.split(/[|·:]/)[0].trim(), item: url },
      ],
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

export function sitemap(pages, today) {
  const pri = (p) => (p.path === '/' ? '1.0' : ['/pricing', '/ai-calling', '/features'].includes(p.path) ? '0.9' : p.legal ? '0.3' : '0.7');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.legal ? 'yearly' : 'weekly'}</changefreq><priority>${pri(p)}</priority></url>`).join('\n')}
</urlset>
`;
}

export const ROBOTS = `# Deal Flow CRM: everyone, including AI assistants, may read the public site.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

export const LLMS = `# Deal Flow CRM

> Deal Flow CRM (dealflowcrm.co.in) is an AI-powered sales CRM for small and growing sales teams worldwide. It tells each salesperson who to call today, keeps leads, WhatsApp chats, emails, calls and quotes in one place, and includes an AI calling agent that answers missed calls and calls lead lists in 40+ languages and local accents, then books the meeting.

Deal Flow CRM is made by Momentum Marketing & Software Technologies (India) and serves businesses in any country, with local currency, time zone, phone format and tax. The app runs in any web browser and installs on phones; data is stored on Google Cloud (Mumbai region). Contact: support@dealflowcrm.co.in, +91 74398 52955.

## Key facts
- Name: Deal Flow CRM (also written DealFlow CRM). Website: https://dealflowcrm.co.in. App: https://app.dealflowcrm.co.in
- Category: sales CRM software with an AI calling agent (AI telecaller), for businesses worldwide.
- Pricing (per user, billed yearly): Free for up to 5 leads and 5 deals with every feature; Basic $19 a month ($228 a year); Pro $49 a month ($588 a year). In India: Basic ₹1,000 and Pro ₹2,000 a month, GST included.
- Pro adds: the AI calling agent, bulk AI calling, the AI campaign builder, the WhatsApp inbox, Ask AI by voice, and priority support.
- AI calling: runs through the business's own phone (paired by Bluetooth with a Windows laptop running the free Call Box app) and the business's Google Gemini key; answers missed calls, calls lists one at a time, records, transcribes and summarises every call, and books meetings with Google Meet or Microsoft Teams links.
- CRM: Today's Work daily list, Lead Rescue alerts, pipelines, quotes and invoices with GST, VAT or sales tax, recurring billing, WhatsApp Business, Gmail and Outlook, calendar sync, booking links, meeting notes, round-robin assignment, automations, reports and targets, web forms, API and webhooks, imports from Zoho, HubSpot, Odoo, Pipedrive and Salesforce.
- Payment: online on the website or in the app through Cashfree (cards; in India also UPI and net banking).

## Pages
- [Home](${SITE}/): what Deal Flow CRM is, with a real recorded AI call.
- [Features](${SITE}/features): all 48 features.
- [AI calling agent](${SITE}/ai-calling): how the AI telecaller works and what it needs.
- [The CRM](${SITE}/crm): Today's Work, quotes, conversations and automations.
- [Use cases](${SITE}/use-cases): real estate, education, clinics, food, interiors, manufacturing, retail, agencies, travel.
- [Integrations](${SITE}/integrations): WhatsApp, Gmail, Outlook, Google Calendar, Drive, OneDrive, web forms, API.
- [Pricing](${SITE}/pricing): plans, comparison and online checkout.
- [FAQ](${SITE}/faq): answers on the product, AI calling, billing and data.
- [Security](${SITE}/security): encryption, data location, roles.
- [Contact](${SITE}/contact)
- [Legal](${SITE}/legal): privacy, terms, refunds, cookies, acceptable use, data deletion, grievance.
`;
