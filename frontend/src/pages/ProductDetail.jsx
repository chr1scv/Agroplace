import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ReviewSystem from '../components/ReviewSystem';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
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
                    ciudad: productData.ciudad || 'Desconocida',
                    comuna: productData.comuna || 'Desconocida',
                    vendedor_info: 'Más de 10 años cultivando productos orgánicos de la más alta calidad.',
                    vendedor_foto: productData.vendedor_foto || null, 
                    origen: productData.origen,
                    certificado_organico: productData.certificado_organico,
                    imagenes: productData.imagen ? [`http://localhost:8000${productData.imagen}`] : [null],
                    beneficios: [
                        '🌿 100% Orgánico certificado',
                        '🚚 Envío gratis en compras sobre $50.000',
                        '💰 Precio directo del productor',
                        '✅ Garantía de frescura'
                    ]
                };
                setProduct(formattedProduct);
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

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        alert(`${quantity} ${product.nombre} agregado(s) al carrito`);
    };

    // Función para "Comprar Ahora"
    const handleBuyNow = () => {
        if (product.stock === 0) return;

        // 1. Agrega el producto al carrito (similar a handleAddToCart)
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        
        // 2. Redirige al usuario a la página de Checkout/Pago
        navigate('/checkout'); // *** Asegúrate de que esta ruta sea correcta ***
    };


    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}>🔄</div>
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={styles.error}>
                <p>{error || 'Producto no encontrado'}</p>
                <button onClick={() => navigate('/productos')} style={styles.backButton}>
                    ← Volver a Productos
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
                <button onClick={() => navigate('/productos')} style={styles.breadcrumbLink}>
                    Productos
                </button>
                <span style={styles.breadcrumbSeparator}>/</span>
                <span style={styles.breadcrumbCurrent}>{product.nombre}</span>
            </div>

            <div style={styles.productContent}>
                {/* Imagen + Beneficios */}
                <div style={styles.imageSection}>
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

                    {product.imagenes.length > 1 && (
                        <div style={styles.imageThumbnails}>
                            {product.imagenes.map((imagen, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.thumbnail,
                                        ...(selectedImage === index ? styles.thumbnailActive : {})
                                    }}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    {imagen ? (
                                        <img 
                                            src={imagen} 
                                            alt={`${product.nombre} ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={styles.thumbnailPlaceholder}>
                                            {product.categoria_nombre === 'Frutas' ? '🍎' : 
                                             product.categoria_nombre === 'Verduras' ? '🥕' : '🌱'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Beneficios debajo de la imagen */}
                    <div style={styles.benefits}>
                        {product.beneficios.map((benefit, index) => (
                            <div key={index} style={styles.benefitItem}>{benefit}</div>
                        ))}
                    </div>
                </div>

                {/* Información del Producto */}
                <div style={styles.infoSection}>
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

                    {/* Vendedor Destacado - ESTILO PROFESIONAL IOS */}
                    <div style={styles.vendorCard}>
                        <h3 style={styles.vendorCardTitle}>Vendido por:</h3>
                        <div style={styles.vendorCardDetails}>
                            {/* Columna Izquierda: Foto y Rating/Badge */}
                            <div style={styles.vendorCardProfile}>
                                <div style={styles.vendorCardImageWrapper}>
                                    {product.vendedor_foto ? (
                                        <img 
                                            src={product.vendedor_foto} 
                                            alt={product.vendedor_nombre} 
                                            style={styles.vendorCardImage} 
                                        />
                                    ) : (
                                        <div style={styles.vendorPlaceholderIcon}>
                                            🧑‍🌾
                                        </div>
                                    )}
                                </div>
                                <div style={styles.vendorCardRating}>
                                    <span style={styles.ratingStars}>★★★★☆</span> 
                                    <span style={styles.ratingNumber}>(4.5)</span>
                                </div>
                            </div>
                    
                            {/* Columna Derecha: Información del vendedor */}
                            <div style={styles.vendorCardText}>
                                <p style={styles.vendorCardName}>{product.vendedor_nombre}</p>
                                
                                <div style={styles.vendorCardBadge}>
                                    <span style={styles.vendorBadgeIcon}>✓</span> Vendedor Verificado
                                </div>

                                <div style={styles.vendorCardLocation}>
                                    <span style={styles.locationIcon}>📍</span>
                                    {product.ciudad}, {product.comuna}
                                </div>
                                <p style={styles.vendorCardDescription}>{product.vendedor_info}</p>
                            </div>
                        </div>
                        <button style={styles.viewVendorButton}>
                            Ver perfil del vendedor <span style={styles.viewVendorIcon}>›</span>
                        </button>
                    </div>


                    <div style={styles.description}>
                        <h3 style={styles.sectionTitle}>Descripción</h3>
                        <p style={styles.descriptionText}>{product.descripcion}</p>
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
                                style={product.stock > 0 ? styles.addToCartButton : styles.disabledButton}
                            >
                                🛒 Agregar al Carrito - {formatPrice(product.precio * quantity)}
                            </button>
                            <button 
                                onClick={handleBuyNow} // AHORA REDIRIGE AL CHECKOUT
                                disabled={product.stock === 0}
                                style={product.stock > 0 ? styles.buyNowButton : styles.disabledButton}
                            >
                                ⚡ Comprar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sistema de Reseñas */}
            <ReviewSystem productId={product.id} productName={product.nombre} />
        </div>
    );
};

// =========================================================================
// === ESTILOS CSS-IN-JS (Estilo E-commerce iOS Compacto) ==================
// =========================================================================
const styles = {
    // --- Estilos Base y Layout ---
    container: { maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
    breadcrumb: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#666' },
    breadcrumbLink: { backgroundColor: 'transparent', border: 'none', color: '#007AFF', cursor: 'pointer', textDecoration: 'none' },
    breadcrumbSeparator: { color: '#999' },
    breadcrumbCurrent: { color: '#333', fontWeight: '500' },
    productContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' },
    infoSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },

    // --- Tipografía y Títulos ---
    productName: { fontSize: '2rem', color: '#1c1c1e', margin: '0', lineHeight: '1.2', fontWeight: '700' }, 
    sectionTitle: { fontSize: '1.1rem', color: '#1c1c1e', margin: '0 0 0.8rem 0', fontWeight: '600' }, 
    descriptionText: { color: '#48484a', lineHeight: '1.5', margin: '0', fontSize: '0.9rem' }, 

    // --- Precios e Stock ---
    priceSection: { display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.5rem' },
    price: { fontSize: '2.2rem', fontWeight: 'bold', color: '#2d5016' }, 
    unit: { color: '#666', fontSize: '0.9rem' },
    stockInfo: { fontSize: '0.95rem', fontWeight: '500' },
    inStock: { color: '#4caf50' },
    outOfStock: { color: '#f44336' },
    
    // --- Imágenes y Beneficios ---
    imageSection: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
    mainImage: { width: '100%', height: '350px', backgroundColor: '#f8f9fa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }, 
    placeholderImage: { fontSize: '7rem', opacity: 0.7 },
    organicBadge: { position: 'absolute', top: '0.8rem', right: '0.8rem', backgroundColor: '#2d5016', color: 'white', padding: '6px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold' },
    imageThumbnails: { display: 'flex', gap: '0.4rem', justifyContent: 'center' },
    thumbnail: { width: '50px', height: '50px', borderRadius: '6px', backgroundColor: '#f8f9fa', cursor: 'pointer', border: '2px solid transparent', overflow: 'hidden' },
    thumbnailActive: { borderColor: '#2d5016' },
    thumbnailPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: 0.7 },
    
    benefits: { backgroundColor: '#f2f2f7', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    benefitItem: { padding: '0', color: '#1c1c1e', fontWeight: '500', fontSize: '0.9rem' },

    // --- 🍏 ESTILOS DE VENDEDOR COMPACTO ---
    vendorCard: { 
        backgroundColor: 'white', 
        padding: '1rem', 
        borderRadius: '10px', 
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '1rem' 
    },
    vendorCardTitle: { 
        fontSize: '0.9rem', 
        color: '#8e8e93',
        marginBottom: '0.7rem', 
        fontWeight: '500',
    },
    vendorCardDetails: { 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '1rem',
        marginBottom: '0.8rem' 
    },
    vendorCardProfile: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.4rem',
        minWidth: '60px'
    },
    vendorCardImageWrapper: {
        width: '56px',
        height: '56px',
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
        fontSize: '1.8rem',
    },
    vendorCardRating: { 
        fontSize: '0.8rem', 
        color: '#FFD60A',
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.2rem'
    },
    ratingStars: { 
        letterSpacing: '0.5px' 
    },
    ratingNumber: { 
        fontSize: '0.75rem', 
        color: '#48484a' 
    },
    vendorCardText: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.2rem',
        flexGrow: 1
    },
    vendorCardName: { 
        fontWeight: '600', 
        fontSize: '1rem', 
        color: '#1c1c1e',
        margin: '0',
    },
    vendorCardBadge: { 
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        backgroundColor: '#007AFF',
        color: 'white', 
        fontSize: '0.7rem', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        fontWeight: '500',
        width: 'fit-content' 
    },
    vendorCardLocation: { 
        fontSize: '0.85rem', 
        color: '#666',
        marginTop: '0.2rem'
    },
    locationIcon: { 
        marginRight: '0.3rem' 
    },
    vendorCardDescription: { 
        fontSize: '0.85rem', 
        color: '#48484a', 
        lineHeight: '1.3',
        marginTop: '0.4rem'
    },
    viewVendorButton: {
        backgroundColor: '#f2f2f7', 
        color: '#007AFF',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '0.9rem',
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
        fontSize: '1.1rem',
        marginLeft: '5px'
    },

    // --- 🛒 Estilos de Compra Compactos ---
    purchaseSection: { 
        backgroundColor: 'white', 
        padding: '1.2rem', 
        borderRadius: '12px', 
        border: '1px solid #e0e0e0', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
    },
    quantitySelector: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1.2rem'
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
        borderRadius: '8px', 
        overflow: 'hidden', 
        height: '36px' 
    },
    quantityButton: { 
        width: '36px', 
        height: '100%', 
        border: 'none', 
        backgroundColor: '#f8f8f8', 
        cursor: 'pointer', 
        fontSize: '1.1rem', 
        fontWeight: '500', 
        color: '#007AFF',
        transition: 'background-color 0.2s',
    },
    quantity: { 
        minWidth: '40px', 
        textAlign: 'center', 
        fontWeight: '600', 
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityUnit: { 
        color: '#666', 
        fontSize: '0.85rem',
        marginLeft: '0.5rem'
    },
    actionButtons: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.7rem' 
    },
    addToCartButton: { 
        backgroundColor: '#2d5016', 
        color: 'white', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '8px', 
        fontSize: '1rem', 
        fontWeight: '700', 
        cursor: 'pointer', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    buyNowButton: { 
        backgroundColor: '#1c1c1e', 
        color: 'white', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '8px', 
        fontSize: '1rem', 
        fontWeight: '700', 
        cursor: 'pointer',
    },
    disabledButton: { 
        backgroundColor: '#d1d1d6', 
        color: '#a1a1a6', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '8px', 
        fontSize: '1rem', 
        fontWeight: '700', 
        cursor: 'not-allowed'
    },

    // --- Estilos de Estado ---
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

export default ProductDetail;