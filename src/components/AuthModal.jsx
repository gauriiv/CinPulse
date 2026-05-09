import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import styles from '../styles';

const AuthModal = ({ open, mode, onClose, onAuth }) => {
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const notify = useNotification();

  useEffect(() => {
    setTab(mode);
    setEmail('');
    setPassword('');
  }, [mode, open]);

  const handleSubmit = e => {
    e.preventDefault();
    notify(`Welcome, ${email.split('@')[0]}! (Demo only)`);
    onAuth({ email });
    onClose();
  };

  if (!open) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeModal} onClick={onClose} aria-label="Close">&times;</button>
        <div style={styles.modalTabs}>
          <button
            style={{ ...styles.modalTab, ...(tab === 'signin' ? styles.activeTab : {}) }}
            onClick={() => setTab('signin')}
          >Sign In</button>
          <button
            style={{ ...styles.modalTab, ...(tab === 'signup' ? styles.activeTab : {}) }}
            onClick={() => setTab('signup')}
          >Sign Up</button>
        </div>
        <h2 style={styles.modalTitle}>{tab === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        <form style={styles.modalForm} onSubmit={handleSubmit}>
          <input
            style={styles.modalInput}
            type="email"
            placeholder="Email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.modalInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button style={styles.modalSubmit} type="submit">
            {tab === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.85) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal; 