import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleProtectedRoute from '../components/SimpleProtectedRoute';
import HeaderCliente from '../pages/cliente/HeaderCliente';

// Importar componentes modulares
import CheckoutShipping from '../components/CheckoutShipping';
import CheckoutPickup from '../components/CheckoutPickup';
import CheckoutReview from '../components/CheckoutReview';

const Checkout = () => {
    const { items, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    // Constantes
    const IVA_RATE = 0.19;
    const SHIPPING_THRESHOLD = 19000;

    const [step, setStep] = useState(1); // 1: Formulario, 2: Revisión
    const [deliveryType, setDeliveryType] = useState(''); // 'envio' o 'retiro'
    const [customerData, setCustomerData] = useState(null);

    // Determinar tipo de entrega al cargar y cuando cambia el total
    useEffect(() => {
        const total = getCartTotal();
        setDeliveryType(total >= SHIPPING_THRESHOLD ? 'envio' : 'retiro');
    }, [getCartTotal]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const calculateTotals = () => {
        const total = getCartTotal();
        const subtotal = total / (1 + IVA_RATE);
        const iva = subtotal * IVA_RATE;

        return { subtotal, iva, total };
    };

    const handleFormSubmit = (data) => {
        setCustomerData(data);
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleBackToForm = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleConfirmOrder = () => {
        // Aquí iría la integración con el backend
        alert('¡Pedido confirmado exitosamente!');
        clearCart();
        navigate('/productos');
    };

    const { subtotal, iva, total } = calculateTotals();

    if (items.length === 0) {
        return (
            <div>
                <HeaderCliente />
                <div style={styles.container}>
                    <div style={styles.emptyCart}>
                        <div style={styles.emptyIcon}>🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega algunos productos antes de proceder al checkout</p>
                        <button
                            onClick={() => navigate('/productos')}
                            style={styles.continueShopping}
                        >
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <SimpleProtectedRoute allowedRoles={['cliente', 'admin']}>
            <div>
                <HeaderCliente />
                <div style={styles.container}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Finalizar Compra</h1>

                        {/* Indicador de Pasos */}
                        <div style={styles.steps}>
                            <div style={{ ...styles.step, ...(step >= 1 ? styles.activeStep : {}) }}>
                                <span style={styles.stepNumber}>1</span>
                                <span>Datos</span>
                            </div>
                            <div style={styles.stepLine}></div>
                            <div style={{ ...styles.step, ...(step >= 2 ? styles.activeStep : {}) }}>
                                <span style={styles.stepNumber}>2</span>
                                <span>Revisión</span>
                            </div>
                            <div style={styles.stepLine}></div>
                            <div style={styles.step}>
                                <span style={styles.stepNumber}>3</span>
                                <span>Pago</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.content}>
                        <div style={styles.mainContent}>
                            {step === 1 ? (
                                deliveryType === 'envio' ? (
                                    <CheckoutShipping
                                        onContinue={handleFormSubmit}
                                        onBack={() => navigate('/carrito')}
                                    />
                                ) : (
                                    <CheckoutPickup
                                        items={items}
                                        onContinue={handleFormSubmit}
                                        onBack={() => navigate('/carrito')}
                                    />
                                )
                            ) : (
                                <CheckoutReview
                                    data={customerData}
                                    type={deliveryType}
                                    onBack={handleBackToForm}
                                    onConfirm={handleConfirmOrder}
                                />
                            )}
                        </div>

                        {/* Sidebar - Resumen del Pedido */}
                        <div style={styles.sidebar}>
                            <div style={styles.summaryCard}>
                                <h3 style={styles.summaryTitle}>Resumen del Pedido</h3>

                                <div style={styles.summaryItems}>
                                    {items.map(item => (
                                        <div key={item.id} style={styles.summaryItem}>
                                            <div style={styles.itemInfo}>
                                                <span style={styles.itemName}>{item.nombre}</span>
                                                <span style={styles.itemQuantity}>x{item.quantity}</span>
                                            </div>
                                            <span style={styles.itemPrice}>
                                                {formatPrice((item.precio || 0) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.summaryDivider}></div>

                                <div style={styles.summaryTotals}>
                                    <div style={styles.totalRow}>
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span>IVA (19%):</span>
                                        <span>{formatPrice(iva)}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span>Envío:</span>
                                        <span style={deliveryType === 'envio' ? styles.freeShipping : {}}>
                                            {deliveryType === 'envio' ? 'Gratis' : 'Retiro en tienda'}
                                        </span>
                                    </div>
                                    <div style={styles.totalDivider}></div>
                                    <div style={styles.grandTotal}>
                                        <span>Total:</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SimpleProtectedRoute>
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
        marginBottom: '3rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '2rem',
    },
    steps: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
    },
    step: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#999',
        fontWeight: '500',
    },
    activeStep: {
        color: '#4a7c1f',
        fontWeight: 'bold',
    },
    stepNumber: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
    },
    stepLine: {
        flex: 1,
        height: '2px',
        backgroundColor: '#eee',
        maxWidth: '100px',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start',
    },
    mainContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '2rem',
    },
    sidebar: {
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
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '1rem',
    },
    summaryItems: {
        marginBottom: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '20px', // Más espacio entre productos y barra de desplazamiento
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #f0f0f0',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    itemName: {
        fontWeight: '500',
        fontSize: '0.9rem',
    },
    itemQuantity: {
        color: '#666',
        fontSize: '0.8rem',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#2d5016',
    },
    summaryDivider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '1rem 0',
    },
    summaryTotals: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#666',
    },
    freeShipping: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    totalDivider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '0.5rem 0',
    },
    grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: '#2d5016',
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
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: '1rem',
    },
};

export default Checkout;