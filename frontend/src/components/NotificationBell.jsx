import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.action) {
            navigate(notification.action.path);
        }
        setIsOpen(false);
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} d`;
        return new Date(timestamp).toLocaleDateString('es-ES');
    };

    const getNotificationIcon = (type) => {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            order: '📦'
        };
        return icons[type] || '🔔';
    };

    const getNotificationStyle = (type) => {
        const styles = {
            success: { backgroundColor: '#e8f5e8', borderColor: '#4caf50' },
            error: { backgroundColor: '#ffebee', borderColor: '#f44336' },
            warning: { backgroundColor: '#fff3e0', borderColor: '#ff9800' },
            info: { backgroundColor: '#e3f2fd', borderColor: '#2196f3' },
            order: { backgroundColor: '#f3e5f5', borderColor: '#9c27b0' }
        };
        return styles[type] || styles.info;
    };

    return (
        <div style={styles.container} ref={dropdownRef}>
            {/* Campana de notificaciones */}
            <div 
                style={styles.bell}
                onClick={() => setIsOpen(!isOpen)}
                className="notification-bell"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={styles.badge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </div>

            {/* Dropdown de notificaciones */}
            {isOpen && (
                <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                        <h3 style={styles.dropdownTitle}>Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                style={styles.markAllReadButton}
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div style={styles.notificationsList}>
                        {notifications.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>🔔</div>
                                <p>No hay notificaciones</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map(notification => (
                                <div
                                    key={notification.id}
                                    style={{
                                        ...styles.notificationItem,
                                        ...getNotificationStyle(notification.type),
                                        ...(!notification.read ? styles.unread : {})
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="notification-item"
                                >
                                    <div style={styles.notificationIcon}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div style={styles.notificationContent}>
                                        <div style={styles.notificationHeader}>
                                            <strong style={styles.notificationTitle}>
                                                {notification.title}
                                            </strong>
                                            {!notification.read && (
                                                <div style={styles.unreadDot}></div>
                                            )}
                                        </div>
                                        <p style={styles.notificationMessage}>
                                            {notification.message}
                                        </p>
                                        <div style={styles.notificationMeta}>
                                            <span style={styles.notificationTime}>
                                                {formatTime(notification.timestamp)}
                                            </span>
                                            {notification.action && (
                                                <span style={styles.actionLabel}>
                                                    {notification.action.label} →
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 10 && (
                        <div style={styles.dropdownFooter}>
                            <button 
                                onClick={() => navigate('/notificaciones')}
                                style={styles.viewAllButton}
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        marginRight: '1rem',
    },
    bell: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1.5rem',
        padding: '0.5rem',
        borderRadius: '50%',
        transition: 'background-color 0.3s',
    },
    badge: {
        position: 'absolute',
        top: '0',
        right: '0',
        backgroundColor: '#ff6b35',
        color: 'white',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: '0',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        width: '380px',
        maxHeight: '500px',
        overflow: 'hidden',
        zIndex: 1001,
        marginTop: '0.5rem',
    },
    dropdownHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    dropdownTitle: {
        margin: '0',
        fontSize: '1.1rem',
        color: '#2d5016',
        fontWeight: 'bold',
    },
    markAllReadButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4a7c1f',
        fontSize: '0.8rem',
        cursor: 'pointer',
        fontWeight: '500',
        textDecoration: 'underline',
    },
    notificationsList: {
        maxHeight: '350px',
        overflowY: 'auto',
    },
    emptyState: {
        padding: '2rem',
        textAlign: 'center',
        color: '#666',
    },
    emptyIcon: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        opacity: 0.5,
    },
    notificationItem: {
        display: 'flex',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #f0f0f0',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        borderLeft: '3px solid',
    },
    unread: {
        backgroundColor: '#f8f9fa',
    },
    notificationIcon: {
        fontSize: '1.2rem',
        marginRight: '1rem',
        flexShrink: 0,
    },
    notificationContent: {
        flex: 1,
        minWidth: 0,
    },
    notificationHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.25rem',
    },
    notificationTitle: {
        fontSize: '0.9rem',
        color: '#333',
        margin: '0',
        lineHeight: '1.3',
    },
    unreadDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#4a7c1f',
        borderRadius: '50%',
        flexShrink: 0,
        marginLeft: '0.5rem',
    },
    notificationMessage: {
        fontSize: '0.8rem',
        color: '#666',
        margin: '0 0 0.5rem 0',
        lineHeight: '1.4',
    },
    notificationMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationTime: {
        fontSize: '0.7rem',
        color: '#999',
    },
    actionLabel: {
        fontSize: '0.7rem',
        color: '#4a7c1f',
        fontWeight: '500',
    },
    dropdownFooter: {
        padding: '1rem 1.5rem',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
    },
    viewAllButton: {
        backgroundColor: 'transparent',
        border: '1px solid #4a7c1f',
        color: '#4a7c1f',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '500',
    },
};

// Agregar estilos hover
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    .notification-bell:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
    }
    .notification-item:hover {
        background-color: #f0f0f0 !important;
    }
`;
document.head.appendChild(styleSheet);

export default NotificationBell;