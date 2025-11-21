import React, { useState } from 'react';
import axios from 'axios';
import './ProductoCard.css';

// Función helper para construir URLs de imagen
const getImageUrl = (imagenPath) => {
    if (!imagenPath) return null;
    
    if (imagenPath.startsWith('/media/')) {
        return `http://localhost:8000${imagenPath}`;
    } 
    else if (imagenPath.startsWith('http')) {
        return imagenPath;
    } 
    else {
        return `http://localhost:8000/media/products/${imagenPath}`;
    }
};

const ProductoCard = ({ producto, onEditar, onEliminar, onRecargar, showToast }) => {
    const [loading, setLoading] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const getPlaceholderIcon = (producto) => {
        const iconos = {
            'Frutas': '🍎',
            'Verduras': '🥕',
            'Hortalizas': '🥬',
            'Orgánicos': '🌱',
            'Tomates': '🍅',
            'Manzanas': '🍎',
            'Zanahorias': '🥕',
            'Papas': '🥔'
        };
        return iconos[producto.categoria_nombre] || '🌱';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

        const handleEliminar = async () => {
        try {
            setLoading(true);
            
            // Obtener CSRF token
            const getCsrfToken = () => {
                const name = 'csrftoken';
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const trimmed = cookie.trim();
                    if (trimmed.startsWith(name + '=')) {
                        return trimmed.substring(name.length + 1);
                    }
                }
                return null;
            };
            
            const csrfToken = getCsrfToken();
            
            await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, {
                withCredentials: true,
                headers: csrfToken ? {
                    'X-CSRFToken': csrfToken
                } : {}
            });
            
            if (showToast) {
                showToast('✅ Producto eliminado correctamente', 'success');
            }
            
            if (onEliminar) {
                onEliminar(producto.id);
            }
            if (onRecargar) {
                await onRecargar();
            }
            
            setMostrarConfirmacion(false);
        } catch (error) {
            console.error('Error eliminando producto:', error);
            if (showToast) {
                showToast('❌ Error al eliminar producto', 'error');
            } else {
                alert('Error al eliminar producto. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { tipo: 'agotado', texto: 'Agotado', color: '#ef4444' };
        if (stock < 10) return { tipo: 'bajo', texto: 'Stock Bajo', color: '#f59e0b' };
        return { tipo: 'normal', texto: 'En Stock', color: '#10b981' };
    };

    const stockStatus = getStockStatus(producto.stock);
    const imagenUrl = getImageUrl(producto.imagen);

    return (
        <>
            <div 
                className="producto-card-modern"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* Imagen del Producto */}
                <div className="producto-image-container-modern">
                    {imagenUrl ? (
                        <img 
                            src={imagenUrl} 
                            alt={producto.nombre}
                            className="producto-image-modern"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div 
                        className="producto-placeholder-modern"
                        style={{display: imagenUrl ? 'none' : 'flex'}}
                    >
                        <span className="placeholder-icon-modern">
                            {getPlaceholderIcon(producto)}
                        </span>
                    </div>

                    {/* Badge de Estado (Aprobado/Pendiente) */}
                    <div className={`producto-badge-status-modern ${producto.aprobado ? 'aprobado' : 'pendiente'}`}>
                        {producto.aprobado ? (
                            <>
                                <span className="badge-icon-modern">✓</span>
                                <span>Activo</span>
                            </>
                        ) : (
                            <>
                                <span className="badge-icon-modern">⏳</span>
                                <span>Revisión</span>
                            </>
                        )}
                    </div>

                    {/* Badge Orgánico */}
                    {producto.origen === 'organico' && (
                        <div className="producto-badge-organic-modern">
                            🌿 Orgánico
                        </div>
                    )}

                    {/* Acciones flotantes al hacer hover */}
                    {showActions && (
                        <div className="producto-actions-overlay-modern">
                            <button
                                onClick={() => onEditar(producto)}
                                className="action-btn-modern action-btn-edit-modern"
                                title="Editar producto"
                            >
                                <span className="action-icon-modern">✏️</span>
                            </button>
                            <button
                                onClick={() => setMostrarConfirmacion(true)}
                                className="action-btn-modern action-btn-delete-modern"
                                title="Eliminar producto"
                            >
                                <span className="action-icon-modern">🗑️</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Información del Producto */}
                <div className="producto-info-modern">
                    <h3 className="producto-nombre-modern">{producto.nombre}</h3>
                    <p className="producto-categoria-modern">{producto.categoria_nombre}</p>
                    
                    {/* Ubicación */}
                    {(producto.comuna || producto.ciudad) && (
                        <p className="producto-ubicacion-modern">
                            <span className="ubicacion-icon-modern">📍</span>
                            {producto.comuna && producto.ciudad 
                                ? `${producto.comuna}, ${producto.ciudad}`
                                : producto.comuna || producto.ciudad
                            }
                        </p>
                    )}

                    {/* Stats: Stock y Vendidos */}
                    <div className="producto-stats-modern">
                        <div className="stat-item-modern">
                            <span className="stat-label-modern">Stock</span>
                            <span 
                                className="stat-value-modern"
                                style={{ color: stockStatus.color }}
                            >
                                {producto.stock}
                            </span>
                        </div>
                        <div className="stat-divider-modern"></div>
                        <div className="stat-item-modern">
                            <span className="stat-label-modern">Vendidos</span>
                            <span className="stat-value-modern stat-vendidos-modern">
                                {producto.vendidos || 0}
                            </span>
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="producto-precio-modern">
                        <span className="precio-valor-modern">{formatPrice(producto.precio)}</span>
                        <span className="precio-unidad-modern">/kg</span>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Eliminación */}
            {mostrarConfirmacion && (
                <div className="modal-overlay-eliminar-modern">
                    <div className="modal-content-eliminar-modern">
                        <div className="modal-icon-eliminar-modern">🗑️</div>
                        <h3 className="modal-title-eliminar-modern">¿Eliminar Producto?</h3>
                        <p className="modal-text-eliminar-modern">
                            ¿Estás seguro de que quieres eliminar <strong>"{producto.nombre}"</strong>?
                        </p>
                        <p className="modal-warning-eliminar-modern">
                            Esta acción no se puede deshacer.
                        </p>
                        
                        <div className="modal-actions-eliminar-modern">
                            <button 
                                onClick={() => setMostrarConfirmacion(false)}
                                className="btn-cancelar-eliminar-modern"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleEliminar}
                                className="btn-confirmar-eliminar-modern"
                                disabled={loading}
                            >
                                {loading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductoCard;