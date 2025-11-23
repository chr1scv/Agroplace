import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleProtectedRoute from '../components/SimpleProtectedRoute';
import HeaderCliente from '../pages/cliente/HeaderCliente';

const Checkout = () => {
    const { items, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    // Constantes
    const IVA_RATE = 0.19;
    const SHIPPING_THRESHOLD = 19000;

    const [pasoActual, setPasoActual] = useState(1);
    const [tipoEntrega, setTipoEntrega] = useState(''); // 'envio' o 'retiro'

    // Estados para formulario de envío
    const [datosEnvio, setDatosEnvio] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: '',
        instrucciones: ''
    });

    // Estados para formulario de retiro
    const [datosRetiro, setDatosRetiro] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        fechaRetiro: '',
        horaRetiro: '',
        notas: ''
    });

    // Determinar tipo de entrega al cargar
    useEffect(() => {
        const total = getCartTotal();
        setTipoEntrega(total >= SHIPPING_THRESHOLD ? 'envio' : 'retiro');
    }, [getCartTotal]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const calcularResumen = () => {
        const total = getCartTotal();
        const subtotal = total / (1 + IVA_RATE);
        const iva = subtotal * IVA_RATE;

        return { subtotal, iva, total };
    };

    const handleEnvioChange = (e) => {
        setDatosEnvio({
            ...datosEnvio,
            [e.target.name]: e.target.value
        });
    };

    const handleRetiroChange = (e) => {
        setDatosRetiro({
            ...datosRetiro,
            [e.target.name]: e.target.value
        });
    };

    const handleContinuar = () => {
        // Validación básica
        if (tipoEntrega === 'envio') {
            if (!datosEnvio.nombre || !datosEnvio.email || !datosEnvio.telefono || !datosEnvio.direccion) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
        } else {
            if (!datosRetiro.nombre || !datosRetiro.email || !datosRetiro.telefono || !datosRetiro.rut) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
        }
        setPasoActual(2);
    };

    const handleConfirmarPedido = () => {
        // Aquí se enviará al backend
        alert('Pedido confirmado! (Integración con backend pendiente)');
        clearCart();
        navigate('/productos');
    };

    const { subtotal, iva, total } = calcularResumen();

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

                        {/* Indicador de tipo de entrega */}
                        <div style={styles.deliveryType}>
                            {tipoEntrega === 'envio' ? (
                                <div style={styles.deliveryBadgeShipping}>
                                    ✓ Envío Gratis Habilitado
                                </div>
                            ) : (
                                <div style={styles.deliveryBadgePickup}>
                                    Retiro en Tienda
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={styles.content}>
                        <div style={styles.mainContent}>
                            {/* PASO 1: Formulario */}
                            {pasoActual === 1 && (
                                <div style={styles.stepContent}>
                                    {tipoEntrega === 'envio' ? (
                                        // FORMULARIO DE ENVÍO
                                        <div>
                                            <h2 style={styles.stepTitle}>Información de Envío</h2>
                                            <p style={styles.subtitle}>
                                                Tu pedido califica para envío gratis ({formatPrice(total)} ≥ {formatPrice(SHIPPING_THRESHOLD)})
                                            </p>

                                            <form style={styles.form}>
                                                <div style={styles.formRow}>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Nombre *</label>
                                                        <input
                                                            type="text"
                                                            name="nombre"
                                                            value={datosEnvio.nombre}
                                                            onChange={handleEnvioChange}
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
                                                            onChange={handleEnvioChange}
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
                                                            onChange={handleEnvioChange}
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
                                                            onChange={handleEnvioChange}
                                                            required
                                                            style={styles.input}
                                                            placeholder="+56 9 1234 5678"
                                                        />
                                                    </div>
                                                </div>

                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>Dirección Completa *</label>
                                                    <input
                                                        type="text"
                                                        name="direccion"
                                                        value={datosEnvio.direccion}
                                                        onChange={handleEnvioChange}
                                                        required
                                                        style={styles.input}
                                                        placeholder="Calle, número, departamento"
                                                    />
                                                </div>

                                                <div style={styles.formRow}>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Comuna *</label>
                                                        <input
                                                            type="text"
                                                            name="comuna"
                                                            value={datosEnvio.comuna}
                                                            onChange={handleEnvioChange}
                                                            required
                                                            style={styles.input}
                                                            placeholder="Comuna"
                                                        />
                                                    </div>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Región *</label>
                                                        <select
                                                            name="region"
                                                            value={datosEnvio.region}
                                                            onChange={handleEnvioChange}
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
                                                </div>

                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>Instrucciones de entrega (opcional)</label>
                                                    <textarea
                                                        name="instrucciones"
                                                        value={datosEnvio.instrucciones}
                                                        onChange={handleEnvioChange}
                                                        style={styles.textarea}
                                                        placeholder="Ej: Timbre 2 veces, dejar con conserjería, etc."
                                                        rows="3"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        // FORMULARIO DE RETIRO
                                        <div>
                                            <h2 style={styles.stepTitle}>Información para Retiro</h2>
                                            <p style={styles.subtitle}>
                                                Tu pedido será preparado para retiro en tienda
                                            </p>

                                            <div style={styles.pickupInfo}>
                                                <h3>📍 Punto de Retiro</h3>
                                                <p><strong>Dirección:</strong> Av. Principal 123, Santiago</p>
                                                <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00</p>
                                                <p><strong>Sábados:</strong> 10:00 - 14:00</p>
                                            </div>

                                            <form style={styles.form}>
                                                <div style={styles.formRow}>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Nombre *</label>
                                                        <input
                                                            type="text"
                                                            name="nombre"
                                                            value={datosRetiro.nombre}
                                                            onChange={handleRetiroChange}
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
                                                            value={datosRetiro.apellido}
                                                            onChange={handleRetiroChange}
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
                                                            value={datosRetiro.email}
                                                            onChange={handleRetiroChange}
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
                                                            value={datosRetiro.telefono}
                                                            onChange={handleRetiroChange}
                                                            required
                                                            style={styles.input}
                                                            placeholder="+56 9 1234 5678"
                                                        />
                                                    </div>
                                                </div>

                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>RUT *</label>
                                                    <input
                                                        type="text"
                                                        name="rut"
                                                        value={datosRetiro.rut}
                                                        onChange={handleRetiroChange}
                                                        required
                                                        style={styles.input}
                                                        placeholder="12.345.678-9"
                                                    />
                                                </div>

                                                <div style={styles.formRow}>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Fecha de Retiro *</label>
                                                        <input
                                                            type="date"
                                                            name="fechaRetiro"
                                                            value={datosRetiro.fechaRetiro}
                                                            onChange={handleRetiroChange}
                                                            required
                                                            style={styles.input}
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                    </div>
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Hora Preferida *</label>
                                                        <select
                                                            name="horaRetiro"
                                                            value={datosRetiro.horaRetiro}
                                                            onChange={handleRetiroChange}
                                                            required
                                                            style={styles.select}
                                                        >
                                                            <option value="">Selecciona hora</option>
                                                            <option value="09:00">09:00 - 10:00</option>
                                                            <option value="10:00">10:00 - 11:00</option>
                                                            <option value="11:00">11:00 - 12:00</option>
                                                            <option value="12:00">12:00 - 13:00</option>
                                                            <option value="14:00">14:00 - 15:00</option>
                                                            <option value="15:00">15:00 - 16:00</option>
                                                            <option value="16:00">16:00 - 17:00</option>
                                                            <option value="17:00">17:00 - 18:00</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>Notas adicionales (opcional)</label>
                                                    <textarea
                                                        name="notas"
                                                        value={datosRetiro.notas}
                                                        onChange={handleRetiroChange}
                                                        style={styles.textarea}
                                                        placeholder="Cualquier información adicional"
                                                        rows="3"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    )}

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
                                            onClick={handleContinuar}
                                            style={styles.continueButton}
                                        >
                                            Continuar →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 2: Confirmación */}
                            {pasoActual === 2 && (
                                <div style={styles.stepContent}>
                                    <h2 style={styles.stepTitle}>Confirmar Pedido</h2>

                                    <div style={styles.confirmationSection}>
                                        <h3>Resumen de {tipoEntrega === 'envio' ? 'Envío' : 'Retiro'}</h3>
                                        {tipoEntrega === 'envio' ? (
                                            <div style={styles.confirmationData}>
                                                <p><strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}</p>
                                                <p><strong>Email:</strong> {datosEnvio.email}</p>
                                                <p><strong>Teléfono:</strong> {datosEnvio.telefono}</p>
                                                <p><strong>Dirección:</strong> {datosEnvio.direccion}</p>
                                                <p><strong>Comuna:</strong> {datosEnvio.comuna}</p>
                                                <p><strong>Región:</strong> {datosEnvio.region}</p>
                                                {datosEnvio.instrucciones && (
                                                    <p><strong>Instrucciones:</strong> {datosEnvio.instrucciones}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={styles.confirmationData}>
                                                <p><strong>Nombre:</strong> {datosRetiro.nombre} {datosRetiro.apellido}</p>
                                                <p><strong>Email:</strong> {datosRetiro.email}</p>
                                                <p><strong>Teléfono:</strong> {datosRetiro.telefono}</p>
                                                <p><strong>RUT:</strong> {datosRetiro.rut}</p>
                                                <p><strong>Fecha de Retiro:</strong> {datosRetiro.fechaRetiro}</p>
                                                <p><strong>Hora:</strong> {datosRetiro.horaRetiro}</p>
                                                {datosRetiro.notas && (
                                                    <p><strong>Notas:</strong> {datosRetiro.notas}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div style={styles.paymentInfo}>
                                        <h3>Información de Pago</h3>
                                        <p>El pago se simulará en los siguientes pasos del proceso.</p>
                                    </div>

                                    <div style={styles.stepActions}>
                                        <button
                                            type="button"
                                            onClick={() => setPasoActual(1)}
                                            style={styles.backButton}
                                        >
                                            ← Editar Información
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirmarPedido}
                                            style={styles.confirmButton}
                                        >
                                            Confirmar Pedido
                                        </button>
                                    </div>
                                </div>
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
                                        <span>{tipoEntrega === 'envio' ? 'Gratis' : 'Retiro en tienda'}</span>
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
        marginBottom: '2rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    deliveryType: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
    },
    deliveryBadgeShipping: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    deliveryBadgePickup: {
        backgroundColor: '#ff9800',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1rem',
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
        marginBottom: '1rem',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '2rem',
    },
    pickupInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
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
    confirmButton: {
        backgroundColor: '#2d7a3e',
        color: 'white',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },
    confirmationSection: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
    },
    confirmationData: {
        marginTop: '1rem',
        lineHeight: '1.8',
    },
    paymentInfo: {
        backgroundColor: '#fff3e0',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
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
        opacity: 0.5',
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