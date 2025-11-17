import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Header = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartItemsCount } = useCart();

    // Detectar scroll para efecto de transparencia
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ CORREGIDO: Función mejorada para cargar usuario
    const loadUser = async () => {
        try {
            console.log('🔄 Cargando información del usuario...');
            const currentUser = await authService.getCurrentUser();
            
            if (currentUser) {
                console.log('✅ Usuario autenticado:', currentUser.username);
                setUser(currentUser);
            } else {
                console.log('ℹ️ No hay usuario autenticado');
                setUser(null);
                // ✅ Cerrar dropdown si no hay usuario
                setShowDropdown(false);
            }
        } catch (error) {
            console.error('❌ Error cargando usuario:', error);
            setUser(null);
            setShowDropdown(false);
        }
    };

    // ✅ CORREGIDO: Detectar usuario al cargar y cuando cambia la ubicación
    useEffect(() => {
        loadUser();
    }, [location]);

    // ✅ NUEVO: Agregar listener para cambios en localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user' || e.key === null) { // null significa que se limpió todo
                console.log('🔄 Cambio detectado en almacenamiento, recargando usuario...');
                loadUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Agregar estilos hover mejorados
    useEffect(() => {
        const addHoverEffects = `
            .nav-link:hover {
                color: #ffd700 !important;
                transform: translateY(-2px);
            }
            .profile:hover {
                background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1)) !important;
                border-color: rgba(255,215,0,0.5) !important;
            }
            .dropdown-item:hover, .logout-button:hover {
                background: linear-gradient(135deg, #4a7c1f, #3a6417) !important;
                color: white !important;
                transform: translateX(5px);
            }
            .login-button:hover {
                background: rgba(255,255,255,0.15) !important;
                border-color: #ffd700 !important;
            }
            .register-button:hover {
                background: linear-gradient(135deg, #ff8c35, #ff6b35) !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(255,107,53,0.3);
            }
            .cart-icon:hover {
                transform: scale(1.1);
                background: rgba(255,215,0,0.1);
            }
            .search-input:focus {
                border-color: #ffd700 !important;
                box-shadow: 0 0 0 2px rgba(255,215,0,0.2);
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = addHoverEffects;
        document.head.appendChild(styleElement);
        
        return () => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, []);

    // ✅ CORREGIDO: Función de logout mejorada - AHORA REDIRIGE AL HOME
    const handleLogout = async () => {
        try {
            console.log('🔄 Iniciando proceso de logout...');
            
            await authService.logout();
            
            // ✅ Forzar actualización inmediata del estado
            setUser(null);
            setShowDropdown(false);
            
            console.log('✅ Logout completado, limpiando estado local...');
            
            // ✅ Redirigir inmediatamente a la página principal
            navigate('/');
            
        } catch (error) {
            console.error('❌ Error durante logout:', error);
            
            // ✅ Asegurar limpieza incluso si hay error
            authService.clearAuthData();
            setUser(null);
            setShowDropdown(false);
            
            // ✅ Redirigir al home incluso con error
            navigate('/');
        }
    };

    // ✅ NUEVO: Efecto para cerrar dropdown automáticamente cuando el usuario se desloguea
    useEffect(() => {
        if (!user) {
            setShowDropdown(false);
        }
    }, [user]);

    const getRoleBadge = (tipoUsuario) => {
        const badges = {
            admin: { text: 'Admin', color: 'linear-gradient(135deg, #d32f2f, #b71c1c)', emoji: '👑' },
            vendedor: { text: 'Vendedor', color: 'linear-gradient(135deg, #1976d2, #0d47a1)', emoji: '👨‍🌾' },
            cliente: { text: 'Comprador', color: 'linear-gradient(135deg, #388e3c, #1b5e20)', emoji: '🛒' }
        };
        return badges[tipoUsuario] || { text: 'Usuario', color: '#666', emoji: '👤' };
    };

    // Función para búsqueda rápida
    const handleQuickSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    // Obtener menú dinámico según permisos
    const getUserMenu = () => {
        if (!user) return [];
        
        const baseMenu = [
            { path: '/', label: 'Inicio', icon: '🏠' },
            { path: '/productos', label: 'Productos', icon: '🛍️' },
            { path: '/carrito', label: 'Carrito', icon: '🛒' },
        ];

        // Mostrar SOLO la opción correspondiente al rol principal del usuario
        if (user.tipo_usuario === 'admin') {
            baseMenu.push({ path: '/admin', label: 'Panel Admin', icon: '👑' });
        } else if (user.tipo_usuario === 'vendedor') {
            baseMenu.push({ path: '/vendedor', label: 'Mi Tienda', icon: '👩‍🌾' });
        } else if (user.tipo_usuario === 'cliente') {
            baseMenu.push({ path: '/cliente', label: 'Mis Compras', icon: '🛒' });
        }

        return baseMenu;
    };

    // Función para obtener avatar basado en el tipo de usuario
    const getUserAvatar = (user) => {
        if (user.avatar) return user.avatar;
        
        const avatars = {
            admin: '👑',
            vendedor: '👩‍🌾',
            cliente: '👤'
        };
        return avatars[user.tipo_usuario] || '👤';
    };

    // Función para obtener nombre para mostrar
    const getDisplayName = (user) => {
        return user.nombre || user.first_name || user.username || 'Usuario';
    };

    // ✅ DEBUG: Mostrar estado actual (puedes remover esto después)
    console.log('🔍 Estado actual del Header - Usuario:', user ? user.username : 'null', 'Dropdown:', showDropdown);

    return (
        <header style={{
            ...styles.header,
            background: isScrolled 
                ? 'linear-gradient(135deg, rgba(45, 80, 22, 0.95), rgba(35, 60, 15, 0.95))'
                : 'linear-gradient(135deg, #2d5016, #3a6417)',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            transition: 'all 0.3s ease',
        }}>
            <div style={styles.container}>
                {/* Logo y Navegación */}
                <div style={styles.leftSection}>
                    <Link to="/" style={styles.logo}>
                        <span style={styles.logoIcon}>🌱</span>
                        Agroplace
                    </Link>
                    <nav style={styles.nav}>
                        <Link to="/" style={styles.navLink} className="nav-link">
                            <span style={styles.navIcon}>🏠</span>
                            Inicio
                        </Link>
                        <Link to="/productos" style={styles.navLink} className="nav-link">
                            <span style={styles.navIcon}>🛍️</span>
                            Productos
                        </Link>
                    </nav>
                </div>

                {/* Búsqueda Rápida */}
                <div style={styles.centerSection}>
                    <div style={styles.quickSearch}>
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="🔍 Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleQuickSearch}
                                style={styles.quickSearchInput}
                                className="search-input"
                            />
                            <div style={styles.searchBorder}></div>
                        </div>
                    </div>
                </div>

                {/* Perfil de Usuario y Carrito */}
                <div style={styles.rightSection}>
                    {/* Campana de Notificaciones */}
                    <NotificationBell />
                    
                    {/* Icono del Carrito */}
                    <div 
                        style={styles.cartIcon} 
                        className="cart-icon"
                        onClick={() => navigate('/carrito')}
                    >
                        <span style={styles.cartIconInner}>🛒</span>
                        {getCartItemsCount() > 0 && (
                            <span style={styles.cartBadge}>
                                {getCartItemsCount()}
                            </span>
                        )}
                    </div>

                    {user ? (
                        <div style={styles.userMenu}>
                            <div 
                                style={styles.profile}
                                className="profile"
                                onClick={() => setShowDropdown(!showDropdown)}
                                onMouseEnter={() => setShowDropdown(true)}
                            >
                                <div style={{
                                    ...styles.avatar,
                                    background: getRoleBadge(user.tipo_usuario).color
                                }}>
                                    {getUserAvatar(user)}
                                </div>
                                <div style={styles.userDetails}>
                                    <span style={styles.userName}>
                                        {getDisplayName(user)}
                                    </span>
                                    <span style={{
                                        ...styles.userRole,
                                        background: getRoleBadge(user.tipo_usuario).color
                                    }}>
                                        {getRoleBadge(user.tipo_usuario).emoji} {getRoleBadge(user.tipo_usuario).text}
                                    </span>
                                </div>
                                <div style={styles.dropdownArrow}>
                                    {showDropdown ? '▲' : '▼'}
                                </div>
                            </div>

                            {/* ✅ CORREGIDO: Dropdown Menu - Solo se muestra si hay usuario Y showDropdown es true */}
                            {user && showDropdown && (
                                <div 
                                    style={styles.dropdown}
                                    onMouseLeave={() => setShowDropdown(false)}
                                >
                                    <div style={styles.dropdownHeader}>
                                        <div style={{
                                            ...styles.dropdownAvatar,
                                            background: getRoleBadge(user.tipo_usuario).color
                                        }}>
                                            {getUserAvatar(user)}
                                        </div>
                                        <div style={styles.dropdownUserInfo}>
                                            <div style={styles.dropdownName}>
                                                {getDisplayName(user)}
                                            </div>
                                            <div style={styles.dropdownEmail}>
                                                {user.email || `${user.username}@agroplace.com`}
                                            </div>
                                            <div style={{
                                                ...styles.roleBadge,
                                                background: getRoleBadge(user.tipo_usuario).color
                                            }}>
                                                {getRoleBadge(user.tipo_usuario).emoji} {getRoleBadge(user.tipo_usuario).text}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.dropdownDivider}></div>

                                    <div style={styles.dropdownMenu}>
                                        {/* Menú dinámico según permisos */}
                                        {getUserMenu().map(item => (
                                            <Link 
                                                key={item.path}
                                                to={item.path} 
                                                style={styles.dropdownItem}
                                                className="dropdown-item"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <span style={styles.dropdownIcon}>{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        ))}

                                        <div style={styles.dropdownDivider}></div>

                                        <button 
                                            onClick={handleLogout}
                                            style={styles.logoutButton}
                                            className="logout-button"
                                        >
                                            <span style={styles.dropdownIcon}>🚪</span>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={styles.authButtons}>
                            <Link to="/login" style={styles.loginButton} className="login-button">
                                <span style={styles.buttonIcon}>🔑</span>
                                Iniciar Sesión
                            </Link>
                            <Link to="/registro" style={styles.registerButton} className="register-button">
                                <span style={styles.buttonIcon}>👤</span>
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ CORREGIDO: Overlay para cerrar dropdown al hacer clic fuera - Solo se muestra si hay dropdown activo */}
            {showDropdown && user && (
                <div 
                    style={styles.overlay}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </header>
    );
};

// Los estilos se mantienen igual...
const styles = {
    // ... (todos los estilos se mantienen igual)
    header: {
        color: 'white',
        padding: '0.8rem 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontSize: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        flex: 1,
    },
    centerSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flex: 1,
        justifyContent: 'flex-end',
    },
    logo: {
        fontSize: '1.8rem',
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
    logoIcon: {
        fontSize: '2rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
    nav: {
        display: 'flex',
        gap: '2.5rem',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        padding: '0.5rem 0',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
    },
    navIcon: {
        fontSize: '1.1rem',
        opacity: 0.8,
    },
    quickSearch: {
        maxWidth: '350px',
        width: '100%',
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
    },
    quickSearchInput: {
        width: '100%',
        padding: '12px 20px',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '25px',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '0.95rem',
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
        minWidth: '300px',
        marginTop: '0.8rem',
        overflow: 'hidden',
        zIndex: 1001,
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
};

export default Header;