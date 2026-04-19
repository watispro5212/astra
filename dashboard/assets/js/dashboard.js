/* ═══════════════════════════════════════════════════════════════════════════
   ASTRA DASHBOARD — SPA Client
   ═══════════════════════════════════════════════════════════════════════════ */

const API_BASE   = 'https://astra-production-e103.up.railway.app';
const REFRESH_INTERVAL = 30;

// ── State ──────────────────────────────────────────────────────────────────

let token         = null;   // JWT from localStorage
let currentUser   = null;   // decoded user payload
let currentGuildId = null;  // selected guild
let guildInfo     = null;   // channels + roles for selected guild
let countdown     = REFRESH_INTERVAL;
let refreshTimer  = null;

// ── Token helpers ──────────────────────────────────────────────────────────

function saveToken(t) {
  token = t;
  localStorage.setItem('astra_token', t);
  try {
    const [data] = t.split('.');
    const pad = data + '='.repeat((4 - data.length % 4) % 4);
    currentUser = JSON.parse(atob(pad));
  } catch {
    currentUser = null;
  }
}

function loadStoredToken() {
  const stored = localStorage.getItem('astra_token');
  if (!stored) return false;
  try {
    const [data] = stored.split('.');
    const pad = data + '='.repeat((4 - data.length % 4) % 4);
    const payload = JSON.parse(atob(pad));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem('astra_token');
      return false;
    }
    token = stored;
    currentUser = payload;
    return true;
  } catch {
    return false;
  }
}

function logout() {
  localStorage.removeItem('astra_token');
  localStorage.removeItem('astra_guild');
  token = null;
  currentUser = null;
  currentGuildId = null;
  guildInfo = null;
  showView('login');
}

// ── API helpers ────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) { logout(); return null; }
  return res;
}

async function apiGet(path) {
  const res = await apiFetch(path);
  if (!res || !res.ok) return null;
  return res.json();
}

async function apiPost(path, body) {
  const res = await apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
  if (!res) return null;
  return res.json();
}

// ── View switching ─────────────────────────────────────────────────────────

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById(`view-${name}`);
  if (el) el.classList.remove('hidden');
}

function showPage(name) {
  document.querySelectorAll('.dash-page').forEach(p => p.classList.add('hidden'));
  const el = document.getElementById(`page-${name}`);
  if (el) el.classList.remove('hidden');
  document.querySelectorAll('.sidebar__link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });
  if (name !== 'overview') loadConfigPage(name);
}

// ── User UI ────────────────────────────────────────────────────────────────

function renderUserBadge(containerId) {
  const el = document.getElementById(containerId);
  if (!el || !currentUser) return;
  const avatar = currentUser.avatar
    ? `https://cdn.discordapp.com/avatars/${currentUser.user_id}/${currentUser.avatar}.png?size=32`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;
  el.innerHTML = `<img src="${avatar}" alt="${currentUser.username}" class="user-avatar" /><span class="user-name">${currentUser.username}</span>`;
}

// ── Guild picker ───────────────────────────────────────────────────────────

function renderGuildPicker() {
  renderUserBadge('topbar-user');
  const guilds = currentUser?.guilds || [];
  const grid = document.getElementById('guilds-grid');
  if (!grid) return;

  if (guilds.length === 0) {
    grid.innerHTML = '<p class="guilds-empty">No servers found where you have <strong>Manage Server</strong> permission and Astra is present.</p>';
    return;
  }

  grid.innerHTML = guilds.map(g => {
    const icon = g.icon
      ? `<img src="https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64" alt="${g.name}" class="guild-card__icon" />`
      : `<div class="guild-card__icon guild-card__icon--fallback">${g.name[0]}</div>`;
    const badge = g.bot_in
      ? '<span class="guild-badge guild-badge--in">Bot Active</span>'
      : '<span class="guild-badge guild-badge--out">Invite Bot</span>';
    return `
      <button type="button" class="guild-card glass-card ${g.bot_in ? '' : 'guild-card--inactive'}" data-gid="${g.id}" data-bot="${g.bot_in}">
        ${icon}
        <div class="guild-card__name">${escapeHtml(g.name)}</div>
        ${badge}
      </button>`;
  }).join('');

  grid.querySelectorAll('.guild-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const gid = btn.dataset.gid;
      const botIn = btn.dataset.bot === 'true';
      if (!botIn) {
        const inviteUrl = `https://discord.com/oauth2/authorize?client_id=1494879804615561238&permissions=8&scope=bot+applications.commands&guild_id=${gid}`;
        window.open(inviteUrl, '_blank');
        return;
      }
      selectGuild(gid);
    });
  });
}

