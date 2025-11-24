import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAxiosConfig } from '../utils/csrf';
import { useCart } from '../context/CartContext';
import SimpleProtectedRoute from '../components/SimpleProtectedRoute';
import HeaderCliente from '../pages/cliente/HeaderCliente';
import CheckoutShipping from '../components/CheckoutShipping';
import CheckoutPickup from '../components/CheckoutPickup';
import CheckoutReview from '../components/CheckoutReview';
import PaymentMethod from '../components/PaymentMethod';

const Checkout = () => {
    const { items: cartItems, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const IVA_RATE = 0.19;
    const SHIPPING_THRESHOLD = 19000;

    const [step, setStep] = useState(1);
    const [deliveryType, setDeliveryType] = useState('');
    const [customerData, setCustomerData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [checkoutItems, setCheckoutItems] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const itemsParam = params.get('items');

        if (itemsParam) {
            const selectedIds = itemsParam.split(',').map(id => parseInt(id));
            const filtered = cartItems.filter(item => selectedIds.includes(item.id));
            setCheckoutItems(filtered);
        } else {
            // Si no hay params, usar todos (comportamiento legacy o fallback)
            setCheckoutItems(cartItems);
        }
    }, [cartItems, location.search]);

    // Calcular totales basados en items filtrados
    const getCheckoutTotal = () => {
        return checkoutItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    // Determinar tipo de entrega al cargar y cuando cambia el total
    useEffect(() => {
        const total = getCheckoutTotal();
        setDeliveryType(total >= SHIPPING_THRESHOLD ? 'envio' : 'retiro');
    }, [checkoutItems]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const calculateTotals = () => {
        const total = getCheckoutTotal();
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


    const handlePaymentSubmit = (data) => {
        setPaymentData(data);
        setStep(3);
        window.scrollTo(0, 0);
    };

    const handleBackToPayment = () => {
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleConfirmOrder = async () => {
        try {
            const { total } = calculateTotals();

            let direccionTexto = '';
            if (deliveryType === 'envio' && customerData) {
                direccionTexto = `${customerData.direccion}, ${customerData.comuna}, ${customerData.region}`;
                if (customerData.instrucciones) {
                    direccionTexto += ` (Instrucciones: ${customerData.instrucciones})`;
                }
                direccionTexto += ` | Contacto: ${customerData.nombre} ${customerData.apellido} (${customerData.telefono})`;
            } else {
                direccionTexto = 'Retiro en tienda';
            }

            const payload = {
                items: checkoutItems.map(item => ({
                    producto_id: item.id,
                    cantidad: item.quantity
                })),
                metodo_pago: paymentData?.metodo_pago || 'efectivo',
                tipo_tarjeta: paymentData?.tipo_tarjeta || '',
                ultimos_digitos: paymentData?.ultimos_digitos || '',
                total: total,
                tipo_entrega: deliveryType
            };

            await axios.post('http://localhost:8000/api/pedidos/', payload, getAxiosConfig());

            alert('¡Pedido confirmado exitosamente!');

            // Solo remover los items comprados del carrito
            // Esto requiere una nueva función en el contexto o iterar
            // Por ahora, para simplificar y dado que clearCart limpia todo:
            clearCart();

            navigate('/productos');
        } catch (error) {
            console.error('Error al crear pedido:', error);
            const errorMsg = error.response?.data?.error || 'Error al procesar el pedido';
            alert(`Error: ${errorMsg}`);
        }
    };

    const { subtotal, iva, total } = calculateTotals();

    if (checkoutItems.length === 0) {
        return (
            <div>
                <HeaderCliente />
                <div style={styles.container}>
                    <div style={styles.emptyCart}>
                        <div style={styles.emptyIcon}>🛒</div>
                        <h2>No hay productos seleccionados</h2>
                        <p>Vuelve al carrito y selecciona productos para comprar</p>
                        <button
                            onClick={() => navigate('/carrito')}
                            style={styles.continueShopping}
                        >
                            Volver al Carrito
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
                                <span>Pago</span>
                            </div>
                            <div style={styles.stepLine}></div>
                            <div style={{ ...styles.step, ...(step >= 3 ? styles.activeStep : {}) }}>
                                <span style={styles.stepNumber}>3</span>
                                <span>Revisión</span>
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
                                        items={checkoutItems}
                                        onContinue={handleFormSubmit}
                                        onBack={() => navigate('/carrito')}
                                    />
                                )
                            ) : step === 2 ? (
                                <PaymentMethod
                                    onContinue={handlePaymentSubmit}
                                    onBack={handleBackToForm}
                                />
                            ) : (
                                <CheckoutReview
                                    data={customerData}
                                    paymentData={paymentData}
                                    type={deliveryType}
                                    onBack={handleBackToPayment}
                                    onConfirm={handleConfirmOrder}
                                />
                            )}
                        </div>

                        {/* Sidebar - Resumen del Pedido */}
                        <div style={styles.sidebar}>
                            <div style={styles.summaryCard}>
                                <h3 style={styles.summaryTitle}>Resumen del Pedido</h3>

                                <div style={styles.summaryItems}>
                                    {checkoutItems.map(item => (
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