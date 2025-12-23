import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import '../../styles/NotificationDialog.css';

const NotificationDialog = ({ isOpen, message, isSuccess, onClose, onRetry }) => {
    if (!isOpen) return null;

    return (
        <div className="notification-dialog-overlay">
            <div className={`notification-dialog ${isSuccess ? 'success' : 'error'}`}>
                <div className="notification-icon">
                    {isSuccess ? (
                        <FaCheckCircle size={40} color="#4caf50" />
                    ) : (
                        <FaExclamationCircle size={40} color="#d32f2f" />
                    )}
                </div>
                <h3>{isSuccess ? 'Success' : 'Error'}</h3>
                <p>{message}</p>
                <div className="notification-buttons">
                    {!isSuccess && onRetry && (
                        <button onClick={onRetry} className="notification-retry-btn">
                            Try Again
                        </button>
                    )}
                    <button onClick={onClose} className="notification-close-btn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDialog;