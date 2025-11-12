import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VendedorPanel.css';

// Importar componentes
import FormularioProducto from './FormularioProducto';
import ProductoCard from './ProductoCard';
import PedidoCard from './PedidoCard';

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

const VendedorPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vendedor, setVendedor] = useState(null);
    const [productosReales, setProductosReales] = useState([]);
    const [pedidosReales, setPedidosReales] = useState([]);
    const [metricasReales, setMetricasReales] = useState({});
    const [categoriasReales, setCategoriasReales] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    // Función para mostrar notificaciones bonitas
    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now();
        const toast = {
            id,
            message,
            type,
            duration
        };
        setToasts(prev => [...prev, toast]);
        
        // Auto-remover después de la duración
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    useEffect(() => {
        cargarDatosReales();
    }, []);

    const cargarDatosReales = async () => {
        try {
            setLoading(true);
            
            // 1. Obtener usuario logueado
            const usuario = JSON.parse(localStorage.getItem('user'));
            setVendedor(usuario);
            
            if (!usuario?.id) {
                console.error('No se pudo obtener ID del vendedor');
                return;
            }

            // 2. Cargar todos los datos en paralelo
            await Promise.all([
                cargarCategoriasReales(),
                cargarProductosVendedor(usuario.id),
                cargarPedidosVendedor(usuario.id),
                cargarMetricasVendedor(usuario.id)
            ]);

            showToast('✅ Datos cargados correctamente', 'success');

        } catch (error) {
            console.error('Error cargando datos reales:', error);
            showToast('❌ Error cargando datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ✅ CATEGORÍAS REALES desde la base de datos
    const cargarCategoriasReales = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categorias/', {
                withCredentials: true
            });
            setCategoriasReales(response.data);
        } catch (error) {
            console.error('Error cargando categorías reales:', error);
        }
    };

    // ✅ PRODUCTOS REALES del vendedor
    const cargarProductosVendedor = async (vendedorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/productos/mis_productos/`, {
                withCredentials: true
            });
            console.log('📦 Productos cargados:', response.data);
            // Log de las rutas de imágenes para debugging
            response.data.forEach(producto => {
                console.log(`🖼️ Producto: ${producto.nombre}, Ruta imagen: ${producto.imagen}`);
            });
            setProductosReales(response.data);
        } catch (error) {
            console.error('Error cargando productos reales:', error);
            // Fallback: filtrar productos por vendedor
            try {
                const allProducts = await axios.get('http://localhost:8000/api/productos/');
                const misProductos = allProducts.data.filter(p => p.vendedor === vendedorId);
                setProductosReales(misProductos);
            } catch (error2) {
                console.error('Error alternativo:', error2);
            }
        }
    };

    // ✅ PEDIDOS REALES del vendedor
    const cargarPedidosVendedor = async (vendedorId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/pedidos/', {
                withCredentials: true
            });
            setPedidosReales(response.data);
        } catch (error) {
            console.error('Error cargando pedidos reales:', error);
        }
    };

    // ✅ MÉTRICAS REALES del vendedor
    const cargarMetricasVendedor = async (vendedorId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/dashboard/', {
                withCredentials: true
            });
            setMetricasReales(response.data);
            
            // Generar notificaciones basadas en métricas reales
            generarNotificacionesReales(response.data);
        } catch (error) {
            console.error('Error cargando métricas reales:', error);
        }
    };

    // ✅ NOTIFICACIONES basadas en datos reales
    const generarNotificacionesReales = (metricas) => {
        const notifs = [];
        
        if (metricas.productos_sin_stock > 0) {
            notifs.push({
                id: 1,
                tipo: 'warning',
                titulo: 'Stock Crítico',
                mensaje: `${metricas.productos_sin_stock} productos sin stock`,
                fecha: new Date().toISOString(),
                leida: false
            });
        }
        
        if (metricas.pedidos_pendientes > 0) {
            notifs.push({
                id: 2,
                tipo: 'info',
                titulo: 'Pedidos Pendientes',
                mensaje: `${metricas.pedidos_pendientes} pedidos por procesar`,
                fecha: new Date().toISOString(),
                leida: false
            });
        }

        // Notificación para productos pendientes de aprobación
        const productosPendientes = productosReales.filter(p => !p.aprobado).length;
        if (productosPendientes > 0) {
            notifs.push({
                id: 3,
                tipo: 'info',
                titulo: 'Productos Pendientes',
                mensaje: `${productosPendientes} productos esperando aprobación`,
                fecha: new Date().toISOString(),
                leida: false
            });
        }
        
        setNotificaciones(notifs);
    };

    // ✅ AGREGAR PRODUCTO REAL
    const handleAgregarProducto = async (productoData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/productos/', productoData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Recargar productos después de agregar
            await cargarProductosVendedor(vendedor.id);
            showToast('🎉 Producto creado! Esperando aprobación del administrador.', 'success');
            return response.data;
        } catch (error) {
            console.error('Error agregando producto:', error);
            showToast('❌ Error al crear producto', 'error');
            throw error;
        }
    };

    // ✅ ACTUALIZAR ESTADO DE PEDIDO REAL
    const handleActualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            await axios.post(`http://localhost:8000/api/pedidos/${pedidoId}/cambiar_estado/`, {
                estado: nuevoEstado
            }, {
                withCredentials: true
            });
            
            // Recargar pedidos después de actualizar
            await cargarPedidosVendedor(vendedor.id);
            showToast('✅ Estado del pedido actualizado', 'success');
        } catch (error) {
            console.error('Error actualizando estado del pedido:', error);
            showToast('❌ Error al actualizar pedido', 'error');
            throw error;
        }
    };

    // ✅ ELIMINAR PRODUCTO REAL
    const handleEliminarProducto = async (productoId) => {
        try {
            await axios.delete(`http://localhost:8000/api/productos/${productoId}/`, {
                withCredentials: true
            });
            
            // Recargar productos después de eliminar
            await cargarProductosVendedor(vendedor.id);
            showToast('✅ Producto eliminado', 'success');
        } catch (error) {
            console.error('Error eliminando producto:', error);
            showToast('❌ Error al eliminar producto', 'error');
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="vendedor-loading">
                <div className="loading-spinner">📊</div>
                <p>Cargando datos reales del vendedor...</p>
            </div>
        );
    }

    // 📊 COMPONENTE DASHBOARD CON DATOS REALES
    const DashboardTab = () => {
        const calcularMetricasAdicionales = () => {
            const totalVendido = productosReales.reduce((sum, p) => sum + (p.precio * (p.vendidos || 0)), 0);
            const stockTotal = productosReales.reduce((sum, p) => sum + (p.stock || 0), 0);
            const productosConStockBajo = productosReales.filter(p => p.stock < 10).length;
            const productosActivos = productosReales.filter(p => p.activo).length;
            const productosPendientes = productosReales.filter(p => !p.aprobado).length;
            const productosAprobados = productosReales.filter(p => p.aprobado).length;
            
            return {
                totalVendido,
                stockTotal,
                productosConStockBajo,
                productosActivos,
                productosPendientes,
                productosAprobados
            };
        };

        const metricasAdicionales = calcularMetricasAdicionales();

        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0
            }).format(price);
        };

        // Productos para el carrusel (máximo 6)
        const productosCarrusel = productosReales.slice(0, 6);

        return (
            <div className="dashboard-tab">
                <h2>📊 Resumen de tu Negocio</h2>
                
                {/* KPIs Principales */}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-icon">💰</div>
                        <div className="kpi-content">
                            <div className="kpi-value">
                                {formatPrice(metricasAdicionales.totalVendido)}
                            </div>
                            <div className="kpi-label">Total Vendido</div>
                        </div>
                    </div>
                    
                    <div className="kpi-card">
                        <div className="kpi-icon">📦</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{metricasReales?.total_pedidos || 0}</div>
                            <div className="kpi-label">Pedidos Totales</div>
                        </div>
                    </div>
                    
                    <div className="kpi-card">
                        <div className="kpi-icon">🌱</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{metricasAdicionales.productosAprobados}</div>
                            <div className="kpi-label">Productos Aprobados</div>
                        </div>
                    </div>
                    
                    <div className="kpi-card">
                        <div className="kpi-icon">⏳</div>
                        <div className="kpi-content">
                            <div className="kpi-value">{metricasAdicionales.productosPendientes}</div>
                            <div className="kpi-label">Pendientes de Aprobación</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content-grid">
                    {/* Productos Destacados */}
                    <div className="dashboard-section">
                        <h3>🏆 Tus Productos Más Vendidos</h3>
                        <div className="productos-destacados">
                            {productosReales
                                .filter(p => (p.vendidos || 0) > 0)
                                .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))
                                .slice(0, 5)
                                .map(producto => (
                                    <div key={producto.id} className="producto-destacado">
                                        <span className="producto-nombre">{producto.nombre}</span>
                                        <span className="producto-ventas">{producto.vendidos || 0} vendidos</span>
                                    </div>
                                ))
                            }
                            {productosReales.filter(p => (p.vendidos || 0) > 0).length === 0 && (
                                <div className="empty-message">
                                    <p>📈 Tus productos más vendidos aparecerán aquí</p>
                                </div>
                            )}
                        </div>

                        {/* Pedidos Recientes */}
                        <div className="dashboard-section">
                            <h3>🛒 Pedidos Recientes</h3>
                            <div className="pedidos-recientes">
                                {pedidosReales.slice(0, 5).map(pedido => (
                                    <div key={pedido.id} className="pedido-resumen">
                                        <span className="pedido-id">#{pedido.id}</span>
                                        <span className="pedido-cliente">{pedido.cliente_nombre || 'Cliente'}</span>
                                        <span className="pedido-total">
                                            {formatPrice(pedido.total || 0)}
                                        </span>
                                        <span className={`pedido-estado ${pedido.estado}`}>
                                            {pedido.estado}
                                        </span>
                                    </div>
                                ))}
                                {pedidosReales.length === 0 && (
                                    <div className="empty-message">
                                        <p>🛒 Tus pedidos aparecerán aquí</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Carrusel de Productos - CORREGIDO */}
                    <div className="dashboard-section carrusel-section">
                        <h3>🔄 Tus Productos</h3>
                        <div className="productos-carrusel">
                            {productosCarrusel.map(producto => {
                                const imagenUrl = getImageUrl(producto.imagen);
                                console.log(`🖼️ Carrusel - Producto: ${producto.nombre}, Imagen URL: ${imagenUrl}`);
                                
                                return (
                                    <div key={producto.id} className="producto-carrusel-item">
                                        <div className="carrusel-image">
                                            {imagenUrl ? (
                                                <img 
                                                    src={imagenUrl}
                                                    alt={producto.nombre}
                                                    onError={(e) => {
                                                        console.error('❌ Error cargando imagen:', imagenUrl);
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                    onLoad={() => console.log('✅ Imagen cargada:', producto.nombre)}
                                                />
                                            ) : null}
                                            <div 
                                                className="carrusel-placeholder"
                                                style={{display: imagenUrl ? 'none' : 'flex'}}
                                            >
                                                {producto.categoria_nombre === 'Frutas' ? '🍎' :
                                                 producto.categoria_nombre === 'Verduras' ? '🥕' : '🌱'}
                                            </div>
                                        </div>
                                        <div className="carrusel-info">
                                            <h4>{producto.nombre}</h4>
                                            <p className="carrusel-precio">{formatPrice(producto.precio)}</p>
                                            <div className={`carrusel-estado ${producto.aprobado ? 'aprobado' : 'pendiente'}`}>
                                                {producto.aprobado ? '✅ Aprobado' : '⏳ Pendiente'}
                                            </div>
                                            <div className="carrusel-stock">
                                                Stock: {producto.stock} unidades
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {productosCarrusel.length === 0 && (
                                <div className="empty-carrusel">
                                    <div className="empty-icon">📦</div>
                                    <p>No tienes productos aún</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 📦 COMPONENTE PRODUCTOS CON PAGINACIÓN
    const ProductosTab = () => {
        const [mostrarFormulario, setMostrarFormulario] = useState(false);
        const [productoEditando, setProductoEditando] = useState(null);
        const [paginaActual, setPaginaActual] = useState(1);
        const [productosPorPagina] = useState(12);
        const [filtroAprobacion, setFiltroAprobacion] = useState('todos');

        const productosFiltrados = productosReales.filter(producto => {
            if (filtroAprobacion === 'aprobados') return producto.aprobado;
            if (filtroAprobacion === 'pendientes') return !producto.aprobado;
            return true;
        });

        const indexOfLastProduct = paginaActual * productosPorPagina;
        const indexOfFirstProduct = indexOfLastProduct - productosPorPagina;
        const productosActuales = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
        const totalPages = Math.ceil(productosFiltrados.length / productosPorPagina);

        const handleEditarProducto = (producto) => {
            setProductoEditando(producto);
            setMostrarFormulario(true);
        };

        const handleGuardarProducto = async (productoData) => {
            try {
                if (productoEditando) {
                    await axios.put(
                        `http://localhost:8000/api/productos/${productoEditando.id}/`,
                        productoData,
                        {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    showToast('✅ Producto actualizado correctamente', 'success');
                } else {
                    await handleAgregarProducto(productoData);
                }
                
                setMostrarFormulario(false);
                setProductoEditando(null);
                await cargarProductosVendedor(vendedor.id);
            } catch (error) {
                console.error('Error guardando producto:', error);
                showToast('❌ Error al guardar producto', 'error');
            }
        };

        const paginate = (pageNumber) => setPaginaActual(pageNumber);

        return (
            <div className="productos-tab">
                <div className="tab-header">
                    <div>
                        <h2>📦 Gestión de Productos ({productosFiltrados.length})</h2>
                        <p>Administra todos tus productos agrícolas</p>
                    </div>
                    <div className="tab-header-actions">
                        <select 
                            value={filtroAprobacion}
                            onChange={(e) => {
                                setFiltroAprobacion(e.target.value);
                                setPaginaActual(1);
                            }}
                            className="filtro-select"
                        >
                            <option value="todos">Todos los productos</option>
                            <option value="aprobados">Solo aprobados</option>
                            <option value="pendientes">Pendientes de aprobación</option>
                        </select>
                        <button 
                            className="btn-agregar"
                            onClick={() => {
                                setProductoEditando(null);
                                setMostrarFormulario(true);
                            }}
                        >
                            ➕ Agregar Producto
                        </button>
                    </div>
                </div>

                {mostrarFormulario && (
                    <FormularioProducto 
                        productoEditar={productoEditando}
                        onGuardar={handleGuardarProducto}
                        onCancelar={() => {
                            setMostrarFormulario(false);
                            setProductoEditando(null);
                        }}
                        onRecargar={() => cargarProductosVendedor(vendedor.id)}
                        categorias={categoriasReales}
                        showToast={showToast}
                    />
                )}

                <div className="productos-stats">
                    <div className="producto-stat">
                        <span className="stat-number">{productosReales.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="producto-stat aprobados">
                        <span className="stat-number">{productosReales.filter(p => p.aprobado).length}</span>
                        <span className="stat-label">Aprobados</span>
                    </div>
                    <div className="producto-stat pendientes">
                        <span className="stat-number">{productosReales.filter(p => !p.aprobado).length}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                </div>

                <div className="productos-grid-paginado">
                    {productosActuales.length > 0 ? (
                        <>
                            <div className="productos-grid">
                                {productosActuales.map(producto => (
                                    <ProductoCard 
                                        key={producto.id}
                                        producto={producto}
                                        onEditar={handleEditarProducto}
                                        onEliminar={() => handleEliminarProducto(producto.id)}
                                        onRecargar={() => cargarProductosVendedor(vendedor.id)}
                                        showToast={showToast}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        onClick={() => paginate(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="pagination-btn"
                                    >
                                        ← Anterior
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`pagination-number ${paginaActual === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => paginate(paginaActual + 1)}
                                        disabled={paginaActual === totalPages}
                                        className="pagination-btn"
                                    >
                                        Siguiente →
                                    </button>
                                </div>
                            )}

                            <div className="pagination-info">
                                Página {paginaActual} de {totalPages} • 
                                Mostrando {productosActuales.length} de {productosFiltrados.length} productos
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No hay productos</h3>
                            <p>{filtroAprobacion === 'aprobados' ? 
                                'No tienes productos aprobados aún' : 
                                filtroAprobacion === 'pendientes' ? 
                                'No tienes productos pendientes de aprobación' : 
                                'Comienza agregando tu primer producto agrícola'
                            }</p>
                            {filtroAprobacion === 'todos' && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setMostrarFormulario(true)}
                                >
                                    Agregar Primer Producto
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 🛒 COMPONENTE PEDIDOS CON DATOS REALES
    const PedidosTab = () => {
        return (
            <div className="pedidos-tab">
                <h2>🛒 Pedidos de Clientes ({pedidosReales.length})</h2>
                
                <div className="pedidos-list">
                    {pedidosReales.map(pedido => (
                        <PedidoCard 
                            key={pedido.id} 
                            pedido={pedido}
                            onActualizarEstado={handleActualizarEstadoPedido}
                            onRecargar={() => cargarPedidosVendedor(vendedor.id)}
                        />
                    ))}
                </div>

                {pedidosReales.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🛒</div>
                        <h3>No tienes pedidos aún</h3>
                        <p>Los pedidos de tus productos aparecerán aquí</p>
                    </div>
                )}
            </div>
        );
    };

    // 🔔 COMPONENTE NOTIFICACIONES
    const NotificacionesTab = () => {
        const [notificacionesLocales, setNotificacionesLocales] = useState(notificaciones);

        const marcarComoLeida = (id) => {
            setNotificacionesLocales(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, leida: true } : notif
                )
            );
        };

        const notificacionesNoLeidas = notificacionesLocales.filter(n => !n.leida);

        return (
            <div className="notificaciones-tab">
                <h2>🔔 Notificaciones ({notificacionesNoLeidas.length})</h2>
                
                <div className="notificaciones-list">
                    {notificacionesLocales.map(notif => (
                        <div 
                            key={notif.id} 
                            className={`notificacion ${notif.tipo} ${notif.leida ? 'leida' : ''}`}
                            onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                        >
                            <div className="notificacion-icono">
                                {notif.tipo === 'warning' ? '⚠️' : 'ℹ️'}
                            </div>
                            <div className="notificacion-contenido">
                                <div className="notificacion-titulo">{notif.titulo}</div>
                                <div className="notificacion-mensaje">{notif.mensaje}</div>
                                <div className="notificacion-fecha">
                                    {new Date(notif.fecha).toLocaleDateString('es-CL')}
                                </div>
                            </div>
                            {!notif.leida && <div className="notificacion-punto"></div>}
                        </div>
                    ))}
                </div>

                {notificacionesLocales.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔔</div>
                        <h3>No hay notificaciones</h3>
                        <p>Te avisaremos cuando tengas novedades importantes</p>
                    </div>
                )}
            </div>
        );
    };

    // 🎨 COMPONENTE TOAST CONTAINER
    const ToastContainer = () => {
        return (
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'success' ? '✅' : 
                             toast.type === 'error' ? '❌' : 'ℹ️'}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="toast-close"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="vendedor-panel">
            {/* Toast Container */}
            <ToastContainer />

            <div className="panel-header">
                <h1>👩‍🌾 Panel del Vendedor</h1>
                <p>Gestiona tu negocio agrícola con datos reales</p>
                <div className="vendedor-info">
                    <span>Vendedor: {vendedor?.username}</span>
                    <span>•</span>
                    <span>Productos: {productosReales.length}</span>
                    <span>•</span>
                    <span>Pedidos: {pedidosReales.length}</span>
                    <span>•</span>
                    <span>Categorías: {categoriasReales.length}</span>
                </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="navigation-tabs">
                <button 
                    className={activeTab === 'dashboard' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button 
                    className={activeTab === 'productos' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('productos')}
                >
                    📦 Productos ({productosReales.length})
                </button>
                <button 
                    className={activeTab === 'pedidos' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('pedidos')}
                >
                    🛒 Pedidos ({pedidosReales.length})
                </button>
                <button 
                    className={activeTab === 'notificaciones' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('notificaciones')}
                >
                    🔔 Notificaciones ({notificaciones.filter(n => !n.leida).length})
                </button>
            </div>

            {/* Contenido principal */}
            <div className="panel-content">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'productos' && <ProductosTab />}
                {activeTab === 'pedidos' && <PedidosTab />}
                {activeTab === 'notificaciones' && <NotificacionesTab />}
            </div>
        </div>
    );
};

export default VendedorPanel;