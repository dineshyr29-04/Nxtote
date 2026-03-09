// src/components/DarkModeToggler.jsx
import { useState, useEffect } from 'react';

export default function DarkModeToggler() {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });

  // Runs whenever isDark changes -> apply attribute and persist
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [isDark]);

  return (
    <>
    
    <div className="theme-toggle">
      <button
        type="button"
        className={`switch-btn ${isDark ? 'is-dark' : ''}`}
        aria-pressed={isDark}
        onClick={() => setIsDark(v => !v)}
      >
        <h1 className="suretext">Change to Dark</h1>
        <div className={`toggle ${isDark ? 'is-dark' : ''}`}>
          <div className="led" />
        </div>
      </button>
    </div>
    </>
  );
}