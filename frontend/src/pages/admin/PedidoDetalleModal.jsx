import React from 'react';

const PedidoDetalleModal = ({ pedido, onClose, formatPrice }) => {
    if (!pedido) return null;

    const getEstadoStyle = (estado) => {
        const estilos = {
            pendiente: { backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', icon: '⏳' },
            confirmado: { backgroundColor: 'rgba(33, 150, 243, 0.15)', color: '#2196f3', icon: '✅' },
            preparacion: { backgroundColor: 'rgba(255, 152, 0, 0.15)', color: '#ff9800', icon: '👨‍🍳' },
            enviado: { backgroundColor: 'rgba(156, 39, 176, 0.15)', color: '#9c27b0', icon: '🚚' },
            entregado: { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', icon: '📦' },
            cancelado: { backgroundColor: 'rgba(244, 67, 54, 0.15)', color: '#f44336', icon: '❌' }
        };
        return estilos[estado] || { backgroundColor: '#6b7280', color: 'white', icon: '❓' };
    };

    const estadoStyle = getEstadoStyle(pedido.estado);

    return (
        <>
            <div style={styles.overlay} onClick={onClose}></div>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>
                    <div>
                        <h2 style={styles.modalTitle}>Detalles del Pedido #{pedido.id}</h2>
                        <p style={styles.modalSubtitle}>
                            Realizado el {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} style={styles.closeButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div style={styles.modalBody}>
                    {/* Estado del Pedido */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Estado del Pedido</h3>
                        <div style={{...styles.estadoBadge, ...estadoStyle}}>
                            <span style={styles.estadoIcon}>{estadoStyle.icon}</span>
                            <span style={styles.estadoText}>{pedido.estado}</span>
                        </div>
                    </div>

                    {/* Información del Cliente */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Información del Cliente</h3>
                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Cliente:</div>
                                <div style={styles.infoValue}>
                                    {pedido.cliente?.first_name && pedido.cliente?.last_name
                                        ? `${pedido.cliente.first_name} ${pedido.cliente.last_name}`
                                        : pedido.cliente?.username || 'N/A'
                                    }
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Email:</div>
                                <div style={styles.infoValue}>{pedido.cliente?.email || 'N/A'}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Teléfono:</div>
                                <div style={styles.infoValue}>{pedido.cliente?.telefono || 'No especificado'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dirección de Entrega */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Dirección de Entrega</h3>
                        <div style={styles.direccionBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div>{pedido.direccion_entrega || 'No especificada'}</div>
                        </div>
                    </div>

                    {/* Productos del Pedido */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Productos</h3>
                        <div style={styles.productosContainer}>
                            {pedido.detalles && pedido.detalles.length > 0 ? (
                                pedido.detalles.map((detalle, index) => (
                                    <div key={index} style={styles.productoItem}>
                                        <div style={styles.productoInfo}>
                                            <div style={styles.productoIcon}>
                                                {detalle.producto?.categoria?.nombre === 'Frutas' ? '🍎' :
                                                 detalle.producto?.categoria?.nombre === 'Verduras' ? '🥕' : '🌱'}
                                            </div>
                                            <div style={styles.productoDetalle}>
                                                <div style={styles.productoNombre}>
                                                    {detalle.producto_nombre || detalle.producto?.nombre || 'Producto'}
                                                </div>
                                                <div style={styles.productoCantidad}>
                                                    Cantidad: {detalle.cantidad} unidad(es)
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.productoPrecio}>
                                            <div style={styles.precioUnitario}>
                                                {formatPrice(detalle.precio_unitario)} c/u
                                            </div>
                                            <div style={styles.precioTotal}>
                                                {formatPrice(detalle.precio_unitario * detalle.cantidad)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.noProductos}>
                                    No hay productos en este pedido
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de Pago */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Información de Pago</h3>
                        <div style={styles.pagoInfo}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Método de pago:</div>
                                <div style={styles.infoValue}>{pedido.metodo_pago || 'Efectivo'}</div>
                            </div>
                            {pedido.transaccion_id && (
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>ID de transacción:</div>
                                    <div style={styles.infoValue}>{pedido.transaccion_id}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen Total */}
                    <div style={styles.totalSection}>
                        <div style={styles.totalRow}>
                            <span style={styles.totalLabel}>Total del Pedido:</span>
                            <span style={styles.totalValue}>{formatPrice(pedido.total)}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.modalFooter}>
                    <button onClick={onClose} style={styles.cerrarButton}>
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998,
        animation: 'fadeIn 0.3s ease',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(26, 31, 46, 0.98)',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        zIndex: 9999,
        border: '1px solid rgba(45, 122, 62, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease',
    },
    modalHeader: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1))',
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.25rem',
    },
    modalSubtitle: {
        color: '#9ca3af',
        fontSize: '0.9rem',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        padding: '2rem',
        overflowY: 'auto',
        maxHeight: 'calc(90vh - 180px)',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#f9fafb',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    estadoBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
    },
    estadoIcon: {
        fontSize: '1.2rem',
    },
    estadoText: {
        textTransform: 'capitalize',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    infoLabel: {
        fontSize: '0.85rem',
        color: '#9ca3af',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: '1rem',
        color: '#f9fafb',
        fontWeight: '500',
    },
    direccionBox: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        border: '1px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '10px',
        color: '#e5e7eb',
        fontSize: '0.95rem',
        lineHeight: 1.6,
    },
    productosContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    productoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'rgba(15, 20, 25, 0.5)',
        borderRadius: '10px',
        border: '1px solid rgba(45, 122, 62, 0.1)',
    },
    productoInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: 1,
    },
    productoIcon: {
        fontSize: '2rem',
        flexShrink: 0,
    },
    productoDetalle: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    productoNombre: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#f9fafb',
    },
    productoCantidad: {
        fontSize: '0.85rem',
        color: '#9ca3af',
    },
    productoPrecio: {
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    precioUnitario: {
        fontSize: '0.85rem',
        color: '#9ca3af',
    },
    precioTotal: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d7a3e',
    },
    noProductos: {
        textAlign: 'center',
        padding: '2rem',
        color: '#9ca3af',
        fontSize: '0.95rem',
    },
    pagoInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    totalSection: {
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.15), rgba(4, 71, 44, 0.15))',
        borderRadius: '12px',
        border: '2px solid rgba(45, 122, 62, 0.3)',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#f9fafb',
    },
    totalValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d7a3e',
    },
    modalFooter: {
        padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        background: 'rgba(15, 20, 25, 0.5)',
    },
    cerrarButton: {
        padding: '0.75rem 2rem',
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#d1d5db',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
};

export default PedidoDetalleModal;