import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { items, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    // Función para formatear precios en CLP
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyCart}>
                    <div style={styles.emptyIcon}>🛒</div>
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega algunos productos deliciosos a tu carrito</p>
                    <Link to="/productos" style={styles.continueShopping}>
                        ← Continuar Comprando
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Mi Carrito de Compras</h1>
                <p style={styles.subtitle}>Revisa tus productos antes de comprar</p>
            </div>

            <div style={styles.cartContent}>
                <div style={styles.itemsSection}>
                    <div style={styles.cartHeader}>
                        <h3>Productos ({items.length})</h3>
                        <button onClick={clearCart} style={styles.clearButton}>
                            🗑️ Vaciar Carrito
                        </button>
                    </div>

                    {items.map(item => (
                        <div key={item.id} style={styles.cartItem}>
                            <div style={styles.itemImage}>
                                <div style={styles.placeholderImage}>
                                    {item.categoria_nombre === 'Frutas' ? '🍎' : 
                                     item.categoria_nombre === 'Verduras' ? '🥕' : 
                                     item.categoria_nombre === 'Granos' ? '🌾' : '🌱'}
                                </div>
                            </div>

                            <div style={styles.itemDetails}>
                                <h4 style={styles.itemName}>{item.nombre}</h4>
                                <p style={styles.itemDescription}>{item.descripcion}</p>
                                <div style={styles.itemMeta}>
                                    <span style={styles.vendor}>Vendedor: {item.vendedor_nombre}</span>
                                    {item.origen === 'organico' && (
                                        <span style={styles.organicTag}>🌿 Orgánico</span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.itemPrice}>
                                <span style={styles.price}>{formatPrice(item.precio || 0)}</span>
                            </div>

                            <div style={styles.itemQuantity}>
                                <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    style={styles.quantityButton}
                                >
                                    -
                                </button>
                                <span style={styles.quantity}>{item.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    +
                                </button>
                            </div>

                            <div style={styles.itemTotal}>
                                <span style={styles.total}>{formatPrice((item.precio || 0) * item.quantity)}</span>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                style={styles.removeButton}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                <div style={styles.summarySection}>
                    <div style={styles.summaryCard}>
                        <h3 style={styles.summaryTitle}>Resumen del Pedido</h3>
                        
                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>
                        
                        <div style={styles.summaryRow}>
                            <span>Envío:</span>
                            <span style={styles.freeShipping}>Gratis</span>
                        </div>
                        
                        <div style={styles.summaryDivider}></div>
                        
                        <div style={styles.totalRow}>
                            <span><strong>Total:</strong></span>
                            <span><strong>{formatPrice(getCartTotal())}</strong></span>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            style={styles.checkoutButton}
                        >
                            🛒 Proceder al Checkout
                        </button>

                        <Link to="/productos" style={styles.continueLink}>
                            ← Continuar Comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    continueShopping: {
        display: 'inline-block',
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '1rem',
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start',
    },
    itemsSection: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '1.5rem',
    },
    cartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f0f0f0',
    },
    clearButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto auto auto auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderImage: {
        fontSize: '2rem',
        opacity: 0.7,
    },
    itemDetails: {
        minWidth: 0,
    },
    itemName: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    itemDescription: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    itemMeta: {
        display: 'flex',
        gap: '1rem',
        fontSize: '0.8rem',
    },
    vendor: {
        color: '#666',
    },
    organicTag: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    itemPrice: {
        textAlign: 'center',
    },
    price: {
        fontWeight: 'bold',
        color: '#2d5016',
        fontSize: '1.1rem',
    },
    itemQuantity: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    quantityButton: {
        width: '30px',
        height: '30px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        minWidth: '30px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    itemTotal: {
        textAlign: 'center',
    },
    total: {
        fontWeight: 'bold',
        color: '#2d5016',
        fontSize: '1.1rem',
    },
    removeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: '#dc3545',
    },
    summarySection: {
        position: 'sticky',
        top: '2rem',
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '1.5rem',
    },
    summaryTitle: {
        fontSize: '1.3rem',
        color: '#2d5016',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: '#666',
    },
    freeShipping: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    summaryDivider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '1rem 0',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.2rem',
        marginBottom: '1.5rem',
    },
    checkoutButton: {
        width: '100%',
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '1rem',
    },
    continueLink: {
        display: 'block',
        textAlign: 'center',
        color: '#4a7c1f',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Cart;