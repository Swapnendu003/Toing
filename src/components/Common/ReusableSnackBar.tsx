import React, { useEffect, useState } from 'react';
import '@/styles/SnackBar.scss';

interface SnackBarProps {
  message: string;
 
  onClose?: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  mode?: 'light' | 'dark';
}

const SnackBar: React.FC<SnackBarProps> = ({
  message,
  onClose,
  duration = 3000,
  type = 'info',
  mode = 'light',
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`snackbar ${visible ? 'show' : ''} ${type} ${mode}`}>
      <span className="message">{message}</span>
      
      <button className="close" onClick={() => setVisible(false)}>
        &times;
      </button>
      <div className={`progress-bar ${type} ${visible ? 'running' : ''}`} />
    </div>
  );
};

export default SnackBar;
