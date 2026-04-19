/* ═══════════════════════════════════════════════════════════════════════════
   ASTRA DASHBOARD — Client Logic
   ═══════════════════════════════════════════════════════════════════════════ */

// ── CONFIGURATION ──────────────────────────────────────────────────────────
// This should point to your BOT's API (Railway), not the dashboard host (Vercel).
// For local development, use http://localhost:8080
const API_BASE = 'https://astra-production-e103.up.railway.app';

const REFRESH_INTERVAL = 30; // seconds

// ── STATE ──────────────────────────────────────────────────────────────────
let countdown = REFRESH_INTERVAL;
let connectionStatus = 'connecting'; // 'online' | 'offline' | 'connecting'

// ── HELPERS ────────────────────────────────────────────────────────────────

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function animateValue(el, start, end, duration = 800) {
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(start + (end - start) * eased);
    el.textContent = formatNumber(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function setConnectionStatus(status) {
  connectionStatus = status;
  const dot = document.getElementById('conn-dot');
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
    label.textContent = 'Connecting...';
  }
}

function skeletonHTML(count, cls = 'skeleton-row') {
  return Array.from({ length: count }, () => `<div class="skeleton ${cls}"></div>`).join('');
}

function timeAgo(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString.replace(' ', 'T'));
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ── API FETCHERS ──────────────────────────────────────────────────────────

async function fetchJSON(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadStats() {
  try {
    const data = await fetchJSON('/api/stats');
    setConnectionStatus('online');

    const cards = [
      { id: 'stat-guilds', value: data.guilds, icon: '🏙️' },
      { id: 'stat-users', value: data.users, icon: '👥' },
      { id: 'stat-channels', value: data.channels, icon: '💬' },
      { id: 'stat-commands', value: data.commands_loaded, icon: '⚡' },
      { id: 'stat-memory', value: data.memory_mb, icon: '🧠', suffix: ' MB' },
      { id: 'stat-latency', value: data.latency_ms, icon: '📡', suffix: 'ms' },
    ];

    cards.forEach(({ id, value, suffix }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const old = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
      if (suffix) {
        el.textContent = value + suffix;
      } else {
        animateValue(el, old, value);
      }
    });

    // Uptime
    const uptimeEl = document.getElementById('stat-uptime');
    if (uptimeEl) uptimeEl.textContent = formatUptime(data.uptime_seconds);

    // Meta badges
    const pyVer = document.getElementById('meta-python');
    const dpyVer = document.getElementById('meta-dpy');
    if (pyVer) pyVer.textContent = `Python ${data.python_version}`;
    if (dpyVer) dpyVer.textContent = `discord.py ${data.discord_py_version}`;

  } catch (err) {
    console.warn('Stats fetch failed:', err);
    setConnectionStatus('offline');
  }
}

async function loadModules() {
  const container = document.getElementById('modules-list');
  if (!container) return;

  try {
    const data = await fetchJSON('/api/modules');

    if (!data.modules || data.modules.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📦</div>No modules loaded</div>';
      return;
    }

    container.innerHTML = data.modules.map(mod => `
      <div class="module-row fade-in">
        <div class="module-row__info">
          <div class="module-row__dot${mod.status !== 'online' ? ' module-row__dot--offline' : ''}"></div>
          <span class="module-row__name">${mod.name}</span>
        </div>
        <div class="module-row__meta">
          ${mod.commands > 0 ? `<span class="module-row__badge">${mod.commands} cmd${mod.commands !== 1 ? 's' : ''}</span>` : ''}
          ${mod.listeners > 0 ? `<span class="module-row__badge">${mod.listeners} event${mod.listeners !== 1 ? 's' : ''}</span>` : ''}
        </div>
      </div>
    `).join('');

    // Update total count badge
    const badge = document.getElementById('modules-count');
    if (badge) badge.textContent = `${data.total} loaded`;

  } catch (err) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠️</div>Could not load modules</div>';
  }
}

async function loadModeration() {
  const container = document.getElementById('mod-table-body');
  if (!container) return;

  try {
    const data = await fetchJSON('/api/moderation');

    if (!data.cases || data.cases.length === 0) {
      container.innerHTML = '<tr><td colspan="5" class="empty-state">No recent cases</td></tr>';
      return;
    }

    container.innerHTML = data.cases.slice(0, 8).map(c => {
      const actionClass = `action-badge--${c.type}`;
      return `
        <tr class="fade-in">
          <td>#${c.case_number || '—'}</td>
          <td><span class="action-badge ${actionClass}">${c.type}</span></td>
          <td>${c.target_id}</td>
          <td title="${c.reason}">${(c.reason || '').substring(0, 30)}${(c.reason || '').length > 30 ? '…' : ''}</td>
          <td>${timeAgo(c.timestamp)}</td>
        </tr>`;
    }).join('');

  } catch (err) {
    container.innerHTML = '<tr><td colspan="5" class="empty-state">Could not load cases</td></tr>';
  }
}

async function loadEconomy() {
  const container = document.getElementById('economy-list');
  if (!container) return;

  try {
    const data = await fetchJSON('/api/economy');

    if (!data.leaderboard || data.leaderboard.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">💰</div>No economy data yet</div>';
      return;
    }

    container.innerHTML = data.leaderboard.map((entry, i) => {
      const rankClass = i === 0 ? 'leader-row__rank--gold' : i === 1 ? 'leader-row__rank--silver' : i === 2 ? 'leader-row__rank--bronze' : '';
      return `
        <div class="leader-row fade-in">
          <div class="leader-row__rank ${rankClass}">${i + 1}</div>
          <div class="leader-row__info">
            <span class="leader-row__name">User ${entry.user_id.slice(-4)}</span>
          </div>
          <span class="leader-row__coins">🪙 ${formatNumber(entry.balance)}</span>
        </div>`;
    }).join('');

  } catch (err) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠️</div>Could not load economy</div>';
  }
}

// ── MASTER REFRESH ────────────────────────────────────────────────────────

async function refreshAll() {
  await Promise.allSettled([
    loadStats(),
    loadModules(),
    loadModeration(),
    loadEconomy(),
  ]);
  countdown = REFRESH_INTERVAL;
}

// ── COUNTDOWN TIMER ───────────────────────────────────────────────────────

function startCountdown() {
  setInterval(() => {
    countdown--;
    const el = document.getElementById('refresh-timer');
    if (el) el.textContent = `${countdown}s`;
    if (countdown <= 0) refreshAll();
  }, 1000);
}

// ── INIT ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setConnectionStatus('connecting');
  refreshAll();
  startCountdown();
});
