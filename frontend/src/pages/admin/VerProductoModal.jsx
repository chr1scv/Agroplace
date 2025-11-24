import React from 'react';

const VerProductoModal = ({ producto, onClose, formatPrice }) => {
    if (!producto) return null;

    const getImageUrl = (imagenPath) => {
        if (!imagenPath) return null;
        if (imagenPath.startsWith('/media/')) {
            return `http://localhost:8000${imagenPath}`;
        } else if (imagenPath.startsWith('http')) {
            return imagenPath;
        } else {
            return `http://localhost:8000/media/${imagenPath}`;
        }
    };

    const formatearPrecio = (precio) => {
        if (formatPrice) {
            return formatPrice(precio);
        }
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div className="modal-header">
                    <h2>Detalles del Producto</h2>
                    <button onClick={onClose} className="modal-close-button">×</button>
                </div>

                {/* Body */}
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* Información General */}
                    <div className="admin-form-section">
                        <h3 className="admin-section-subtitle">Información General</h3>
                        <table className="admin-detail-table">
                            <tbody>
                                <tr>
                                    <td className="admin-detail-label">Nombre del Producto:</td>
                                    <td className="admin-detail-value">{producto.nombre}</td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Categoría:</td>
                                    <td className="admin-detail-value">
                                        {producto.categoria?.nombre || 'Sin categoría'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Precio:</td>
                                    <td className="admin-detail-value" style={{ color: '#2d7a3e', fontWeight: '600' }}>
                                        {formatearPrecio(producto.precio)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Stock Disponible:</td>
                                    <td className="admin-detail-value">
                                        <span className={producto.stock > 0 ? "admin-stock-disponible" : "admin-stock-agotado"}>
                                            {producto.stock} unidades
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Estado:</td>
                                    <td className="admin-detail-value">
                                        <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                            {producto.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Estado de Aprobación:</td>
                                    <td className="admin-detail-value">
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            backgroundColor: producto.aprobado ? '#d1fae5' : '#fef3c7',
                                            color: producto.aprobado ? '#065f46' : '#92400e'
                                        }}>
                                            {producto.aprobado ? '✅ Aprobado' : '⏳ Pendiente'}
                                        </span>
                                    </td>
                                </tr>
                                {producto.origen && (
                                    <tr>
                                        <td className="admin-detail-label">Tipo de Origen:</td>
                                        <td className="admin-detail-value">
                                            {producto.origen === 'organico' ? 'Orgánico' : 'Convencional'}
                                        </td>
                                    </tr>
                                )}
                                {producto.region && (
                                    <tr>
                                        <td className="admin-detail-label">Región:</td>
                                        <td className="admin-detail-value">{producto.region}</td>
                                    </tr>
                                )}
                                {producto.provincia && (
                                    <tr>
                                        <td className="admin-detail-label">Provincia:</td>
                                        <td className="admin-detail-value">{producto.provincia}</td>
                                    </tr>
                                )}
                                {producto.comuna && (
                                    <tr>
                                        <td className="admin-detail-label">Comuna:</td>
                                        <td className="admin-detail-value">{producto.comuna}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Descripción */}
                    <div className="admin-form-section">
                        <h3 className="admin-section-subtitle">Descripción Completa</h3>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#374151',
                            lineHeight: '1.6',
                            minHeight: '80px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {producto.descripcion || 'No hay descripción disponible para este producto.'}
                        </div>
                    </div>

                    {/* Información del Vendedor */}
                    <div className="admin-form-section">
                        <h3 className="admin-section-subtitle">Información del Vendedor</h3>
                        <table className="admin-detail-table">
                            <tbody>
                                <tr>
                                    <td className="admin-detail-label">Usuario:</td>
                                    <td className="admin-detail-value">
                                        {producto.vendedor?.username || 'Vendedor Desconocido'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-label">Email:</td>
                                    <td className="admin-detail-value">
                                        {producto.vendedor?.email || 'Sin email'}
                                    </td>
                                </tr>
                                {producto.vendedor?.telefono && (
                                    <tr>
                                        <td className="admin-detail-label">Teléfono:</td>
                                        <td className="admin-detail-value">{producto.vendedor.telefono}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Imagen del Producto */}
                    {producto.imagen && (
                        <div className="admin-form-section">
                            <h3 className="admin-section-subtitle">Imagen del Producto</h3>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '20px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <img
                                    src={getImageUrl(producto.imagen)}
                                    alt={producto.nombre}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<p style="color: #6b7280; text-align: center;">No se pudo cargar la imagen</p>';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button onClick={onClose} className="admin-button-secondary">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerProductoModal;
