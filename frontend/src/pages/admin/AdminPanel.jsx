import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/auth';
import './adminStyles.css';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';
import PedidoDetalleModal from './PedidoDetalleModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import EditarProductoModal from './EditarProductoModal';
import CategoriasTab from './CategoriasTab';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [vendedoresPendientes, setVendedoresPendientes] = useState([]);
    const [productosPendientes, setProductosPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // ✅ NUEVOS ESTADOS PARA MODALES
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [productoEditar, setProductoEditar] = useState(null);

    // ✅ HOOK DE TOASTS
    const { toasts, showToast, removeToast } = useToast();

    const navigate = useNavigate();

    // Verificar autenticación y permisos de admin
    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser || currentUser.tipo_usuario !== 'admin') {
                navigate('/login');
                return;
            }
            setUser(currentUser);
            cargarDatosIniciales();
        };
        checkAuth();
    }, [navigate]);

    const cargarDatosIniciales = async () => {
        try {
            await Promise.all([
                cargarEstadisticas(),
                cargarCategorias(),
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            setLoading(false);
        }
    };

    // ===== FUNCIONES DE CARGA DE DATOS =====

    const cargarEstadisticas = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/dashboard/');
            setEstadisticas(response.data);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    };

    const cargarVendedoresPendientes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/usuarios/?estado=pendiente&tipo_usuario=vendedor');
            setVendedoresPendientes(response.data);
        } catch (error) {
            console.error('Error cargando vendedores pendientes:', error);
        }
    };

    const cargarProductosPendientes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/productos/?aprobado=false');
            setProductosPendientes(response.data);
        } catch (error) {
            console.error('Error cargando productos pendientes:', error);
        }
    };

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/usuarios/');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    };

    const cargarProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/productos/');
            setProductos(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const cargarPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/pedidos/');
            setPedidos(response.data);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categorias/');
            setCategorias(response.data);
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    };

    // ===== FUNCIONES DE EDICIÓN (NUEVAS) =====

    // ✅ EDITAR USUARIO
    const editarUsuario = async (usuarioId, datosActualizados) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/usuarios/${usuarioId}/`,
                datosActualizados
            );

            await cargarUsuarios();
            await cargarEstadisticas();

            showToast('✅ Usuario actualizado exitosamente', 'success');
            setUsuarioEditar(null);

        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            showToast('❌ Error al actualizar el usuario', 'error');
        }
    };

    // ✅ EDITAR PRODUCTO
    const editarProducto = async (productoId, datosActualizados) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/productos/${productoId}/`,
                datosActualizados
            );

            await cargarProductos();
            await cargarEstadisticas();

            showToast('✅ Producto actualizado exitosamente', 'success');
            setProductoEditar(null);

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            showToast('❌ Error al actualizar el producto', 'error');
        }
    };

    // ✅ CREAR CATEGORÍA
    const crearCategoria = async (datosCategoria) => {
        try {
            await axios.post('http://localhost:8000/api/categorias/', datosCategoria);

            await cargarCategorias();

            showToast('✅ Categoría creada exitosamente', 'success');

        } catch (error) {
            console.error('Error al crear categoría:', error);
            showToast('❌ Error al crear la categoría', 'error');
            throw error;
        }
    };

    // ✅ EDITAR CATEGORÍA
    const editarCategoria = async (categoriaId, datosActualizados) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/categorias/${categoriaId}/`,
                datosActualizados
            );

            await cargarCategorias();

            showToast('✅ Categoría actualizada exitosamente', 'success');

        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            showToast('❌ Error al actualizar la categoría', 'error');
            throw error;
        }
    };

    // ✅ ELIMINAR CATEGORÍA
    const eliminarCategoria = async (categoriaId, nombreCategoria) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que quieres eliminar la categoría "${nombreCategoria}"?\n\n` +
            `ADVERTENCIA: Esta acción no se puede deshacer y puede afectar a los productos asociados.`
        );

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/api/categorias/${categoriaId}/`);

                await cargarCategorias();

                showToast(`✅ Categoría "${nombreCategoria}" eliminada`, 'success');

            } catch (error) {
                console.error('Error eliminando categoría:', error);
                showToast('❌ Error al eliminar la categoría', 'error');
            }
        }
    };

    // ===== FUNCIONES EXISTENTES (MANTENER) =====

    const aprobarVendedor = async (usuarioId) => {
        try {
            await axios.patch(`http://localhost:8000/api/usuarios/${usuarioId}/`, {
                estado: 'activo'
            });

            await cargarVendedoresPendientes();
            await cargarUsuarios();
            await cargarEstadisticas();

            showToast('✅ Vendedor aprobado exitosamente', 'success');
        } catch (error) {
            console.error('Error aprobando vendedor:', error);
            showToast('❌ Error al aprobar vendedor', 'error');
        }
    };

    const rechazarVendedor = async (usuarioId) => {
        if (window.confirm('¿Estás seguro de que quieres rechazar este vendedor?')) {
            try {
                await axios.patch(`http://localhost:8000/api/usuarios/${usuarioId}/`, {
                    estado: 'rechazado'
                });

                await cargarVendedoresPendientes();
                await cargarUsuarios();
                await cargarEstadisticas();

                showToast('✅ Vendedor rechazado', 'warning');
            } catch (error) {
                console.error('Error rechazando vendedor:', error);
                showToast('❌ Error al rechazar vendedor', 'error');
            }
        }
    };

    const aprobarProducto = async (productoId) => {
        try {
            await axios.patch(`http://localhost:8000/api/productos/${productoId}/`, {
                aprobado: true,
                activo: true
            });

            await cargarProductos();
            await cargarProductosPendientes();
            await cargarEstadisticas();

            showToast('✅ Producto aprobado exitosamente', 'success');
        } catch (error) {
            console.error('Error aprobando producto:', error);
            showToast('❌ Error al aprobar producto', 'error');
        }
    };

    const rechazarProducto = async (productoId) => {
        if (window.confirm('¿Estás seguro de que quieres rechazar este producto?')) {
            try {
                await axios.patch(`http://localhost:8000/api/productos/${productoId}/`, {
                    aprobado: false,
                    activo: false
                });

                await cargarProductos();
                await cargarProductosPendientes();
                await cargarEstadisticas();

                showToast('✅ Producto rechazado', 'warning');
            } catch (error) {
                console.error('Error rechazando producto:', error);
                showToast('❌ Error al rechazar producto', 'error');
            }
        }
    };

    const eliminarUsuario = async (usuarioId, username) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que quieres eliminar al usuario "${username}"?\n\n` +
            `Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.`
        );

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/api/usuarios/${usuarioId}/`);

                await cargarUsuarios();
                await cargarEstadisticas();

                showToast(`✅ Usuario "${username}" eliminado`, 'success');
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                showToast('❌ Error al eliminar el usuario', 'error');
            }
        }
    };

    const eliminarProducto = async (productoId, nombre) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que quieres eliminar el producto "${nombre}"?\n\n` +
            `Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.`
        );

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/api/productos/${productoId}/`);

                await cargarProductos();
                await cargarEstadisticas();

                showToast(`✅ Producto "${nombre}" eliminado`, 'success');
            } catch (error) {
                console.error('Error eliminando producto:', error);
                showToast('❌ Error al eliminar el producto', 'error');
            }
        }
    };

    const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            await axios.patch(`http://localhost:8000/api/pedidos/${pedidoId}/`, {
                estado: nuevoEstado
            });

            await cargarPedidos();

            showToast(`✅ Estado del pedido actualizado a: ${nuevoEstado}`, 'success');
        } catch (error) {
            console.error('Error actualizando pedido:', error);
            showToast('❌ Error al actualizar el pedido', 'error');
        }
    };

    // Cargar datos según la pestaña activa
    useEffect(() => {
        const cargarDatosTab = async () => {
            setLoading(true);
            try {
                switch (activeTab) {
                    case 'dashboard':
                        await cargarEstadisticas();
                        break;
                    case 'usuarios':
                        await cargarUsuarios();
                        break;
                    case 'vendedores':
                        await cargarVendedoresPendientes();
                        break;
                    case 'productos-pendientes':
                        await cargarProductosPendientes();
                        break;
                    case 'productos':
                        await cargarProductos();
                        break;
                    case 'pedidos':
                        await cargarPedidos();
                        break;
                    case 'categorias':
                        await cargarCategorias();
                        break;
                    case 'configuracion':
                        break;
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            cargarDatosTab();
        }
    }, [activeTab, user]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Verificando permisos...</p>
            </div>
        );
    }

    return (
        <div className="admin-page-container">
            {/* ✅ CONTENEDOR DE TOASTS */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header del Admin */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo" onClick={() => navigate('/')}>
                        <div className="admin-logo-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <span className="admin-logo-text">Agroplace Admin</span>
                    </div>

                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {user.first_name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                        </div>
                        <div className="admin-user-details">
                            <div className="admin-user-name">{authService.getFullName()}</div>
                            <div className="admin-user-role">Administrador</div>
                        </div>
                        <button onClick={handleLogout} className="admin-logout-button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-main-container">
                {/* Sidebar de Navegación */}
                <nav className="admin-sidebar">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                        { id: 'usuarios', label: 'Gestión de Usuarios', icon: '👥' },
                        { id: 'vendedores', label: 'Vendedores Pendientes', icon: '⏳', badge: vendedoresPendientes.length },
                        { id: 'productos-pendientes', label: 'Productos Pendientes', icon: '📦', badge: productosPendientes.length },
                        { id: 'productos', label: 'Todos los Productos', icon: '🏷️' },
                        { id: 'pedidos', label: 'Gestión de Pedidos', icon: '🛒' },
                        { id: 'categorias', label: 'Categorías', icon: '📂' },
                        { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? "admin-sidebar-item-active" : "admin-sidebar-item"}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="admin-sidebar-icon">{tab.icon}</span>
                            <span className="admin-sidebar-label">{tab.label}</span>
                            {tab.badge > 0 && (
                                <span className="admin-sidebar-badge">{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Contenido Principal */}
                <main className="admin-content">
                    {activeTab === 'dashboard' && (
                        <DashboardTab
                            estadisticas={estadisticas}
                            usuarios={usuarios}
                            productos={productos}
                            pedidos={pedidos}
                            formatPrice={formatPrice}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'usuarios' && (
                        <UsuariosTab
                            usuarios={usuarios}
                            loading={loading}
                            onReload={cargarUsuarios}
                            onEliminarUsuario={eliminarUsuario}
                            onEditarUsuario={setUsuarioEditar}
                        />
                    )}
                    {activeTab === 'vendedores' && (
                        <VendedoresPendientesTab
                            vendedoresPendientes={vendedoresPendientes}
                            loading={loading}
                            onAprobarVendedor={aprobarVendedor}
                            onRechazarVendedor={rechazarVendedor}
                            onReload={cargarVendedoresPendientes}
                        />
                    )}
                    {activeTab === 'productos-pendientes' && (
                        <ProductosPendientesTab
                            productosPendientes={productosPendientes}
                            loading={loading}
                            onAprobarProducto={aprobarProducto}
                            onRechazarProducto={rechazarProducto}
                            onReload={cargarProductosPendientes}
                            formatPrice={formatPrice}
                        />
                    )}
                    {activeTab === 'productos' && (
                        <ProductosTab
                            productos={productos}
                            loading={loading}
                            onReload={cargarProductos}
                            onEliminarProducto={eliminarProducto}
                            onEditarProducto={setProductoEditar}
                            formatPrice={formatPrice}
                        />
                    )}
                    {activeTab === 'pedidos' && (
                        <PedidosTab
                            pedidos={pedidos}
                            loading={loading}
                            onReload={cargarPedidos}
                            onActualizarEstado={actualizarEstadoPedido}
                            onVerDetalle={setPedidoDetalle}
                            formatPrice={formatPrice}
                        />
                    )}
                    {activeTab === 'categorias' && (
                        <CategoriasTab
                            categorias={categorias}
                            loading={loading}
                            onReload={cargarCategorias}
                            onCrear={crearCategoria}
                            onEditar={editarCategoria}
                            onEliminar={eliminarCategoria}
                        />
                    )}
                    {activeTab === 'configuracion' && (
                        <ConfiguracionTab />
                    )}
                </main>
            </div>

            {/* ✅ MODALES */}
            {pedidoDetalle && (
                <PedidoDetalleModal
                    pedido={pedidoDetalle}
                    onClose={() => setPedidoDetalle(null)}
                    formatPrice={formatPrice}
                />
            )}

            {usuarioEditar && (
                <EditarUsuarioModal
                    usuario={usuarioEditar}
                    onClose={() => setUsuarioEditar(null)}
                    onSave={editarUsuario}
                />
            )}

            {productoEditar && (
                <EditarProductoModal
                    producto={productoEditar}
                    categorias={categorias}
                    onClose={() => setProductoEditar(null)}
                    onSave={editarProducto}
                    formatPrice={formatPrice}
                />
            )}
        </div>
    );
};

// ===== COMPONENTES TAB ACTUALIZADOS =====

// COMPONENTE UsuariosTab - CON BOTÓN DE EDITAR
const UsuariosTab = ({ usuarios, loading, onReload, onEliminarUsuario, onEditarUsuario }) => {
    const [filtro, setFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('todos');

    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    // Filtrar usuarios
    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideBusqueda = usuario.username.toLowerCase().includes(filtro.toLowerCase()) ||
            usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
            (usuario.first_name && usuario.first_name.toLowerCase().includes(filtro.toLowerCase())) ||
            (usuario.last_name && usuario.last_name.toLowerCase().includes(filtro.toLowerCase()));

        const coincideTipo = tipoFiltro === 'todos' || usuario.tipo_usuario === tipoFiltro;

        return coincideBusqueda && coincideTipo;
    });

    const getBadgeStyle = (tipo) => {
        const colors = {
            admin: {
                background: 'linear-gradient(135deg, #d32f2f, #f44336)',
                color: 'white',
                icon: '👑'
            },
            vendedor: {
                background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                color: 'white',
                icon: '👨‍🌾'
            },
            cliente: {
                background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                color: 'white',
                icon: '👤'
            }
        };
        return colors[tipo] || { background: '#6b7280', color: 'white', icon: '❓' };
    };

    const getEstadoStyle = (estado) => {
        const colors = {
            activo: { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', icon: '✅' },
            pendiente: { backgroundColor: 'rgba(255, 152, 0, 0.15)', color: '#ff9800', icon: '⏳' },
            rechazado: { backgroundColor: 'rgba(244, 67, 54, 0.15)', color: '#f44336', icon: '❌' },
            inactivo: { backgroundColor: 'rgba(158, 158, 158, 0.15)', color: '#9e9e9e', icon: '💤' }
        };
        return colors[estado] || { backgroundColor: '#6b7280', color: 'white', icon: '❓' };
    };

    const getAvatarColor = (nombre) => {
        const colors = [
            'linear-gradient(135deg, #2d7a3e, #47a855)',
            'linear-gradient(135deg, #1976d2, #2196f3)',
            'linear-gradient(135deg, #ed6c02, #ff9800)',
            'linear-gradient(135deg, #9c27b0, #e91e63)',
            'linear-gradient(135deg, #2e7d32, #4caf50)',
            'linear-gradient(135deg, #1565c0, #1976d2)'
        ];
        const index = nombre.length % colors.length;
        return colors[index];
    };

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Gestión de Usuarios</h1>
                        <p className="admin-tab-subtitle">Administra todos los usuarios de la plataforma Agroplace</p>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={onReload} className="admin-reload-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Actualizar Lista
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="admin-filtros-container">
                <div className="admin-search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-search-icon">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre, email o username..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-filtro-group">
                    <label className="admin-filtro-label">Filtrar por tipo:</label>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="admin-filtro-select"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="admin">Administradores</option>
                        <option value="vendedor">Vendedores</option>
                        <option value="cliente">Clientes</option>
                    </select>
                </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="admin-stats-row">
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{usuariosFiltrados.length}</div>
                    <div className="admin-mini-stat-label">Usuarios Encontrados</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{usuarios.filter(u => u.tipo_usuario === 'admin').length}</div>
                    <div className="admin-mini-stat-label">Administradores</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{usuarios.filter(u => u.tipo_usuario === 'vendedor').length}</div>
                    <div className="admin-mini-stat-label">Vendedores</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{usuarios.filter(u => u.tipo_usuario === 'cliente').length}</div>
                    <div className="admin-mini-stat-label">Clientes</div>
                </div>
            </div>

            {/* Tabla Moderna de Usuarios */}
            <div className="admin-table-modern-container">
                <table className="admin-table-modern">
                    <thead className="admin-table-header-modern">
                        <tr className="admin-table-header-row">
                            <th style={{ width: '15%' }}>Usuario</th>
                            <th style={{ width: '15%' }}>Contacto</th>
                            <th style={{ width: '15%' }}>Tipo</th>
                            <th style={{ width: '15%' }}>Estado</th>
                            <th style={{ width: '15%' }}>Registro</th>
                            <th style={{ width: '15%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="admin-table-body">
                        {usuariosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="admin-empty-table">
                                    <div className="admin-empty-icon">👥</div>
                                    <h3 className="admin-empty-title">No se encontraron usuarios</h3>
                                    <p className="admin-empty-text">Intenta ajustar los filtros de búsqueda</p>
                                </td>
                            </tr>
                        ) : (
                            usuariosFiltrados.map(usuario => {
                                const badgeStyle = getBadgeStyle(usuario.tipo_usuario);
                                const estadoStyle = getEstadoStyle(usuario.estado || 'activo');
                                const avatarColor = getAvatarColor(usuario.username);

                                return (
                                    <tr key={usuario.id} className="admin-table-row-modern">
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-usuario-info-modern">
                                                <div className="admin-avatar-modern" style={{ background: avatarColor }}>
                                                    {usuario.first_name?.[0]?.toUpperCase() || usuario.username[0].toUpperCase()}
                                                </div>
                                                <div className="admin-usuario-details">
                                                    <div className="admin-usuario-nombre-modern">
                                                        {usuario.first_name && usuario.last_name
                                                            ? `${usuario.first_name} ${usuario.last_name}`
                                                            : usuario.username
                                                        }
                                                    </div>
                                                    <div className="admin-usuario-username-modern">@{usuario.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-contact-info">
                                                <div className="admin-contact-email">{usuario.email}</div>
                                                {usuario.telefono && (
                                                    <div className="admin-contact-phone">📞 {usuario.telefono}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-badge-modern" style={{ background: badgeStyle.background, color: badgeStyle.color }}>
                                                <span className="admin-badge-icon">{badgeStyle.icon}</span>
                                                {usuario.tipo_usuario}
                                            </div>
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-estado-badge" style={{ backgroundColor: estadoStyle.backgroundColor, color: estadoStyle.color }}>
                                                <span className="admin-estado-icon">{estadoStyle.icon}</span>
                                                {usuario.estado || 'activo'}
                                            </div>
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-registro-info">
                                                <div className="admin-registro-fecha">
                                                    {new Date(usuario.fecha_registro).toLocaleDateString('es-CL')}
                                                </div>
                                                <div className="admin-registro-hora">
                                                    {new Date(usuario.fecha_registro).toLocaleTimeString('es-CL', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            <div className="admin-acciones-modern">
                                                <button
                                                    onClick={() => onEditarUsuario(usuario)}
                                                    className="admin-action-button-edit"
                                                    title="Editar usuario"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => onEliminarUsuario(usuario.id, usuario.username)}
                                                    className="admin-action-button-delete"
                                                    title="Eliminar usuario"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer de la tabla */}
            <div className="admin-table-footer">
                <div className="admin-table-info">
                    Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                </div>
            </div>
        </div>
    );
};

const ProductosTab = ({ productos, loading, onReload, onEliminarProducto, onEditarProducto, formatPrice }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    // Filtrar productos
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());

        const coincideCategoria = categoriaFiltro === 'todos' ||
            producto.categoria?.nombre === categoriaFiltro;

        return coincideBusqueda && coincideCategoria;
    });

    const categorias = [...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))];

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Todos los Productos</h1>
                        <p className="admin-tab-subtitle">Gestiona todos los productos de la plataforma</p>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={onReload} className="admin-reload-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="admin-filtros-container">
                <div className="admin-search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-search-icon">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre o descripción..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-filtro-group">
                    <label className="admin-filtro-label">Filtrar por categoría:</label>
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="admin-filtro-select"
                    >
                        <option value="todos">Todas las categorías</option>
                        {categorias.map(categoria => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="admin-stats-row">
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{productosFiltrados.length}</div>
                    <div className="admin-mini-stat-label">Productos Encontrados</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{productos.filter(p => p.activo).length}</div>
                    <div className="admin-mini-stat-label">Productos Activos</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{productos.filter(p => !p.activo).length}</div>
                    <div className="admin-mini-stat-label">Productos Inactivos</div>
                </div>
                <div className="admin-mini-stat">
                    <div className="admin-mini-stat-number">{categorias.length}</div>
                    <div className="admin-mini-stat-label">Categorías</div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Categoría</th>
                            <th className="admin-table-header">Precio</th>
                            <th className="admin-table-header">Stock</th>
                            <th className="admin-table-header">Vendedor</th>
                            <th className="admin-table-header">Estado</th>
                            <th className="admin-table-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map(producto => (
                            <tr key={producto.id} className="admin-table-row">
                                <td className="admin-table-cell">
                                    <div className="admin-producto-info">
                                        <div className="admin-producto-icon">
                                            {producto.categoria?.nombre === 'Frutas' ? '🍎' :
                                                producto.categoria?.nombre === 'Verduras' ? '🥕' : '🌱'}
                                        </div>
                                        <div>
                                            <span className="admin-producto-nombre">{producto.nombre}</span>
                                            {producto.descripcion && (
                                                <div className="admin-producto-descripcion">
                                                    {producto.descripcion.substring(0, 50)}
                                                    {producto.descripcion.length > 50 ? '...' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="admin-table-cell">{producto.categoria?.nombre || 'Sin categoría'}</td>
                                <td className="admin-table-cell">{formatPrice(producto.precio)}</td>
                                <td className="admin-table-cell">
                                    <span className={producto.stock > 0 ? "admin-stock-disponible" : "admin-stock-agotado"}>
                                        {producto.stock} unidades
                                    </span>
                                </td>
                                <td className="admin-table-cell">{producto.vendedor?.username || 'N/A'}</td>
                                <td className="admin-table-cell">
                                    <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                        {producto.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </td>
                                <td className="admin-table-cell">
                                    <div className="admin-acciones">
                                        <button
                                            onClick={() => onEditarProducto(producto)}
                                            className="admin-editar-button"
                                            title="Editar producto"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            className="admin-eliminar-button"
                                            onClick={() => onEliminarProducto(producto.id, producto.nombre)}
                                            title="Eliminar producto"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {productosFiltrados.length === 0 && (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">📦</div>
                    <h3 className="admin-empty-title">No se encontraron productos</h3>
                    <p className="admin-empty-text">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}
        </div>
    );
};

// COMPONENTE PedidosTab - CON BOTÓN VER DETALLES
const PedidosTab = ({ pedidos, loading, onReload, onActualizarEstado, onVerDetalle, formatPrice }) => {
    const [filtroEstado, setFiltroEstado] = useState('todos');

    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando pedidos...</p>
            </div>
        );
    }

    const pedidosFiltrados = filtroEstado === 'todos'
        ? pedidos
        : pedidos.filter(pedido => pedido.estado === filtroEstado);

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

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Gestión de Pedidos</h1>
                        <p className="admin-tab-subtitle">Administra y actualiza el estado de los pedidos</p>
                    </div>
                    <div className="admin-header-actions">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="admin-filtro-select"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="preparacion">En preparación</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <button onClick={onReload} className="admin-reload-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="admin-table-header">Pedido ID</th>
                            <th className="admin-table-header">Fecha</th>
                            <th className="admin-table-header">Cliente</th>
                            <th className="admin-table-header">Total</th>
                            <th className="admin-table-header">Estado</th>
                            <th className="admin-table-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.map(pedido => {
                            const estadoStyle = getEstadoStyle(pedido.estado);
                            return (
                                <tr key={pedido.id} className="admin-table-row">
                                    <td className="admin-table-cell">
                                        <span style={{ fontWeight: '600', color: '#2d7a3e' }}>#{pedido.id}</span>
                                    </td>
                                    <td className="admin-table-cell">
                                        {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="admin-table-cell">{pedido.cliente?.username || 'N/A'}</td>
                                    <td className="admin-table-cell">
                                        <span style={{ fontWeight: '600', color: '#2d7a3e' }}>
                                            {formatPrice(pedido.total)}
                                        </span>
                                    </td>
                                    <td className="admin-table-cell">
                                        <span className="admin-estado-badge" style={{ backgroundColor: estadoStyle.backgroundColor, color: estadoStyle.color }}>
                                            <span className="admin-estado-icon">{estadoStyle.icon}</span>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td className="admin-table-cell">
                                        <div className="admin-acciones">
                                            <button
                                                onClick={() => onVerDetalle(pedido)}
                                                className="admin-detalles-button"
                                                title="Ver detalles del pedido"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                Detalles
                                            </button>
                                            <select
                                                value={pedido.estado}
                                                onChange={(e) => onActualizarEstado(pedido.id, e.target.value)}
                                                className="admin-estado-select"
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="confirmado">Confirmado</option>
                                                <option value="preparacion">En preparación</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="entregado">Entregado</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {pedidosFiltrados.length === 0 && (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">🛒</div>
                    <h3 className="admin-empty-title">No se encontraron pedidos</h3>
                    <p className="admin-empty-text">Intenta ajustar los filtros de estado</p>
                </div>
            )}
        </div>
    );
};

// COMPONENTE DashboardTab - Con datos reales
const DashboardTab = ({ estadisticas, usuarios, productos, pedidos, formatPrice, loading }) => {
    const [actividadReciente, setActividadReciente] = useState([]);

    // Calcular actividad reciente basada en datos reales
    useEffect(() => {
        const calcularActividadReciente = () => {
            const actividad = [];

            // Pedidos recientes
            const pedidosRecientes = pedidos
                .sort((a, b) => new Date(b.fecha_pedido || b.fecha_creacion) - new Date(a.fecha_pedido || a.fecha_creacion))
                .slice(0, 3);

            pedidosRecientes.forEach(pedido => {
                actividad.push({
                    action: `Nuevo pedido #${pedido.id}`,
                    user: pedido.cliente?.username || 'Cliente',
                    time: `Hace ${calcularTiempoTranscurrido(pedido.fecha_pedido || pedido.fecha_creacion)}`,
                    icon: '🛒'
                });
            });

            // Usuarios registrados recientemente
            const usuariosRecientes = usuarios
                .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
                .slice(0, 2);

            usuariosRecientes.forEach(usuario => {
                actividad.push({
                    action: `Nuevo usuario registrado`,
                    user: `${usuario.first_name || usuario.username}`,
                    time: `Hace ${calcularTiempoTranscurrido(usuario.fecha_registro)}`,
                    icon: '👤'
                });
            });

            setActividadReciente(actividad.slice(0, 5));
        };

        calcularActividadReciente();
    }, [usuarios, pedidos]);

    const calcularTiempoTranscurrido = (fecha) => {
        if (!fecha) return 'algún tiempo';
        const ahora = new Date();
        const fechaObj = new Date(fecha);
        const diffMs = ahora - fechaObj;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min`;
        if (diffHours < 24) return `${diffHours} h`;
        return `${diffDays} días`;
    };

    // Calcular métricas reales
    const calcularMetricasReales = () => {
        const totalUsuarios = usuarios.length;
        const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
        const pedidosCompletados = pedidos.filter(p => p.estado === 'entregado').length;

        const tasaActividad = totalUsuarios > 0 ? Math.min(100, (usuariosActivos / totalUsuarios) * 100).toFixed(1) : 0;
        const tasaExitoPedidos = pedidos.length > 0 ? Math.min(100, (pedidosCompletados / pedidos.length) * 100).toFixed(1) : 0;

        return {
            tasaActividad: `${tasaActividad}%`,
            exitoPedidos: `${tasaExitoPedidos}%`,
            productosActivos: `${Math.round((productos.filter(p => p.activo).length / productos.length) * 100) || 0}%`
        };
    };

    const metricas = calcularMetricasReales();
    const statsCards = [
        {
            title: 'Usuarios Totales',
            value: estadisticas.usuarios_totales || usuarios.length || 0,
            icon: '👥',
            color: '#2d7a3e',
            descripcion: 'Usuarios registrados en la plataforma'
        },
        {
            title: 'Productos Activos',
            value: productos.filter(p => p.activo).length || 0,
            icon: '📦',
            color: '#1976d2',
            descripcion: 'Productos disponibles para venta'
        },
        {
            title: 'Vendedores Activos',
            value: estadisticas.vendedores_activos || usuarios.filter(u => u.tipo_usuario === 'vendedor' && u.estado === 'activo').length || 0,
            icon: '👨‍🌾',
            color: '#ed6c02',
            descripcion: 'Vendedores verificados'
        },
        {
            title: 'Ingresos Totales',
            value: formatPrice(estadisticas.ingresos_totales || 0),
            icon: '💰',
            color: '#2e7d32',
            descripcion: 'Ingresos generados'
        },
        {
            title: 'Pedidos Totales',
            value: estadisticas.pedidos_totales || pedidos.length || 0,
            icon: '🛒',
            color: '#7b1fa2',
            descripcion: 'Pedidos realizados'
        },
        {
            title: 'Pendientes de Revisión',
            value: (estadisticas.vendedores_pendientes || 0) + (estadisticas.productos_pendientes || 0),
            icon: '⏳',
            color: '#ff9800',
            descripcion: 'Solicitudes pendientes'
        }
    ];

    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-tab-header">
                <h1 className="admin-tab-title">Dashboard General</h1>
                <p className="admin-tab-subtitle">Resumen completo de la plataforma Agroplace - Datos en tiempo real</p>
            </div>

            {/* Grid de Estadísticas */}
            <div className="admin-stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={index} className="admin-stat-card">
                        <div className="admin-stat-icon-container">
                            <span className="admin-stat-icon">{stat.icon}</span>
                        </div>
                        <div className="admin-stat-content">
                            <div className="admin-stat-value">{stat.value}</div>
                            <div className="admin-stat-label">{stat.title}</div>
                            <div className="admin-stat-description">{stat.descripcion}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secciones Adicionales */}
            <div className="admin-dashboard-sections">
                <div className="admin-section-card">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Actividad Reciente</h3>
                        <span className="admin-badge">{actividadReciente.length} actividades</span>
                    </div>
                    <div className="admin-activity-list">
                        {actividadReciente.length > 0 ? (
                            actividadReciente.map((activity, index) => (
                                <div key={index} className="admin-activity-item">
                                    <div className="admin-activity-icon">{activity.icon}</div>
                                    <div className="admin-activity-content">
                                        <div className="admin-activity-text">{activity.action}</div>
                                        <div className="admin-activity-meta">
                                            <span className="admin-activity-user">{activity.user}</span>
                                            <span>•</span>
                                            <span className="admin-activity-time">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="admin-empty-activity">
                                <div className="admin-empty-icon">📊</div>
                                <p className="admin-empty-text">No hay actividad reciente</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-section-card">
                    <h3 className="admin-section-title">Métricas de Rendimiento</h3>
                    <div className="admin-metrics-grid">
                        {[
                            { label: 'Tasa de Actividad', value: metricas.tasaActividad, trend: 'up' },
                            { label: 'Éxito en Pedidos', value: metricas.exitoPedidos, trend: 'up' },
                            { label: 'Productos Activos', value: metricas.productosActivos, trend: 'stable' }
                        ].map((metric, index) => (
                            <div key={index} className="admin-metric-item">
                                <div className="admin-metric-value">{metric.value}</div>
                                <div className="admin-metric-label">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// COMPONENTE VendedoresPendientesTab
const VendedoresPendientesTab = ({ vendedoresPendientes, loading, onAprobarVendedor, onRechazarVendedor, onReload }) => {
    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando vendedores pendientes...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Vendedores Pendientes</h1>
                        <p className="admin-tab-subtitle">Gestiona las solicitudes de nuevos vendedores</p>
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-contador-badge">
                            {vendedoresPendientes.length} pendientes
                        </div>
                        <button onClick={onReload} className="admin-reload-button">
                            🔄 Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {vendedoresPendientes.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">✅</div>
                    <h3 className="admin-empty-title">No hay vendedores pendientes</h3>
                    <p className="admin-empty-text">Todas las solicitudes han sido procesadas.</p>
                </div>
            ) : (
                <div className="admin-vendedores-grid">
                    {vendedoresPendientes.map(vendedor => (
                        <div key={vendedor.id} className="admin-vendedor-card">
                            <div className="admin-vendedor-header">
                                <div className="admin-vendedor-avatar">
                                    {vendedor.first_name?.[0]?.toUpperCase() || vendedor.username[0].toUpperCase()}
                                </div>
                                <div className="admin-vendedor-info">
                                    <h3 className="admin-vendedor-nombre">
                                        {vendedor.first_name && vendedor.last_name
                                            ? `${vendedor.first_name} ${vendedor.last_name}`
                                            : vendedor.username
                                        }
                                    </h3>
                                    <p className="admin-vendedor-email">{vendedor.email}</p>
                                    <p className="admin-vendedor-telefono">{vendedor.telefono || 'No especificado'}</p>
                                </div>
                            </div>

                            <div className="admin-vendedor-detalles">
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Usuario:</span>
                                    <span className="admin-detalle-valor">{vendedor.username}</span>
                                </div>
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Registro:</span>
                                    <span className="admin-detalle-valor">
                                        {new Date(vendedor.fecha_registro).toLocaleDateString('es-CL')}
                                    </span>
                                </div>
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Estado:</span>
                                    <span className="admin-estado-pendiente">⏳ Pendiente de revisión</span>
                                </div>
                            </div>

                            <div className="admin-vendedor-actions">
                                <button
                                    onClick={() => onAprobarVendedor(vendedor.id)}
                                    className="admin-aprobar-button"
                                >
                                    ✅ Aprobar Vendedor
                                </button>
                                <button
                                    onClick={() => onRechazarVendedor(vendedor.id)}
                                    className="admin-rechazar-button"
                                >
                                    ❌ Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// COMPONENTE ProductosPendientesTab
const ProductosPendientesTab = ({ productosPendientes, loading, onAprobarProducto, onRechazarProducto, onReload, formatPrice }) => {
    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando productos pendientes...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Productos Pendientes de Aprobación</h1>
                        <p className="admin-tab-subtitle">Revisa y aprueba los productos subidos por vendedores</p>
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-contador-badge">
                            {productosPendientes.length} pendientes
                        </div>
                        <button onClick={onReload} className="admin-reload-button">
                            🔄 Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {productosPendientes.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">✅</div>
                    <h3 className="admin-empty-title">No hay productos pendientes</h3>
                    <p className="admin-empty-text">Todos los productos han sido revisados y aprobados.</p>
                </div>
            ) : (
                <div className="admin-productos-grid">
                    {productosPendientes.map(producto => (
                        <div key={producto.id} className="admin-producto-card">
                            <div className="admin-producto-header">
                                <div className="admin-producto-icon">
                                    {producto.categoria?.nombre === 'Frutas' ? '🍎' :
                                        producto.categoria?.nombre === 'Verduras' ? '🥕' : '🌱'}
                                </div>
                                <div className="admin-producto-info">
                                    <h3 className="admin-producto-nombre">{producto.nombre}</h3>
                                    <p className="admin-producto-categoria">{producto.categoria?.nombre}</p>
                                    <p className="admin-producto-precio">{formatPrice(producto.precio)}</p>
                                </div>
                            </div>

                            <div className="admin-producto-detalles">
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Stock:</span>
                                    <span className="admin-detalle-valor">{producto.stock} unidades</span>
                                </div>
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Vendedor:</span>
                                    <span className="admin-detalle-valor">{producto.vendedor?.username}</span>
                                </div>
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Descripción:</span>
                                    <span className="admin-detalle-valor">{producto.descripcion || 'Sin descripción'}</span>
                                </div>
                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Estado:</span>
                                    <span className="admin-estado-pendiente">⏳ Pendiente de revisión</span>
                                </div>
                            </div>

                            <div className="admin-producto-actions">
                                <button
                                    onClick={() => onAprobarProducto(producto.id)}
                                    className="admin-aprobar-button"
                                >
                                    ✅ Aprobar Producto
                                </button>
                                <button
                                    onClick={() => onRechazarProducto(producto.id)}
                                    className="admin-rechazar-button"
                                >
                                    ❌ Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// COMPONENTE ConfiguracionTab
const ConfiguracionTab = () => {
    const [configuracion, setConfiguracion] = useState({
        nombreSitio: 'Agroplace',
        emailContacto: 'contacto@agroplace.com',
        telefonoContacto: '+56 2 2345 6789',
        moneda: 'CLP',
        iva: 19,
        productosAutoAprobacion: false,
        notificacionesEmail: true,
        limiteProductosVendedor: 50
    });

    const [guardando, setGuardando] = useState(false);

    const handleGuardarConfiguracion = async () => {
        setGuardando(true);
        try {
            // Simular guardado en API
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('✅ Configuración guardada exitosamente');
        } catch (error) {
            alert('❌ Error al guardar la configuración');
        } finally {
            setGuardando(false);
        }
    };

    const handleRestablecer = () => {
        if (window.confirm('¿Estás seguro de que quieres restablecer la configuración a los valores por defecto?')) {
            setConfiguracion({
                nombreSitio: 'Agroplace',
                emailContacto: 'contacto@agroplace.com',
                telefonoContacto: '+56 2 2345 6789',
                moneda: 'CLP',
                iva: 19,
                productosAutoAprobacion: false,
                notificacionesEmail: true,
                limiteProductosVendedor: 50
            });
        }
    };

    return (
        <div>
            <div className="admin-tab-header">
                <h1 className="admin-tab-title">Configuración del Sistema</h1>
                <p className="admin-tab-subtitle">Configura los parámetros generales de la plataforma</p>
            </div>

            <div className="admin-configuracion-card">
                <h3 className="admin-configuracion-title">Configuración General</h3>

                <div className="admin-configuracion-form">
                    <div className="admin-form-group">
                        <label className="admin-label">Nombre del Sitio</label>
                        <input
                            type="text"
                            value={configuracion.nombreSitio}
                            onChange={(e) => setConfiguracion(prev => ({ ...prev, nombreSitio: e.target.value }))}
                            className="admin-input"
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-label">Email de Contacto</label>
                            <input
                                type="email"
                                value={configuracion.emailContacto}
                                onChange={(e) => setConfiguracion(prev => ({ ...prev, emailContacto: e.target.value }))}
                                className="admin-input"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Teléfono de Contacto</label>
                            <input
                                type="tel"
                                value={configuracion.telefonoContacto}
                                onChange={(e) => setConfiguracion(prev => ({ ...prev, telefonoContacto: e.target.value }))}
                                className="admin-input"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-label">Moneda Principal</label>
                            <select
                                className="admin-select"
                                value={configuracion.moneda}
                                onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value }))}
                            >
                                <option value="CLP">CLP - Peso Chileno</option>
                                <option value="USD">USD - Dólar Americano</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">IVA (%)</label>
                            <input
                                type="number"
                                value={configuracion.iva}
                                onChange={(e) => setConfiguracion(prev => ({ ...prev, iva: parseInt(e.target.value) || 0 }))}
                                className="admin-input"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="admin-configuracion-section">
                        <h4 className="admin-section-title">Configuración de Productos</h4>
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={configuracion.productosAutoAprobacion}
                                        onChange={(e) => setConfiguracion(prev => ({ ...prev, productosAutoAprobacion: e.target.checked }))}
                                        className="admin-checkbox"
                                    />
                                    Aprobación automática de productos
                                </label>
                                <div className="admin-help-text">
                                    Los productos nuevos se aprobarán automáticamente sin revisión manual
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Límite de productos por vendedor</label>
                                <input
                                    type="number"
                                    value={configuracion.limiteProductosVendedor}
                                    onChange={(e) => setConfiguracion(prev => ({ ...prev, limiteProductosVendedor: parseInt(e.target.value) || 0 }))}
                                    className="admin-input"
                                    min="1"
                                    max="1000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="admin-configuracion-section">
                        <h4 className="admin-section-title">Configuración de Notificaciones</h4>
                        <div className="admin-form-group">
                            <label className="admin-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={configuracion.notificacionesEmail}
                                    onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesEmail: e.target.checked }))}
                                    className="admin-checkbox"
                                />
                                Enviar notificaciones por email
                            </label>
                            <div className="admin-help-text">
                                Recibir notificaciones por email sobre actividades importantes
                            </div>
                        </div>
                    </div>

                    <div className="admin-configuracion-actions">
                        <button
                            onClick={handleGuardarConfiguracion}
                            className="admin-guardar-button"
                            disabled={guardando}
                        >
                            {guardando ? '💾 Guardando...' : '💾 Guardar Configuración'}
                        </button>
                        <button
                            onClick={handleRestablecer}
                            className="admin-restablecer-button"
                        >
                            🔄 Restablecer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;