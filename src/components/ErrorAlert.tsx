import React from 'react';
interface ErrorAlertProps {
  message: string | null;
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-alert" role="alert">
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="close-error-button" 
          aria-label="Dismiss error message"
          type="button"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
