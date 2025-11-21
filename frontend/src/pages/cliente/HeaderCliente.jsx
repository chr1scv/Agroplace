import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth';
import { useCart } from '../../context/CartContext';

const HeaderCliente = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartItemsCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    // Búsqueda de productos
    const handleQuickSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const getDisplayName = (user) => {
        return user.nombre || user.first_name || user.username || 'Usuario';
    };

    return (
        <header style={{
            ...styles.header,
            background: isScrolled 
                ? 'rgba(26, 31, 46, 0.98)'
                : '#1a1f2e',
            boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
        }}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.leftSection}>
                    <Link to="/productos" style={styles.logo}>
                        <img 
                            src="/img/logo-banner-agroplace.png" 
                            alt="Agroplace" 
                            style={styles.logoImage}
                        />
                    </Link>
                </div>
                <div style={styles.leftSection}>
                    <Link to="/productos" style={styles.logo}>
                        <h2 style={styles.productTitle}>Productos</h2>
                    </Link>
                </div>

                {/* Barra de búsqueda */}
                <div style={styles.centerSection}>
                    <div style={styles.searchContainer}>
                        <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleQuickSearch}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Panel derecho */}
                <div style={styles.rightSection}>
                    {/* Carrito minimalista */}
                    <div 
                        style={styles.cartIcon}
                        onClick={() => navigate('/carrito')}
                        title="Carrito"
                    >
                        <svg style={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {getCartItemsCount() > 0 && (
                            <span style={styles.badge}>
                                {getCartItemsCount()}
                            </span>
                        )}
                    </div>

                    {user ? (
                        <div style={styles.userMenu}>
                            <div 
                                style={styles.profile}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div style={styles.avatar}>
                                    {getDisplayName(user).charAt(0).toUpperCase()}
                                </div>
                                {notifications > 0 && (
                                    <span style={styles.notificationDot}></span>
                                )}
                            </div>

                            {/* Dropdown moderno */}
                            {showDropdown && (
                                <div 
                                    style={{
                                        ...styles.dropdown,
                                        animation: 'slideDown 0.3s ease-out',
                                    }}
                                    onMouseLeave={() => setShowDropdown(false)}
                                >
                                    {/* Header del dropdown */}
                                    <div style={styles.dropdownHeader}>
                                        <div style={styles.dropdownAvatar}>
                                            {getDisplayName(user).charAt(0).toUpperCase()}
                                        </div>
                                        <div style={styles.dropdownUserInfo}>
                                            <div style={styles.dropdownName}>
                                                {getDisplayName(user)}
                                            </div>
                                            <div style={styles.dropdownEmail}>
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notificaciones */}
                                    {notifications > 0 && (
                                        <>
                                            <div style={styles.notificationSection}>
                                                <div style={styles.notificationHeader}>
                                                    <svg style={styles.notificationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                                    </svg>
                                                    <span style={styles.notificationText}>Notificaciones</span>
                                                    <span style={styles.notificationCount}>{notifications}</span>
                                                </div>
                                            </div>
                                            <div style={styles.divider}></div>
                                        </>
                                    )}

                                    {/* Menú de opciones */}
                                    <div style={styles.dropdownMenu}>
                                        <Link 
                                            to="/cliente" 
                                            style={styles.menuItem}
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <svg style={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                            <span>Mis Compras</span>
                                        </Link>
                                        <Link 
                                            to="/productos" 
                                            style={styles.menuItem}
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <svg style={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                            </svg>
                                            <span>Productos</span>
                                        </Link>
                                        <Link 
                                            to="/carrito" 
                                            style={styles.menuItem}
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <svg style={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                            </svg>
                                            <span>Carrito</span>
                                        </Link>
                                    </div>

                                    <div style={styles.divider}></div>

                                    {/* Botón de logout */}
                                    <button 
                                        onClick={handleLogout}
                                        style={styles.logoutButton}
                                    >
                                        <svg style={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" style={styles.loginButton}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {showDropdown && (
                <div 
                    style={styles.overlay}
                    onClick={() => setShowDropdown(false)}
                />
            )}

            {/* Animación CSS */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </header>
    );
};

const styles = {
    header: {
        color: 'white',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        gap: '2rem',
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
    },
    centerSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '600px',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    logoImage: {
        height: '75px',
        width: 'auto',
        transition: 'transform 0.3s ease',
    },
    productTitle: {
        color: 'white',
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
    },
    searchIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '18px',
        height: '18px',
        color: '#94a3b8',
        strokeWidth: 2,
        pointerEvents: 'none',
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px 12px 44px',
        border: '1px solid #2a3040',
        borderRadius: '12px',
        background: '#2a3040',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    cartIcon: {
        position: 'relative',
        height: 'auto',
        width: 'auto',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSvg: {
        width: '22px',
        height: '22px',
        color: 'white',
        strokeWidth: 2,
    },
    badge: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        background: '#dc3545',
        color: 'white',
        borderRadius: '10px',
        minWidth: '18px',
        height: '18px',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        padding: '0 5px',
        border: '2px solid #1a1f2e',
    },
    loginButton: {
        color: 'white',
        textDecoration: 'none',
        padding: '10px 24px',
        borderRadius: '12px',
        border: '1px solid #4a7c1f',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
        fontWeight: '600',
        background: '#4a7c1f',
    },
    userMenu: {
        position: 'relative',
    },
    profile: {
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'white',
        background: 'linear-gradient(135deg, #4a7c1f, #2d5016)',
        border: '2px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
    },
    notificationDot: {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '10px',
        height: '10px',
        background: '#dc3545',
        borderRadius: '50%',
        border: '2px solid #1a1f2e',
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minWidth: '280px',
        overflow: 'hidden',
        zIndex: 1001,
        border: '1px solid #e2e8f0',
    },
    dropdownHeader: {
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #4a7c1f, #2d5016)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    dropdownAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'white',
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.3)',
    },
    dropdownUserInfo: {
        flex: 1,
        minWidth: 0,
    },
    dropdownName: {
        fontWeight: '600',
        color: 'white',
        fontSize: '1rem',
        marginBottom: '2px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    dropdownEmail: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.8rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    notificationSection: {
        padding: '0.75rem 1.25rem',
        background: '#f8f9fa',
    },
    notificationHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    notificationIcon: {
        width: '18px',
        height: '18px',
        color: '#4a7c1f',
        strokeWidth: 2,
    },
    notificationText: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#1a1f2e',
        flex: 1,
    },
    notificationCount: {
        background: '#dc3545',
        color: 'white',
        borderRadius: '10px',
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
    divider: {
        height: '1px',
        background: '#e2e8f0',
    },
    dropdownMenu: {
        padding: '0.5rem',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        color: '#1a1f2e',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        fontSize: '0.9rem',
        fontWeight: '500',
        borderRadius: '10px',
        cursor: 'pointer',
    },
    menuIcon: {
        width: '18px',
        height: '18px',
        strokeWidth: 2,
    },
    logoutButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        margin: '0.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#dc3545',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '0.9rem',
        fontWeight: '500',
        borderRadius: '10px',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        background: 'transparent',
    },
};

export default HeaderCliente;