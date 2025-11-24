import React, { useState } from 'react';
import axios from 'axios';
import './PedidoCard.css';

const PedidoCard = ({ pedido, onActualizarEstado, onRecargar }) => {
    const [loading, setLoading] = useState(false);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoStyle = (estado) => {
        const estilos = {
            pendiente: { color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)', icon: '⏳' },
            preparacion: { color: '#fd7e14', bg: 'rgba(253, 126, 20, 0.1)', icon: '👨‍🍳' },
            transito: { color: '#0d6efd', bg: 'rgba(13, 110, 253, 0.1)', icon: '🚚' },
            entregado: { color: '#198754', bg: 'rgba(25, 135, 84, 0.1)', icon: '✅' },
            cancelado: { color: '#dc3545', bg: 'rgba(220, 53, 69, 0.1)', icon: '❌' }
        };
        return estilos[estado] || estilos.pendiente;
    };

    const handleEstadoChange = async (nuevoEstado) => {
        try {
            setLoading(true);
            await axios.post(
                `http://localhost:8000/api/pedidos/${pedido.id}/cambiar_estado/`,
                { estado: nuevoEstado },
                { withCredentials: true }
            );

            if (onActualizarEstado) {
                onActualizarEstado(pedido.id, nuevoEstado);
            }
            if (onRecargar) {
                await onRecargar();
            }
        } catch (error) {
            console.error('Error actualizando estado:', error);
            alert('Error al actualizar estado del pedido');
        } finally {
            setLoading(false);
        }
    };

    const estadoInfo = getEstadoStyle(pedido.estado);
    const productosCount = pedido.detalles?.reduce((sum, detalle) => sum + detalle.cantidad, 0) || 0;

    return (
        <div className="pedido-card">
            {/* Header del Pedido */}
            <div className="pedido-header">
                <div className="pedido-info">
                    <h3 className="pedido-id">Pedido #{pedido.id}</h3>
                    <p className="pedido-fecha">{formatFecha(pedido.fecha_pedido)}</p>
                    <p className="pedido-cliente">
                        👤 Cliente: <strong>{pedido.cliente_nombre || 'Cliente'}</strong>
                    </p>
                </div>

                <div className="pedido-estado-info">
                    <div
                        className="estado-badge"
                        style={{
                            color: estadoInfo.color,
                            backgroundColor: estadoInfo.bg
                        }}
                    >
                        <span className="estado-icon">{estadoInfo.icon}</span>
                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </div>
                    <div className="pedido-total">
                        Total: <strong>{formatPrice(pedido.total)}</strong>
                    </div>
                </div>
            </div>

            {/* Resumen de Productos */}
            <div className="pedido-resumen">
                <div className="resumen-item">
                    <span>📦 Productos:</span>
                    <span>{productosCount} unidades</span>
                </div>
                <div className="resumen-item">
                    <span>📋 Items:</span>
                    <span>{pedido.detalles?.length || 0} tipos</span>
                </div>
            </div>

            {/* Acciones */}
            <div className="pedido-actions">
                <button
                    onClick={() => setMostrarDetalles(!mostrarDetalles)}
                    className="btn-detalles"
                >
                    {mostrarDetalles ? '▲' : '▼'} Ver Detalles
                </button>

                <select
                    value={pedido.estado}
                    onChange={(e) => handleEstadoChange(e.target.value)}
                    className="estado-select"
                    disabled={loading}
                >
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="preparacion">👨‍🍳 En preparación</option>
                    <option value="transito">🚚 En tránsito</option>
                    <option value="entregado">✅ Entregado</option>
                    <option value="cancelado">❌ Cancelado</option>
                </select>
            </div>

            {/* Detalles Expandibles */}
            {mostrarDetalles && (
                <div className="pedido-detalles">
                    <h4>📋 Detalles del Pedido</h4>

                    <div className="productos-lista">
                        {pedido.detalles?.map((detalle, index) => (
                            <div key={index} className="producto-detalle">
                                <div className="producto-info">
                                    <span className="producto-nombre">
                                        {detalle.producto_nombre || 'Producto'}
                                    </span>
                                    <span className="producto-precio">
                                        {formatPrice(detalle.precio_unitario)} c/u
                                    </span>
                                </div>
                                <div className="producto-cantidad">
                                    {detalle.cantidad} x {formatPrice(detalle.precio_unitario * detalle.cantidad)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Información de Envío */}
                    <div className="envio-info">
                        <h5>🚚 Información de Envío</h5>
                        <p><strong>Dirección:</strong> {pedido.direccion_entrega || 'Por definir'}</p>
                        <p><strong>Método de pago:</strong> {pedido.metodo_pago || 'Efectivo'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PedidoCard;