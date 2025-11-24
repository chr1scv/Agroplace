import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import authService from '../services/auth';
import Toast from '../components/Toast';
import '../styles/Products.css';
import HeaderCliente from '../pages/cliente/HeaderCliente';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para filtros y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Paginación - CAMBIADO A 10 productos por página
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    // Estados para notificaciones y autenticación
    const [toasts, setToasts] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { addToCart, getCartItemsCount } = useCart();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.user;
    const navigate = useNavigate();

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        filterProducts();
        setCurrentPage(1);
    }, [products, searchTerm, selectedCategory, priceRange, selectedOrigin, sortBy, inStockOnly]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/productos/');

            if (response.ok) {
                const productos = await response.json();
                const productosFormateados = productos.map(producto => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: parseFloat(producto.precio),
                    stock: producto.stock,
                    categoria: producto.categoria,
                    categoria_nombre: producto.categoria_nombre || 'Sin categoría',
                    vendedor_id: typeof producto.vendedor === 'object' ? producto.vendedor.id : producto.vendedor,
                    vendedor: typeof producto.vendedor === 'object' ? producto.vendedor : null,
                    vendedor_nombre: producto.vendedor_nombre || 'Vendedor',
                    origen: producto.origen,
                    imagen: producto.imagen,
                    certificado_organico: producto.certificado_organico || false,
                    ciudad: producto.ciudad || '',
                    comuna: producto.comuna || ''
                }));
                setProducts(productosFormateados);
            } else {
                throw new Error('Error al cargar productos de la API');
            }
        } catch (err) {
            setError('Error al cargar los productos desde el servidor');
            console.error('Error:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/categorias/');
            if (response.ok) {
                const categorias = await response.json();
                setCategories(categorias);
            }
        } catch (err) {
            console.error('Error cargando categorías:', err);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product?.vendedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product?.categoria === parseInt(selectedCategory)
            );
        }

        filtered = filtered.filter(product =>
            (product.precio || 0) >= priceRange[0] && (product.precio || 0) <= priceRange[1]
        );

        if (selectedOrigin) {
            filtered = filtered.filter(product =>
                product?.origen === selectedOrigin
            );
        }

        if (inStockOnly) {
            filtered = filtered.filter(product => (product.stock || 0) > 0);
        }

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
                break;
            case 'name':
                filtered.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
                break;
            case 'stock':
                filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            setSelectedProduct(product);
            setShowAuthModal(true);
            return;
        }

        if (product.stock === 0) {
            showToast('Este producto está agotado', 'error');
            return;
        }

        addToCart(product);
        showToast(`${product.nombre} agregado al carrito`, 'success');
    };

    const handleLoginSuccess = () => {
        setShowAuthModal(false);

        if (selectedProduct) {
            addToCart(selectedProduct);
            showToast(`${selectedProduct.nombre} agregado al carrito`, 'success');
            setSelectedProduct(null);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

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

        if (!showAuthModal) return null;

        return (
            <div className="modal-overlay-modern" onClick={() => setShowAuthModal(false)}>
                <div className="modal-content-horizontal" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowAuthModal(false)}
                        className="modal-close-modern"
                    >
                        ✕
                    </button>

                    <div className="modal-content-horizontal-inner">
                        <div className="modal-left-side">
                            <div className="modal-logo-container">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h2 className="modal-brand-name">Agroplace</h2>
                            <p className="modal-message">Inicia sesión para continuar</p>
                            <p className="modal-submessage">Accede a tu cuenta para agregar productos al carrito</p>
                        </div>

                        <div className="modal-right-side">
                            <h3 className="modal-title-horizontal">Iniciar Sesión</h3>

                            <form onSubmit={handleSubmit} className="modal-form-horizontal">
                                {error && (
                                    <div className="modal-error-alert">{error}</div>
                                )}
                                <div className="modal-form-group">
                                    <label className="modal-label">Usuario</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="modal-input-horizontal"
                                        placeholder="Tu nombre de usuario"
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label className="modal-label">Contraseña</label>
                                    <div className="modal-password-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="modal-input-horizontal"
                                            placeholder="Tu contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="modal-eye-button"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="modal-submit-button-horizontal"
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                                <p className="modal-register-text">
                                    ¿No tienes cuenta?{' '}
                                    <span
                                        onClick={() => navigate('/registro')}
                                        className="modal-register-link"
                                    >
                                        Regístrate aquí
                                    </span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setPriceRange([0, 10000]);
        setSelectedOrigin('');
        setSortBy('name');
        setInStockOnly(false);
        showToast('Filtros limpiados', 'info');
    };

    if (loading) {
        return (
            <div>
                <HeaderCliente />
                <div className="products-loading-container">
                    <div className="loading-spinner-modern">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    <p className="loading-text">Cargando productos frescos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <HeaderCliente />
                <div className="products-error-container">
                    <div className="error-icon-modern">⚠️</div>
                    <h3 className="error-title">Ups, algo salió mal</h3>
                    <p className="error-message">{error}</p>
                    <button onClick={loadProducts} className="retry-button-modern">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <HeaderCliente />

            {/* Hero Section */}
            <section className="products-hero">
                <div className="hero-content">
                    <span className="hero-badge">Productos Frescos</span>
                    <h1 className="hero-title">
                        Descubre la <span className="hero-highlight">frescura</span> natural
                    </h1>
                    <p className="hero-subtitle">
                        Productos agrícolas de calidad, directo del campo a tu mesa
                    </p>

                    {/* Stats Cards */}
                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-icon">🛒</div>
                            <div className="stat-content">
                                <span className="stat-number">{products.length}</span>
                                <span className="stat-label">Productos</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🌿</div>
                            <div className="stat-content">
                                <span className="stat-number">
                                    {products.filter(p => p.origen === 'organico').length}
                                </span>
                                <span className="stat-label">Orgánicos</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <span className="stat-number">{categories.length}</span>
                                <span className="stat-label">Categorías</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filters Section */}
            <section className="filters-section">
                <div className="container">
                    {/* Search Bar */}
                    <div className="search-bar-modern">
                        <div className="search-icon-modern">🔍</div>
                        <input
                            type="text"
                            placeholder="Buscar productos, vendedores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-modern"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="search-clear"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Products Grid Section */}
            <section className="products-grid-section">
                <div className="container">
                    <div className="products-layout-wrapper">
                        {/* Sidebar de Filtros */}
                        <aside className="filters-sidebar">
                            <h3 className="sidebar-title">Filtros</h3>

                            {/* Filter Pills */}
                            <div className="filter-controls">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`filter-pill ${showFilters ? 'active' : ''}`}
                                >
                                    <span className="pill-icon">⚙️</span>
                                    <span className="pill-text">Filtros avanzados</span>
                                    <span className="pill-arrow">{showFilters ? '▲' : '▼'}</span>
                                </button>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select-modern"
                                >
                                    <option value="name">Ordenar: A-Z</option>
                                    <option value="price-low">Precio: Menor a Mayor</option>
                                    <option value="price-high">Precio: Mayor a Menor</option>
                                    <option value="stock">Mayor Disponibilidad</option>
                                    <option value="newest">Más Recientes</option>
                                </select>

                                {(searchTerm || selectedCategory || selectedOrigin || inStockOnly) && (
                                    <button onClick={clearFilters} className="clear-button-modern">
                                        <span>✕</span>
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Advanced Filters Panel */}
                            {showFilters && (
                                <div className="filters-panel-modern">
                                    <div className="filters-grid-modern">
                                        <div className="filter-group-modern">
                                            <label className="filter-label-modern">Categoría</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="filter-select-modern"
                                            >
                                                <option value="">Todas</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="filter-group-modern">
                                            <label className="filter-label-modern">Tipo de Cultivo</label>
                                            <select
                                                value={selectedOrigin}
                                                onChange={(e) => setSelectedOrigin(e.target.value)}
                                                className="filter-select-modern"
                                            >
                                                <option value="">Todos</option>
                                                <option value="organico">🌿 Orgánico</option>
                                                <option value="convencional">🏭 Convencional</option>
                                            </select>
                                        </div>

                                        <div className="filter-group-modern">
                                            <label className="filter-label-modern">
                                                Precio máx: {formatPrice(priceRange[1])}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="500"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                                className="range-slider-modern"
                                            />
                                        </div>

                                        <div className="filter-group-modern">
                                            <label className="checkbox-modern">
                                                <input
                                                    type="checkbox"
                                                    checked={inStockOnly}
                                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                                    className="checkbox-input-modern"
                                                />
                                                <span className="checkbox-label-modern">Solo en stock</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results Info */}
                            <div className="results-bar">
                                <span className="results-count">
                                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                                </span>
                                {totalPages > 1 && (
                                    <span className="results-page-info">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                )}
                            </div>
                        </aside>

                        {/* Grid de Productos - SIN DUPLICADOS */}
                        <div>
                            {currentProducts.length > 0 ? (
                                <>
                                    <div className="products-grid-modern">
                                        {currentProducts.map(product => (
                                            <article key={product.id} className="product-card-modern">
                                                {/* Product Image */}
                                                <div className="product-image-wrapper">
                                                    {product.imagen ? (
                                                        <img
                                                            src={`http://localhost:8000${product.imagen}`}
                                                            alt={product.nombre}
                                                            className="product-image-modern"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="product-image-placeholder">
                                                            <span className="placeholder-emoji">
                                                                {product.categoria_nombre === 'Frutas' ? '🍎' :
                                                                    product.categoria_nombre === 'Verduras' ? '🥕' :
                                                                        product.categoria_nombre === 'Lácteos' ? '🥛' : '🌱'}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Badges */}
                                                    <div className="product-badges">
                                                        {product.origen === 'organico' && (
                                                            <span className="badge badge-organic">🌿 Orgánico</span>
                                                        )}
                                                        {product.stock === 0 && (
                                                            <span className="badge badge-sold-out">Agotado</span>
                                                        )}
                                                        {product.stock > 0 && product.stock < 10 && (
                                                            <span className="badge badge-low-stock">Últimas unidades</span>
                                                        )}
                                                    </div>

                                                    {/* Quick View Button */}
                                                    <button
                                                        onClick={() => navigate(`/producto/${product.id}`)}
                                                        className="quick-view-button"
                                                    >
                                                        Vista rápida
                                                    </button>
                                                </div>

                                                {/* Product Content */}
                                                <div className="product-content-modern">
                                                    {/* Category Tag */}
                                                    <span className="product-category-tag">
                                                        {product.categoria_nombre}
                                                    </span>

                                                    {/* Product Title */}
                                                    <h3 className="product-title-modern">
                                                        {product.nombre}
                                                    </h3>

                                                    {/* Product Description */}
                                                    <p className="product-description-modern">
                                                        {product.descripcion && product.descripcion.length > 80
                                                            ? `${product.descripcion.substring(0, 80)}...`
                                                            : product.descripcion}
                                                    </p>

                                                    {/* Product Meta */}
                                                    <div className="product-meta-modern">
                                                        <div className="meta-item">
                                                            <span className="meta-icon">👤</span>
                                                            <span className="meta-text">{product.vendedor_nombre}</span>
                                                        </div>
                                                        {(product.ciudad || product.comuna) && (
                                                            <div className="meta-item">
                                                                <span className="meta-icon">📍</span>
                                                                <span className="meta-text">
                                                                    {product.ciudad}{product.ciudad && product.comuna ? ', ' : ''}{product.comuna}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price and Actions */}
                                                    <div className="product-footer-modern">
                                                        <div className="price-wrapper">
                                                            <span className="product-price-modern">
                                                                {formatPrice(product.precio || 0)}
                                                            </span>
                                                            <span className="price-unit">/kg</span>
                                                        </div>

                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={product.stock === 0}
                                                            className={`add-to-cart-button-modern ${product.stock === 0 ? 'disabled' : ''}`}
                                                        >
                                                            {product.stock > 0 ? (
                                                                <>
                                                                    <span className="cart-icon">🛒</span>
                                                                    <span>Agregar</span>
                                                                </>
                                                            ) : (
                                                                <span>Agotado</span>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Stock Indicator */}
                                                    {product.stock > 0 && (
                                                        <div className="stock-indicator-modern">
                                                            <div className="stock-bar">
                                                                <div
                                                                    className="stock-fill"
                                                                    style={{
                                                                        width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                                                                        backgroundColor: product.stock < 10 ? '#ff6b6b' : '#10b981'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="stock-text">
                                                                {product.stock} disponibles
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    {/* Pagination - SE MUESTRA SOLO SI HAY MÁS DE 10 PRODUCTOS */}
                                    {filteredProducts.length > productsPerPage && (
                                        <div className="pagination-modern">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="pagination-button prev"
                                            >
                                                ← Anterior
                                            </button>

                                            <div className="pagination-numbers">
                                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 7) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 4) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 3) {
                                                        pageNum = totalPages - 6 + i;
                                                    } else {
                                                        pageNum = currentPage - 3 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => paginate(pageNum)}
                                                            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="pagination-button next"
                                            >
                                                Siguiente →
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state-modern">
                                    <div className="empty-icon-modern">🔍</div>
                                    <h3 className="empty-title">No encontramos productos</h3>
                                    <p className="empty-description">
                                        Intenta ajustar los filtros o buscar con otros términos
                                    </p>
                                    <button onClick={clearFilters} className="empty-action-button">
                                        Ver todos los productos
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Login */}
            <LoginModal />

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

export default Products;