async function selectGuild(gid) {
  currentGuildId = gid;
  localStorage.setItem('astra_guild', gid);

  const guild = currentUser.guilds.find(g => g.id === gid);
  if (!guild) return;

  // Fetch channels + roles
  const info = await apiGet(`/api/guild/${gid}/info`);
  if (!info) { showToast('Failed to load server info.', 'error'); return; }
  guildInfo = info;

  // Update topbar guild switcher
  const gsIcon = document.getElementById('gs-icon');
  const gsName = document.getElementById('gs-name');
  if (gsIcon && gsName) {
    if (guild.icon) {
      gsIcon.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32`;
      gsIcon.classList.remove('hidden');
    }
    gsName.textContent = guild.name;
  }

  renderUserBadge('topbar-user-dash');
  showView('dashboard');
  showPage('overview');
  startAutoRefresh();
}

// ── Channel / Role selects population ────────────────────────────────────

function populateSelects(form) {
  if (!guildInfo) return;
  form.querySelectorAll('select[data-type]').forEach(sel => {
    const type = sel.dataset.type;
    const current = sel.value;
    // keep first <option value="">None / default</option>
    const first = sel.options[0];
    sel.innerHTML = '';
    sel.appendChild(first);

    let items = [];
    if (type === 'text-channels') {
      items = guildInfo.channels.filter(c => c.type === 0);
    } else if (type === 'categories') {
      items = guildInfo.channels.filter(c => c.type === 4);
    } else if (type === 'roles') {
      items = guildInfo.roles;
    }

    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = type === 'roles' ? `@${item.name}` : `#${item.name}`;
      if (item.id === current) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

// ── Config loading ─────────────────────────────────────────────────────────

async function loadConfigPage(section) {
  const form = document.getElementById(`form-${section}`);
  if (!form || !currentGuildId) return;

  const data = await apiGet(`/api/config/${currentGuildId}`);
  if (!data) return;

  const cfg = data[section] || {};
  populateSelects(form);

  // Populate fields
  form.querySelectorAll('[name]').forEach(el => {
    const key = el.name;
    if (!(key in cfg)) return;
    const val = cfg[key];
    if (el.type === 'checkbox') {
      el.checked = Boolean(val);
    } else {
      el.value = val ?? '';
    }
  });
}

// ── Config saving ──────────────────────────────────────────────────────────

async function saveConfigForm(form) {
  const endpoint = form.dataset.endpoint;
  const status   = document.getElementById(`save-${endpoint}`);
  const btn      = form.querySelector('.btn-save');

  if (!currentGuildId || !endpoint) return;

  btn.disabled = true;
  btn.textContent = 'Saving…';
  if (status) { status.textContent = ''; status.className = 'save-status'; }

  const body = {};
  form.querySelectorAll('[name]').forEach(el => {
    if (el.type === 'checkbox') {
      body[el.name] = el.checked;
    } else {
      body[el.name] = el.value || null;
    }
  });

  const res = await apiPost(`/api/config/${currentGuildId}/${endpoint}`, body);

  btn.disabled = false;
  btn.textContent = 'Save Changes';

  if (res?.ok) {
    if (status) { status.textContent = '✓ Saved'; status.className = 'save-status save-status--ok'; }
    showToast('Settings saved!', 'success');
    setTimeout(() => { if (status) status.textContent = ''; }, 3000);
  } else {
    if (status) { status.textContent = '✗ Failed'; status.className = 'save-status save-status--err'; }
    showToast('Failed to save settings.', 'error');
  }
}

// ── Overview data loaders ─────────────────────────────────────────────────

function formatUptime(s) {
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

function animateValue(el, start, end, dur = 800) {
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = formatNum(Math.floor(start + (end - start) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diff = Math.floor((Date.now() - new Date(iso.replace(' ', 'T'))) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function setConnectionStatus(status) {
  const dot   = document.getElementById('conn-dot');
  const label = document.getElementById('conn-label');
  if (!dot || !label) return;
  dot.className = 'topbar__dot';
  if (status === 'online') {
    label.textContent = 'Connected';
  } else if (status === 'offline') {
    dot.classList.add('topbar__dot--offline');
    label.textContent = 'Disconnected';
  } else {
    dot.classList.add('topbar__dot--connecting');
    label.textContent = 'Connecting…';
  }
}

async function loadStats() {
  try {
    const data = await apiGet('/api/stats');
    if (!data) { setConnectionStatus('offline'); return; }
    setConnectionStatus('online');
    [
      ['stat-guilds',   data.guilds],
      ['stat-users',    data.users],
      ['stat-channels', data.channels],
      ['stat-commands', data.commands_loaded],
    ].forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (!el) return;
      animateValue(el, parseInt(el.textContent.replace(/\D/g, '')) || 0, val);
    });
    const mem = document.getElementById('stat-memory');
    const lat = document.getElementById('stat-latency');
    if (mem) mem.textContent = data.memory_mb + ' MB';
    if (lat) lat.textContent = data.latency_ms + 'ms';
    const py  = document.getElementById('meta-python');
    const dpy = document.getElementById('meta-dpy');
    if (py)  py.textContent  = `Python ${data.python_version}`;
    if (dpy) dpy.textContent = `discord.py ${data.discord_py_version}`;
  } catch { setConnectionStatus('offline'); }
}

async function loadModules() {
  const el = document.getElementById('modules-list');
  if (!el) return;
  try {
    const data = await apiGet('/api/modules');
    if (!data?.modules?.length) { el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📦</div>No modules loaded</div>'; return; }
    el.innerHTML = data.modules.map(m => `
      <div class="module-row fade-in">
        <div class="module-row__info"><div class="module-row__dot${m.status !== 'online' ? ' module-row__dot--offline' : ''}"></div><span class="module-row__name">${m.name}</span></div>
        <div class="module-row__meta">${m.commands > 0 ? `<span class="module-row__badge">${m.commands} cmd${m.commands !== 1 ? 's' : ''}</span>` : ''}${m.listeners > 0 ? `<span class="module-row__badge">${m.listeners} event${m.listeners !== 1 ? 's' : ''}</span>` : ''}</div>
      </div>`).join('');
    const badge = document.getElementById('modules-count');
    if (badge) badge.textContent = `${data.total} loaded`;
  } catch { el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠️</div>Could not load modules</div>'; }
}

async function loadModeration() {
  const el = document.getElementById('mod-table-body');
  if (!el) return;
  try {
    const data = await apiGet('/api/moderation');
    if (!data?.cases?.length) { el.innerHTML = '<tr><td colspan="5" class="empty-state">No recent cases</td></tr>'; return; }
    el.innerHTML = data.cases.slice(0, 8).map(c => `
      <tr class="fade-in">
        <td>#${c.case_number || '—'}</td>
        <td><span class="action-badge action-badge--${c.type}">${c.type}</span></td>
        <td>${c.target_id}</td>
        <td title="${escapeHtml(c.reason || '')}">${escapeHtml((c.reason || '').substring(0, 30))}${(c.reason || '').length > 30 ? '…' : ''}</td>
        <td>${timeAgo(c.timestamp)}</td>
      </tr>`).join('');
  } catch { el.innerHTML = '<tr><td colspan="5" class="empty-state">Could not load cases</td></tr>'; }
}

async function loadEconomy() {
  const el = document.getElementById('economy-list');
  if (!el) return;
  try {
    const data = await apiGet('/api/economy');
    if (!data?.leaderboard?.length) { el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">💰</div>No economy data</div>'; return; }
    el.innerHTML = data.leaderboard.map((e, i) => {
      const cls = i === 0 ? 'leader-row__rank--gold' : i === 1 ? 'leader-row__rank--silver' : i === 2 ? 'leader-row__rank--bronze' : '';
      return `<div class="leader-row fade-in"><div class="leader-row__rank ${cls}">${i + 1}</div><div class="leader-row__info"><span class="leader-row__name">User …${e.user_id.slice(-4)}</span></div><span class="leader-row__coins">🪙 ${formatNum(e.balance)}</span></div>`;
    }).join('');
  } catch { el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠️</div>Could not load economy</div>'; }
}

async function refreshAll() {
  await Promise.allSettled([loadStats(), loadModules(), loadModeration(), loadEconomy()]);
  countdown = REFRESH_INTERVAL;
}

// ── Auto-refresh ───────────────────────────────────────────────────────────

function startAutoRefresh() {
  if (refreshTimer) return;
  refreshAll();
  refreshTimer = setInterval(() => {
    countdown--;
    const el = document.getElementById('refresh-timer');
    if (el) el.textContent = `${countdown}s`;
    if (countdown <= 0) refreshAll();
  }, 1000);
}

// ── Toast notifications ────────────────────────────────────────────────────

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Utility ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Initialisation ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Check if this is an OAuth2 callback with a token in the URL
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const authError = params.get('auth_error');

  if (urlToken) {
    saveToken(urlToken);
    // Clean the token from the URL
    history.replaceState({}, '', window.location.pathname);
  }

  if (authError) {
    showView('login');
    showToast('Login failed. Please try again.', 'error');
    return;
  }

  // Check localStorage for existing session
  if (!token && !loadStoredToken()) {
    showView('login');
  } else {
    // Restore previously selected guild
    const savedGuild = localStorage.getItem('astra_guild');
    if (savedGuild && currentUser?.guilds?.some(g => g.id === savedGuild)) {
      // Auto-select stored guild
      selectGuild(savedGuild);
    } else {
      showView('guilds');
      renderGuildPicker();
    }
  }

  // Login button
  document.getElementById('login-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `${API_BASE}/auth/login`;
  });

  // Logout buttons
  ['logout-btn', 'logout-btn-dash'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', logout);
  });

  // Guild switcher → go back to guild picker
  document.getElementById('guild-switcher')?.addEventListener('click', () => {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
    showView('guilds');
    renderGuildPicker();
  });

  // Sidebar navigation
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Config form submissions
  document.querySelectorAll('.config-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveConfigForm(form);
    });
  });
});
