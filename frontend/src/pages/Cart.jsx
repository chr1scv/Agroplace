import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import HeaderCliente from '../pages/cliente/HeaderCliente';

const Cart = () => {
    const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, getVendorGroups } = useCart();
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedVendorId, setSelectedVendorId] = useState(null);

    // Constante de IVA (19% en Chile)
    const IVA_RATE = 0.19;

    // Umbral para envío gratis
    const SHIPPING_THRESHOLD = 19000;

    // Función para formatear precios en CLP
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Calcular subtotal sin IVA
    const getSubtotal = () => {
        return getCartTotal() / (1 + IVA_RATE);
    };

    // Calcular IVA
    const getIVA = () => {
        return getSubtotal() * IVA_RATE;
    };

    // Calcular progreso hacia envío gratis
    const getShippingProgress = () => {
        const total = getCartTotal();
        const percentage = Math.min((total / SHIPPING_THRESHOLD) * 100, 100);
        const remaining = Math.max(SHIPPING_THRESHOLD - total, 0);
        return { percentage, remaining, hasShipping: total >= SHIPPING_THRESHOLD };
    };

    // Calcular total de items seleccionados
    const getSelectedTotal = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = items.find(i => i.id === itemId);
            return total + ((item?.precio || 0) * item.quantity);
        }, 0);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleItemSelect = (itemId, vendorId) => {
        // Si no hay vendedor seleccionado, seleccionar este vendedor
        if (selectedVendorId === null) {
            setSelectedVendorId(vendorId);
            setSelectedItems([itemId]);
            return;
        }

        // Si el vendedor es diferente al seleccionado, mostrar error
        if (selectedVendorId !== vendorId) {
            alert('⚠️ Solo puedes seleccionar productos de un mismo vendedor a la vez.\n\nPor favor, deselecciona los productos actuales o procede al checkout con el vendedor actual.');
            return;
        }

        // Toggle selection del item
        if (selectedItems.includes(itemId)) {
            const newSelected = selectedItems.filter(id => id !== itemId);
            setSelectedItems(newSelected);
            // Si no quedan items seleccionados, resetear vendedor
            if (newSelected.length === 0) {
                setSelectedVendorId(null);
            }
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    // Manejar selección de todos los productos de un vendedor
    const handleVendorSelectAll = (vendorGroup) => {
        const vendorItemIds = vendorGroup.items.map(item => item.id);
        const allSelected = vendorItemIds.every(id => selectedItems.includes(id));

        if (allSelected) {
            // Deseleccionar todos
            setSelectedItems([]);
            setSelectedVendorId(null);
        } else {
            // Si hay un vendedor diferente seleccionado, mostrar error
            if (selectedVendorId !== null && selectedVendorId !== vendorGroup.vendorId) {
                alert('⚠️ Solo puedes seleccionar productos de un mismo vendedor a la vez.\n\nPor favor, deselecciona los productos actuales primero.');
                return;
            }
            // Seleccionar todos
            setSelectedVendorId(vendorGroup.vendorId);
            setSelectedItems(vendorItemIds);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Por favor selecciona al menos un producto para continuar');
            return;
        }
        navigate(`/checkout?vendor=${selectedVendorId}&items=${selectedItems.join(',')}`);
    };

    // Obtener grupos de vendedores
    const vendorGroups = getVendorGroups();

    // Debug: Mostrar información de agrupación
    console.log('Vendor Groups:', vendorGroups);
    console.log('Items:', items);

    if (items.length === 0) {
        return (
            <div>
                <HeaderCliente />
                <div style={styles.container}>
                    <div style={styles.emptyCart}>
                        <div style={styles.emptyIcon}>🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega algunos productos frescos a tu carrito</p>
                        <Link to="/productos" style={styles.continueShopping}>
                            ← Continuar Comprando
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const shippingProgress = getShippingProgress();

    return (
        <div>
            <HeaderCliente />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Mi Carrito de Compras</h1>
                    <p style={styles.subtitle}>Selecciona los productos que deseas comprar</p>
                </div>

                <div style={styles.cartContent}>
                    <div style={styles.itemsSection}>
                        <div style={styles.cartHeader}>
                            <h3>Productos ({items.length})</h3>
                            <button onClick={clearCart} style={styles.clearButton}>
                                Vaciar Carrito
                            </button>
                        </div>

                        {vendorGroups.map((vendorGroup) => {
                            const vendorItemIds = vendorGroup.items.map(item => item.id);
                            const allVendorItemsSelected = vendorItemIds.every(id => selectedItems.includes(id));
                            const someVendorItemsSelected = vendorItemIds.some(id => selectedItems.includes(id));

                            return (
                                <div key={vendorGroup.vendorId} style={styles.vendorGroup}>
                                    {/* Header del Vendedor con Checkbox Maestro */}
                                    <div style={styles.vendorHeader}>
                                        <div style={styles.vendorInfo}>
                                            <input
                                                type="checkbox"
                                                checked={allVendorItemsSelected}
                                                ref={input => {
                                                    if (input) {
                                                        input.indeterminate = someVendorItemsSelected && !allVendorItemsSelected;
                                                    }
                                                }}
                                                onChange={() => handleVendorSelectAll(vendorGroup)}
                                                style={styles.vendorCheckbox}
                                            />
                                            <div style={styles.vendorIcon}>🏪</div>
                                            <div>
                                                <h4 style={styles.vendorName}>{vendorGroup.vendorName}</h4>
                                                <p style={styles.vendorItemCount}>
                                                    {vendorGroup.items.length} producto{vendorGroup.items.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={styles.vendorTotal}>
                                            <span style={styles.vendorTotalLabel}>Total:</span>
                                            <span style={styles.vendorTotalAmount}>{formatPrice(vendorGroup.total)}</span>
                                        </div>
                                    </div>

                                    {/* Productos del Vendedor */}
                                    {vendorGroup.items.map(item => {
                                        const isSelected = selectedItems.includes(item.id);
                                        const isFromSelectedVendor = selectedVendorId === null || selectedVendorId === vendorGroup.vendorId;

                                        return (
                                            <div
                                                key={item.id}
                                                style={{
                                                    ...styles.cartItem,
                                                    ...(isSelected ? styles.cartItemSelected : {}),
                                                    ...((!isFromSelectedVendor) ? styles.cartItemDisabled : {})
                                                }}
                                            >
                                                {/* Checkbox */}
                                                <div style={styles.checkboxContainer}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleItemSelect(item.id, vendorGroup.vendorId)}
                                                        style={styles.checkbox}
                                                    />
                                                </div>

                                                <div style={styles.itemImage}>
                                                    {item.imagen ? (
                                                        <img
                                                            src={`http://localhost:8000${item.imagen}`}
                                                            alt={item.nombre}
                                                            style={styles.productImage}
                                                        />
                                                    ) : (
                                                        <div style={styles.placeholderImage}>
                                                            {item.categoria_nombre === 'Frutas' ? '🍎' :
                                                                item.categoria_nombre === 'Verduras' ? '🥕' :
                                                                    item.categoria_nombre === 'Granos' ? '🌾' : '🌱'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={styles.itemDetails}>
                                                    <h4 style={styles.itemName}>{item.nombre}</h4>
                                                    <p style={styles.itemDescription}>{item.descripcion}</p>
                                                    <div style={styles.itemMeta}>
                                                        {item.origen === 'organico' && (
                                                            <span style={styles.organicTag}>Orgánico</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={styles.itemPrice}>
                                                    <span style={styles.price}>{formatPrice(item.precio || 0)}</span>
                                                </div>

                                                <div style={styles.itemQuantity}>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        style={styles.quantityButton}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={styles.quantity}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        style={styles.quantityButton}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div style={styles.itemTotal}>
                                                    <span style={styles.total}>{formatPrice((item.precio || 0) * item.quantity)}</span>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    style={styles.removeButton}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div style={styles.summarySection}>
                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>Resumen del Pedido</h3>

                            {selectedItems.length > 0 && (
                                <div style={styles.selectedInfo}>
                                    <p style={styles.selectedText}>
                                        ✓ {selectedItems.length} producto{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}

                            {/* Barra de Progreso para Envío Gratis */}
                            <div style={styles.shippingProgress}>
                                <div style={styles.progressHeader}>
                                    {shippingProgress.hasShipping ? (
                                        <span style={styles.progressTextSuccess}>
                                            ¡Envío gratis habilitado! 🎉
                                        </span>
                                    ) : (
                                        <span style={styles.progressText}>
                                            Te faltan {formatPrice(shippingProgress.remaining)} para envío gratis
                                        </span>
                                    )}
                                </div>
                                <div style={styles.progressBarContainer}>
                                    <div
                                        style={{
                                            ...styles.progressBarFill,
                                            width: `${shippingProgress.percentage}%`,
                                            backgroundColor: shippingProgress.hasShipping ? '#4caf50' : '#4a7c1f'
                                        }}
                                    ></div>
                                </div>
                                <div style={styles.progressFooter}>
                                    <span style={styles.progressAmount}>{formatPrice(getCartTotal())}</span>
                                    <span style={styles.progressGoal}>{formatPrice(SHIPPING_THRESHOLD)}</span>
                                </div>
                            </div>

                            <div style={styles.summaryDivider}></div>

                            <div style={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>{formatPrice(getSubtotal())}</span>
                            </div>

                            <div style={styles.summaryRow}>
                                <span>IVA (19%):</span>
                                <span>{formatPrice(getIVA())}</span>
                            </div>

                            <div style={styles.summaryDivider}></div>

                            <div style={styles.totalRow}>
                                <span><strong>Total:</strong></span>
                                <span><strong>{formatPrice(getCartTotal())}</strong></span>
                            </div>

                            {selectedItems.length > 0 && (
                                <>
                                    <div style={styles.summaryDivider}></div>
                                    <div style={styles.selectedTotalRow}>
                                        <span><strong>Total Seleccionado:</strong></span>
                                        <span style={styles.selectedTotalAmount}><strong>{formatPrice(getSelectedTotal())}</strong></span>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={handleCheckout}
                                style={{
                                    ...styles.checkoutButton,
                                    ...(selectedItems.length === 0 ? styles.checkoutButtonDisabled : {})
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                {selectedItems.length > 0
                                    ? `Proceder al Checkout (${selectedItems.length} producto${selectedItems.length !== 1 ? 's' : ''})`
                                    : 'Selecciona productos para continuar'
                                }
                            </button>

                            <div style={styles.infoNote}>
                                💡 Selecciona los productos que deseas comprar. Solo puedes seleccionar productos de un mismo vendedor.
                            </div>

                            <Link to="/productos" style={styles.continueLink}>
                                ← Continuar Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    continueShopping: {
        display: 'inline-block',
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '1rem',
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start',
    },
    itemsSection: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '1.5rem',
    },
    vendorGroup: {
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
    },
    vendorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    vendorInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    vendorCheckbox: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
    },
    vendorIcon: {
        fontSize: '1.5rem',
    },
    vendorName: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        margin: 0,
    },
    vendorItemCount: {
        fontSize: '0.75rem',
        color: '#666',
        margin: '0.15rem 0 0 0',
    },
    vendorTotal: {
        textAlign: 'right',
    },
    vendorTotalLabel: {
        display: 'block',
        fontSize: '0.75rem',
        color: '#666',
        marginBottom: '0.15rem',
    },
    vendorTotalAmount: {
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    cartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f0f0f0',
    },
    clearButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: '40px 80px 1fr auto auto auto auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '0.5rem',
        backgroundColor: 'white',
        transition: 'all 0.2s',
    },
    cartItemSelected: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
    },
    cartItemDisabled: {
        opacity: 0.5,
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholderImage: {
        fontSize: '2rem',
        opacity: 0.7,
    },
    itemDetails: {
        minWidth: 0,
    },
    itemName: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.25rem',
    },
    itemDescription: {
        color: '#666',
        fontSize: '0.85rem',
        marginBottom: '0.25rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    itemMeta: {
        display: 'flex',
        gap: '0.5rem',
        fontSize: '0.75rem',
    },
    organicTag: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    itemPrice: {
        textAlign: 'center',
    },
    price: {
        fontWeight: 'bold',
        color: '#2d5016',
        fontSize: '1rem',
    },
    itemQuantity: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    quantityButton: {
        width: '28px',
        height: '28px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    quantity: {
        minWidth: '25px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    itemTotal: {
        textAlign: 'center',
    },
    total: {
        fontWeight: 'bold',
        color: '#2d5016',
        fontSize: '1rem',
    },
    removeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.3rem',
        color: '#dc3545',
        fontWeight: 'bold',
    },
    summarySection: {
        position: 'sticky',
        top: '2rem',
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '1.5rem',
    },
    summaryTitle: {
        fontSize: '1.3rem',
        color: '#2d5016',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    selectedInfo: {
        backgroundColor: '#e8f5e9',
        padding: '0.75rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    selectedText: {
        color: '#2d5016',
        fontWeight: 'bold',
        margin: 0,
        fontSize: '0.9rem',
    },
    shippingProgress: {
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    progressHeader: {
        marginBottom: '0.75rem',
        textAlign: 'center',
    },
    progressText: {
        fontSize: '0.9rem',
        color: '#666',
        fontWeight: '500',
    },
    progressTextSuccess: {
        fontSize: '0.9rem',
        color: '#4caf50',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '0.5rem',
    },
    progressBarFill: {
        height: '100%',
        transition: 'width 0.3s ease, background-color 0.3s ease',
        borderRadius: '4px',
    },
    progressFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#999',
    },
    progressAmount: {
        fontWeight: 'bold',
        color: '#4a7c1f',
    },
    progressGoal: {
        fontWeight: '500',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: '#666',
    },
    summaryDivider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        margin: '1rem 0',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.2rem',
        marginBottom: '1rem',
    },
    selectedTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.1rem',
        marginBottom: '1.5rem',
    },
    selectedTotalAmount: {
        color: '#4caf50',
    },
    checkoutButton: {
        width: '100%',
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '1rem',
        transition: 'background-color 0.2s',
    },
    checkoutButtonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    infoNote: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '0.75rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        marginBottom: '1rem',
        textAlign: 'center',
        lineHeight: '1.4',
    },
    continueLink: {
        display: 'block',
        textAlign: 'center',
        color: '#4a7c1f',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Cart;