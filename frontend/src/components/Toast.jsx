import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = () => {
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '0.95rem',
            fontWeight: '500',
        };

        const typeStyles = {
            success: {
                background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.95), rgba(71, 168, 85, 0.95))',
                color: 'white',
                border: '1px solid rgba(45, 122, 62, 0.3)',
            },
            error: {
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(239, 68, 68, 0.95))',
                color: 'white',
                border: '1px solid rgba(220, 38, 38, 0.3)',
            },
            warning: {
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(255, 193, 7, 0.95))',
                color: 'white',
                border: '1px solid rgba(255, 152, 0, 0.3)',
            },
            info: {
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(66, 165, 245, 0.95))',
                color: 'white',
                border: '1px solid rgba(33, 150, 243, 0.3)',
            }
        };

        return { ...baseStyles, ...typeStyles[type] };
    };

    const getIcon = () => {
        const icons = {
            success: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            ),
            error: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            ),
            warning: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            ),
            info: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            )
        };
        return icons[type];
    };

    return (
        <>
            <div style={getStyles()}>
                <div style={{ flexShrink: 0 }}>
                    {getIcon()}
                </div>
                <div style={{ flex: 1 }}>
                    {message}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8,
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <style>
                {`
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default Toast;