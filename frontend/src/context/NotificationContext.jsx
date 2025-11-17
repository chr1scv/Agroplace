import React, { createContext, useContext, useReducer } from 'react';

// Crear el Context
const NotificationContext = createContext();

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    ORDER: 'order'
};

// Reducer para manejar las notificaciones
const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications].slice(0, 50) // Limitar a 50 notificaciones
            };
        
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload)
            };
        
        case 'MARK_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification.id === action.payload 
                        ? { ...notification, read: true }
                        : notification
                )
            };
        
        case 'MARK_ALL_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    read: true
                }))
            };
        
        case 'CLEAR_ALL':
            return {
                ...state,
                notifications: []
            };
        
        case 'SET_UNREAD_COUNT':
            return {
                ...state,
                unreadCount: action.payload
            };
        
        default:
            return state;
    }
};

// Estado inicial
const initialState = {
    notifications: [],
    unreadCount: 0
};

// Provider de Notificaciones
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    // Calcular notificaciones no leídas
    React.useEffect(() => {
        const unread = state.notifications.filter(notification => !notification.read).length;
        dispatch({ type: 'SET_UNREAD_COUNT', payload: unread });
    }, [state.notifications]);

    // Acciones
    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: NOTIFICATION_TYPES.INFO,
            title: 'Nueva notificación',
            message: '',
            timestamp: new Date(),
            read: false,
            action: null,
            ...notification
        };
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
        
        // Auto-remover notificaciones después de un tiempo (excepto las de pedido)
        if (notification.type !== NOTIFICATION_TYPES.ORDER) {
            setTimeout(() => {
                removeNotification(id);
            }, 5000);
        }
        
        return id;
    };

    const removeNotification = (id) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    const markAsRead = (id) => {
        dispatch({ type: 'MARK_AS_READ', payload: id });
    };

    const markAllAsRead = () => {
        dispatch({ type: 'MARK_ALL_AS_READ' });
    };

    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    // Métodos helpers para tipos específicos
    const showSuccess = (message, title = '¡Éxito!') => {
        return addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            title,
            message,
            icon: '✅'
        });
    };

    const showError = (message, title = 'Error') => {
        return addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title,
            message,
            icon: '❌'
        });
    };

    const showWarning = (message, title = 'Advertencia') => {
        return addNotification({
            type: NOTIFICATION_TYPES.WARNING,
            title,
            message,
            icon: '⚠️'
        });
    };

    const showInfo = (message, title = 'Información') => {
        return addNotification({
            type: NOTIFICATION_TYPES.INFO,
            title,
            message,
            icon: 'ℹ️'
        });
    };

    const showOrderNotification = (orderData) => {
        return addNotification({
            type: NOTIFICATION_TYPES.ORDER,
            title: '📦 Nuevo Pedido',
            message: `Tienes un nuevo pedido #${orderData.id}`,
            orderId: orderData.id,
            timestamp: new Date(),
            read: false,
            action: {
                label: 'Ver Pedido',
                path: `/vendedor/pedidos`
            }
        });
    };

    const value = {
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showOrderNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

// Componente contenedor de notificaciones (toast)
const NotificationContainer = () => {
    const { notifications, removeNotification } = useContext(NotificationContext);

    // Filtrar solo notificaciones toast (no las de pedido)
    const toastNotifications = notifications.filter(
        notification => notification.type !== NOTIFICATION_TYPES.ORDER
    );

    return (
        <div style={containerStyles}>
            {toastNotifications.map(notification => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

// Componente Toast individual
const NotificationToast = ({ notification, onClose }) => {
    const [isLeaving, setIsLeaving] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getToastStyle = (type) => {
        const styles = {
            [NOTIFICATION_TYPES.SUCCESS]: {
                backgroundColor: '#4caf50',
                borderColor: '#45a049'
            },
            [NOTIFICATION_TYPES.ERROR]: {
                backgroundColor: '#f44336',
                borderColor: '#d32f2f'
            },
            [NOTIFICATION_TYPES.WARNING]: {
                backgroundColor: '#ff9800',
                borderColor: '#f57c00'
            },
            [NOTIFICATION_TYPES.INFO]: {
                backgroundColor: '#2196f3',
                borderColor: '#1976d2'
            }
        };
        return styles[type] || styles[NOTIFICATION_TYPES.INFO];
    };

    return (
        <div
            style={{
                ...toastStyles,
                ...getToastStyle(notification.type),
                transform: isLeaving ? 'translateX(100%)' : 'translateX(0)',
                opacity: isLeaving ? 0 : 1
            }}
        >
            <div style={toastHeaderStyles}>
                <span style={toastIconStyles}>{notification.icon}</span>
                <strong style={toastTitleStyles}>{notification.title}</strong>
                <button onClick={onClose} style={toastCloseStyles}>
                    ×
                </button>
            </div>
            <div style={toastMessageStyles}>{notification.message}</div>
        </div>
    );
};

// Hook personalizado para usar notificaciones
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
    }
    return context;
};

// Estilos
const containerStyles = {
    position: 'fixed',
    top: '80px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px'
};

const toastStyles = {
    padding: '15px',
    borderRadius: '8px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderLeft: '4px solid',
    transition: 'all 0.3s ease',
    minWidth: '300px'
};

const toastHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
};

const toastIconStyles = {
    fontSize: '16px'
};

const toastTitleStyles = {
    flex: 1,
    fontSize: '14px',
    margin: 0
};

const toastCloseStyles = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const toastMessageStyles = {
    fontSize: '13px',
    lineHeight: '1.4',
    margin: 0,
    opacity: 0.9
};

export default NotificationContext;