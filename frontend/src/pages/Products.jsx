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

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <HeaderCliente />  {/* ← HEADER AGREGADO */}
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
                <HeaderCliente />  {/* ← HEADER AGREGADO */}
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
            <HeaderCliente />  {/* ← HEADER AGREGADO */}
            
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
                        <div className="search-icon-modern"></div>
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

                    {/* Filter Pills */}
                    <div className="filter-controls">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`filter-pill ${showFilters ? 'active' : ''}`}
                        >
                            <span className="pill-icon">⚙️</span>
                            <span className="pill-text">Filtros</span>
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
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="products-grid-section">
                <div className="container">
                    {currentProducts.length > 0 ? (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-modern">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button prev"
                            >
                                ← Anterior
                            </button>

                            <div className="pagination-numbers">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
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
                </div>
            </section>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="modal-overlay-modern" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="modal-close-modern"
                        >
                            ✕
                        </button>

                        <div className="modal-icon-modern">🔒</div>
                        <h3 className="modal-title-modern">Inicia sesión para continuar</h3>
                        <p className="modal-description-modern">
                            Crea una cuenta o inicia sesión para agregar productos al carrito
                        </p>

                        {selectedProduct && (
                            <div className="modal-product-preview">
                                <div className="preview-image">
                                    {selectedProduct.imagen ? (
                                        <img src={`http://localhost:8000${selectedProduct.imagen}`} alt={selectedProduct.nombre} />
                                    ) : (
                                        <span>🌱</span>
                                    )}
                                </div>
                                <div className="preview-info">
                                    <p className="preview-name">{selectedProduct.nombre}</p>
                                    <p className="preview-price">{formatPrice(selectedProduct.precio)}</p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions-modern">
                            <button
                                onClick={() => navigate('/login')}
                                className="modal-button-primary"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="modal-button-secondary"
                            >
                                Crear Cuenta
                            </button>
                        </div>
                    </div>
                </div>
            )}

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