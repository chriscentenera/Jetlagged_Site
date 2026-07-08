// ── Navigation ────────────────────────────────────────────────────────────────

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  const link = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  document.querySelector('.nav-links').classList.remove('open');
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigate(el.dataset.page);
  });
});

document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById(el.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}


// ── Forms ─────────────────────────────────────────────────────────────────────

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast("🎉 Message sent! We'll get back to you soon.");
  e.target.reset();
});

document.getElementById('sellForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast("💌 Offer sent! We'll be in touch within 24 hours.");
  e.target.reset();
});

// ── Countdown helpers ─────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target - now) / 86400000));
}

function countdownParts(dateStr) {
  const target = new Date(dateStr);
  const diff = Math.max(0, target - new Date());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

// ── Renderers ─────────────────────────────────────────────────────────────────

function renderHome(data) {
  document.getElementById('hero-title').textContent = data.hero_title;
  document.getElementById('hero-subtitle').textContent = data.hero_subtitle;
  document.getElementById('hero-cta-primary').textContent = data.cta_primary_label;
  document.getElementById('hero-cta-secondary').textContent = data.cta_secondary_label;
  document.getElementById('banner-title').textContent = data.cta_banner_title;
  document.getElementById('banner-subtitle').textContent = data.cta_banner_subtitle;
  document.getElementById('banner-btn').textContent = data.cta_banner_button;

  document.getElementById('features-grid').innerHTML = data.features.map(f => `
    <div class="feature-card">
      <span class="feature-icon">${f.icon}</span>
      <h3>${f.title}</h3>
      <p>${f.description}</p>
    </div>
  `).join('');
}

function renderHostedPromo(shows) {
  document.getElementById('hosted-promo').innerHTML = shows.filter(s => s.active !== false).map(s => {
    const [year, mon, dy] = s.date.split('-').map(Number);
    const d = new Date(year, mon - 1, dy);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const days = daysUntil(s.date);
    const daysLabel = days === 0 ? "TODAY!" : days === 1 ? "1 day away" : `${days} days away`;
    return `
      <a href="#" class="promo-card" data-page="our-shows">
        <div class="promo-date-box" style="background: ${s.color};">
          <div class="month">${month}</div>
          <div class="day">${day}</div>
        </div>
        <div class="promo-text">
          <div class="promo-label">🎪 We're Hosting</div>
          <h3>${s.name}</h3>
          <p>${s.venue_name} · ${s.time}</p>
        </div>
        <div class="promo-countdown">
          <div class="days-num">${days}</div>
          <div class="days-label">days to go</div>
        </div>
      </a>
    `;
  }).join('');

  // Re-attach nav listeners for dynamically created [data-page] elements
  document.querySelectorAll('.promo-card[data-page]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.page); });
  });
}

