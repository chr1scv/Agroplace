import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth';
import { orderService } from '../../services/api';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import NotificationBell from '../../components/NotificationBell';
import HeaderCliente from './HeaderCliente';

const ClientePanel = () => {
    const [activeTab, setActiveTab] = useState('pedidos');
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartItemsCount } = useCart();

    // Cargar usuario
    const loadUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
                setShowDropdown(false);
            }
        } catch (error) {
            console.error('Error cargando usuario:', error);
            setUser(null);
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, [location]);

    // Cargar datos (Pedidos)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const ordersData = await orderService.getAllOrders();
                setPedidos(ordersData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Header Functions
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setShowDropdown(false);
            navigate('/');
        } catch (error) {
            console.error('Error durante logout:', error);
            authService.clearAuthData();
            setUser(null);
            setShowDropdown(false);
            navigate('/');
        }
    };

    const handleQuickSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const getRoleBadge = (tipoUsuario) => {
        const badges = {
            admin: { text: 'Admin', color: 'linear-gradient(135deg, #d32f2f, #b71c1c)', emoji: '👑' },
            vendedor: { text: 'Vendedor', color: 'linear-gradient(135deg, #1976d2, #0d47a1)', emoji: '👨‍🌾' },
            cliente: { text: 'Comprador', color: 'linear-gradient(135deg, #388e3c, #1b5e20)', emoji: '🛒' }
        };
        return badges[tipoUsuario] || { text: 'Usuario', color: '#666', emoji: '👤' };
    };

    const getUserAvatar = (user) => {
        if (user.avatar) return user.avatar;
        const avatars = {
            admin: '👑',
            vendedor: '👩‍🌾',
            cliente: '👤'
        };
        return avatars[user.tipo_usuario] || '👤';
    };

    const getDisplayName = (user) => {
        return user.nombre || user.first_name || user.username || 'Usuario';
    };

    // Panel Functions
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleCancelarPedido = async (pedidoId) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
            try {
                await api.post(`/pedidos/${pedidoId}/cancelar_pedido/`);
                setPedidos(prev => prev.map(pedido =>
                    pedido.id === pedidoId ? { ...pedido, estado: 'cancelado' } : pedido
                ));
                alert('Pedido cancelado exitosamente');
            } catch (error) {
                console.error('Error cancelando pedido:', error);
                alert('Error al cancelar el pedido');
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}>🔄</div>
                <p>Cargando panel de cliente...</p>
            </div>
        );
    }

    return (
        <div>
            <HeaderCliente />
            {/* Contenido del Panel del Cliente */}
            <div style={styles.panelContainer}>
                <div style={styles.panelHeader}>
                    <h1 style={styles.panelTitle}>Mis Compras</h1>
                    <p style={styles.panelSubtitle}>Gestiona tus pedidos y perfil</p>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'pedidos' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        📦 Mis Pedidos
                    </button>
                    <button
                        style={activeTab === 'perfil' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('perfil')}
                    >
                        👤 Mi Perfil
                    </button>
                </div>

                <div style={styles.content}>
                    {activeTab === 'pedidos' && (
                        <PedidosTab
                            pedidos={pedidos}
                            onCancelarPedido={handleCancelarPedido}
                            formatPrice={formatPrice}
                        />
                    )}
                    {activeTab === 'perfil' && <PerfilTab user={user} formatPrice={formatPrice} navigate={navigate} />}
                </div>
            </div>
        </div >
    );
};

