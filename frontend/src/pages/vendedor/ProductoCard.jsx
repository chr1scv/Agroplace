import React, { useState } from 'react';
import axios from 'axios';
import './ProductoCard.css';

// ✅ Función helper para construir URLs de imagen correctamente
const getImageUrl = (imagenPath) => {
    if (!imagenPath) return null;
    
    // Si ya empieza con /media/, agregar el dominio
    if (imagenPath.startsWith('/media/')) {
        return `http://localhost:8000${imagenPath}`;
    } 
    // Si ya es una URL completa, usarla directamente
    else if (imagenPath.startsWith('http')) {
        return imagenPath;
    } 
    // Si es solo el nombre del archivo, construir la ruta completa
    else {
        return `http://localhost:8000/media/products/${imagenPath}`;
    }
};

const ProductoCard = ({ producto, onEditar, onEliminar, onRecargar, showToast }) => {
    const [loading, setLoading] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

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
            await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, {
                withCredentials: true
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
        if (stock === 0) return { tipo: 'agotado', texto: 'Agotado' };
        if (stock < 10) return { tipo: 'bajo', texto: 'Stock Bajo' };
        return { tipo: 'normal', texto: 'En Stock' };
    };

    const stockStatus = getStockStatus(producto.stock);
    
    // ✅ Obtener URL de imagen con manejo correcto
    const imagenUrl = getImageUrl(producto.imagen);
    console.log(`🖼️ ProductoCard - ${producto.nombre}, Imagen URL: ${imagenUrl}`);

    return (
        <div className="producto-card">
            {/* Imagen del Producto - CORREGIDO */}
            <div className="producto-image">
                {imagenUrl ? (
                    <img 
                        src={imagenUrl} 
                        alt={producto.nombre}
                        className="producto-real-image"
                        onError={(e) => {
                            console.error('❌ Error cargando imagen:', imagenUrl);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={() => console.log('✅ Imagen cargada:', producto.nombre)}
                    />
                ) : null}
                <div 
                    className="placeholder-image"
                    style={{display: imagenUrl ? 'none' : 'flex'}}
                >
                    {getPlaceholderIcon(producto)}
                </div>
                
                {/* Badges */}
                <div className="producto-badges">
                    {producto.origen === 'organico' && (
                        <span className="badge organic">🌿 Orgánico</span>
                    )}
                    <span className={`badge stock ${stockStatus.tipo}`}>
                        {stockStatus.texto}
                    </span>
                    {!producto.activo && (
                        <span className="badge inactivo">⏸️ Inactivo</span>
                    )}
                    {!producto.aprobado && (
                        <span className="badge pendiente">⏳ Pendiente</span>
                    )}
                </div>
            </div>
            
            {/* Información del Producto */}
            <div className="producto-info">
                <h4 className="producto-nombre">{producto.nombre}</h4>
                <p className="producto-categoria">{producto.categoria_nombre}</p>
                
                <div className="producto-precio">
                    {formatPrice(producto.precio)}
                </div>
                
                <div className="producto-stats">
                    <div className="stat">
                        <span className="stat-label">Stock:</span>
                        <span className="stat-value">{producto.stock} unidades</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Vendidos:</span>
                        <span className="stat-value">{producto.vendidos || 0}</span>
                    </div>
                </div>
                
                {producto.vendedor_nombre && (
                    <div className="producto-meta">
                        <span className="vendedor">Vendedor: {producto.vendedor_nombre}</span>
                    </div>
                )}
            </div>
            
            {/* Acciones */}
            <div className="producto-actions">
                <button 
                    onClick={() => onEditar(producto)}
                    className="btn-editar"
                    disabled={loading}
                >
                    ✏️ Editar
                </button>
                <button 
                    onClick={() => setMostrarConfirmacion(true)}
                    className="btn-eliminar"
                    disabled={loading}
                >
                    {loading ? '🔄' : '🗑️'} Eliminar
                </button>
            </div>

            {/* Modal de Confirmación */}
            {mostrarConfirmacion && (
                <div className="confirmacion-modal">
                    <div className="modal-content">
                        <h3>¿Eliminar Producto?</h3>
                        <p>¿Estás seguro de que quieres eliminar "{producto.nombre}"?</p>
                        <p className="advertencia">Esta acción no se puede deshacer.</p>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={handleEliminar}
                                className="btn-confirmar"
                                disabled={loading}
                            >
                                {loading ? '🔄 Eliminando...' : '✅ Sí, Eliminar'}
                            </button>
                            <button 
                                onClick={() => setMostrarConfirmacion(false)}
                                className="btn-cancelar"
                                disabled={loading}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoCard;