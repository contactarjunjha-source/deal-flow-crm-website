// Deal Flow CRM legal pages: the business details used on every page, in one place.
// Every value here was given by the owner: never invent contact details. An empty value shows a
// highlighted "to be added" marker where it is used.
window.LEGAL = {
  // Registered legal name of the business that runs Deal Flow CRM (e.g. "Example Technologies Private Limited").
  company: 'Momentum Marketing & Software Technologies',
  // Email for support, billing and privacy requests.
  email: 'support@dealflowcrm.co.in',
  // Support phone number (with country code).
  phone: '+91 74398 52955',
  // Support hours (e.g. "Monday to Saturday, 10:00 to 18:00 IST").
  hours: 'Monday to Friday, 9:00 AM to 5:00 PM IST',
  // Grievance Officer (IT Rules 2021 / DPDP Act 2023): name, and email if different from `email`.
  grievanceName: 'Arjun Jha',
  grievanceEmail: '',
  // City whose courts have jurisdiction (e.g. "Mumbai, Maharashtra").
  jurisdiction: 'Bengaluru, Karnataka',
  // Date these pages take effect.
  effective: '27 October 2026',
};

(function () {
  const L = window.LEGAL;
  const labels = {
    company: 'Company legal name',
    email: 'Contact email',
    phone: 'Phone number',
    hours: 'Support hours',
    grievanceName: 'Grievance Officer name',
    grievanceEmail: 'Grievance Officer email',
    jurisdiction: 'City for jurisdiction',
    effective: 'Effective date',
  };
  const pages = [
    ['index.html', 'Legal'],
    ['privacy.html', 'Privacy Policy'],
    ['terms.html', 'Terms of Service'],
    ['refund.html', 'Refund & Cancellation'],
    ['shipping.html', 'Shipping & Delivery'],
    ['contact.html', 'Contact Us'],
    ['cookies.html', 'Cookie Policy'],
    ['acceptable-use.html', 'Acceptable Use'],
    ['data-deletion.html', 'Data Deletion'],
    ['grievance.html', 'Grievance Redressal'],
  ];

  function value(key) {
    if (key === 'grievanceEmail') return L.grievanceEmail || L.email;
    return L[key];
  }

  function fill() {
    document.querySelectorAll('[data-k]').forEach((el) => {
      const key = el.getAttribute('data-k');
      const v = value(key);
      if (v) {
        if (el.hasAttribute('data-link') && (key === 'email' || key === 'grievanceEmail')) {
          el.innerHTML = '';
          const a = document.createElement('a');
          a.href = 'mailto:' + v;
          a.textContent = v;
          el.appendChild(a);
        } else if (el.hasAttribute('data-link') && key === 'phone') {
          el.innerHTML = '';
          const a = document.createElement('a');
          a.href = 'tel:' + v.replace(/[^+\d]/g, '');
          a.textContent = v;
          el.appendChild(a);
        } else {
          el.textContent = v;
        }
      } else {
        el.textContent = '[' + (labels[key] || key) + ': to be added]';
        el.classList.add('missing');
      }
    });
  }

  function chrome() {
    const here = location.pathname.split('/').pop() || 'index.html';
    const url = (href) => '/legal/' + href;
    const header = document.createElement('header');
    header.className = 'top';
    header.innerHTML =
      '<a class="brand" href="/"><img src="/logo.webp" alt="Deal Flow CRM" height="34"></a>' +
      '<a class="app" href="/">Open Deal Flow CRM</a>';
    document.body.prepend(header);

    const nav = document.createElement('nav');
    nav.className = 'legal-nav';
    nav.setAttribute('aria-label', 'Legal pages');
    nav.innerHTML = pages
      .map(([href, name]) => '<a href="' + url(href) + '"' + (href === here || (here === 'legal' && href === 'index.html') ? ' aria-current="page"' : '') + '>' + name + '</a>')
      .join('');
    document.querySelector('main').before(nav);

    const footer = document.createElement('footer');
    footer.innerHTML =
      '<p>&copy; ' + new Date().getFullYear() + ' <span data-k="company"></span>. Deal Flow CRM.</p>' +
      '<p>' + pages.slice(1).map(([href, name]) => '<a href="' + url(href) + '">' + name + '</a>').join(' · ') + '</p>';
    document.body.appendChild(footer);
  }

  document.addEventListener('DOMContentLoaded', () => {
    chrome();
    fill();
  });
})();
