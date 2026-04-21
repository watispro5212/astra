import React, { useEffect, useState } from 'react';

const GUILD_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1494879804615561238&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D1494879804615561238&integration_type=0&scope=bot+guilds+email+identify+applications.commands+applications.commands.permissions.update+openid";
const USER_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1494879804615561238&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D1494879804615561238&integration_type=1&scope=applications.commands";

export default function GuildPicker({ token, onSelectGuild, onLogout }) {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/guilds', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setGuilds(data.guilds || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const handleGuildClick = (guild) => {
    if (guild.bot_in) {
      onSelectGuild(guild);
    } else {
      window.open(GUILD_INVITE_URL, '_blank');
    }
  };

  return (
    <div className="view">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__title">Astra Dashboard</span>
          <span className="topbar__version">v5.0.0</span>
        </div>
        <div className="topbar__right">
          <button type="button" className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>
      
      <div className="guilds-wrap fade-in">
        <div className="guilds-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="guilds-title">Select a Server</h2>
            <p className="guilds-sub">Choose the server you want to configure.</p>
          </div>
          <button 
            onClick={() => window.open(USER_INVITE_URL, '_blank')}
            className="btn-discord" 
            style={{ margin: 0, background: 'var(--accent-secondary)', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)' }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '6px' }}>✨</span>
            Install to Profile
          </button>
        </div>
        
        {loading ? (
          <div className="guilds-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="guild-card">
                <div className="skeleton skeleton-stat" style={{width: '64px', height: '64px', borderRadius: '16px'}}></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="guilds-grid">
            {guilds.map(guild => (
              <div 
                key={guild.id} 
                className={`guild-card ${!guild.bot_in ? 'guild-card--inactive' : ''}`}
                onClick={() => handleGuildClick(guild)}
              >
                {guild.icon ? (
                  <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} className="guild-card__icon" />
                ) : (
                  <div className="guild-card__icon guild-card__icon--fallback">{guild.name.charAt(0)}</div>
                )}
                <div className="guild-card__name">{guild.name}</div>
                <div className={`guild-badge ${guild.bot_in ? 'guild-badge--in' : 'guild-badge--out'}`}>
                  {guild.bot_in ? 'Bot is here' : 'Invite Bot'}
                </div>
              </div>
            ))}
            {guilds.length === 0 && <p className="guilds-empty">No manageable servers found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
