import React from 'react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const Greeting = () => (
  <div
    style={{
      position: 'fixed',
      right: 14,
      bottom: 16,
      background: 'linear-gradient(140deg, rgba(15,23,42,0.96), rgba(30,41,59,0.94))',
      color: '#f8fafc',
      padding: '10px 12px',
      borderRadius: 14,
      border: '1px solid rgba(125, 211, 252, 0.35)',
      boxShadow: '0 12px 24px rgba(2, 6, 23, 0.45)',
      zIndex: 1500,
      letterSpacing: 0.2,
      userSelect: 'none',
      maxWidth: 'calc(100vw - 28px)',
      minWidth: 170,
      animation: 'fadeInUp 0.4s ease both',
      backdropFilter: 'blur(6px)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: '1rem' }} aria-hidden="true">✨</span>
      <strong style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bae6fd' }}>
        CinPulse
      </strong>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          marginLeft: 'auto',
          background: '#22c55e',
          boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.8)',
          animation: 'pulseDot 1.5s infinite',
        }}
        aria-hidden="true"
      />
    </div>

    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>
      {getGreeting()}
    </p>
    <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#cbd5e1' }}>
      Ready for your next movie pick?
    </p>
  </div>
);

export default Greeting;
