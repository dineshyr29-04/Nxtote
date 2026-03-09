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
    <button
      onClick={() => setIsDark(v => !v)}
      aria-pressed={isDark}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        background: isDark ? '#111827' : '#e5e7eb',
        color: isDark ? '#fff' : '#111'
      }}
    >
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}