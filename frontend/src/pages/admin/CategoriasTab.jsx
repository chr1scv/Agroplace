import React, { useState } from 'react';

const CategoriasTab = ({ categorias, loading, onReload, onCrear, onEditar, onEliminar }) => {
    const [modalCrear, setModalCrear] = useState(false);
    const [categoriaEditar, setCategoriaEditar] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activa: true,
    });
    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);

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
            newErrors.nombre = 'El nombre de la categoría es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setGuardando(true);
        try {
            if (categoriaEditar) {
                await onEditar(categoriaEditar.id, formData);
            } else {
                await onCrear(formData);
            }

            // Limpiar formulario y cerrar modal
            setFormData({ nombre: '', descripcion: '', activa: true });
            setCategoriaEditar(null);
            setModalCrear(false);
        } catch (error) {
            console.error('Error al guardar categoría:', error);
        } finally {
            setGuardando(false);
        }
    };

    const abrirModalCrear = () => {
        setFormData({ nombre: '', descripcion: '', activa: true });
        setCategoriaEditar(null);
        setErrors({});
        setModalCrear(true);
    };

    const abrirModalEditar = (categoria) => {
        setFormData({
            nombre: categoria.nombre || '',
            descripcion: categoria.descripcion || '',
            activa: categoria.activa !== undefined ? categoria.activa : true,
        });
        setCategoriaEditar(categoria);
        setErrors({});
        setModalCrear(true);
    };

    const cerrarModal = () => {
        setModalCrear(false);
        setCategoriaEditar(null);
        setFormData({ nombre: '', descripcion: '', activa: true });
        setErrors({});
    };

    if (loading) {
        return (
            <div style={styles.loadingState}>
                <div style={styles.spinner}></div>
                <p>Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={styles.tabHeader}>
                <div style={styles.tabHeaderRow}>
                    <div>
                        <h1 style={styles.tabTitle}>Gestión de Categorías</h1>
                        <p style={styles.tabSubtitle}>Administra las categorías de productos de la plataforma</p>
                    </div>
                    <div style={styles.headerActions}>
                        <button onClick={onReload} style={styles.reloadButton}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Actualizar
                        </button>
                        <button onClick={abrirModalCrear} style={styles.crearButton}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Nueva Categoría
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div style={styles.statsRow}>
                <div style={styles.miniStat}>
                    <div style={styles.miniStatNumber}>{categorias.length}</div>
                    <div style={styles.miniStatLabel}>Total de Categorías</div>
                </div>
                <div style={styles.miniStat}>
                    <div style={styles.miniStatNumber}>{categorias.filter(c => c.activa).length}</div>
                    <div style={styles.miniStatLabel}>Categorías Activas</div>
                </div>
                <div style={styles.miniStat}>
                    <div style={styles.miniStatNumber}>{categorias.filter(c => !c.activa).length}</div>
                    <div style={styles.miniStatLabel}>Categorías Inactivas</div>
                </div>
            </div>

            {/* Grid de Categorías */}
            {categorias.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>
                    <h3 style={styles.emptyTitle}>No hay categorías</h3>
                    <p style={styles.emptyText}>Comienza creando la primera categoría de productos</p>
                    <button onClick={abrirModalCrear} style={styles.emptyButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Crear Primera Categoría
                    </button>
                </div>
            ) : (
                <div style={styles.categoriasGrid}>
                    {categorias.map(categoria => (
                        <div key={categoria.id} style={styles.categoriaCard}>
                            <div style={styles.categoriaHeader}>
                                <div style={styles.categoriaIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div style={categoria.activa ? styles.estadoActivo : styles.estadoInactivo}>
                                    {categoria.activa ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                            Activa
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="15" y1="9" x2="9" y2="15" />
                                                <line x1="9" y1="9" x2="15" y2="15" />
                                            </svg>
                                            Inactiva
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={styles.categoriaBody}>
                                <h3 style={styles.categoriaNombre}>{categoria.nombre}</h3>
                                {categoria.descripcion && (
                                    <p style={styles.categoriaDescripcion}>{categoria.descripcion}</p>
                                )}
                            </div>

                            <div style={styles.categoriaFooter}>
                                <button
                                    onClick={() => abrirModalEditar(categoria)}
                                    style={styles.editButton}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Editar
                                </button>
                                <button
                                    onClick={() => onEliminar(categoria.id, categoria.nombre)}
                                    style={styles.deleteButton}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear/Editar Categoría */}
            {modalCrear && (
                <>
                    <div style={styles.overlay} onClick={cerrarModal}></div>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={styles.modalTitle}>
                                    {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h2>
                                <p style={styles.modalSubtitle}>
                                    {categoriaEditar
                                        ? 'Modifica la información de la categoría'
                                        : 'Crea una nueva categoría para organizar tus productos'
                                    }
                                </p>
                            </div>
                            <button onClick={cerrarModal} style={styles.closeButton}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={styles.modalBody}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Nombre de la Categoría *
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    </svg>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    style={errors.nombre ? styles.inputError : styles.input}
                                    placeholder="Ej: Frutas, Verduras, Lácteos..."
                                    autoFocus
                                />
                                {errors.nombre && <span style={styles.errorText}>{errors.nombre}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Descripción (Opcional)
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    style={styles.textarea}
                                    placeholder="Describe brevemente esta categoría..."
                                    rows="3"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="activa"
                                        checked={formData.activa}
                                        onChange={handleChange}
                                        style={styles.checkbox}
                                    />
                                    <div style={styles.checkboxText}>
                                        <span style={styles.checkboxTitle}>Categoría Activa</span>
                                        <span style={styles.checkboxDescription}>
                                            {formData.activa
                                                ? 'La categoría estará visible y disponible para asignar a productos'
                                                : 'La categoría estará oculta y no se podrá asignar a nuevos productos'
                                            }
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div style={styles.infoBox}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <div style={styles.infoText}>
                                    Las categorías ayudan a organizar y filtrar los productos en la plataforma.
                                    Asegúrate de usar nombres claros y descriptivos.
                                </div>
                            </div>
                        </form>

                        <div style={styles.modalFooter}>
                            <button
                                type="button"
                                onClick={cerrarModal}
                                style={styles.cancelButton}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={guardando ? styles.saveButtonDisabled : styles.saveButton}
                                disabled={guardando}
                            >
                                {guardando ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }}>
                                            <line x1="12" y1="2" x2="12" y2="6" />
                                            <line x1="12" y1="18" x2="12" y2="22" />
                                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                            <line x1="2" y1="12" x2="6" y2="12" />
                                            <line x1="18" y1="12" x2="22" y2="12" />
                                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                                        </svg>
                                        {categoriaEditar ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        {categoriaEditar ? 'Actualizar' : 'Crear Categoría'}
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
                                from {
                                    transform: translate(-50%, -45%);
                                    opacity: 0;
                                }
                                to {
                                    transform: translate(-50%, -50%);
                                    opacity: 1;
                                }
                            }
                            
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </>
            )}
        </div>
    );
};

const styles = {
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #374151',
        borderTop: '3px solid #2d7a3e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem',
    },
    tabHeader: {
        marginBottom: '2rem',
    },
    tabHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    tabTitle: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.5rem',
    },
    tabSubtitle: {
        color: '#9ca3af',
        fontSize: '1rem',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    reloadButton: {
        background: 'rgba(45, 122, 62, 0.1)',
        color: '#2d7a3e',
        border: '1px solid rgba(45, 122, 62, 0.3)',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    crearButton: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(45, 122, 62, 0.3)',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    miniStat: {
        background: 'rgba(26, 31, 46, 0.6)',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid rgba(45, 122, 62, 0.1)',
        textAlign: 'center',
    },
    miniStatNumber: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d7a3e',
        marginBottom: '0.25rem',
    },
    miniStatLabel: {
        fontSize: '0.8rem',
        color: '#9ca3af',
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(26, 31, 46, 0.5)',
        borderRadius: '12px',
        border: '2px dashed rgba(45, 122, 62, 0.3)',
    },
    emptyIcon: {
        color: '#2d7a3e',
        opacity: 0.5,
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
    },
    emptyTitle: {
        color: '#f9fafb',
        marginBottom: '0.5rem',
        fontSize: '1.25rem',
    },
    emptyText: {
        color: '#9ca3af',
        marginBottom: '2rem',
    },
    emptyButton: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    categoriasGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    categoriaCard: {
        background: 'rgba(26, 31, 46, 0.8)',
        border: '1px solid rgba(45, 122, 62, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
    },
    categoriaHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    categoriaIcon: {
        color: '#2d7a3e',
        padding: '0.75rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '10px',
    },
    estadoActivo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#10b981',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    estadoInactivo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    categoriaBody: {
        marginBottom: '1.5rem',
    },
    categoriaNombre: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.5rem',
    },
    categoriaDescripcion: {
        color: '#9ca3af',
        fontSize: '0.9rem',
        lineHeight: 1.6,
    },
    categoriaFooter: {
        display: 'flex',
        gap: '0.75rem',
        borderTop: '1px solid rgba(45, 122, 62, 0.1)',
        paddingTop: '1rem',
    },
    editButton: {
        flex: 1,
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        padding: '0.75rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
    },
    deleteButton: {
        flex: 1,
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        padding: '0.75rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
    },
    // Estilos del Modal (reutilizados)
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        zIndex: 9999,
        border: '1px solid rgba(45, 122, 62, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease',
    },
    modalHeader: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1))',
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.25rem',
    },
    modalSubtitle: {
        color: '#9ca3af',
        fontSize: '0.9rem',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        padding: '2rem',
        overflowY: 'auto',
        maxHeight: 'calc(90vh - 180px)',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.5rem',
    },
    label: {
        color: '#d1d5db',
        fontWeight: '500',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    labelIcon: {
        opacity: 0.7,
    },
    input: {
        padding: '12px 16px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '10px',
        color: '#e5e7eb',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    inputError: {
        padding: '12px 16px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '10px',
        color: '#e5e7eb',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    textarea: {
        padding: '12px 16px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '10px',
        color: '#e5e7eb',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(15, 20, 25, 0.5)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        accentColor: '#2d7a3e',
        marginTop: '2px',
    },
    checkboxText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    checkboxTitle: {
        color: '#f9fafb',
        fontWeight: '600',
        fontSize: '0.95rem',
    },
    checkboxDescription: {
        color: '#9ca3af',
        fontSize: '0.85rem',
        lineHeight: 1.5,
    },
    errorText: {
        color: '#fca5a5',
        fontSize: '0.8rem',
        marginTop: '-0.25rem',
    },
    infoBox: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        border: '1px solid rgba(45, 122, 62, 0.3)',
        borderRadius: '10px',
    },
    infoText: {
        color: '#d1d5db',
        fontSize: '0.85rem',
        lineHeight: 1.6,
    },
    modalFooter: {
        padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        background: 'rgba(15, 20, 25, 0.5)',
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#d1d5db',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    saveButton: {
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        padding: '0.75rem 1.5rem',
        background: '#374151',
        color: '#9ca3af',
        border: 'none',
        borderRadius: '10px',
        cursor: 'not-allowed',
        fontSize: '0.95rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default CategoriasTab;