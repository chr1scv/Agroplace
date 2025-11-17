import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import authService from '../services/auth';
import Toast from '../components/Toast';
import '../styles/Products.css';

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
    const [productsPerPage] = useState(9); // Máximo 9 productos por página

    // Estados para notificaciones y autenticación
    const [toasts, setToasts] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { addToCart, getCartItemsCount } = useCart();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.user;
    const navigate = useNavigate();

    // Función para mostrar notificaciones
    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Función para formatear precios en CLP
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Cargar productos y categorías al iniciar
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // Filtrar productos cuando cambian los filtros
    useEffect(() => {
        filterProducts();
        setCurrentPage(1); // Resetear a primera página cuando cambian filtros
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
                    certificado_organico: producto.certificado_organico || false
                }));

                setProducts(productosFormateados);
            } else {
                throw new Error('Error al cargar productos de la API');
            }
        } catch (err) {
            setError('Error al cargar los productos desde el servidor');
            console.error('Error:', err);

            // Datos de ejemplo como fallback
            const exampleProducts = [
                {
                    id: 1,
                    nombre: 'Manzanas Orgánicas Premium',
                    descripcion: 'Manzanas frescas cultivadas de forma orgánica, dulces y jugosas',
                    precio: 3200,
                    stock: 25,
                    categoria: 1,
                    categoria_nombre: 'Frutas',
                    vendedor_nombre: 'Granja Orgánica',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                },
                {
                    id: 2,
                    nombre: 'Zanahorias Frescas',
                    descripcion: 'Zanahorias crujientes recién cosechadas, ricas en vitamina A',
                    precio: 1800,
                    stock: 40,
                    categoria: 2,
                    categoria_nombre: 'Verduras',
                    vendedor_nombre: 'Huerto Familiar',
                    origen: 'convencional',
                    imagen: null,
                    certificado_organico: false
                },
                {
                    id: 3,
                    nombre: 'Quinua Real',
                    descripcion: 'Quinua orgánica de alta calidad, perfecta para ensaladas y platos saludables',
                    precio: 4500,
                    stock: 15,
                    categoria: 3,
                    categoria_nombre: 'Granos',
                    vendedor_nombre: 'Cultivos Andinos',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                },
                {
                    id: 4,
                    nombre: 'Leche Orgánica',
                    descripcion: 'Leche fresca de vacas criadas en pastoreo libre sin hormonas',
                    precio: 2800,
                    stock: 0,
                    categoria: 4,
                    categoria_nombre: 'Lácteos',
                    vendedor_nombre: 'Estancia Natural',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                },
                {
                    id: 5,
                    nombre: 'Albahaca Fresca',
                    descripcion: 'Albahaca orgánica recién cosechada, ideal para pesto y cocina italiana',
                    precio: 1200,
                    stock: 30,
                    categoria: 5,
                    categoria_nombre: 'Hierbas',
                    vendedor_nombre: 'Huerto Aromático',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                },
                {
                    id: 6,
                    nombre: 'Tomates Cherry',
                    descripcion: 'Tomates cherry dulces y jugosos, perfectos para ensaladas',
                    precio: 2200,
                    stock: 20,
                    categoria: 2,
                    categoria_nombre: 'Verduras',
                    vendedor_nombre: 'Invernadero Solar',
                    origen: 'convencional',
                    imagen: null,
                    certificado_organico: false
                },
                {
                    id: 7,
                    nombre: 'Miel Pura de Abeja',
                    descripcion: 'Miel 100% natural de flores silvestres, sin procesar',
                    precio: 5800,
                    stock: 12,
                    categoria: 6,
                    categoria_nombre: 'Endulzantes',
                    vendedor_nombre: 'Apicultura Natural',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                },
                {
                    id: 8,
                    nombre: 'Aguacates Hass',
                    descripcion: 'Aguacates cremosos de la variedad Hass, listos para consumir',
                    precio: 3800,
                    stock: 18,
                    categoria: 1,
                    categoria_nombre: 'Frutas',
                    vendedor_nombre: 'Palta Premium',
                    origen: 'convencional',
                    imagen: null,
                    certificado_organico: false
                },
                {
                    id: 9,
                    nombre: 'Espinacas Orgánicas',
                    descripcion: 'Espinacas frescas cultivadas sin pesticidas, ricas en hierro',
                    precio: 1900,
                    stock: 22,
                    categoria: 2,
                    categoria_nombre: 'Verduras',
                    vendedor_nombre: 'Verduras Salud',
                    origen: 'organico',
                    imagen: null,
                    certificado_organico: true
                }
            ];
            setProducts(exampleProducts);
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
            } else {
                throw new Error('Error al cargar categorías');
            }
        } catch (err) {
            console.error('Error cargando categorías:', err);
            // Datos de ejemplo como fallback
            const exampleCategories = [
                { id: 1, nombre: 'Frutas', descripcion: 'Frutas frescas de temporada' },
                { id: 2, nombre: 'Verduras', descripcion: 'Verduras orgánicas y convencionales' },
                { id: 3, nombre: 'Granos', descripcion: 'Granos y cereales nutritivos' },
                { id: 4, nombre: 'Lácteos', descripcion: 'Productos lácteos frescos' },
                { id: 5, nombre: 'Hierbas', descripcion: 'Hierbas aromáticas y medicinales' },
                { id: 6, nombre: 'Endulzantes', descripcion: 'Miel y otros endulzantes naturales' }
            ];
            setCategories(exampleCategories);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product?.vendedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product?.categoria === parseInt(selectedCategory)
            );
        }

        // Filtrar por rango de precio
        filtered = filtered.filter(product =>
            (product.precio || 0) >= priceRange[0] && (product.precio || 0) <= priceRange[1]
        );

        // Filtrar por origen
        if (selectedOrigin) {
            filtered = filtered.filter(product =>
                product?.origen === selectedOrigin
            );
        }

        // Filtrar por stock
        if (inStockOnly) {
            filtered = filtered.filter(product => (product.stock || 0) > 0);
        }

        // Ordenar productos
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

    // Manejo de agregar al carrito con autenticación
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
        showToast(`¡${product.nombre} agregado al carrito!`, 'success');
    };

    // Confirmación rápida de agregar al carrito
    const handleQuickAddToCart = (product) => {
        handleAddToCart(product);
    };

    // Paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        const value = parseInt(e.target.value);
        setPriceRange([0, value]);
    };

    const handleOriginChange = (e) => {
        setSelectedOrigin(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleStockChange = (e) => {
        setInStockOnly(e.target.checked);
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

    const getPriceRangeLabels = () => {
        const ranges = [
            { max: 2000, label: 'Menos de $2.000' },
            { max: 5000, label: 'Menos de $5.000' },
            { max: 10000, label: 'Menos de $10.000' },
            { max: 10000, label: 'Todos los precios' }
        ];
        return ranges.find(range => range.max === priceRange[1])?.label || 'Todos los precios';
    };

    if (loading) {
        return (
            <div className="products-loading">
                <div className="products-spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-error">
                <div className="error-icon">⚠️</div>
                <h3>Error al cargar productos</h3>
                <p>{error}</p>
                <button onClick={loadProducts} className="retry-button">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="products-container">
            {/* Header con título y estadísticas */}
            <div className="products-header">
                <div className="header-content">
                    <h1 className="products-title">Nuestros Productos</h1>
                    <p className="products-subtitle">
                        Descubre la frescura de productos agrícolas seleccionados
                    </p>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{products.length}</span>
                            <span className="stat-label">Productos</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {products.filter(p => p.origen === 'organico').length}
                            </span>
                            <span className="stat-label">Orgánicos</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{categories.length}</span>
                            <span className="stat-label">Categorías</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="search-filters-container">
                <div className="search-section">
                    <div className="search-box">
                        <div className="search-icon">🔍</div>
                        <input
                            type="text"
                            placeholder="Buscar productos, descripción o vendedor..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="filter-toggle"
                    >
                        {showFilters ? '▲' : '▼'} Filtros Avanzados
                    </button>
                </div>

                <div className="quick-controls">
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="sort-select"
                    >
                        <option value="name">Ordenar por: Nombre</option>
                        <option value="price-low">Precio: Menor a Mayor</option>
                        <option value="price-high">Precio: Mayor a Menor</option>
                        <option value="stock">Más Stock</option>
                        <option value="newest">Más Recientes</option>
                    </select>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        🗑️ Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Filtros Avanzados con Animación */}
            {showFilters && (
                <div className="advanced-filters">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">Categoría</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="filter-select"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">
                                Precio Máximo: {formatPrice(priceRange[1])}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="500"
                                value={priceRange[1]}
                                onChange={handlePriceRangeChange}
                                className="price-range"
                            />
                            <div className="range-label">{getPriceRangeLabels()}</div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Tipo de Cultivo</label>
                            <select
                                value={selectedOrigin}
                                onChange={handleOriginChange}
                                className="filter-select"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="organico">🌿 Orgánico</option>
                                <option value="convencional">🏭 Convencional</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Disponibilidad</label>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="inStockOnly"
                                    checked={inStockOnly}
                                    onChange={handleStockChange}
                                    className="filter-checkbox"
                                />
                                <label htmlFor="inStockOnly" className="checkbox-label">
                                    Solo productos en stock
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Información de Resultados */}
            <div className="results-info">
                <p>
                    Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory && ` en ${categories.find(c => c.id === parseInt(selectedCategory))?.nombre}`}
                    {selectedOrigin && ` · ${selectedOrigin === 'organico' ? 'Orgánicos' : 'Convencionales'}`}
                    {inStockOnly && ` · Solo en stock`}
                </p>
            </div>

            {/* Grid de Productos */}
            <div className="products-grid">
                {currentProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            {product.imagen ? (
                                <img
                                    src={`http://localhost:8000${product.imagen}`}
                                    alt={product.nombre}
                                    className="product-img"
                                />
                            ) : (
                                <div className="placeholder-image">
                                    {product.categoria_nombre === 'Frutas' ? '🍎' :
                                        product.categoria_nombre === 'Verduras' ? '🥕' :
                                            product.categoria_nombre === 'Granos' ? '🌾' :
                                                product.categoria_nombre === 'Lácteos' ? '🥛' :
                                                    product.categoria_nombre === 'Hierbas' ? '🌿' : '🌱'}
                                </div>
                            )}

                            {/* Badges */}
                            {product.origen === 'organico' && (
                                <div className="organic-badge">🌿 Orgánico</div>
                            )}
                            {product.certificado_organico && (
                                <div className="certified-badge">✅ Certificado</div>
                            )}
                            {product.stock === 0 && (
                                <div className="out-of-stock-badge">⛔ Agotado</div>
                            )}
                            {product.stock > 0 && product.stock < 10 && (
                                <div className="low-stock-badge">⚠️ Últimas unidades</div>
                            )}
                        </div>

                        <div className="product-info">
                            <h3 className="product-name">{product.nombre}</h3>
                            <p className="product-description">
                                {product.descripcion && product.descripcion.length > 100
                                    ? `${product.descripcion.substring(0, 100)}...`
                                    : product.descripcion}
                            </p>

                            <div className="product-details">
                                <div className="detail-row">
                                    <span className="detail-label">Precio:</span>
                                    <span className="product-price">{formatPrice(product.precio || 0)}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Stock:</span>
                                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Categoría:</span>
                                    <span className="product-category">{product.categoria_nombre}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Vendedor:</span>
                                    <span className="product-vendor">{product.vendedor_nombre}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Origen:</span>
                                    <span className={`origin-type ${product.origen === 'organico' ? 'organic' : 'conventional'}`}>
                                        {product.origen === 'organico' ? 'Orgánico' : 'Convencional'}
                                    </span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock > 0 ? '🛒 Agregar al Carrito' : '❌ Agotado'}
                                </button>
                                <button
                                    onClick={() => navigate(`/producto/${product.id}`)}
                                    className="view-details-btn"
                                >
                                    👁️ Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            ← Anterior
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Siguiente →
                        </button>
                    </div>
                    <div className="pagination-info">
                        Página {currentPage} de {totalPages}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {filteredProducts.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Mostrar Todos los Productos
                    </button>
                </div>
            )}

            {/* Modal de Autenticación */}
            {showAuthModal && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal">
                        <div className="modal-header">
                            <h3>Iniciar Sesión Requerido</h3>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="close-modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>Para agregar productos al carrito, necesitas iniciar sesión.</p>
                            {selectedProduct && (
                                <div className="selected-product-preview">
                                    <strong>Producto seleccionado:</strong>
                                    <p>{selectedProduct.nombre} - {formatPrice(selectedProduct.precio)}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => navigate('/login')}
                                className="login-btn"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="register-btn"
                            >
                                Crear Cuenta
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Container de Notificaciones */}
            <div className="toast-container">
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