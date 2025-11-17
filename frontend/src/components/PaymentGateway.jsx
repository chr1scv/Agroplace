import React, { useState } from 'react';

const PaymentGateway = ({ order, onPaymentSuccess, onPaymentError }) => {
    const [selectedMethod, setSelectedMethod] = useState('webpay');
    const [processing, setProcessing] = useState(false);

    const paymentMethods = [
        {
            id: 'webpay',
            name: 'Webpay',
            icon: '🏦',
            description: 'Pago seguro con tarjeta de crédito/débito',
            supported: true
        },
        {
            id: 'mercadopago',
            name: 'MercadoPago',
            icon: '💳',
            description: 'Pago con MercadoPago',
            supported: true
        },
        {
            id: 'transferencia',
            name: 'Transferencia',
            icon: '📤',
            description: 'Transferencia bancaria',
            supported: true
        },
        {
            id: 'efectivo',
            name: 'Efectivo',
            icon: '💰',
            description: 'Pago al momento de la entrega',
            supported: true
        }
    ];

    // Simulación de Webpay
    const processWebpayPayment = async () => {
        setProcessing(true);
        try {
            // En un caso real, aquí llamarías a tu backend para iniciar transacción Webpay
            const webpayResponse = await simulateWebpayTransaction(order);
            
            if (webpayResponse.success) {
                onPaymentSuccess({
                    method: 'webpay',
                    transactionId: webpayResponse.transactionId,
                    amount: order.total,
                    status: 'completed'
                });
            } else {
                onPaymentError('Error en transacción Webpay');
            }
        } catch (error) {
            onPaymentError('Error procesando pago con Webpay');
        } finally {
            setProcessing(false);
        }
    };

    // Simulación de MercadoPago
    const processMercadoPagoPayment = async () => {
        setProcessing(true);
        try {
            // En un caso real, integrarías el SDK de MercadoPago
            const mpResponse = await simulateMercadoPagoTransaction(order);
            
            if (mpResponse.success) {
                onPaymentSuccess({
                    method: 'mercadopago',
                    preferenceId: mpResponse.preferenceId,
                    amount: order.total,
                    status: 'pending' // MercadoPago puede ser pendiente hasta confirmación
                });
            } else {
                onPaymentError('Error en transacción MercadoPago');
            }
        } catch (error) {
            onPaymentError('Error procesando pago con MercadoPago');
        } finally {
            setProcessing(false);
        }
    };

    const processTransferPayment = async () => {
        setProcessing(true);
        try {
            // Simular procesamiento de transferencia
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            onPaymentSuccess({
                method: 'transferencia',
                status: 'pending',
                instructions: 'Banco: Banco Estado\nCuenta: 1234567890\nRUT: 12.345.678-9\nMonto: $' + order.total
            });
        } catch (error) {
            onPaymentError('Error procesando transferencia');
        } finally {
            setProcessing(false);
        }
    };

    const processCashPayment = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            onPaymentSuccess({
                method: 'efectivo',
                status: 'pending',
                instructions: 'Paga en efectivo al momento de la entrega'
            });
        } catch (error) {
            onPaymentError('Error procesando pago en efectivo');
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        switch (selectedMethod) {
            case 'webpay':
                await processWebpayPayment();
                break;
            case 'mercadopago':
                await processMercadoPagoPayment();
                break;
            case 'transferencia':
                await processTransferPayment();
                break;
            case 'efectivo':
                await processCashPayment();
                break;
            default:
                onPaymentError('Método de pago no válido');
        }
    };

    // Simulaciones de transacciones (en realidad estas irían en el backend)
    const simulateWebpayTransaction = async (order) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            success: true,
            transactionId: 'TBK_' + Date.now(),
            url: 'https://webpay.transbank.cl/webpayserver/initTransaction',
            token: 'token_simulado_' + Math.random().toString(36).substr(2, 9)
        };
    };

    const simulateMercadoPagoTransaction = async (order) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            success: true,
            preferenceId: 'MP_' + Date.now(),
            initPoint: 'https://www.mercadopago.cl/checkout/v1/redirect'
        };
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Selecciona Método de Pago</h3>
            
            <div style={styles.paymentMethods}>
                {paymentMethods.map(method => (
                    <div
                        key={method.id}
                        style={{
                            ...styles.paymentMethod,
                            ...(selectedMethod === method.id ? styles.paymentMethodSelected : {})
                        }}
                        onClick={() => setSelectedMethod(method.id)}
                    >
                        <div style={styles.methodHeader}>
                            <span style={styles.methodIcon}>{method.icon}</span>
                            <div style={styles.methodInfo}>
                                <h4 style={styles.methodName}>{method.name}</h4>
                                <p style={styles.methodDescription}>{method.description}</p>
                            </div>
                            <div style={styles.radio}>
                                {selectedMethod === method.id && '✓'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detalles del método seleccionado */}
            <div style={styles.methodDetails}>
                {selectedMethod === 'webpay' && (
                    <div style={styles.detailCard}>
                        <h4>🏦 Información Webpay</h4>
                        <p>Serás redirigido a Transbank para completar tu pago de forma segura.</p>
                        <ul style={styles.featuresList}>
                            <li>✅ Pagos con tarjeta de crédito y débito</li>
                            <li>✅ Transacción 100% segura</li>
                            <li>✅ Certificado por Transbank</li>
                            <li>✅ Confirmación inmediata</li>
                        </ul>
                    </div>
                )}

                {selectedMethod === 'mercadopago' && (
                    <div style={styles.detailCard}>
                        <h4>💳 Información MercadoPago</h4>
                        <p>Paga con tu cuenta de MercadoPago, tarjeta de crédito o efectivo.</p>
                        <ul style={styles.featuresList}>
                            <li>✅ Cuenta MercadoPago</li>
                            <li>✅ Tarjetas de crédito/débito</li>
                            <li>✅ Pago en efectivo (Servipag, Sencillito)</li>
                            <li>✅ Hasta 12 cuotas sin interés</li>
                        </ul>
                    </div>
                )}

                {selectedMethod === 'transferencia' && (
                    <div style={styles.detailCard}>
                        <h4>📤 Transferencia Bancaria</h4>
                        <p>Realiza la transferencia y envía el comprobante.</p>
                        <div style={styles.bankInfo}>
                            <p><strong>Banco:</strong> Banco Estado</p>
                            <p><strong>Tipo de Cuenta:</strong> Cuenta Corriente</p>
                            <p><strong>Número:</strong> 1234567890</p>
                            <p><strong>RUT:</strong> 12.345.678-9</p>
                            <p><strong>Email comprobante:</strong> pagos@agroplace.com</p>
                            <p><strong>Monto:</strong> ${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                {selectedMethod === 'efectivo' && (
                    <div style={styles.detailCard}>
                        <h4>💰 Pago en Efectivo</h4>
                        <p>Paga al momento de recibir tu pedido.</p>
                        <div style={styles.cashInfo}>
                            <p>💡 <strong>Recomendaciones:</strong></p>
                            <ul style={styles.featuresList}>
                                <li>Ten el monto exacto o cambio disponible</li>
                                <li>El repartidor llevará comprobante</li>
                                <li>Puedes pagar con billetes o monedas</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Botón de pago */}
            <div style={styles.paymentActions}>
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    style={processing ? styles.processingButton : styles.payButton}
                >
                    {processing ? (
                        <>
                            <div style={styles.spinner}></div>
                            Procesando pago...
                        </>
                    ) : (
                        `Pagar $${order.total.toFixed(2)}`
                    )}
                </button>
                
                <p style={styles.securityNote}>
                    🔒 Tu pago está protegido. No almacenamos datos de tu tarjeta.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '1.5rem',
        color: '#2d5016',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    paymentMethods: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '2rem',
    },
    paymentMethod: {
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    paymentMethodSelected: {
        borderColor: '#4a7c1f',
        backgroundColor: '#f8f9fa',
    },
    methodHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    methodIcon: {
        fontSize: '2rem',
        flexShrink: 0,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#333',
        margin: '0 0 0.25rem 0',
    },
    methodDescription: {
        color: '#666',
        margin: 0,
        fontSize: '0.9rem',
    },
    radio: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #4a7c1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a7c1f',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    methodDetails: {
        marginBottom: '2rem',
    },
    detailCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    featuresList: {
        margin: '1rem 0 0 0',
        paddingLeft: '1.5rem',
    },
    bankInfo: {
        marginTop: '1rem',
    },
    cashInfo: {
        marginTop: '1rem',
    },
    paymentActions: {
        textAlign: 'center',
    },
    payButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        marginBottom: '1rem',
        transition: 'background-color 0.3s',
    },
    processingButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        width: '100%',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    securityNote: {
        color: '#666',
        fontSize: '0.8rem',
        textAlign: 'center',
        margin: 0,
    },
};

export default PaymentGateway;