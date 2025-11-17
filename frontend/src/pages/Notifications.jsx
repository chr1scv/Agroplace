import React, { useState, useEffect, useContext } from 'react';
import '../styles/Notifications.css';

// Simulamos el contexto de autenticación - ajusta según tu implementación real
const AuthContext = React.createContext();
const useAuth = () => {
  return {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: () => !!localStorage.getItem('user'),
    isAdmin: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.tipo_usuario === 'admin';
    },
    isVendedor: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.tipo_usuario === 'vendedor';
    },
    isCliente: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.tipo_usuario === 'cliente';
    }
  };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAdmin, isVendedor, isCliente } = useAuth();

  // Cargar notificaciones al iniciar y cuando cambia el usuario
  useEffect(() => {
    loadNotifications();
    
    // Simular notificaciones en tiempo real cada 30 segundos
    const interval = setInterval(() => {
      checkNewNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    try {
      // En una implementación real, esto vendría de tu API
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('user_notifications', JSON.stringify(mockNotifications));
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Cargar desde localStorage como fallback
      const stored = localStorage.getItem('user_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    }
  };

  const generateMockNotifications = () => {
    if (!user) return [];
    
    const baseNotifications = [];
    const now = new Date();
    
    // Notificaciones para ADMIN
    if (isAdmin()) {
      baseNotifications.push(
        {
          id: 1,
          type: 'system',
          title: 'Vendedores Pendientes',
          message: 'Tienes 3 solicitudes de vendedores pendientes de revisión',
          timestamp: new Date(now - 3600000), // 1 hora atrás
          read: false,
          priority: 'high',
          action: '/admin/vendedores'
        },
        {
          id: 2,
          type: 'stats',
          title: 'Reporte Semanal',
          message: 'El reporte de ventas de esta semana está listo para revisión',
          timestamp: new Date(now - 86400000), // 1 día atrás
          read: true,
          priority: 'medium',
          action: '/admin/estadisticas'
        },
        {
          id: 3,
          type: 'alert',
          title: 'Stock Bajo',
          message: '5 productos tienen stock crítico',
          timestamp: new Date(now - 7200000), // 2 horas atrás
          read: false,
          priority: 'high',
          action: '/admin/productos'
        }
      );
    }

    // Notificaciones para VENDEDOR
    if (isVendedor()) {
      baseNotifications.push(
        {
          id: 4,
          type: 'order',
          title: 'Nuevo Pedido',
          message: 'Tienes un nuevo pedido #ORD-001 del cliente María González',
          timestamp: new Date(now - 1800000), // 30 minutos atrás
          read: false,
          priority: 'high',
          action: '/vendedor/pedidos'
        },
        {
          id: 5,
          type: 'product',
          title: 'Producto Agotado',
          message: 'Tu producto "Manzanas Orgánicas" se ha agotado',
          timestamp: new Date(now - 43200000), // 12 horas atrás
          read: true,
          priority: 'medium',
          action: '/vendedor/productos'
        },
        {
          id: 6,
          type: 'sales',
          title: 'Meta de Ventas',
          message: 'Has alcanzado el 75% de tu meta mensual de ventas',
          timestamp: new Date(now - 86400000), // 1 día atrás
          read: false,
          priority: 'low',
          action: '/vendedor/estadisticas'
        }
      );
    }

    // Notificaciones para CLIENTE
    if (isCliente()) {
      baseNotifications.push(
        {
          id: 7,
          type: 'order',
          title: 'Pedido En Camino',
          message: 'Tu pedido #ORD-002 está en camino y llegará hoy',
          timestamp: new Date(now - 3600000), // 1 hora atrás
          read: false,
          priority: 'medium',
          action: '/cliente/pedidos'
        },
        {
          id: 8,
          type: 'promotion',
          title: 'Oferta Especial',
          message: '20% de descuento en productos orgánicos esta semana',
          timestamp: new Date(now - 172800000), // 2 días atrás
          read: true,
          priority: 'low',
          action: '/productos?categoria=organico'
        },
        {
          id: 9,
          type: 'product',
          title: 'Producto Disponible',
          message: 'El producto "Aguacates Hass" que seguías está disponible nuevamente',
          timestamp: new Date(now - 21600000), // 6 horas atrás
          read: false,
          priority: 'medium',
          action: '/producto/8'
        }
      );
    }

    // Notificaciones generales para todos los usuarios
    baseNotifications.push(
      {
        id: 10,
        type: 'system',
        title: 'Mantenimiento Programado',
        message: 'El sistema estará en mantenimiento el domingo de 2:00 a 4:00 AM',
        timestamp: new Date(now - 259200000), // 3 días atrás
        read: true,
        priority: 'low',
        action: null
      }
    );

    return baseNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const checkNewNotifications = () => {
    // En una implementación real, harías una petición a tu API
    // Para este ejemplo, generamos notificaciones aleatorias
    if (Math.random() > 0.7) { // 30% de probabilidad de nueva notificación
      const newNotification = generateRandomNotification();
      setNotifications(prev => [newNotification, ...prev]);
      
      // Mostrar toast para nueva notificación
      if (window.showToast) {
        window.showToast(newNotification.message, 'info');
      }
    }
  };

  const generateRandomNotification = () => {
    const types = {
      admin: [
        { type: 'system', title: 'Nueva Solicitud', message: 'Nueva solicitud de vendedor recibida' },
        { type: 'alert', title: 'Problema Reportado', message: 'Un usuario reportó un problema con un producto' }
      ],
      vendedor: [
        { type: 'order', title: 'Pedido Actualizado', message: 'Un cliente actualizó su pedido' },
        { type: 'review', title: 'Nueva Reseña', message: 'Tienes una nueva reseña en tus productos' }
      ],
      cliente: [
        { type: 'promotion', title: 'Nueva Oferta', message: 'Nueva oferta disponible en tu categoría favorita' },
        { type: 'shipping', title: 'Envío Actualizado', message: 'El estado de tu envío ha sido actualizado' }
      ]
    };

    let notificationPool = [];
    
    if (isAdmin()) notificationPool = types.admin;
    else if (isVendedor()) notificationPool = types.vendedor;
    else if (isCliente()) notificationPool = types.cliente;

    const randomNotif = notificationPool[Math.floor(Math.random() * notificationPool.length)];
    
    return {
      id: Date.now(),
      ...randomNotif,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      action: null
    };
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} d`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🔵'
    };
    return icons[priority] || '⚪';
  };

  const getTypeIcon = (type) => {
    const icons = {
      system: '⚙️',
      order: '📦',
      product: '🍎',
      sales: '📊',
      alert: '🚨',
      promotion: '🎁',
      review: '⭐',
      shipping: '🚚',
      stats: '📈'
    };
    return icons[type] || '📢';
  };

  if (!user) {
    return null; // No mostrar notificaciones si no hay usuario logueado
  }

  return (
    <div className="notifications-container">
      {/* Botón de notificaciones */}
      <button 
        className="notifications-toggle"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="notification-icon">🔔</span>
        {getUnreadCount() > 0 && (
          <span className="notification-badge">{getUnreadCount()}</span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notificaciones</h3>
            <div className="notifications-actions">
              {getUnreadCount() > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Marcar todas como leídas
                </button>
              )}
              <button 
                className="close-panel"
                onClick={() => setShowNotifications(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <div className="empty-icon">📭</div>
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <span className="notification-title">
                        {notification.title}
                      </span>
                      <span className="notification-priority">
                        {getPriorityIcon(notification.priority)}
                      </span>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-footer">
                      <span className="notification-time">
                        {formatTime(notification.timestamp)}
                      </span>
                      {notification.action && (
                        <button 
                          className="notification-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.action;
                          }}
                        >
                          Ver
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="notifications-footer">
            <span className="notifications-count">
              {notifications.length} notificaciones
            </span>
            <button 
              className="clear-all"
              onClick={() => setNotifications([])}
            >
              Limpiar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default Notifications;