// En frontend/src/services/api.js - REEMPLAZAR COMPLETAMENTE:

import axios from 'axios';

// Configurar la base URL de tu backend Django
const API_BASE_URL = 'http://100.31.14.143/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // IMPORTANTE para cookies de sesión
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('No autorizado');
                    // No redirigir automáticamente, manejar en los componentes
                    break;
                case 403:
                    console.error('Acceso denegado');
                    break;
                case 404:
                    console.error('Recurso no encontrado');
                    break;
                case 500:
                    console.error('Error interno del servidor');
                    break;
                default:
                    console.error(`Error ${error.response.status}:`, error.response.data);
            }
        } else if (error.request) {
            console.error('No se pudo conectar con el servidor');
        } else {
            console.error('Error de configuración:', error.message);
        }

        return Promise.reject(error);
    }
);

// Servicios para cada endpoint
export const productService = {
    // Obtener todos los productos
    getAllProducts: async (params = {}) => {
        try {
            const response = await api.get('/productos/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Obtener producto por ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/productos/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    // Crear producto (solo vendedores/admin)
    createProduct: async (productData) => {
        try {
            const response = await api.post('/productos/', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Actualizar producto
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`/productos/${id}/`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Eliminar producto
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/productos/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },
};

export const categoryService = {
    // Obtener todas las categorías
    getAllCategories: async () => {
        try {
            const response = await api.get('/categorias/');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
};

export const authService = {
    // Login con Django
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Registro con Django
    register: async (userData) => {
        try {
            const response = await api.post('/auth/registro/', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await api.post('/auth/logout/');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Obtener usuario actual
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/user/');
            return response.data;
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }
};

export const orderService = {
    // Obtener todos los pedidos
    getAllOrders: async () => {
        try {
            const response = await api.get('/pedidos/');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Crear pedido
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/pedidos/', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Actualizar estado del pedido
    updateOrderStatus: async (id, status) => {
        try {
            const response = await api.patch(`/pedidos/${id}/`, { estado: status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },
};

export const userService = {
    // Obtener todos los usuarios (solo admin)
    getAllUsers: async () => {
        try {
            const response = await api.get('/usuarios/');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Obtener usuario por ID
    getUserById: async (id) => {
        try {
            const response = await api.get(`/usuarios/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },
};

export default api;