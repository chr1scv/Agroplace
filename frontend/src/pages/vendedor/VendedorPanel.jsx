import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './VendedorPanel.css';
import FormularioProducto from './FormularioProducto';
import ProductoCard from './ProductoCard';
import PedidoCard from './PedidoCard';
import VendedorProfileMenu from '../../components/VendedorProfileMenu';

// 🎨 COMPONENTES AUXILIARES
const StatCard = ({ icon, label, value, colorClass, onClick }) => (
    <div className={`stat-card-modern ${colorClass}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="stat-icon-modern">{icon}</div>
        <div className="stat-content-modern">
            <div className="stat-value-modern">{value}</div>
            <div className="stat-label-modern">{label}</div>
        </div>
    </div>
);

const CarruselProductos = ({ productos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const productosRecientes = productos.slice(-6).reverse();

    const siguiente = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, productosRecientes.length - 2));
    };

    const anterior = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.max(1, productosRecientes.length - 2)) % Math.max(1, productosRecientes.length - 2));
    };

    if (productosRecientes.length === 0) {
        return (
            <div className="empty-state-modern">
                <p>📦 Aún no has agregado productos</p>
            </div>
        );
    }

    return (
        <div className="carrusel-modern">
            <button onClick={anterior} className="carrusel-btn-modern carrusel-btn-left-modern">‹</button>
            <div className="carrusel-container-modern">
                <div className="carrusel-track-modern" style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}>
                    {productosRecientes.map(producto => (
                        <div key={producto.id} className="carrusel-item-modern">
                            <div className="carrusel-producto-modern">
                                <img
                                    src={producto.imagen || '/placeholder.png'}
                                    alt={producto.nombre}
                                    className="carrusel-imagen-modern"
                                />
                                <div className="carrusel-info-modern">
                                    <h4 className="carrusel-nombre-modern">{producto.nombre}</h4>
                                    <p className="carrusel-precio-modern">
                                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(producto.precio)}
                                    </p>
                                    <span className={`carrusel-badge-modern ${producto.aprobado ? 'badge-aprobado' : 'badge-pendiente'}`}>
                                        {producto.aprobado ? '✅ Aprobado' : '⏳ Pendiente'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={siguiente} className="carrusel-btn-modern carrusel-btn-right-modern">›</button>
        </div>
    );
};

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast-modern toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="toast-close-modern">×</button>
        </div>
    );
};

// 🏠 COMPONENTE PRINCIPAL
const VendedorPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vendedor, setVendedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productosReales, setProductosReales] = useState([]);
    const [pedidosReales, setPedidosReales] = useState([]);
    const [metricasReales, setMetricasReales] = useState({});
    const [categoriasReales, setCategoriasReales] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [toasts, setToasts] = useState([]);

    // Toast functions
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    useEffect(() => {
        cargarDatosReales();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarDatosReales = async () => {
        try {
            setLoading(true);

            const usuario = JSON.parse(localStorage.getItem('user'));
            setVendedor(usuario);

            if (!usuario?.id) {
                console.error('No se pudo obtener ID del vendedor');
                return;
            }

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

    const cargarCategoriasReales = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categorias/', {
                withCredentials: true
            });
            setCategoriasReales(response.data);
        } catch (error) {
            console.error('Error cargando categorías reales:', error);
        }
    }, []);

    const cargarProductosVendedor = useCallback(async (vendedorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/productos/mis_productos/`, {
                withCredentials: true
            });
            console.log('📦 Productos cargados:', response.data);
            response.data.forEach(producto => {
                console.log(`🖼️ Producto: ${producto.nombre}, Ruta imagen: ${producto.imagen}`);
            });
            setProductosReales(response.data);
        } catch (error) {
            console.error('Error cargando productos reales:', error);
            try {
                const allProducts = await axios.get('http://localhost:8000/api/productos/');
                const misProductos = allProducts.data.filter(p => p.vendedor === vendedorId);
                setProductosReales(misProductos);
            } catch (error2) {
                console.error('Error alternativo:', error2);
            }
        }
    }, []);

    const cargarPedidosVendedor = useCallback(async (vendedorId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/pedidos/', {
                withCredentials: true
            });
            setPedidosReales(response.data);
        } catch (error) {
            console.error('Error cargando pedidos reales:', error);
        }
    }, []);

    const generarNotificacionesReales = useCallback((metricas) => {
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
    }, [productosReales]);

    const cargarMetricasVendedor = useCallback(async (vendedorId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/dashboard/', {
                withCredentials: true
            });
            setMetricasReales(response.data);
            generarNotificacionesReales(response.data);
        } catch (error) {
            console.error('Error cargando métricas reales:', error);
        }
    }, [generarNotificacionesReales]);

    const handleAgregarProducto = async (productoData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/productos/', productoData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await cargarProductosVendedor(vendedor.id);
            return response.data;
        } catch (error) {
            console.error('Error agregando producto:', error);
            throw error;
        }
    };

    const handleActualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            await axios.post(`http://localhost:8000/api/pedidos/${pedidoId}/cambiar_estado/`, {
                estado: nuevoEstado
            }, {
                withCredentials: true
            });

            await cargarPedidosVendedor(vendedor.id);
            showToast('✅ Estado del pedido actualizado', 'success');
        } catch (error) {
            console.error('Error actualizando estado del pedido:', error);
            showToast('❌ Error al actualizar pedido', 'error');
            throw error;
        }
    };

    const handleEliminarProducto = async (productoId) => {
        try {
            await axios.delete(`http://localhost:8000/api/productos/${productoId}/`, {
                withCredentials: true
            });

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
            <div className="vendedor-loading-modern">
                <div className="loading-spinner-modern">📊</div>
                <p>Cargando tu panel...</p>
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

        return (
            <div className="dashboard-modern">
                <div className="dashboard-header-modern">
                    <h1 className="dashboard-title-modern">Hola, {vendedor?.username || 'Vendedor'} 👋</h1>
                    <p className="dashboard-subtitle-modern">Así va tu negocio hoy</p>
                </div>

                {/* KPIs Grid */}
                <div className="kpi-grid-modern">
                    <StatCard
                        icon="💰"
                        label="Ventas Totales"
                        value={formatPrice(metricasAdicionales.totalVendido)}
                        colorClass="stat-card-blue"
                    />
                    <StatCard
                        icon="🛒"
                        label="Pedidos Pendientes"
                        value={metricasReales?.pedidos_pendientes || 0}
                        colorClass="stat-card-amber"
                        onClick={() => setActiveTab('pedidos')}
                    />
                    <StatCard
                        icon="📦"
                        label="Productos Activos"
                        value={metricasAdicionales.productosAprobados}
                        colorClass="stat-card-green"
                    />
                    <StatCard
                        icon="⚠️"
                        label="Stock Bajo"
                        value={metricasAdicionales.productosConStockBajo}
                        colorClass="stat-card-red"
                        onClick={() => setActiveTab('productos')}
                    />
                </div>

                {/* Grid con Pedidos, Productos Destacados y Carrusel */}
                <div className="dashboard-grid-modern">
                    {/* Pedidos Recientes */}
                    <div className="dashboard-section-modern">
                        <div className="section-header-modern">
                            <h2 className="section-title-modern">📦 Pedidos Recientes</h2>
                            <button
                                onClick={() => setActiveTab('pedidos')}
                                className="btn-link-modern"
                            >
                                Ver todos →
                            </button>
                        </div>
                        <div className="pedidos-grid-modern">
                            {pedidosReales.slice(0, 3).map(pedido => (
                                <PedidoCard
                                    key={pedido.id}
                                    pedido={pedido}
                                    onActualizarEstado={handleActualizarEstadoPedido}
                                    onRecargar={() => cargarPedidosVendedor(vendedor.id)}
                                />
                            ))}
                            {pedidosReales.length === 0 && (
                                <div className="empty-state-modern">
                                    <div className="empty-icon-modern">🛒</div>
                                    <p>No hay pedidos recientes</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos Destacados */}
                    <div className="dashboard-section-modern">
                        <h2 className="section-title-modern">🏆 Productos Más Vendidos</h2>
                        <div className="productos-destacados-modern">
                            {productosReales
                                .filter(p => (p.vendidos || 0) > 0)
                                .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))
                                .slice(0, 5)
                                .map(producto => (
                                    <div key={producto.id} className="producto-destacado-modern">
                                        <span className="producto-nombre-modern">{producto.nombre}</span>
                                        <span className="producto-ventas-modern">{producto.vendidos || 0} vendidos</span>
                                    </div>
                                ))
                            }
                            {productosReales.filter(p => (p.vendidos || 0) > 0).length === 0 && (
                                <div className="empty-state-modern">
                                    <p>📈 Tus productos más vendidos aparecerán aquí</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Carrusel de Nuevos Productos */}
                    <div className="dashboard-section-modern carousel-section-modern">
                        <div className="section-header-modern">
                            <h2 className="section-title-modern">✨ Últimos Productos</h2>
                            <button
                                onClick={() => setActiveTab('productos')}
                                className="btn-link-modern"
                            >
                                Ver todos →
                            </button>
                        </div>
                        <CarruselProductos productos={productosReales} />
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
        const [searchTerm, setSearchTerm] = useState('');

        const productosFiltrados = productosReales.filter(producto => {
            const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            if (filtroAprobacion === 'aprobados') return producto.aprobado && matchSearch;
            if (filtroAprobacion === 'pendientes') return !producto.aprobado && matchSearch;
            return matchSearch;
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
                } else {
                    await handleAgregarProducto(productoData);
                }

                setMostrarFormulario(false);
                setProductoEditando(null);
                await cargarProductosVendedor(vendedor.id);
            } catch (error) {
                console.error('Error guardando producto:', error);
            }
        };

        const paginate = (pageNumber) => setPaginaActual(pageNumber);

        return (
            <div className="productos-tab-modern">
                <div className="productos-header-modern">
                    <div>
                        <h1 className="tab-title-modern">Mis Productos</h1>
                        <p className="tab-subtitle-modern">{productosFiltrados.length} productos en total</p>
                    </div>
                    <button
                        className="btn-primary-modern"
                        onClick={() => {
                            setProductoEditando(null);
                            setMostrarFormulario(true);
                        }}
                    >
                        <span className="btn-icon-modern">+</span>
                        Nuevo Producto
                    </button>
                </div>

                {/* Barra de búsqueda y filtros */}
                <div className="productos-filters-modern">
                    <div className="search-box-modern">
                        <span className="search-icon-modern">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-modern"
                        />
                    </div>
                    <select
                        value={filtroAprobacion}
                        onChange={(e) => {
                            setFiltroAprobacion(e.target.value);
                            setPaginaActual(1);
                        }}
                        className="filter-select-modern"
                    >
                        <option value="todos">Todos</option>
                        <option value="aprobados">Solo Aprobados</option>
                        <option value="pendientes">Pendientes</option>
                    </select>
                </div>

                {mostrarFormulario && (
                    <div className="modal-overlay-modern">
                        <div className="modal-content-modern">
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
                        </div>
                    </div>
                )}

                {productosActuales.length > 0 ? (
                    <>
                        <div className="productos-grid-modern">
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
                            <div className="pagination-modern">
                                <button
                                    onClick={() => paginate(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                    className="pagination-btn-modern"
                                >
                                    ← Anterior
                                </button>

                                <span className="pagination-info-modern">
                                    Página {paginaActual} de {totalPages}
                                </span>

                                <button
                                    onClick={() => paginate(paginaActual + 1)}
                                    disabled={paginaActual === totalPages}
                                    className="pagination-btn-modern"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state-modern">
                        <div className="empty-icon-modern">📦</div>
                        <h3 className="empty-title-modern">No se encontraron productos</h3>
                        <p className="empty-text-modern">
                            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer producto'}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // 🛒 COMPONENTE PEDIDOS CON DATOS REALES
    const PedidosTab = () => {
        const [filtroEstado, setFiltroEstado] = useState('todos');

        const pedidosFiltrados = pedidosReales.filter(pedido => {
            if (filtroEstado === 'todos') return true;
            return pedido.estado === filtroEstado;
        });

        return (
            <div className="pedidos-tab-modern">
                <div className="productos-header-modern">
                    <div>
                        <h1 className="tab-title-modern">Gestión de Pedidos</h1>
                        <p className="tab-subtitle-modern">{pedidosFiltrados.length} pedidos</p>
                    </div>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="filter-select-modern"
                    >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="procesando">En Proceso</option>
                        <option value="despachado">Despachados</option>
                        <option value="entregado">Entregados</option>
                    </select>
                </div>

                <div className="pedidos-list-modern">
                    {pedidosFiltrados.map(pedido => (
                        <PedidoCard
                            key={pedido.id}
                            pedido={pedido}
                            onActualizarEstado={handleActualizarEstadoPedido}
                            onRecargar={() => cargarPedidosVendedor(vendedor.id)}
                        />
                    ))}
                </div>

                {pedidosFiltrados.length === 0 && (
                    <div className="empty-state-modern">
                        <div className="empty-icon-modern">🛒</div>
                        <h3 className="empty-title-modern">No hay pedidos</h3>
                        <p className="empty-text-modern">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
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
            <div className="notificaciones-tab-modern">
                <h1 className="tab-title-modern">Notificaciones ({notificacionesNoLeidas.length})</h1>

                <div className="notificaciones-list-modern">
                    {notificacionesLocales.map(notif => (
                        <div
                            key={notif.id}
                            className={`notificacion-modern ${notif.tipo} ${notif.leida ? 'leida' : ''}`}
                            onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                        >
                            <div className="notificacion-icono-modern">
                                {notif.tipo === 'warning' ? '⚠️' : 'ℹ️'}
                            </div>
                            <div className="notificacion-contenido-modern">
                                <div className="notificacion-titulo-modern">{notif.titulo}</div>
                                <div className="notificacion-mensaje-modern">{notif.mensaje}</div>
                                <div className="notificacion-fecha-modern">
                                    {new Date(notif.fecha).toLocaleDateString('es-CL')}
                                </div>
                            </div>
                            {!notif.leida && <div className="notificacion-punto-modern"></div>}
                        </div>
                    ))}
                </div>

                {notificacionesLocales.length === 0 && (
                    <div className="empty-state-modern">
                        <div className="empty-icon-modern">🔔</div>
                        <h3 className="empty-title-modern">No hay notificaciones</h3>
                        <p className="empty-text-modern">Te avisaremos cuando tengas novedades importantes</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="vendedor-panel-modern">
            {/* Navigation Bar estilo iOS */}
            <nav className="navbar-modern">
                <div className="navbar-container-modern">
                    <div className="navbar-content-modern">
                        <div className="navbar-left-modern">
                            <div className="logo-modern">
                                <div className="logo-icon-modern">🌾</div>
                                <span className="logo-text-modern">Panel Vendedor</span>
                            </div>

                            <div className="tabs-modern">
                                {[
                                    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                                    { id: 'productos', icon: '📦', label: 'Productos' },
                                    { id: 'pedidos', icon: '🛒', label: 'Pedidos' },
                                    { id: 'notificaciones', icon: '🔔', label: 'Alertas' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`tab-btn-modern ${activeTab === tab.id ? 'tab-active-modern' : ''}`}
                                    >
                                        <span className="tab-icon-modern">{tab.icon}</span>
                                        <span className="tab-label-modern">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="navbar-right-modern">
                            <button className="notification-btn-modern">
                                <span>🔔</span>
                                {notificaciones.filter(n => !n.leida).length > 0 && (
                                    <span className="notification-badge-modern"></span>
                                )}
                            </button>
                            <VendedorProfileMenu user={vendedor} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido Principal */}
            <main className="main-content-modern">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'productos' && <ProductosTab />}
                {activeTab === 'pedidos' && <PedidosTab />}
                {activeTab === 'notificaciones' && <NotificacionesTab />}
            </main>

            {/* Toasts */}
            <div className="toast-container-modern">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default VendedorPanel;