const PerfilTab = ({ user, formatPrice, navigate }) => {
    const displayUser = user || {};

    const perfil = {
        nombre: displayUser.first_name || displayUser.username || 'Cliente',
        email: displayUser.email || 'N/A',
        telefono: displayUser.telefono || 'N/A',
        fecha_registro: displayUser.date_joined ? new Date(displayUser.date_joined).toLocaleDateString('es-CL') : 'N/A',
        nivelFidelidad: 'Bronce',
        direccionPrincipal: displayUser.direccion || 'No asignada',
        preferencias: ['Orgánicos', 'Frescos'],
        pedidosRealizados: 0,
        totalGastado: 0,
        productosFavoritos: 0,
        direccionesGuardadas: 1,
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div>
            <h2 style={styles.tabTitle}>Mi Perfil - Cliente</h2>

            <div style={styles.perfilCard}>
                <div style={styles.perfilHeader}>
                    <div style={styles.perfilAvatarCliente}>🛒</div>
                    <div style={styles.perfilInfo}>
                        <h3 style={styles.perfilNombre}>{perfil.nombre}</h3>
                        <p style={styles.perfilEmail}>{perfil.email}</p>
                        <span style={styles.rolBadgeCliente}>🛒 Cliente {perfil.nivelFidelidad}</span>
                    </div>
                </div>

                <div style={styles.perfilDetalles}>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Teléfono:</span>
                        <span style={styles.detalleValor}>{perfil.telefono}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Dirección Principal:</span>
                        <span style={styles.detalleValor}>{perfil.direccionPrincipal}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Fecha de registro:</span>
                        <span style={styles.detalleValor}>{perfil.fecha_registro}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Nivel de Fidelidad:</span>
                        <span style={styles.detalleValor}>{perfil.nivelFidelidad}</span>
                    </div>
                </div>

                <div style={styles.preferenciasSection}>
                    <h4>Mis Preferencias</h4>
                    <div style={styles.preferenciasGrid}>
                        {perfil.preferencias.map((preferencia, index) => (
                            <div key={index} style={styles.preferenciaItem}>
                                <span style={styles.preferenciaIcon}>❤️</span>
                                <span style={styles.preferenciaText}>{preferencia}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.estadisticasCliente}>
                    <h4>Mi Actividad</h4>
                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{perfil.pedidosRealizados}</span>
                            <span style={styles.statLabel}>Pedidos Realizados</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{perfil.productosFavoritos}</span>
                            <span style={styles.statLabel}>Productos Favoritos</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{perfil.direccionesGuardadas}</span>
                            <span style={styles.statLabel}>Direcciones Guardadas</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{formatPrice(perfil.totalGastado)}</span>
                            <span style={styles.statLabel}>Total Gastado</span>
                        </div>
                    </div>
                </div>

                <div style={styles.perfilActions}>
                    <button onClick={() => handleNavigation('/profile/edit')} style={styles.editarPerfilButton}>
                        ✏️ Editar Perfil
                    </button>
                    <button onClick={() => handleNavigation('/profile/edit')} style={styles.cambiarPasswordButton}>
                        🔒 Cambiar Contraseña
                    </button>
                    <button onClick={() => handleNavigation('/cliente')} style={styles.gestionDireccionesButton}>
                        📍 Gestionar Direcciones
                    </button>
                    <button onClick={() => handleNavigation('/cliente')} style={styles.preferenciasButton}>
                        ⚙️ Preferencias de Compra
                    </button>
                </div>
            </div>
        </div>
    );
};

const PedidosTab = ({ pedidos, onCancelarPedido, formatPrice }) => {
    const getEstadoStyle = (estado) => {
        const estilos = {
            entregado: { backgroundColor: '#4caf50', color: 'white' },
            enviado: { backgroundColor: '#2196f3', color: 'white' },
            preparacion: { backgroundColor: '#ff9800', color: 'white' },
            pendiente: { backgroundColor: '#ffc107', color: 'black' },
            cancelado: { backgroundColor: '#f44336', color: 'white' }
        };
        return { ...styles.estadoBadge, ...estilos[estado] };
    };

    return (
        <div>
            <h2 style={styles.tabTitle}>Historial de Pedidos</h2>

            {pedidos.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📦</div>
                    <h3>No tienes pedidos aún</h3>
                    <a href="/productos" style={styles.explorarButton}>
                        🛍️ Ir a comprar
                    </a>
                </div>
            ) : (
                <div style={styles.pedidosList}>
                    {pedidos.map(pedido => (
                        <div key={pedido.id} style={styles.pedidoCard}>
                            <div style={styles.pedidoHeader}>
                                <div>
                                    <h3 style={styles.pedidoId}>Pedido #{pedido.id}</h3>
                                    <p style={styles.pedidoFecha}>Fecha: {new Date(pedido.fecha_creacion).toLocaleDateString()}</p>
                                    <p style={styles.pedidoDireccion}>{pedido.direccion_envio || 'Dirección no disponible'}</p>
                                </div>
                                <div style={styles.pedidoInfo}>
                                    <span style={getEstadoStyle(pedido.estado)}>
                                        {pedido.estado}
                                    </span>
                                    <div style={styles.pedidoTotal}>
                                        Total: <strong>{formatPrice(pedido.total)}</strong>
                                    </div>
                                    {pedido.metodo_pago && (
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                            Pago: {pedido.metodo_pago} ({pedido.estado_pago})
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.productosList}>
                                <h4>Productos:</h4>
                                {pedido.detalles && pedido.detalles.map((detalle, index) => (
                                    <div key={index} style={styles.productoItem}>
                                        <span>{detalle.cantidad} x {detalle.producto_nombre}</span>
                                        <span>{formatPrice(detalle.cantidad * detalle.precio_unitario)}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.pedidoActions}>
                                <button style={styles.detallesButton}>
                                    👁️ Ver Detalles
                                </button>
                                {pedido.estado === 'pendiente' && (
                                    <button
                                        onClick={() => onCancelarPedido(pedido.id)}
                                        style={styles.cancelarButton}
                                    >
                                        ❌ Cancelar Pedido
                                    </button>
                                )}
                                {pedido.estado === 'entregado' && (
                                    <button style={styles.repetirButton}>
                                        🔄 Repetir Pedido
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#5a6b8eff',
    },
    notificationBell: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1.6rem',
        padding: '0.6rem',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bellIcon: {
        display: 'block',
        transition: 'transform 0.3s ease',
    },
    notificationBadge: {
        position: 'absolute',
        top: '0',
        right: '0',
        background: 'linear-gradient(135deg, #ff6b35, #ff8c35)',
        color: 'white',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        border: '2px solid #2d5016',
        boxShadow: '0 2px 8px rgba(255,107,53,0.4)',
    },
    header: {
        background: 'linear-gradient(135deg, #2d5016, #3a6417)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 1000,
    },
    headerContainer: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        gap: '2rem',
    },
    logoSection: {
        flex: 1,
    },
    logo: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    logoImage: {
        height: '50px',
        width: 'auto',
    },
    logoFallback: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logoIcon: {
        fontSize: '2.5rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
    searchSection: {
        flex: 2,
        display: 'flex',
        justifyContent: 'center',
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
    },
    searchInput: {
        width: '100%',
        padding: '12px 20px',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '25px',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
    },
    searchBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '25px',
        border: '2px solid transparent',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,107,53,0.3))',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
    },
    userSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        justifyContent: 'flex-end',
    },
    cartIcon: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1.6rem',
        padding: '0.6rem',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    cartIconInner: {
        display: 'block',
        transition: 'transform 0.3s ease',
    },
    cartBadge: {
        position: 'absolute',
        top: '0',
        right: '0',
        background: 'linear-gradient(135deg, #ff6b35, #ff8c35)',
        color: 'white',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        border: '2px solid #2d5016',
        boxShadow: '0 2px 8px rgba(255,107,53,0.4)',
    },
    authButtons: {
        display: 'flex',
        gap: '1.2rem',
        alignItems: 'center',
    },
    loginButton: {
        color: 'white',
        textDecoration: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '2px solid rgba(255,255,255,0.3)',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backdropFilter: 'blur(10px)',
    },
    registerButton: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c35)',
        color: 'white',
        textDecoration: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
        border: 'none',
    },
    buttonIcon: {
        fontSize: '1rem',
    },
    userMenu: {
        position: 'relative',
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.6rem 1rem',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: 'rgba(255,255,255,0.08)',
        border: '2px solid rgba(255,255,255,0.15)',
        minWidth: 'auto',
        backdropFilter: 'blur(10px)',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'white',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
    },
    userName: {
        fontWeight: '600',
        fontSize: '0.9rem',
        whiteSpace: 'nowrap',
        color: 'white',
    },
    userRole: {
        fontSize: '0.7rem',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '10px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    dropdownArrow: {
        fontSize: '0.7rem',
        opacity: 0.8,
        marginLeft: '4px',
        color: '#ffd700',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        minWidth: '280px',
        marginTop: '0.8rem',
        overflow: 'hidden',
        zIndex: 1001, // ← ASEGÚRATE DE QUE TENGA ESTE z-index
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.3)',
    },
    dropdownHeader: {
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #4a7c1f, #3a6417)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    dropdownAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: 'white',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    dropdownUserInfo: {
        flex: 1,
        minWidth: 0,
    },
    dropdownName: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: '1.1rem',
        marginBottom: '4px',
    },
    dropdownEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.85rem',
        marginBottom: '6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    roleBadge: {
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        display: 'inline-block',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    dropdownDivider: {
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
    },
    dropdownMenu: {
        padding: '0.8rem 0',
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1.5rem',
        color: '#333',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    dropdownIcon: {
        fontSize: '1.1rem',
        width: '20px',
        textAlign: 'center',
    },
    logoutButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#d32f2f',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        background: 'rgba(0,0,0,0.1)',
    },

    panelContainer: {
        backgroundColor: '#eff0f4ff',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: 'calc(100vh - 80px)',
    },
    panelHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    panelTitle: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    panelSubtitle: {
        fontSize: '1.2rem',
        color: '#666',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
    },
    spinner: {
        fontSize: '3rem',
        marginBottom: '1rem',
        animation: 'spin 1s linear infinite',
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #1a1f2e',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
    },
    tab: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderRadius: '8px 8px 0 0',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.3s',
    },
    tabActive: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: '#4a7c1f',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '8px 8px 0 0',
        fontSize: '1rem',
        fontWeight: '500',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '2rem',
    },
    tabTitle: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '1.5rem',
    },
    tabHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    tabSubtitle: {
        color: '#666',
        fontSize: '1rem',
    },
    pedidosList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    pedidoCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    pedidoHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    pedidoId: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    pedidoFecha: {
        color: '#666',
        marginBottom: '0.25rem',
    },
    pedidoDireccion: {
        color: '#666',
        fontSize: '0.9rem',
    },
    pedidoInfo: {
        textAlign: 'right',
    },
    estadoBadge: {
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '0.5rem',
    },
    pedidoTotal: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    productosList: {
        marginBottom: '1rem',
    },
    productoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    pedidoActions: {
        display: 'flex',
        gap: '1rem',
    },
    detallesButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    cancelarButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    repetirButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    explorarButton: {
        display: 'inline-block',
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '1rem',
    },
    favoritosGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    favoritoCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
    },
    favoritoImage: {
        height: '120px',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    placeholderImage: {
        fontSize: '3rem',
        opacity: 0.7,
    },
    favoritoInfo: {
        flex: 1,
        marginBottom: '1rem',
    },
    favoritoNombre: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    favoritoCategoria: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.25rem',
    },
    favoritoVendedor: {
        color: '#666',
        fontSize: '0.8rem',
        marginBottom: '0.5rem',
    },
    favoritoPrecio: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    favoritoActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    comprarButton: {
        flex: 2,
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    eliminarFavoritoButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    agregarButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    formularioDireccion: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem',
    },
    input: {
        padding: '10px 12px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '0.9rem',
        outline: 'none',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    checkbox: {
        width: '18px',
        height: '18px',
    },
    checkboxLabel: {
        fontSize: '0.9rem',
        color: '#333',
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
    },
    guardarButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    direccionesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
    },
    direccionCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    direccionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    direccionTitulo: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        margin: 0,
    },
    principalBadge: {
        backgroundColor: '#ffc107',
        color: 'black',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    direccionInfo: {
        marginBottom: '1rem',
    },
    direccionTexto: {
        color: '#333',
        marginBottom: '0.5rem',
        lineHeight: '1.4',
    },
    direccionCiudad: {
        color: '#666',
        fontSize: '0.9rem',
    },
    direccionActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    editarButton: {
        backgroundColor: '#ffc107',
        color: 'black',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    eliminarButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    perfilCard: {
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    perfilHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    perfilAvatarCliente: {
        width: '80px',
        height: '80px',
        backgroundColor: '#4a7c1f',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: 'white',
    },
    perfilInfo: {
        flex: 1,
    },
    perfilNombre: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    perfilEmail: {
        color: '#666',
        marginBottom: '0.5rem',
    },
    rolBadgeCliente: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    perfilDetalles: {
        marginBottom: '2rem',
    },
    detalleItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    detalleLabel: {
        fontWeight: '600',
        color: '#333',
    },
    detalleValor: {
        color: '#666',
    },
    preferenciasSection: {
        marginBottom: '2rem',
    },
    preferenciasGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },
    preferenciaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
    },
    preferenciaIcon: {
        fontSize: '1rem',
    },
    preferenciaText: {
        fontSize: '0.9rem',
    },
    estadisticasCliente: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },
    statItem: {
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    statNumber: {
        display: 'block',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#666',
    },
    perfilActions: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    editarPerfilButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    cambiarPasswordButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    gestionDireccionesButton: {
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    preferenciasButton: {
        backgroundColor: '#9c27b0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default ClientePanel;