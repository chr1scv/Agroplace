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

    // Función para formatear precios en CLP
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
        
        // CONECTAR CON LA API REAL DE DJANGO
        const response = await fetch(`http://localhost:8000/api/productos/${id}/`);
        
        if (response.ok) {
            const productData = await response.json();
            
            // Formatear los datos de la API al formato que espera el componente
            const formattedProduct = {
                id: productData.id,
                nombre: productData.nombre,
                descripcion: productData.descripcion,
                precio: parseFloat(productData.precio),
                stock: productData.stock,
                categoria: productData.categoria,
                categoria_nombre: productData.categoria_nombre,
                vendedor_nombre: productData.vendedor_nombre,
                vendedor_info: 'Más de 10 años cultivando productos orgánicos de la más alta calidad.',
                origen: productData.origen,
                certificado_organico: productData.certificado_organico,
                // CORRECCIÓN: Convertir URL relativa a absoluta
                imagenes: productData.imagen ? [`http://localhost:8000${productData.imagen}`] : [null],
                especificaciones: {
                    'Tipo': productData.origen === 'organico' ? 'Orgánico' : 'Convencional',
                    'Origen': 'Región Metropolitana',
                    'Cosecha': 'Temporada Actual',
                    'Conservación': 'Refrigerar',
                    'Vida Útil': '2 semanas'
                },
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
        
        // Mantener datos de ejemplo como fallback
        const exampleProduct = {
            // ... datos de ejemplo
        };
        setProduct(exampleProduct);
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
            {/* Navegación */}
            <div style={styles.breadcrumb}>
                <button onClick={() => navigate('/productos')} style={styles.breadcrumbLink}>
                    Productos
                </button>
                <span style={styles.breadcrumbSeparator}>/</span>
                <span style={styles.breadcrumbCurrent}>{product.nombre}</span>
            </div>

            <div style={styles.productContent}>
                {/* Galería de Imágenes */}
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
                </div>

                {/* Información del Producto */}
                <div style={styles.infoSection}>
                    <h1 style={styles.productName}>{product.nombre}</h1>
                    
                    <div style={styles.ratingOverview}>
                        <div style={styles.stars}>★★★★☆</div>
                        <span style={styles.ratingText}>(4.2 · 15 reseñas)</span>
                    </div>

                    <div style={styles.priceSection}>
                        <span style={styles.price}>{formatPrice(product.precio)}</span>
                        <span style={styles.unit}>/kg</span>
                    </div>

                    <div style={styles.stockInfo}>
                        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                            {product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Agotado'}
                        </span>
                    </div>

                    <div style={styles.vendorInfo}>
                        <h3 style={styles.vendorTitle}>Vendedor</h3>
                        <div style={styles.vendorDetails}>
                            <span style={styles.vendorName}>{product.vendedor_nombre}</span>
                            <span style={styles.vendorDescription}>{product.vendedor_info}</span>
                        </div>
                    </div>

                    <div style={styles.description}>
                        <h3 style={styles.sectionTitle}>Descripción</h3>
                        <p style={styles.descriptionText}>{product.descripcion}</p>
                    </div>

                    {/* Especificaciones */}
                    <div style={styles.specifications}>
                        <h3 style={styles.sectionTitle}>Especificaciones</h3>
                        <div style={styles.specsGrid}>
                            {Object.entries(product.especificaciones).map(([key, value]) => (
                                <div key={key} style={styles.specItem}>
                                    <span style={styles.specKey}>{key}:</span>
                                    <span style={styles.specValue}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Beneficios */}
                    <div style={styles.benefits}>
                        <h3 style={styles.sectionTitle}>Beneficios</h3>
                        <div style={styles.benefitsList}>
                            {product.beneficios.map((benefit, index) => (
                                <div key={index} style={styles.benefitItem}>
                                    {benefit}
                                </div>
                            ))}
                        </div>
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
                                    -
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
                            <button style={styles.buyNowButton}>
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

// Los estilos se mantienen iguales...
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: '100vh',
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
        fontSize: '0.9rem',
        color: '#666',
    },
    breadcrumbLink: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4a7c1f',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    breadcrumbSeparator: {
        color: '#999',
    },
    breadcrumbCurrent: {
        color: '#333',
        fontWeight: '500',
    },
    productContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem',
    },
    // Sección de Imágenes
    imageSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
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
        overflow: 'hidden',
    },
    placeholderImage: {
        fontSize: '8rem',
        opacity: 0.7,
    },
    organicBadge: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    imageThumbnails: {
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
    },
    thumbnail: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        border: '2px solid transparent',
        overflow: 'hidden',
    },
    thumbnailActive: {
        borderColor: '#4a7c1f',
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        opacity: 0.7,
    },
    // Sección de Información
    infoSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    productName: {
        fontSize: '2.2rem',
        color: '#2d5016',
        margin: '0',
        lineHeight: '1.2',
    },
    ratingOverview: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    stars: {
        fontSize: '1.2rem',
        color: '#ffc107',
    },
    ratingText: {
        color: '#666',
        fontSize: '0.9rem',
    },
    priceSection: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem',
    },
    price: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    unit: {
        color: '#666',
        fontSize: '1rem',
    },
    stockInfo: {
        fontSize: '1rem',
        fontWeight: '500',
    },
    inStock: {
        color: '#4caf50',
    },
    outOfStock: {
        color: '#f44336',
    },
    vendorInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    vendorTitle: {
        fontSize: '1.1rem',
        color: '#2d5016',
        margin: '0 0 0.5rem 0',
    },
    vendorDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    vendorName: {
        fontWeight: 'bold',
        color: '#333',
    },
    vendorDescription: {
        color: '#666',
        fontSize: '0.9rem',
    },
    description: {
        lineHeight: '1.6',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#2d5016',
        margin: '0 0 1rem 0',
    },
    descriptionText: {
        color: '#333',
        lineHeight: '1.6',
        margin: '0',
    },
    specifications: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
    },
    specsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
    },
    specItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    specKey: {
        fontWeight: '600',
        color: '#333',
    },
    specValue: {
        color: '#666',
    },
    benefits: {
        backgroundColor: '#e8f5e8',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #4caf50',
    },
    benefitsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    benefitItem: {
        padding: '0.5rem 0',
        color: '#2d5016',
        fontWeight: '500',
    },
    // Sección de Compra
    purchaseSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '2px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    quantitySelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
    },
    quantityLabel: {
        fontWeight: '600',
        color: '#333',
        fontSize: '1rem',
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '0.25rem',
    },
    quantityButton: {
        width: '35px',
        height: '35px',
        border: 'none',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        minWidth: '40px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },
    quantityUnit: {
        color: '#666',
        fontSize: '0.9rem',
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    addToCartButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        color: '#666',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'not-allowed',
    },
    buyNowButton: {
        backgroundColor: '#ff6b35',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    // Estados
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
    error: {
        textAlign: 'center',
        padding: '2rem',
        color: '#d32f2f',
    },
    backButton: {
        backgroundColor: '#2d5016',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '1rem',
    },
};

export default ProductDetail;