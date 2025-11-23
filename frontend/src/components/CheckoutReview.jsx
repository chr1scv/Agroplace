import React from 'react';

const CheckoutReview = ({ data, type, onBack, onConfirm }) => {
    const isShipping = type === 'envio';

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Confirmar Pedido</h2>

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    Datos de {isShipping ? 'Envío' : 'Retiro'}
                </h3>

                <div style={styles.dataGrid}>
                    {isShipping ? (
                        <>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Nombre:</span>
                                <span>{data.nombre} {data.apellido}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Email:</span>
                                <span>{data.email}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Teléfono:</span>
                                <span>{data.telefono}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Dirección:</span>
                                <span>{data.direccion}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Comuna/Región:</span>
                                <span>{data.comuna}, {data.region}</span>
                            </div>
                            {data.instrucciones && (
                                <div style={styles.dataItem}>
                                    <span style={styles.label}>Instrucciones:</span>
                                    <span>{data.instrucciones}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Nombre:</span>
                                <span>{data.nombre} {data.apellido}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Email:</span>
                                <span>{data.email}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Teléfono:</span>
                                <span>{data.telefono}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>RUT:</span>
                                <span>{data.rut}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.label}>Fecha Retiro:</span>
                                <span>{data.fechaRetiro} ({data.horaRetiro})</span>
                            </div>
                            {data.notas && (
                                <div style={styles.dataItem}>
                                    <span style={styles.label}>Notas:</span>
                                    <span>{data.notas}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div style={styles.paymentInfo}>
                <h3 style={styles.sectionTitle}>Información de Pago</h3>
                <p style={styles.paymentText}>
                    El pago se procesará en el siguiente paso.
                </p>
            </div>

            <div style={styles.actions}>
                <button
                    onClick={onBack}
                    style={styles.backButton}
                >
                    ← Editar Información
                </button>
                <button
                    onClick={onConfirm}
                    style={styles.confirmButton}
                >
                    Confirmar Pedido
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
        marginBottom: '2rem',
    },
    section: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #e0e0e0',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#2d5016',
        marginBottom: '1rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem',
    },
    dataGrid: {
        display: 'grid',
        gap: '0.8rem',
    },
    dataItem: {
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        alignItems: 'baseline',
    },
    label: {
        fontWeight: '600',
        color: '#666',
    },
    paymentInfo: {
        backgroundColor: '#fff3e0',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #ffe0b2',
    },
    paymentText: {
        color: '#e65100',
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
};

export default CheckoutReview;
