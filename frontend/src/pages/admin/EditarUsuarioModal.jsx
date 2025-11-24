import React, { useState, useEffect } from 'react';

const EditarUsuarioModal = ({ usuario, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        direccion: '',
        provincia: '',
        direccion_retiro: '',
        horario_atencion: '',
        descripcion: '',
        titulo: '',
        tipo_usuario: 'cliente',
        estado: 'activo',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (usuario) {
            setFormData({
                username: usuario.username || '',
                email: usuario.email || '',
                first_name: usuario.first_name || '',
                last_name: usuario.last_name || '',
                telefono: usuario.telefono || '',
                direccion: usuario.direccion || '',
                provincia: usuario.provincia || '',
                direccion_retiro: usuario.direccion_retiro || '',
                horario_atencion: usuario.horario_atencion || '',
                descripcion: usuario.descripcion || '',
                titulo: usuario.titulo || '',
                tipo_usuario: usuario.tipo_usuario || 'cliente',
                estado: usuario.estado || 'activo',
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El username es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'El nombre es requerido';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'El apellido es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await onSave(usuario.id, formData);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return null;

    return (
        <>
            <div style={styles.overlay} onClick={onClose}></div>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>
                    <div>
                        <h2 style={styles.modalTitle}>Editar Usuario</h2>
                        <p style={styles.modalSubtitle}>Modifica la información del usuario</p>
                    </div>
                    <button onClick={onClose} style={styles.closeButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div style={styles.modalBody}>
                    <form onSubmit={handleSubmit}>
                        {/* Información Básica */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Información Básica</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Username *
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        style={errors.username ? styles.inputError : styles.input}
                                        placeholder="nombre_usuario"
                                    />
                                    {errors.username && <span style={styles.errorText}>{errors.username}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Email *
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={errors.email ? styles.inputError : styles.input}
                                        placeholder="usuario@email.com"
                                    />
                                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                                </div>
                            </div>

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Nombre *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        style={errors.first_name ? styles.inputError : styles.input}
                                        placeholder="Juan"
                                    />
                                    {errors.first_name && <span style={styles.errorText}>{errors.first_name}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Apellido *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        style={errors.last_name ? styles.inputError : styles.input}
                                        placeholder="Pérez"
                                    />
                                    {errors.last_name && <span style={styles.errorText}>{errors.last_name}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Información de Contacto</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Teléfono
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Dirección
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.labelIcon}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Calle 123, Ciudad"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de Vendedor (Condicional) */}
                        {formData.tipo_usuario === 'vendedor' && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Información de Vendedor</h3>
                                <div style={styles.formGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Provincia</label>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={formData.provincia}
                                            onChange={handleChange}
                                            style={styles.input}
                                            placeholder="Ej: Santiago"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Horario de Atención</label>
                                        <input
                                            type="text"
                                            name="horario_atencion"
                                            value={formData.horario_atencion}
                                            onChange={handleChange}
                                            style={styles.input}
                                            placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                                        />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Dirección de Retiro</label>
                                    <input
                                        type="text"
                                        name="direccion_retiro"
                                        value={formData.direccion_retiro}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Dirección completa para retiro de productos"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Perfil Público */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Perfil Público</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Título del Perfil</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Ej: Granja Los Aromos"
                                    />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Descripción breve del usuario o tienda..."
                                />
                            </div>
                        </div>

                        {/* Configuración de Cuenta */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Configuración de Cuenta</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tipo de Usuario</label>
                                    <select
                                        name="tipo_usuario"
                                        value={formData.tipo_usuario}
                                        onChange={handleChange}
                                        style={styles.select}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="vendedor">Vendedor</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Estado</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        style={styles.select}
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="inactivo">Inactivo</option>
                                        <option value="rechazado">Rechazado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Información de Ayuda */}
                        <div style={styles.infoBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <div style={styles.infoText}>
                                Los campos marcados con (*) son obligatorios. Asegúrate de verificar la información antes de guardar.
                            </div>
                        </div>

                        {/* Botones dentro del formulario */}
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
                                type="submit"
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
                                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
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
                    </form>
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
        width: '95%',
        maxWidth: '600px',
        maxHeight: '85vh',
        overflow: 'hidden',
        zIndex: 9999,
        border: '1px solid rgba(45, 122, 62, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
    },
    modalHeader: {
        padding: '1.5rem 1.5rem',
        borderBottom: '1px solid rgba(45, 122, 62, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1))',
        flexShrink: 0,
    },
    modalTitle: {
        fontSize: '1.25rem',
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
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    modalBody: {
        padding: '1.5rem',
        overflowY: 'auto',
        flex: 1,
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
        gridTemplateColumns: '1fr',
        gap: '1rem',
        marginBottom: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        color: '#d1d5db',
        fontWeight: '500',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    labelIcon: {
        opacity: 0.7,
    },
    input: {
        padding: '10px 12px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        width: '100%',
    },
    inputError: {
        padding: '10px 12px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(220, 38, 38, 0.5)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        width: '100%',
    },
    select: {
        padding: '10px 12px',
        backgroundColor: 'rgba(15, 20, 25, 0.6)',
        border: '2px solid rgba(45, 122, 62, 0.2)',
        borderRadius: '8px',
        color: '#e5e7eb',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none',
        width: '100%',
    },
    errorText: {
        color: '#fca5a5',
        fontSize: '0.75rem',
        marginTop: '-0.25rem',
    },
    infoBox: {
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(45, 122, 62, 0.1)',
        border: '1px solid rgba(45, 122, 62, 0.3)',
        borderRadius: '8px',
        margin: '1.5rem 0',
    },
    infoText: {
        color: '#d1d5db',
        fontSize: '0.8rem',
        lineHeight: 1.5,
        flex: 1,
    },
    modalFooter: {
        padding: '1rem 0 0 0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginTop: '1rem',
        borderTop: '1px solid rgba(45, 122, 62, 0.2)',
        paddingTop: '1rem',
    },
    cancelButton: {
        padding: '0.6rem 1.25rem',
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#d1d5db',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
    },
    saveButton: {
        padding: '0.6rem 1.25rem',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
    },
    saveButtonDisabled: {
        padding: '0.6rem 1.25rem',
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
        whiteSpace: 'nowrap',
    },
};

export default EditarUsuarioModal;