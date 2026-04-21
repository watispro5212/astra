import React, { useState, useEffect } from 'react';

export default function Dashboard({ token, guild, onBack }) {
  const [activePage, setActivePage] = useState('overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch stats or overview data
    if (activePage === 'overview') {
      fetch('http://localhost:8080/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
    }
  }, [activePage, token]);

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { divider: true, label: 'Configuration' },
    { id: 'general', icon: '⚙️', label: 'General' },
    { id: 'welcome', icon: '👋', label: 'Welcome' },
    { id: 'automod', icon: '🛡️', label: 'AutoMod' },
    { id: 'tickets', icon: '🎫', label: 'Tickets' },
    { id: 'antiraid', icon: '🚨', label: 'Anti-Raid' },
    { id: 'birthdays', icon: '🎂', label: 'Birthdays' },
    { id: 'suggestions', icon: '💡', label: 'Suggestions' },
    { id: 'economy', icon: '💰', label: 'Economy' },
    { id: 'leveling', icon: '🏆', label: 'Leveling' },
    { id: 'starboard', icon: '⭐', label: 'Starboard' },
  ];

  return (
    <div className="view fade-in">
      <header className="topbar topbar--dash">
        <div className="topbar__brand">
          <span className="topbar__title">Astra Dashboard</span>
          <span className="topbar__version">v5.0.0</span>
        </div>
        <div className="topbar__center">
          <button type="button" className="guild-switcher" onClick={onBack}>
            {guild.icon ? (
              <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt="" className="gs-icon" />
            ) : (
              <div className="gs-icon" style={{background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>{guild.name.charAt(0)}</div>
            )}
            <span id="gs-name">{guild.name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{marginLeft: '4px'}}><path d="M6 8L1 3h10z"/></svg>
          </button>
        </div>
        <div className="topbar__right">
          <div className="topbar__status">
            <div className="topbar__dot"></div>
            <span>Connected</span>
          </div>
        </div>
      </header>

      <div className="dash-layout">
        <aside className="sidebar">
          <nav className="sidebar__nav">
            {navItems.map((item, i) => (
              item.divider ? (
                <div key={`div-${i}`} className="sidebar__divider">{item.label}</div>
              ) : (
                <a 
                  key={item.id} 
                  className={`sidebar__link ${activePage === item.id ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
                  href="#"
                >
                  {item.icon} {item.label}
                </a>
              )
            ))}
          </nav>
        </aside>

        <main className="dash-main">
          {activePage === 'overview' && (
            <div className="dash-page fade-in">
              <div className="page-header">
                <h2 className="page-title">📊 Overview</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card__icon">🏙️</div>
                  <div className="stat-card__value">{stats ? stats.guilds : <div className="skeleton skeleton-stat"></div>}</div>
                  <div className="stat-card__label">Servers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__icon">👥</div>
                  <div className="stat-card__value">{stats ? stats.users : <div className="skeleton skeleton-stat"></div>}</div>
                  <div className="stat-card__label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__icon">📡</div>
                  <div className="stat-card__value">{stats ? `${stats.latency_ms}ms` : <div className="skeleton skeleton-stat"></div>}</div>
                  <div className="stat-card__label">Latency</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__icon">🧠</div>
                  <div className="stat-card__value">{stats ? `${stats.memory_mb}MB` : <div className="skeleton skeleton-stat"></div>}</div>
                  <div className="stat-card__label">Memory</div>
                </div>
              </div>
            </div>
          )}
          {activePage !== 'overview' && (
            <div className="dash-page fade-in">
              <div className="page-header">
                <h2 className="page-title">🚧 Under Construction</h2>
                <p className="page-sub">The {activePage} configuration panel is being built.</p>
              </div>
              <div className="glass-card" style={{padding: '40px', textAlign: 'center'}}>
                <span style={{fontSize: '3rem'}}>🛠️</span>
                <p style={{marginTop: '20px', color: 'var(--text-secondary)'}}>
                  React component for {activePage} settings will be rendered here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
