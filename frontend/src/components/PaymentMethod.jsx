import React, { useState } from 'react';

const PaymentMethod = ({ onContinue, onBack }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        cardType: ''
    });

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        if (method === 'efectivo') {
            setCardData({
                cardNumber: '',
                cardHolder: '',
                expiryDate: '',
                cvv: '',
                cardType: ''
            });
        }
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const cleaned = value.replace(/\s/g, '');
            const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
            setCardData({ ...cardData, [name]: formatted });
        }
        else if (name === 'expiryDate') {
            const cleaned = value.replace(/\D/g, '');
            let formatted = cleaned;
            if (cleaned.length >= 2) {
                formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
            }
            setCardData({ ...cardData, [name]: formatted });
        }
        else {
            setCardData({ ...cardData, [name]: value });
        }
    };

    const handleContinue = () => {
        if (!selectedMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        if (selectedMethod !== 'efectivo') {
            // Validar datos de tarjeta
            if (!cardData.cardType) {
                alert('Por favor selecciona el tipo de tarjeta');
                return;
            }
            if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
                alert('Por favor ingresa un número de tarjeta válido');
                return;
            }
            if (!cardData.cardHolder) {
                alert('Por favor ingresa el nombre del titular');
                return;
            }
            if (!cardData.expiryDate || cardData.expiryDate.length < 5) {
                alert('Por favor ingresa una fecha de vencimiento válida');
                return;
            }
            if (!cardData.cvv || cardData.cvv.length < 3) {
                alert('Por favor ingresa un CVV válido');
                return;
            }

            // Pasar datos de tarjeta
            const lastDigits = cardData.cardNumber.replace(/\s/g, '').slice(-4);
            onContinue({
                metodo_pago: selectedMethod === 'debito' ? 'tarjeta_debito' : 'tarjeta_credito',
                tipo_tarjeta: cardData.cardType,
                ultimos_digitos: lastDigits,
                nombre_titular: cardData.cardHolder
            });
        } else {
            // Pago en efectivo
            onContinue({
                metodo_pago: 'efectivo'
            });
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Método de Pago</h2>
            <p style={styles.subtitle}>Selecciona cómo deseas pagar tu pedido</p>

            {/* Opciones de método de pago */}
            <div style={styles.methodsContainer}>
                {/* Tarjeta Débito */}
                <div
                    style={{
                        ...styles.methodCard,
                        ...(selectedMethod === 'debito' ? styles.methodCardSelected : {})
                    }}
                    onClick={() => handleMethodSelect('debito')}
                >
                    <div style={styles.methodHeader}>
                        <span style={styles.methodIcon}>💳</span>
                        <div>
                            <h4 style={styles.methodName}>Tarjeta de Débito</h4>
                            <p style={styles.methodDescription}>Pago inmediato con tu tarjeta</p>
                        </div>
                        <div style={styles.radio}>
                            {selectedMethod === 'debito' && '✓'}
                        </div>
                    </div>
                </div>

                {/* Tarjeta Crédito */}
                <div
                    style={{
                        ...styles.methodCard,
                        ...(selectedMethod === 'credito' ? styles.methodCardSelected : {})
                    }}
                    onClick={() => handleMethodSelect('credito')}
                >
                    <div style={styles.methodHeader}>
                        <span style={styles.methodIcon}>💳</span>
                        <div>
                            <h4 style={styles.methodName}>Tarjeta de Crédito</h4>
                            <p style={styles.methodDescription}>Pago con tarjeta de crédito</p>
                        </div>
                        <div style={styles.radio}>
                            {selectedMethod === 'credito' && '✓'}
                        </div>
                    </div>
                </div>

                {/* Efectivo */}
                <div
                    style={{
                        ...styles.methodCard,
                        ...(selectedMethod === 'efectivo' ? styles.methodCardSelected : {})
                    }}
                    onClick={() => handleMethodSelect('efectivo')}
                >
                    <div style={styles.methodHeader}>
                        <span style={styles.methodIcon}>💰</span>
                        <div>
                            <h4 style={styles.methodName}>Efectivo</h4>
                            <p style={styles.methodDescription}>Paga al retirar tu pedido</p>
                        </div>
                        <div style={styles.radio}>
                            {selectedMethod === 'efectivo' && '✓'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario de tarjeta (solo si seleccionó tarjeta) */}
            {(selectedMethod === 'debito' || selectedMethod === 'credito') && (
                <div style={styles.cardForm}>
                    <h3 style={styles.formTitle}>Datos de la Tarjeta</h3>
                    <p style={styles.formNote}>
                        🔒 Esta es una simulación. No se procesarán pagos reales.
                    </p>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Número de Tarjeta *</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardData.cardNumber}
                            onChange={handleCardInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nombre del Titular *</label>
                        <input
                            type="text"
                            name="cardHolder"
                            value={cardData.cardHolder}
                            onChange={handleCardInputChange}
                            placeholder="NOMBRE APELLIDO"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fecha de Vencimiento *</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={cardData.expiryDate}
                                onChange={handleCardInputChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>CVV *</label>
                            <input
                                type="text"
                                name="cvv"
                                value={cardData.cvv}
                                onChange={handleCardInputChange}
                                placeholder="123"
                                maxLength="4"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tipo de Tarjeta *</label>
                        <select
                            name="cardType"
                            value={cardData.cardType}
                            onChange={handleCardInputChange}
                            style={styles.select}
                        >
                            <option value="">Selecciona tipo</option>
                            <option value="debito">Débito</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Información de efectivo */}
            {selectedMethod === 'efectivo' && (
                <div style={styles.cashInfo}>
                    <h3 style={styles.formTitle}>Pago en Efectivo</h3>
                    <div style={styles.infoBox}>
                        <p>💡 <strong>Importante:</strong></p>
                        <ul style={styles.infoList}>
                            <li>Pagarás al momento de retirar tu pedido</li>
                            <li>Ten el monto exacto o cambio disponible</li>
                            <li>El vendedor te entregará un comprobante</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div style={styles.actions}>
                <button
                    onClick={onBack}
                    style={styles.backButton}
                >
                    ← Volver a Datos
                </button>
                <button
                    onClick={handleContinue}
                    style={styles.continueButton}
                    disabled={!selectedMethod}
                >
                    Continuar a Revisión →
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
    },
    title: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '2rem',
    },
    methodsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
    },
    methodCard: {
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    methodCardSelected: {
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
        marginLeft: 'auto',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #4a7c1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a7c1f',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    cardForm: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    formTitle: {
        fontSize: '1.2rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    formNote: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '0.75rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        color: '#333',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
    },
    cashInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    infoBox: {
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '6px',
    },
    infoList: {
        margin: '0.5rem 0 0 1.5rem',
        padding: 0,
    },
    actions: {
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
};

export default PaymentMethod;
