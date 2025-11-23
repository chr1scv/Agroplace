import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import authService from '../services/auth';
import ReviewSystem from '../components/ReviewSystem';
import HeaderCliente from '../pages/cliente/HeaderCliente';
import '../styles/Products.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [showVendorModal, setShowVendorModal] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const Toast = ({ message, type, duration, onClose }) => {
        useEffect(() => {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }, [duration, onClose]);

        return (
            <div className={`toast-modern toast-${type}`}>
                {message}
                <button onClick={onClose} className="toast-close-button">✕</button>
            </div>
        );
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/productos/${id}/`);
            if (response.ok) {
                const productData = await response.json();
                const formattedProduct = {
                    id: productData.id,
                    nombre: productData.nombre,
                    descripcion: productData.descripcion,
                    precio: parseFloat(productData.precio),
                    stock: productData.stock,
                    categoria_nombre: productData.categoria_nombre,
                    vendedor_nombre: productData.vendedor_nombre,
                    vendedor_id: productData.vendedor,
                    ciudad: productData.ciudad || '',
                    comuna: productData.comuna || '',
                    region: productData.region || '',
                    provincia: productData.provincia || '',
                    vendedor_foto: productData.vendedor_foto || null,
                    origen: productData.origen,
                    certificado_organico: productData.certificado_organico,
                    imagenes: productData.imagen ? [`http://localhost:8000${productData.imagen}`] : [null]
                };
                setProduct(formattedProduct);

                // Cargar datos del vendedor si está disponible en la respuesta
                if (productData.vendedor && typeof productData.vendedor === 'object') {
                    setVendor(productData.vendedor);
                }
            } else {
                throw new Error('Error al cargar el producto desde la API');
            }
        } catch (err) {
            setError('Error al cargar el producto desde el servidor');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadVendorDetails = async (vendorId) => {
        try {
            // Cargar datos completos del vendedor
            const vendorResponse = await fetch(`http://localhost:8000/api/usuarios/${vendorId}/`);
            if (vendorResponse.ok) {
                const vendorData = await vendorResponse.json();
                setVendor(vendorData);
            }

            // Cargar productos del vendedor
            const productsResponse = await fetch(`http://localhost:8000/api/productos/?vendedor=${vendorId}`);
            if (productsResponse.ok) {
                const productsData = await productsResponse.json();
                setVendorProducts(productsData.results || productsData || []);
            }
        } catch (err) {
            console.error('Error cargando datos del vendedor:', err);
        }
    };

    const handleViewVendor = () => {
        if (product && product.vendedor_id) {
            loadVendorDetails(product.vendedor_id);
            setShowVendorModal(true);
        }
    };

    const handleAddToCart = () => {
        if (!authService.isAuthenticated()) {
            setPendingAction('add');
            setShowLoginModal(true);
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`${quantity} ${product.nombre} agregado(s) al carrito`, 'success');

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const handleBuyNow = () => {
        if (product.stock === 0) return;

        if (!authService.isAuthenticated()) {
            setPendingAction('buy');
            setShowLoginModal(true);
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        navigate('/carrito');
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        if (pendingAction === 'buy') {
            navigate('/carrito');
        } else {
            showToast(`${quantity} ${product.nombre} agregado(s) al carrito`, 'success');

            // Recargar después de agregar al carrito para actualizar el header
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        setPendingAction(null);
    };

    const getMemberSince = (fechaRegistro) => {
        if (!fechaRegistro) return '';
        const date = new Date(fechaRegistro);
        return date.getFullYear();
    };

    // Modal de Login
    const LoginModal = () => {
        const [formData, setFormData] = useState({ username: '', password: '' });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [showPassword, setShowPassword] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
                await authService.login(formData.username, formData.password);
                handleLoginSuccess();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!showLoginModal) return null;

        return (
            <div style={loginModalStyles.overlay} onClick={() => setShowLoginModal(false)}>
                <div style={loginModalStyles.modal} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowLoginModal(false)}
                        style={loginModalStyles.closeButton}
                    >
                        ✕
                    </button>
                    <div style={loginModalStyles.content}>
                        <div style={loginModalStyles.leftSide}>
                            <div style={loginModalStyles.logoContainer}>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h2 style={loginModalStyles.brandName}>Agroplace</h2>
                            <p style={loginModalStyles.message}>Inicia sesión para continuar</p>
                            <p style={loginModalStyles.submessage}>Accede a tu cuenta para agregar productos al carrito</p>
                        </div>
                        <div style={loginModalStyles.rightSide}>
                            <h3 style={loginModalStyles.title}>Iniciar Sesión</h3>
                            <form onSubmit={handleSubmit} style={loginModalStyles.form}>
                                {error && (
                                    <div style={loginModalStyles.errorAlert}>{error}</div>
                                )}
                                <div style={loginModalStyles.formGroup}>
                                    <label style={loginModalStyles.label}>Usuario</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={loginModalStyles.input}
                                        placeholder="Tu nombre de usuario"
                                    />
                                </div>
                                <div style={loginModalStyles.formGroup}>
                                    <label style={loginModalStyles.label}>Contraseña</label>
                                    <div style={loginModalStyles.passwordWrapper}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            style={loginModalStyles.input}
                                            placeholder="Tu contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={loginModalStyles.eyeButton}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={loginModalStyles.submitButton}
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                                <p style={loginModalStyles.registerText}>
                                    ¿No tienes cuenta?{' '}
                                    <Link to="/registro" style={loginModalStyles.registerLink}>
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Modal del Vendedor
    const VendorModal = () => {
        if (!showVendorModal || !vendor) return null;

        return (
            <div style={vendorModalStyles.overlay} onClick={() => setShowVendorModal(false)}>
                <div style={vendorModalStyles.modal} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowVendorModal(false)}
                        style={vendorModalStyles.closeButton}
                    >
                        ✕
                    </button>

                    <div style={vendorModalStyles.header}>
                        <div style={vendorModalStyles.avatar}>
                            {vendor.foto_perfil ? (
                                <img
                                    src={vendor.foto_perfil}
                                    alt={vendor.username}
                                    style={vendorModalStyles.avatarImage}
                                />
                            ) : (
                                <div style={vendorModalStyles.avatarPlaceholder}>
                                    🧑‍🌾
                                </div>
                            )}
                        </div>
                        <div style={vendorModalStyles.vendorBasicInfo}>
                            <h2 style={vendorModalStyles.vendorName}>{vendor.username}</h2>
                            {vendor.titulo && (
                                <p style={vendorModalStyles.vendorTitle}>{vendor.titulo}</p>
                            )}
                            <div style={vendorModalStyles.verificationBadge}>
                                <span style={vendorModalStyles.badgeIcon}>✓</span>
                                Vendedor Verificado
                            </div>
                        </div>
                    </div>

                    <div style={vendorModalStyles.content}>
                        {/* Estadísticas */}
                        <div style={vendorModalStyles.statsGrid}>
                            {vendor.rating && (
                                <div style={vendorModalStyles.statItem}>
                                    <span style={vendorModalStyles.statIcon}>⭐</span>
                                    <div style={vendorModalStyles.statContent}>
                                        <span style={vendorModalStyles.statValue}>{vendor.rating}</span>
                                        <span style={vendorModalStyles.statLabel}>/5 Rating</span>
                                    </div>
                                </div>
                            )}

                            {vendor.reviews_count !== undefined && (
                                <div style={vendorModalStyles.statItem}>
                                    <span style={vendorModalStyles.statIcon}>💬</span>
                                    <div style={vendorModalStyles.statContent}>
                                        <span style={vendorModalStyles.statValue}>{vendor.reviews_count}</span>
                                        <span style={vendorModalStyles.statLabel}>Reseñas</span>
                                    </div>
                                </div>
                            )}

                            {vendor.ventas !== undefined && (
                                <div style={vendorModalStyles.statItem}>
                                    <span style={vendorModalStyles.statIcon}>🛒</span>
                                    <div style={vendorModalStyles.statContent}>
                                        <span style={vendorModalStyles.statValue}>{vendor.ventas}</span>
                                        <span style={vendorModalStyles.statLabel}>Ventas</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        {vendor.descripcion && (
                            <div style={vendorModalStyles.section}>
                                <h3 style={vendorModalStyles.sectionTitle}>Sobre el vendedor</h3>
                                <p style={vendorModalStyles.sectionText}>{vendor.descripcion}</p>
                            </div>
                        )}

                        {/* Ubicación */}
                        {(vendor.direccion || product.region) && (
                            <div style={vendorModalStyles.section}>
                                <h3 style={vendorModalStyles.sectionTitle}>Ubicación</h3>
                                <div style={vendorModalStyles.locationInfo}>
                                    <span style={vendorModalStyles.locationIcon}>📍</span>
                                    <div style={vendorModalStyles.locationText}>
                                        {vendor.direccion && <div>{vendor.direccion}</div>}
                                        <div style={vendorModalStyles.locationDetails}>
                                            {product.comuna && <span>{product.comuna}</span>}
                                            {product.provincia && <span>, {product.provincia}</span>}
                                            {product.region && <span>, {product.region}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contacto */}
                        <div style={vendorModalStyles.section}>
                            <h3 style={vendorModalStyles.sectionTitle}>Contacto</h3>
                            <div style={vendorModalStyles.contactInfo}>
                                <div style={vendorModalStyles.contactItem}>
                                    <span style={vendorModalStyles.contactIcon}>📧</span>
                                    <span>{vendor.email}</span>
                                </div>
                                {vendor.telefono && (
                                    <div style={vendorModalStyles.contactItem}>
                                        <span style={vendorModalStyles.contactIcon}>📞</span>
                                        <span>{vendor.telefono}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Otros productos del vendedor */}
                        {vendorProducts.length > 0 && (
                            <div style={vendorModalStyles.section}>
                                <h3 style={vendorModalStyles.sectionTitle}>
                                    Otros productos de {vendor.username} ({vendorProducts.length})
                                </h3>
                                <div style={vendorModalStyles.productsGrid}>
                                    {vendorProducts.slice(0, 3).map(vendorProduct => (
                                        <div key={vendorProduct.id} style={vendorModalStyles.productCard}>
                                            <div style={vendorModalStyles.productImage}>
                                                {vendorProduct.imagen ? (
                                                    <img
                                                        src={`http://localhost:8000${vendorProduct.imagen}`}
                                                        alt={vendorProduct.nombre}
                                                        style={vendorModalStyles.productImageImg}
                                                    />
                                                ) : (
                                                    <div style={vendorModalStyles.productImagePlaceholder}>
                                                        {vendorProduct.categoria_nombre === 'Frutas' ? '🍎' :
                                                            vendorProduct.categoria_nombre === 'Verduras' ? '🥕' : '🌱'}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={vendorModalStyles.productInfo}>
                                                <h4 style={vendorModalStyles.productName}>{vendorProduct.nombre}</h4>
                                                <div style={vendorModalStyles.productPrice}>
                                                    {formatPrice(vendorProduct.precio)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div>
                <HeaderCliente />
                <div style={styles.loading}>
                    <div style={styles.spinner}>🔄</div>
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div>
                <HeaderCliente />
                <div style={styles.error}>
                    <p>{error || 'Producto no encontrado'}</p>
                    <button onClick={() => navigate('/productos')} style={styles.backButton}>
                        ← Volver a Productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeaderCliente />
            <div style={styles.container}>
                {/* Breadcrumb */}
                <div style={styles.breadcrumb}>
                    <button onClick={() => navigate('/productos')} style={styles.breadcrumbLink}>
                        Productos
                    </button>
                    <span style={styles.breadcrumbSeparator}>/</span>
                    <span style={styles.breadcrumbCurrent}>{product.nombre}</span>
                </div>

                {/* Layout Principal */}
                <div style={styles.mainLayout}>
                    {/* Columna Izquierda - Imagen */}
                    <div style={styles.imageColumn}>
                        <div style={styles.mainImage}>
                            {product.imagenes[0] ? (
                                <img
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={styles.placeholderImage}>
                                    {product.categoria_nombre === 'Frutas' ? '🍎' :
                                        product.categoria_nombre === 'Verduras' ? '🥕' : '🌱'}
                                </div>
                            )}
                            {product.origen === 'organico' && (
                                <div style={styles.organicBadge}>🌿 Orgánico Certificado</div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha - Información del Producto */}
                    <div style={styles.infoColumn}>
                        <h1 style={styles.productName}>{product.nombre}</h1>

                        <div style={styles.priceSection}>
                            <span style={styles.price}>{formatPrice(product.precio)}</span>
                            <span style={styles.unit}>/kg</span>
                        </div>

                        <div style={styles.stockInfo}>
                            <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                                {product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Agotado'}
                            </span>
                        </div>

                        {/* Descripción */}
                        <div style={styles.description}>
                            <h3 style={styles.sectionTitle}>Descripción</h3>
                            <p style={styles.descriptionText}>{product.descripcion}</p>
                            {/* Ubicación dentro de la descripción */}
                            {(product.region || product.provincia || product.comuna) && (
                                <div style={styles.locationInDescription}>
                                    <span style={styles.locationIcon}>📍</span>
                                    <span>
                                        {product.region && `Región: ${product.region}`}
                                        {product.provincia && `, Provincia: ${product.provincia}`}
                                        {product.comuna && `, Comuna: ${product.comuna}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Vendedor con datos reales */}
                        <div style={styles.vendorCard}>
                            <h3 style={styles.vendorCardTitle}>Vendido por:</h3>
                            <div style={styles.vendorCardDetails}>
                                <div style={styles.vendorCardProfile}>
                                    <div style={styles.vendorCardImageWrapper}>
                                        {vendor?.foto_perfil ? (
                                            <img
                                                src={vendor.foto_perfil}
                                                alt={product.vendedor_nombre}
                                                style={styles.vendorCardImage}
                                            />
                                        ) : (
                                            <div style={styles.vendorPlaceholderIcon}>
                                                🧑‍🌾
                                            </div>
                                        )}
                                    </div>
                                    {/* Rating real si está disponible */}
                                    {vendor?.rating && (
                                        <div style={styles.vendorCardRating}>
                                            <span style={styles.ratingStars}>
                                                {'★'.repeat(Math.floor(vendor.rating))}
                                                {'☆'.repeat(5 - Math.floor(vendor.rating))}
                                            </span>
                                            <span style={styles.ratingNumber}>({vendor.rating})</span>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.vendorCardText}>
                                    <p style={styles.vendorCardName}>{product.vendedor_nombre}</p>

                                    <div style={styles.vendorCardBadge}>
                                        <span style={styles.vendorBadgeIcon}>✓</span> Vendedor Verificado
                                    </div>

                                    {/* Estadísticas reales */}
                                    <div style={styles.vendorStats}>
                                        {vendor?.reviews_count !== undefined && (
                                            <span style={styles.vendorStat}>
                                                ⭐ {vendor.rating || 'N/A'}/5 ({vendor.reviews_count} reseñas)
                                            </span>
                                        )}
                                        {vendor?.ventas !== undefined && (
                                            <span style={styles.vendorStat}>
                                                🛒 +{vendor.ventas} ventas
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                style={styles.viewVendorButton}
                                onClick={handleViewVendor}
                            >
                                Ver perfil del vendedor <span style={styles.viewVendorIcon}>›</span>
                            </button>
                        </div>

                        {/* Acciones de Compra */}
                        <div style={styles.purchaseSection}>
                            <div style={styles.quantitySelector}>
                                <label style={styles.quantityLabel}>Cantidad:</label>
                                <div style={styles.quantityControls}>
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        style={styles.quantityButton}
                                    >
                                        −
                                    </button>
                                    <span style={styles.quantity}>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                        style={styles.quantityButton}
                                    >
                                        +
                                    </button>
                                </div>
                                <span style={styles.quantityUnit}>kg</span>
                            </div>

                            <div style={styles.actionButtons}>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={product.stock > 0 ? "add-to-cart-button-modern" : "disabled-button"}
                                >
                                    🛒 Agregar al Carrito - {formatPrice(product.precio * quantity)}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className={product.stock > 0 ? "add-to-cart-button-modern" : "disabled-button"}
                                    style={{ backgroundColor: '#1c1c1e' }}
                                >
                                    ⚡ Comprar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sistema de Reseñas */}
            <ReviewSystem productId={product.id} productName={product.nombre} />

            {/* Modal de Login */}
            <LoginModal />

            {/* Modal del Vendedor */}
            <VendorModal />

            {/* Toast Notifications */}
            <div className="toast-container-modern">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

// =========================================================================
// === ESTILOS PRINCIPALES ================================================
// =========================================================================
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
        fontSize: '0.85rem',
        color: '#666'
    },
    breadcrumbLink: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#007AFF',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    breadcrumbSeparator: { color: '#999' },
    breadcrumbCurrent: { color: '#333', fontWeight: '500' },

    mainLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'start'
    },
    imageColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },

    productName: {
        fontSize: '2.2rem',
        color: '#1c1c1e',
        margin: '0',
        lineHeight: '1.2',
        fontWeight: '700',
        marginBottom: '0.5rem'
    },
    sectionTitle: {
        fontSize: '1.1rem',
        color: '#1c1c1e',
        margin: '0 0 0.8rem 0',
        fontWeight: '600'
    },
    descriptionText: {
        color: '#48484a',
        lineHeight: '1.6',
        margin: '0',
        fontSize: '1rem'
    },

    priceSection: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.4rem',
        marginBottom: '0.5rem'
    },
    price: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2d5016'
    },
    unit: {
        color: '#666',
        fontSize: '1rem'
    },
    stockInfo: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '1rem'
    },
    inStock: { color: '#4caf50' },
    outOfStock: { color: '#f44336' },

    description: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
    },

    mainImage: {
        width: '100%',
        height: '400px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
    },
    placeholderImage: {
        fontSize: '6rem',
        opacity: 0.7
    },
    organicBadge: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#2d5016',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },

    vendorCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '1rem'
    },
    vendorCardTitle: {
        fontSize: '1rem',
        color: '#8e8e93',
        marginBottom: '1rem',
        fontWeight: '500',
    },
    vendorCardDetails: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.2rem',
        marginBottom: '1rem'
    },
    vendorCardProfile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: '70px'
    },
    vendorCardImageWrapper: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #f0f0f0',
    },
    vendorCardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    vendorPlaceholderIcon: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e8f5e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
    },
    vendorCardRating: {
        fontSize: '0.85rem',
        color: '#FFD60A',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem'
    },
    ratingStars: {
        letterSpacing: '0.5px'
    },
    ratingNumber: {
        fontSize: '0.8rem',
        color: '#48484a'
    },
    vendorCardText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        flexGrow: 1
    },
    vendorCardName: {
        fontWeight: '600',
        fontSize: '1.1rem',
        color: '#1c1c1e',
        margin: '0',
        marginBottom: '0.3rem'
    },
    vendorCardBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#007AFF',
        color: 'white',
        fontSize: '0.75rem',
        padding: '4px 10px',
        borderRadius: '12px',
        fontWeight: '500',
        width: 'fit-content',
        marginBottom: '0.5rem'
    },
    vendorStats: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginTop: '0.5rem'
    },
    vendorStat: {
        fontSize: '0.85rem',
        color: '#666'
    },
    viewVendorButton: {
        backgroundColor: '#f2f2f7',
        color: '#007AFF',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.8rem',
        transition: 'background-color 0.2s'
    },
    viewVendorIcon: {
        fontSize: '1.2rem',
        marginLeft: '5px'
    },

    purchaseSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    quantitySelector: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
    },
    quantityLabel: {
        fontWeight: '600',
        color: '#1c1c1e',
        fontSize: '1rem'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'stretch',
        border: '1px solid #d1d1d6',
        borderRadius: '10px',
        overflow: 'hidden',
        height: '40px'
    },
    quantityButton: {
        width: '40px',
        height: '100%',
        border: 'none',
        backgroundColor: '#f8f8f8',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: '500',
        color: '#007AFF',
        transition: 'background-color 0.2s',
    },
    quantity: {
        minWidth: '50px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityUnit: {
        color: '#666',
        fontSize: '0.9rem',
        marginLeft: '0.5rem'
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    },

    locationInDescription: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666',
    },
    locationIcon: {
        fontSize: '1rem'
    },

    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '30vh',
        fontSize: '1rem',
        color: '#8e8e93'
    },
    spinner: {
        fontSize: '2.5rem',
        marginBottom: '0.8rem',
        color: '#007AFF'
    },
    error: {
        textAlign: 'center',
        padding: '1.5rem',
        color: '#ff3b30'
    },
    backButton: {
        backgroundColor: '#007AFF',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '1rem',
        fontWeight: '600'
    },
};

// =========================================================================
// === ESTILOS DEL MODAL DE LOGIN ==========================================
// =========================================================================
const loginModalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    modal: {
        backgroundColor: '#1a1f2e',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 10,
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        minHeight: '500px',
    },
    leftSide: {
        background: 'linear-gradient(135deg, #2d7a3e 0%, #1a4d26 100%)',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px 0 0 16px',
    },
    logoContainer: {
        marginBottom: '20px',
    },
    brandName: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'white',
        margin: '0 0 10px 0',
    },
    message: {
        fontSize: '1.3rem',
        color: 'white',
        margin: '20px 0 10px 0',
        fontWeight: '600',
    },
    submessage: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        maxWidth: '280px',
    },
    rightSide: {
        padding: '60px 50px',
        backgroundColor: '#1a1f2e',
        borderRadius: '0 16px 16px 0',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#a0aec0',
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
    },
    passwordWrapper: {
        position: 'relative',
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    submitButton: {
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2d7a3e',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
    },
    errorAlert: {
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        fontSize: '0.9rem',
    },
    registerText: {
        textAlign: 'center',
        color: '#a0aec0',
        fontSize: '0.9rem',
        marginTop: '10px',
    },
    registerLink: {
        color: '#2d7a3e',
        textDecoration: 'none',
        fontWeight: '600',
    },
};

// =========================================================================
// === ESTILOS DEL MODAL DEL VENDEDOR ======================================
// =========================================================================
const vendorModalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'rgba(0,0,0,0.1)',
        border: 'none',
        color: '#333',
        fontSize: '1.5rem',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 10,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '2rem 2rem 1rem 2rem',
        borderBottom: '1px solid #f0f0f0',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#e8f5e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        fontSize: '2.5rem',
    },
    vendorBasicInfo: {
        flex: 1,
    },
    vendorName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1c1c1e',
        margin: '0 0 0.5rem 0',
    },
    vendorTitle: {
        fontSize: '1rem',
        color: '#2d5016',
        fontWeight: '600',
        margin: '0 0 0.5rem 0',
    },
    verificationBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#007AFF',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
        width: 'fit-content',
    },
    badgeIcon: {
        fontSize: '0.8rem',
    },
    content: {
        padding: '1.5rem 2rem 2rem 2rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
    },
    statIcon: {
        fontSize: '1.5rem',
    },
    statContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    statValue: {
        fontWeight: '700',
        color: '#1c1c1e',
        fontSize: '1.1rem',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#666',
    },
    section: {
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#1c1c1e',
        margin: '0 0 0.75rem 0',
    },
    sectionText: {
        color: '#48484a',
        lineHeight: '1.6',
        margin: '0',
    },
    locationInfo: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    locationIcon: {
        fontSize: '1.1rem',
        marginTop: '0.1rem',
    },
    locationText: {
        color: '#48484a',
        lineHeight: '1.5',
    },
    locationDetails: {
        fontSize: '0.95rem',
        color: '#666',
    },
    contactInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#48484a',
    },
    contactIcon: {
        fontSize: '1.1rem',
    },
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
    },
    productCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    productImage: {
        width: '100%',
        height: '100px',
        backgroundColor: '#e9ecef',
    },
    productImageImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    productImagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        opacity: 0.7,
    },
    productInfo: {
        padding: '0.75rem',
    },
    productName: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#1c1c1e',
        margin: '0 0 0.25rem 0',
        lineHeight: '1.3',
    },
    productPrice: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#2d5016',
    },
};

export default ProductDetail;