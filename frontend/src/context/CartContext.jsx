import React, { createContext, useContext, useReducer } from 'react';

// Crear el Context
const CartContext = createContext();

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                // Si ya existe, aumentar la cantidad
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            } else {
                // Si es nuevo, agregarlo al carrito
                return {
                    ...state,
                    items: [...state.items, { ...action.payload, quantity: 1 }]
                };
            }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        case 'TOGGLE_CART':
            return {
                ...state,
                isOpen: !state.isOpen
            };

        default:
            return state;
    }
};

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem('agroplace_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

// Estado inicial
const initialState = {
    items: loadCartFromStorage(),
    isOpen: false
};

// Provider del Carrito
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    React.useEffect(() => {
        try {
            localStorage.setItem('agroplace_cart', JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [state.items]);

    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const toggleCart = () => {
        dispatch({ type: 'TOGGLE_CART' });
    };

    // Calcular totales
    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    const getCartItemsCount = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    // Agrupar items por vendedor
    const getItemsByVendor = () => {
        const grouped = {};
        state.items.forEach(item => {
            const vendorId = item.vendedor?.id || item.vendedor_id || 'unknown';
            if (!grouped[vendorId]) {
                grouped[vendorId] = {
                    vendorId,
                    vendorName: item.vendedor?.username || item.vendedor_nombre || 'Vendedor desconocido',
                    vendorInfo: item.vendedor || null,
                    items: [],
                    total: 0
                };
            }
            grouped[vendorId].items.push(item);
            grouped[vendorId].total += (item.precio || 0) * item.quantity;
        });
        return grouped;
    };

    // Obtener array de grupos de vendedores
    const getVendorGroups = () => {
        return Object.values(getItemsByVendor());
    };

    const value = {
        items: state.items,
        isOpen: state.isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        getCartTotal,
        getCartItemsCount,
        getItemsByVendor,
        getVendorGroups
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};