function renderHostedShows(shows) {
  document.getElementById('hosted-shows-list').innerHTML = shows.filter(s => s.active !== false).map(s => {
    const d = new Date(s.date);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const c = countdownParts(s.date);
    const highlightItems = s.highlights.map(h => `<li>${h}</li>`).join('');
    const mapsLink = s.maps_url
      ? `<a href="${s.maps_url}" target="_blank" class="btn btn-primary" style="font-size:.9rem;padding:.6rem 1.4rem;text-decoration:none;">📍 View Map</a>`
      : '';

    return `
      <div class="hosted-show-card">
        <div class="show-card-inner">
          <div class="show-card-banner" style="background: ${s.color};">
            <div class="show-badge">🎪 Hosted by Jetlagged Cards</div>
            <h2>${s.name}</h2>
            <div class="show-card-meta">
              <span>📅 ${s.display_date}</span>
              <span>🕐 ${s.time}</span>
              <span>📍 ${s.venue_name}</span>
            </div>
          </div>

          <div class="show-countdown-strip" style="background: ${s.color.replace('135deg', '135deg').replace(')', ', 0.85)')};">
            <span style="color:white; font-weight:700; font-size:0.9rem;">Countdown:</span>
            <div class="countdown-boxes">
              <div class="cbox"><span class="cnum" id="cd-${s.id}-d">${c.days}</span><span class="clabel">days</span></div>
              <div class="cbox"><span class="cnum" id="cd-${s.id}-h">${c.hours}</span><span class="clabel">hrs</span></div>
              <div class="cbox"><span class="cnum" id="cd-${s.id}-m">${c.minutes}</span><span class="clabel">min</span></div>
              <div class="cbox"><span class="cnum" id="cd-${s.id}-s">${c.seconds}</span><span class="clabel">sec</span></div>
            </div>
          </div>

          <div class="show-card-body">
            <div>
              <p class="show-description">${s.description}</p>
              <div class="show-section-label">What to Expect</div>
              <ul class="highlights-list">${highlightItems}</ul>
              ${mapsLink}
            </div>

            <div>
              <div class="vendor-box">
                <div class="show-section-label" style="margin-bottom:0.85rem;">Vendor Tables</div>
                <p class="vendor-desc">${s.vendor_description}</p>
                ${s.vendor_tiers ? `
                  <div class="vendor-tiers-grid">
                    ${s.vendor_tiers.map(t => `
                      <div class="vendor-tier-chip${t.sold_out ? ' sold-out' : ''}">
                        <div class="tier-name">${t.name}</div>
                        <div class="tier-price">${t.price}</div>
                        ${t.sold_out ? '<div class="tier-soldout">SOLD OUT</div>' : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${s.vendor_bulk ? `
                  <div class="vendor-bulk-label">Bulk discounts</div>
                  <div class="vendor-bulk-list">
                    ${s.vendor_bulk.map(b => `
                      <div class="vendor-bulk-row">
                        <span class="bulk-qty">${b.min}+ tables</span>
                        <span class="bulk-discount">${b.discount}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${s.showup_url ? `
                  <a href="${s.showup_url}" target="_blank" class="btn btn-primary showup-apply-btn">Apply for a Table on ShowUp →</a>
                  <p class="showup-attribution">Vendor applications powered by <a href="https://joinshowup.io" target="_blank">ShowUp</a></p>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Tick countdown every second
  setInterval(() => {
    shows.filter(s => s.active !== false).forEach(s => {
      const c = countdownParts(s.date);
      const dEl = document.getElementById(`cd-${s.id}-d`);
      if (dEl) {
        dEl.textContent = c.days;
        document.getElementById(`cd-${s.id}-h`).textContent = c.hours;
        document.getElementById(`cd-${s.id}-m`).textContent = c.minutes;
        document.getElementById(`cd-${s.id}-s`).textContent = c.seconds;
      }
    });
  }, 1000);
}

function renderEvents(data) {
  const grid = document.getElementById('events-grid');
  if (!grid) return; // Events page is under construction — no grid to render
  grid.innerHTML = data.events.map(ev => `
    <div class="event-card">
      <div class="event-banner" style="background: ${ev.gradient};"></div>
      <div class="event-card-body">
        <span class="event-date">${ev.date}</span>
        <h3>${ev.title}</h3>
        <p>${ev.description}</p>
        <div class="event-meta">
          <span>📍 ${ev.location}</span>
          <span>🕐 ${ev.time}</span>
        </div>
        <button class="btn btn-primary" style="font-size:.9rem;padding:.6rem 1.4rem;">${ev.button_label}</button>
      </div>
    </div>
  `).join('');
}

function renderStore(data) {
  const grid = document.getElementById('store-grid');
  if (!grid) return; // Shop is under construction — no product grid to render
  let activeFilter = 'all';

  grid.innerHTML = data.products.map(p => `
    <div class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="product-img" style="background: ${p.bg};">${p.icon}</div>
      <div class="product-body">
        <div class="product-tag">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="price">$${p.price}</span>
          <button class="add-btn">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.closest('.product-card').querySelector('h3').textContent;
      showToast(`✓ "${name}" added to cart!`);
    });
  });

  function applyFilters() {
    const query = document.getElementById('store-search').value.toLowerCase().trim();
    grid.querySelectorAll('.product-card').forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query || card.dataset.name.includes(query);
      card.style.display = matchesCategory && matchesSearch ? '' : 'none';
    });
  }

  document.getElementById('store-search').addEventListener('input', applyFilters);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

function renderShows(data) {
  document.getElementById('shows-list').innerHTML = data.shows.map(s => {
    const [month, day] = s.date.split(' ');
    const linkHtml = s.url
      ? `<a href="${s.url}" target="_blank" class="show-link">Details →</a>`
      : `<span class="show-link" style="opacity:0.4;cursor:default;">TBA</span>`;
    return `
      <div class="show-row">
        <div class="show-date-box">
          <div class="month">${month}</div>
          <div class="day">${parseInt(day)}</div>
        </div>
        <div class="show-info">
          <h3>${s.name}</h3>
          <div class="show-meta">
            <span>📍 ${s.location}</span>
            <span>${s.city}</span>
          </div>
          ${s.table ? `<span class="show-table-badge">🪑 ${s.table}</span>` : ''}
        </div>
        ${linkHtml}
      </div>
    `;
  }).join('');
}

function renderSell(data) {
  document.getElementById('buying-intro').textContent = data.buying_intro;
  document.getElementById('contact-note').textContent = data.contact_note;
  document.getElementById('condition-note').textContent = data.condition_note;

  document.getElementById('conditions-list').innerHTML = data.conditions_accepted
    .map(c => `<li>${c}</li>`).join('');

  renderWantlist(data.wantlist);
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function renderWantlist(wantlist) {
  const container = document.getElementById('wantlist');
  if (!container) return;

  const groupHtml = groups => groups.map(set => `
    <div class="wantlist-set">
      <div class="wantlist-set-header">${set.set}</div>
      ${[...set.cards]
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
        .map(card => `
        <div class="wantlist-card-row" data-name="${card.name.toLowerCase()}" data-priority="${card.priority}">
          <div>
            <span class="wantlist-card-name">${card.name}</span>
            <span class="wantlist-card-num">${card.number}</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span class="wantlist-card-cond">${card.condition}</span>
            <span class="priority-badge priority-${card.priority}">${card.priority}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  const wishlists = wantlist.filter(g => g.type === 'wishlist');
  const sets = wantlist.filter(g => g.type !== 'wishlist');

  container.innerHTML = `
    ${wishlists.length ? `
      <div class="wantlist-group" data-group="wishlist">
        <div class="wantlist-group-label">🙋 Collector Wishlists</div>
        <div class="wantlist-grid">${groupHtml(wishlists)}</div>
      </div>` : ''}
    ${sets.length ? `
      <div class="wantlist-group" data-group="set">
        <div class="wantlist-group-label">📦 By Set</div>
        <div class="wantlist-grid">${groupHtml(sets)}</div>
      </div>` : ''}
  `;

  wireWantlistFilters();
}

function wireWantlistFilters() {
  const search = document.getElementById('wantlist-search');
  const filterWrap = document.getElementById('wantlist-priority-filters');
  const emptyMsg = document.getElementById('wantlist-empty');
  if (!search || !filterWrap) return;

  let activePriority = 'all';

  function applyFilters() {
    const query = search.value.toLowerCase().trim();
    let anyVisible = false;

    document.querySelectorAll('#wantlist .wantlist-set').forEach(set => {
      let setHasVisible = false;
      set.querySelectorAll('.wantlist-card-row').forEach(row => {
        const matchesSearch = !query || row.dataset.name.includes(query);
        const matchesPriority = activePriority === 'all' || row.dataset.priority === activePriority;
        const show = matchesSearch && matchesPriority;
        row.hidden = !show;
        if (show) setHasVisible = true;
      });
      set.hidden = !setHasVisible;
      if (setHasVisible) anyVisible = true;
    });

    // Hide a group heading when all of its sets are hidden
    document.querySelectorAll('#wantlist .wantlist-group').forEach(group => {
      const visibleSet = group.querySelector('.wantlist-set:not([hidden])');
      group.hidden = !visibleSet;
    });

    if (emptyMsg) emptyMsg.hidden = anyVisible;
  }

  search.addEventListener('input', applyFilters);

  filterWrap.querySelectorAll('.wl-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterWrap.querySelectorAll('.wl-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePriority = btn.dataset.priority;
      applyFilters();
    });
  });
}

function renderAbout(data) {
  document.getElementById('about-tagline').textContent = data.tagline;
  document.getElementById('about-cta-text').textContent = data.cta;
  document.getElementById('about-story').innerHTML = data.story
    .map(p => `<p>${p}</p>`).join('');
  document.getElementById('about-values').innerHTML = data.values
    .map(v => `
      <div class="feature-card">
        <span class="feature-icon">${v.icon}</span>
        <h3>${v.title}</h3>
        <p>${v.description}</p>
      </div>
    `).join('');
}

function renderFaq(data) {
  document.getElementById('faq-list').innerHTML = data.faqs.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-question" onclick="toggleFaq(${i})">
        <span>${f.question}</span>
        <span class="faq-chevron">▾</span>
      </button>
      <div class="faq-answer"><p>${f.answer}</p></div>
    </div>
  `).join('');
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

Promise.all([
  fetch('data/home.json').then(r => r.json()),
  fetch('data/events.json').then(r => r.json()),
  fetch('data/products.json').then(r => r.json()),
  fetch('data/shows.json').then(r => r.json()),
  fetch('data/hosted-shows.json').then(r => r.json()),
  fetch('data/wantlist.json').then(r => r.json()),
  fetch('data/about.json').then(r => r.json()),
  fetch('data/faq.json').then(r => r.json()),
]).then(([home, events, products, shows, hostedShows, wantlist, about, faq]) => {
  renderHome(home);
  renderHostedPromo(hostedShows.shows);
  renderHostedShows(hostedShows.shows);
  renderEvents(events);
  renderStore(products);
  renderShows(shows);
  renderSell(wantlist);
  renderAbout(about);
  renderFaq(faq);
}).catch(err => console.error('Failed to load content:', err));

function toggleFaq(i) {
  const item = document.getElementById(`faq-${i}`);
  item.classList.toggle('open');
}


// ── Netlify Identity ──────────────────────────────────────────────────────────

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    }
  });
}
