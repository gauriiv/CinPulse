import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import styles from '../styles';

const Toast = () => {
  const { message, clear } = useNotification();
  if (!message) return null;
  return (
    <div style={styles.toast} onClick={clear}>
      {message}
    </div>
  );
};

export default Toast; 