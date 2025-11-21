import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleProtectedRoute from '../components/SimpleProtectedRoute';
import PaymentGateway from '../components/PaymentGateway';
import HeaderCliente from '../pages/cliente/HeaderCliente';  

const Checkout = () => {
    const { items, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    
    const [pasoActual, setPasoActual] = useState(1);
    const [ordenCreada, setOrdenCreada] = useState(null);
    const [loading, setLoading] = useState(false);

    // Estados para formularios
    const [datosEnvio, setDatosEnvio] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '',
        codigoPostal: '',
        instrucciones: ''
    });

    // Aplicar estilos dinámicos a los steps
    useEffect(() => {
        const stepNumbers = document.querySelectorAll('.step-number');
        stepNumbers.forEach((step, index) => {
            if (index + 1 <= pasoActual) {
                step.style.backgroundColor = '#4a7c1f';
                step.style.color = 'white';
            } else {
                step.style.backgroundColor = '#e0e0e0';
                step.style.color = '#666';
            }
        });
    }, [pasoActual]);

    const handleDatosEnvioChange = (e) => {
        setDatosEnvio({
            ...datosEnvio,
            [e.target.name]: e.target.value
        });
    };

    const calcularResumen = () => {
        const subtotal = getCartTotal();
        const envio = subtotal > 50 ? 0 : 5.99;
        const iva = subtotal * 0.19;
        const total = subtotal + envio + iva;

        return { subtotal, envio, iva, total };
    };

    const handlePaymentSuccess = (paymentResult) => {
        const resumen = calcularResumen();
        const nuevaOrden = {
            id: `ORD-${Date.now()}`,
            fecha: new Date().toISOString().split('T')[0],
            productos: items,
            envio: datosEnvio,
            pago: paymentResult,
            total: resumen.total,
            estado: paymentResult.status || 'confirmado'
        };

        setOrdenCreada(nuevaOrden);
        clearCart();
        setPasoActual(5);
    };

    const handlePaymentError = (error) => {
        alert(`Error en el pago: ${error}`);
        setLoading(false);
    };

    const { subtotal, envio, iva, total } = calcularResumen();

    if (items.length === 0 && !ordenCreada) {
        return (
            <div>
                <HeaderCliente />  {/* ← HEADER AGREGADO */}
                <div style={styles.container}>
                    <div style={styles.emptyCart}>
                        <div style={styles.emptyIcon}>🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega algunos productos antes de proceder al checkout</p>
                        <button 
                            onClick={() => navigate('/productos')}
                            style={styles.continueShopping}
                        >
                            🛍️ Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <SimpleProtectedRoute allowedRoles={['cliente', 'admin']}>
            <div>
                <HeaderCliente />  {/* ← HEADER AGREGADO */}
                <div style={styles.container}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Finalizar Compra</h1>
                        <div style={styles.progressBar}>
                            <div style={styles.progressSteps}>
                                {[1, 2, 3, 4, 5].map(step => (
                                    <div key={step} style={styles.step}>
                                        <div className="step-number" style={styles.stepNumber}>
                                            {step}
                                        </div>
                                        <div style={styles.stepLabel}>
                                            {step === 1 && 'Envío'}
                                            {step === 2 && 'Revisión'}
                                            {step === 3 && 'Pago'}
                                            {step === 4 && 'Confirmación'}
                                            {step === 5 && 'Completado'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={styles.content}>
                        <div style={styles.mainContent}>
                            {/* PASO 1: Información de Envío */}
                            {pasoActual === 1 && (
                                <div style={styles.stepContent}>
                                    <h2 style={styles.stepTitle}>Información de Envío</h2>
                                    <form style={styles.form}>
                                        <div style={styles.formRow}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Nombre *</label>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={datosEnvio.nombre}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.input}
                                                    placeholder="Tu nombre"
                                                />
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Apellido *</label>
                                                <input
                                                    type="text"
                                                    name="apellido"
                                                    value={datosEnvio.apellido}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.input}
                                                    placeholder="Tu apellido"
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.formRow}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={datosEnvio.email}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.input}
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Teléfono *</label>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={datosEnvio.telefono}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.input}
                                                    placeholder="+56 9 1234 5678"
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Dirección *</label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={datosEnvio.direccion}
                                                onChange={handleDatosEnvioChange}
                                                required
                                                style={styles.input}
                                                placeholder="Calle, número, departamento"
                                            />
                                        </div>

                                        <div style={styles.formRow}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Ciudad *</label>
                                                <input
                                                    type="text"
                                                    name="ciudad"
                                                    value={datosEnvio.ciudad}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.input}
                                                    placeholder="Ciudad"
                                                />
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Región *</label>
                                                <select
                                                    name="region"
                                                    value={datosEnvio.region}
                                                    onChange={handleDatosEnvioChange}
                                                    required
                                                    style={styles.select}
                                                >
                                                    <option value="">Selecciona región</option>
                                                    <option value="metropolitana">Región Metropolitana</option>
                                                    <option value="valparaiso">Valparaíso</option>
                                                    <option value="biobio">Biobío</option>
                                                    <option value="araucania">La Araucanía</option>
                                                    <option value="loslagos">Los Lagos</option>
                                                </select>
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Código Postal</label>
                                                <input
                                                    type="text"
                                                    name="codigoPostal"
                                                    value={datosEnvio.codigoPostal}
                                                    onChange={handleDatosEnvioChange}
                                                    style={styles.input}
                                                    placeholder="Código postal"
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Instrucciones de entrega (opcional)</label>
                                            <textarea
                                                name="instrucciones"
                                                value={datosEnvio.instrucciones}
                                                onChange={handleDatosEnvioChange}
                                                style={styles.textarea}
                                                placeholder="Ej: Timbre 2 veces, dejar con conserjería, etc."
                                                rows="3"
                                            />
                                        </div>

                                        <div style={styles.stepActions}>
                                            <button 
                                                type="button"
                                                onClick={() => navigate('/carrito')}
                                                style={styles.backButton}
                                            >
                                                ← Volver al Carrito
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setPasoActual(2)}
                                                style={styles.continueButton}
                                            >
                                                Continuar a Revisión →
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ... resto del código del checkout se mantiene igual ... */}
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
                                                ${((item.precio || 0) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.summaryDivider}></div>

                                <div style={styles.summaryTotals}>
                                    <div style={styles.totalRow}>
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span>Envío:</span>
                                        <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span>IVA (19%):</span>
                                        <span>${iva.toFixed(2)}</span>
                                    </div>
                                    <div style={styles.totalDivider}></div>
                                    <div style={styles.grandTotal}>
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {envio > 0 && (
                                    <div style={styles.shippingNote}>
                                        🚚 Envío gratis en compras sobre $50
                                    </div>
                                )}
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
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    progressBar: {
        marginBottom: '2rem',
    },
    progressSteps: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
    },
    step: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    stepNumber: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: '#666',
    },
    stepLabel: {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
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
    stepContent: {
        minHeight: '400px',
    },
    stepTitle: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s',
        outline: 'none',
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none',
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
    },
    stepActions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '2px solid #f0f0f0',
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#4a7c1f',
        border: '2px solid #4a7c1f',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    continueButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    // Review Sections
    reviewSections: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    reviewSection: {
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    reviewSectionTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.2rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    editButton: {
        backgroundColor: 'transparent',
        color: '#4a7c1f',
        border: '1px solid #4a7c1f',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    reviewContent: {
        lineHeight: '1.6',
    },
    reviewProducts: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    reviewProduct: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    productImage: {
        width: '50px',
        height: '50px',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
    },
    productInfo: {
        flex: 1,
    },
    productPrice: {
        fontWeight: 'bold',
        color: '#2d5016',
        fontSize: '1.1rem',
    },
    // Processing Payment
    processingPayment: {
        textAlign: 'center',
        padding: '3rem 2rem',
    },
    processingIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    processingTitle: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    processingText: {
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '2rem',
    },
    processingSpinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4a7c1f',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    },
    // Confirmation
    confirmation: {
        textAlign: 'center',
        padding: '2rem',
    },
    confirmationIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    confirmationTitle: {
        fontSize: '2rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    confirmationText: {
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '2rem',
    },
    orderSummary: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '1rem',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
    },
    statusConfirmed: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    paymentInstructions: {
        backgroundColor: '#e8f5e8',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    instructionsContent: {
        whiteSpace: 'pre-line',
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #4caf50',
    },
    nextSteps: {
        backgroundColor: '#fff3e0',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    stepsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        margin: '1rem 0 0 0',
    },
    stepItem: {
        padding: '0.5rem 0',
        fontSize: '1rem',
    },
    confirmationActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
    },
    trackButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    // Sidebar
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
    },
    summaryItems: {
        marginBottom: '1rem',
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
    totalDivider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '0.5rem 0',
    },
    grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        color: '#2d5016',
    },
    shippingNote: {
        textAlign: 'center',
        color: '#4caf50',
        fontSize: '0.8rem',
        marginTop: '1rem',
        fontStyle: 'italic',
    },
    // Empty Cart
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
        textDecoration: 'none',
        display: 'inline-block',
    },
};

// Agregar animación CSS
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default Checkout;