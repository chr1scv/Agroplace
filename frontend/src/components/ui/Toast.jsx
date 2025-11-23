import React, { useEffect } from 'react';
import './Toast.css';

export const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    const colors = {
        success: 'toast-success',
        error: 'toast-error',
        info: 'toast-info',
        warning: 'toast-warning'
    };

    return (
        <div className={`toast-modern ${colors[type]}`}>
            <div className="toast-icon-modern">{icons[type]}</div>
            <div className="toast-message-modern">{message}</div>
            <button onClick={onClose} className="toast-close-modern">✕</button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container-modern">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};
