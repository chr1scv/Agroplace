class NotificationService {
    constructor() {
        this.API_BASE = 'http://100.31.14.143/api';
    }

    async getUserNotifications(userId) {
        try {
            const response = await fetch(`${this.API_BASE}/notificaciones/usuario/${userId}/`);
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    async markAsRead(notificationId) {
        try {
            await fetch(`${this.API_BASE}/notificaciones/${notificationId}/leer/`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    async createNotification(notificationData) {
        try {
            const response = await fetch(`${this.API_BASE}/notificaciones/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData)
            });
            return response.ok;
        } catch (error) {
            console.error('Error creating notification:', error);
            return false;
        }
    }

    // Para notificaciones push en tiempo real
    initializePushNotifications() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Push notifications granted');
                }
            });
        }
    }

    // Notificación cuando se agrega al carrito
    async notifyCartAdd(userId, productName) {
        const notification = {
            usuario: userId,
            tipo: 'cart',
            titulo: 'Producto Agregado',
            mensaje: `Agregaste "${productName}" al carrito`,
            leida: false,
            prioridad: 'low'
        };

        return await this.createNotification(notification);
    }

    // Notificación para admin sobre nuevo vendedor
    async notifyNewVendor(adminUserId, vendorName) {
        const notification = {
            usuario: adminUserId,
            tipo: 'vendor',
            titulo: 'Nuevo Vendedor',
            mensaje: `Nueva solicitud de vendedor: ${vendorName}`,
            leida: false,
            prioridad: 'high',
            accion: '/admin/vendedores'
        };

        return await this.createNotification(notification);
    }

    // Notificación de cambio de estado de pedido
    async notifyOrderStatus(userId, orderId, newStatus) {
        const statusMessages = {
            'preparacion': 'en preparación',
            'transito': 'en camino',
            'entregado': 'entregado',
            'cancelado': 'cancelado'
        };

        const notification = {
            usuario: userId,
            tipo: 'order',
            titulo: 'Estado de Pedido',
            mensaje: `Tu pedido #${orderId} está ${statusMessages[newStatus]}`,
            leida: false,
            prioridad: 'medium',
            accion: `/pedidos/${orderId}`
        };

        return await this.createNotification(notification);
    }
}

export default new NotificationService();