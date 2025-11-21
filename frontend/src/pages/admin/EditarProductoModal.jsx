import React, { useState, useEffect } from 'react';

const EditarProductoModal = ({ producto, categorias, onClose, onSave, formatPrice }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        origen: 'convencional',
        activo: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
                categoria: producto.categoria?.id || producto.categoria || '',
                origen: producto.origen || 'convencional',
                activo: producto.activo !== undefined ? producto.activo : true,
            });
        }
    }, [producto]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del producto es requerido';
        }
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }
        if (!formData.precio || parseFloat(formData.precio) <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
        }
        if (!formData.categoria) {
            newErrors.categoria = 'Debes seleccionar una categoría';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                categoria: parseInt(formData.categoria),
            };
            await onSave(producto.id, dataToSend);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!producto) return null;

    return (
        <>
            <div style={styles.overlay} onClick={onClose}></div>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>
                    <div>
                        <h2 style={styles.modalTitle}>Editar Producto</h2>
                        <p style={styles.modalSubtitle}>Modifica la información del producto</p>
                    </div>
                    <button onClick={onClose} style={styles.closeButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div style={styles.modalBody}>
                    {/* Información del Producto */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            Información del Producto
                        </h3>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre del Producto *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                style={errors.nombre ? styles.inputError : styles.input}
                                placeholder="Ej: Tomates Cherry Orgánicos"
                            />
                            {errors.nombre && <span style={styles.errorText}>{errors.nombre}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Descripción *</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                style={errors.descripcion ? styles.textareaError : styles.textarea}
                                placeholder="Describe tu producto..."
                                rows="3"
                            />
                            {errors.descripcion && <span style={styles.errorText}>{errors.descripcion}</span>}
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Categoría *</label>
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    style={errors.categoria ? styles.selectError : styles.select}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias && categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                                {errors.categoria && <span style={styles.errorText}>{errors.categoria}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tipo de Origen</label>
                                <select
                                    name="origen"
                                    value={formData.origen}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    <option value="organico">Orgánico</option>
                                    <option value="convencional">Convencional</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Precio y Stock */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Precio y Disponibilidad
                        </h3>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Precio (CLP) *</label>
                                <div style={styles.inputWithIcon}>
                                    <span style={styles.inputIcon}>$</span>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        style={errors.precio ? styles.inputWithPrefixError : styles.inputWithPrefix}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                {errors.precio && <span style={styles.errorText}>{errors.precio}</span>}
                                {formData.precio && !errors.precio && (
                                    <div style={styles.pricePreview}>Vista previa: {formatPrice(formData.precio)}</div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Stock Disponible *</label>
                                <div style={styles.inputWithIcon}>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        style={errors.stock ? styles.inputError : styles.input}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                {errors.stock && <span style={styles.errorText}>{errors.stock}</span>}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div style={styles.stockIndicator}>
                            {parseInt(formData.stock) === 0 ? (
                                <div style={styles.stockAlert}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    <span>Sin stock - Producto no visible</span>
                                </div>
                            ) : parseInt(formData.stock) < 10 ? (
                                <div style={styles.stockWarning}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                    <span>Stock bajo</span>
                                </div>
                            ) : (
                                <div style={styles.stockGood}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span>Stock disponible</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estado */}
                    <div style={styles.section}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            <div style={styles.checkboxText}>
                                <span style={styles.checkboxTitle}>Producto Activo</span>
                                <span style={styles.checkboxDescription}>
                                    {formData.activo ? 'Visible para compra' : 'Oculto'}
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer con botones - SIEMPRE VISIBLE */}
                <div style={styles.modalFooter}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={styles.cancelButton}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={loading ? styles.saveButtonDisabled : styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }}>
                                    <line x1="12" y1="2" x2="12" y2="6" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                    <line x1="2" y1="12" x2="6" y2="12" />
                                    <line x1="18" y1="12" x2="22" y2="12" />
                                </svg>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translate(-50%, -45%); opacity: 0; }
                        to { transform: translate(-50%, -50%); opacity: 1; }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998,
        animation: 'fadeIn 0.3s ease',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(26, 31, 46, 0.98)',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '85vh',
        zIndex: 9999,
        border: '1px solid rgba(45, 122, 62, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
    },
    modalHeader: {
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1))',
        flexShrink: 0,
    },
    modalTitle: {
        fontSize: '1.35rem',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.25rem',
    },
    modalSubtitle: {
        color: '#9ca3af',
        fontSize: '0.85rem',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        padding: '1.5rem',
        overflowY: 'auto',
        flex: 1,
        minHeight: 0,
    },
    section: {
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#f9fafb',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        marginBottom: '1rem',
    },
    label: {
        color: '#d1d5db',
        fontWeight: '500',
        fontSize: '0.85rem',
    },
    input: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
    },
    inputError: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
    },
    textarea: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        minHeight: '70px',
    },
    textareaError: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        minHeight: '70px',
    },
    select: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none',
    },
    selectError: {
        padding: '10px 14px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none',
    },
    inputWithIcon: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        color: '#9ca3af',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        pointerEvents: 'none',
    },
    inputWithPrefix: {
        padding: '10px 14px 10px 32px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
    },
    inputWithPrefixError: {
        padding: '10px 14px 10px 32px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
    },
    pricePreview: {
        fontSize: '0.8rem',
        color: '#2d7a3e',
        fontWeight: '600',
    },
    stockIndicator: {
        marginTop: '0.75rem',
        padding: '0.75rem',
        borderRadius: '8px',
        background: 'rgba(15, 20, 25, 0.5)',
    },
    stockAlert: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#ef4444',
        fontSize: '0.85rem',
    },
    stockWarning: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#f59e0b',
        fontSize: '0.85rem',
    },
    stockGood: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#10b981',
        fontSize: '0.85rem',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(15, 20, 25, 0.5)',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#2d7a3e',
        marginTop: '2px',
    },
    checkboxText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
    },
    checkboxTitle: {
        color: '#f9fafb',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    checkboxDescription: {
        color: '#9ca3af',
        fontSize: '0.8rem',
    },
    errorText: {
        color: '#fca5a5',
        fontSize: '0.75rem',
    },
    modalFooter: {
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        background: 'rgba(15, 20, 25, 0.8)',
        flexShrink: 0,
    },
    cancelButton: {
        padding: '0.65rem 1.25rem',
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#d1d5db',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    saveButton: {
        padding: '0.65rem 1.25rem',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        padding: '0.65rem 1.25rem',
        background: '#374151',
        color: '#9ca3af',
        border: 'none',
        borderRadius: '8px',
        cursor: 'not-allowed',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default EditarProductoModal;