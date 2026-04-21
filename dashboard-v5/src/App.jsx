import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in URL or local storage (simplified for now)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('astra_token', token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    } else if (localStorage.getItem('astra_token')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/login';
  };

  return (
    <>
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-glow" aria-hidden="true"></div>

      {!isAuthenticated ? (
        <div className="view login-wrap">
          <div className="login-card">
            <h1 className="login-title">Astra Dashboard v5</h1>
            <p className="login-sub">Sign in with Discord to manage your server settings.</p>
            <button onClick={handleLogin} className="btn-discord">
              <svg width="20" height="20" viewBox="0 0 71 55" fill="currentColor" aria-hidden="true">
                <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.7a40.5 40.5 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.3 0A40 40 0 0 0 25.6.7 58.4 58.4 0 0 0 11 4.9C1.6 19 -1 32.7.3 46.2a59 59 0 0 0 17.9 9 44 44 0 0 0 3.8-6.2 38.4 38.4 0 0 1-6-2.9l1.5-1.2a42 42 0 0 0 36 0l1.5 1.2a38.4 38.4 0 0 1-6 2.9 44 44 0 0 0 3.8 6.2 58.8 58.8 0 0 0 17.9-9C72 30.6 68.2 17 60.1 4.9ZM23.8 38c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.4 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Z"/>
              </svg>
              Login with Discord
            </button>
            <p className="login-note">Only servers where you have <strong>Manage Server</strong> permission will appear.</p>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <header className="topbar">
            <div className="topbar__brand">
              <span className="topbar__title">Astra Dashboard</span>
              <span className="topbar__version">v5.0.0</span>
            </div>
            <div className="topbar__right">
              <button onClick={() => {
                localStorage.removeItem('astra_token');
                setIsAuthenticated(false);
              }} className="btn-discord" style={{padding: '8px 16px', fontSize: '0.9rem', marginTop: 0}}>Logout</button>
            </div>
          </header>
          
          <div style={{color: '#f1f5f9', textAlign: 'center', marginTop: '50px'}}>
            <h2>Welcome to Astra v5!</h2>
            <p style={{color: '#94a3b8', marginTop: '10px'}}>The interactive web dashboard is currently under construction.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default App
