import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const Register = () => {
    const [step, setStep] = useState(1); // 1: Selección, 2: Formulario
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        // Campos comunes
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        // Campos específicos de vendedor
        rut: '',
        razon_social: '',
        tipo_productos: '',
        certificaciones: '',
        region: '',
        comuna: '',
        descripcion_negocio: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones...
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        try {
            const result = await authService.register({
                ...formData,
                userType: userType
            });

            console.log('Registro exitoso:', result);

            // ✅ REDIRECCIÓN MEJORADA
            if (userType === 'vendedor') {
                // Vendedores van a página de espera
                navigate('/vendedor/espera');
            } else {
                // Clientes van directamente a productos
                navigate('/productos');
            }

        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.message || 'Error en el registro. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // STEP 1: Selección de tipo de usuario
    if (step === 1) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.backgroundPattern}></div>

                <div style={styles.selectionWrapper}>
                    <div style={styles.logoSection}>
                        <div style={styles.logoContainer}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h1 style={styles.brandName}>Agroplace</h1>
                        <p style={styles.brandTagline}>Únete a nuestra comunidad agrícola</p>
                    </div>

                    <div style={styles.selectionContainer}>
                        <h2 style={styles.selectionTitle}>¿Cómo quieres unirte?</h2>
                        <p style={styles.selectionSubtitle}>Selecciona el tipo de cuenta que mejor se adapte a ti</p>

                        <div style={styles.cardsContainer}>
                            {/* Card Comprador */}
                            <div
                                style={styles.typeCard}
                                onClick={() => handleUserTypeSelect('cliente')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = '#2d7a3e';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#374151';
                                }}
                            >
                                <div style={styles.cardIcon}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                </div>
                                <h3 style={styles.cardTitle}>Comprador</h3>
                                <p style={styles.cardDescription}>
                                    Accede a productos frescos directamente del campo.
                                    Compra de forma segura y apoya a productores locales.
                                </p>
                                <ul style={styles.featureList}>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Compra productos frescos
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Seguimiento de pedidos
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Historial de compras
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Valoraciones y reseñas
                                    </li>
                                </ul>
                                <div style={styles.cardButton}>
                                    Continuar como Comprador
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </div>

                            {/* Card Vendedor */}
                            <div
                                style={styles.typeCard}
                                onClick={() => handleUserTypeSelect('vendedor')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = '#2d7a3e';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#374151';
                                }}
                            >
                                <div style={styles.cardIcon}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                        <path d="M3 3h18v18H3zM12 8v8M8 12h8" />
                                    </svg>
                                </div>
                                <h3 style={styles.cardTitle}>Vendedor</h3>
                                <p style={styles.cardDescription}>
                                    Vende tus productos agrícolas de forma directa.
                                    Gestiona tu tienda y llega a más clientes.
                                </p>
                                <ul style={styles.featureList}>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Publica tus productos
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Gestión de inventario
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Dashboard de ventas
                                    </li>
                                    <li style={styles.featureItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Requiere validación
                                    </li>
                                </ul>
                                <div style={styles.cardButton}>
                                    Continuar como Vendedor
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.backLink} onClick={() => navigate('/login')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        ¿Ya tienes cuenta? Inicia sesión
                    </div>
                </div>
            </div>
        );
    }

    // STEP 2: Formulario según tipo de usuario
    return (
        <div style={styles.pageContainer}>
            <div style={styles.backgroundPattern}></div>

            <div style={styles.formWrapper}>
                <div style={styles.logoSectionSmall}>
                    <div style={styles.logoContainerSmall}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h2 style={styles.formBrandName}>Agroplace</h2>
                </div>

                <div style={styles.registerCard}>
                    <div style={styles.cardHeader}>
                        <button
                            onClick={() => setStep(1)}
                            style={styles.backButton}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>
                        <div>
                            <h2 style={styles.title}>
                                {userType === 'cliente' ? 'Registro de Comprador' : 'Registro de Vendedor'}
                            </h2>
                            <p style={styles.subtitle}>
                                {userType === 'cliente'
                                    ? 'Completa tus datos para comenzar a comprar'
                                    : 'Tu cuenta será revisada por nuestro equipo antes de activarse'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.errorAlert}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Campos comunes */}
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="Tu apellido"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre de usuario</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="nombre_usuario"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Contraseña</label>
                                <div style={styles.passwordContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={styles.passwordInput}
                                        placeholder="Mínimo 8 caracteres"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.togglePassword}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Confirmar contraseña</label>
                                <div style={styles.passwordContainer}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        style={styles.passwordInput}
                                        placeholder="Repite tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.togglePassword}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="Tu dirección"
                                />
                            </div>
                        </div>

                        {/* Campos específicos para vendedor */}
                        {userType === 'vendedor' && (
                            <>
                                <div style={styles.sectionDivider}>
                                    <span style={styles.sectionTitle}>Información del Vendedor</span>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>RUT</label>
                                        <input
                                            type="text"
                                            name="rut"
                                            value={formData.rut}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                            placeholder="12.345.678-9"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Razón Social</label>
                                        <input
                                            type="text"
                                            name="razon_social"
                                            value={formData.razon_social}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                            placeholder="Nombre de tu empresa"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Región</label>
                                        <select
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            required
                                            style={styles.select}
                                        >
                                            <option value="">Selecciona tu región</option>
                                            <option value="maule">Maule</option>
                                            <option value="biobio">Biobío</option>
                                            <option value="araucania">Araucanía</option>
                                            <option value="los_rios">Los Ríos</option>
                                            <option value="metropolitana">Metropolitana</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Comuna</label>
                                        <input
                                            type="text"
                                            name="comuna"
                                            value={formData.comuna}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                            placeholder="Tu comuna"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tipo de Productos</label>
                                    <select
                                        name="tipo_productos"
                                        value={formData.tipo_productos}
                                        onChange={handleChange}
                                        required
                                        style={styles.select}
                                    >
                                        <option value="">Selecciona el tipo de productos</option>
                                        <option value="frutas">Frutas</option>
                                        <option value="verduras">Verduras</option>
                                        <option value="lacteos">Lácteos</option>
                                        <option value="carnes">Carnes</option>
                                        <option value="granos">Granos y Cereales</option>
                                        <option value="procesados">Productos Procesados</option>
                                        <option value="mixto">Mixto</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Certificaciones (opcional)</label>
                                    <input
                                        type="text"
                                        name="certificaciones"
                                        value={formData.certificaciones}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Ej: Orgánico, SAG, HACCP"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Descripción de tu negocio</label>
                                    <textarea
                                        name="descripcion_negocio"
                                        value={formData.descripcion_negocio}
                                        onChange={handleChange}
                                        required
                                        style={styles.textarea}
                                        placeholder="Cuéntanos sobre tu negocio, productos y experiencia..."
                                        rows="4"
                                    />
                                </div>

                                <div style={styles.warningBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                    <div>
                                        <strong>Validación requerida:</strong> Tu cuenta será revisada por nuestro equipo de administración.
                                        Recibirás un correo cuando sea aprobada (generalmente en 24-48 horas).
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? styles.buttonDisabled : styles.button}
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
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                        <line x1="23" y1="11" x2="17" y2="11" />
                                    </svg>
                                    Crear Cuenta
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div style={styles.backLink} onClick={() => navigate('/login')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    ¿Ya tienes cuenta? Inicia sesión
                </div>
            </div>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    input:focus, select:focus, textarea:focus {
                        outline: none;
                        border-color: #2d7a3e !important;
                        box-shadow: 0 0 0 3px rgba(45, 122, 62, 0.1) !important;
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    // Página principal
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#0f1419',
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(45, 122, 62, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(4, 71, 44, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
    },

    // Step 1: Selección
    selectionWrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1,
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    logoContainer: {
        display: 'inline-flex',
        padding: '1.5rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '50%',
        marginBottom: '1rem',
    },
    brandName: {
        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
    },
    brandTagline: {
        color: '#9ca3af',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    },
    selectionContainer: {
        width: '100%',
        maxWidth: '1100px',
    },
    selectionTitle: {
        fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
        color: '#f9fafb',
        textAlign: 'center',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    selectionSubtitle: {
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: '3rem',
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    },
    cardsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
    },
    typeCard: {
        background: 'rgba(26, 31, 46, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '2.5rem',
        border: '2px solid #374151',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    cardIcon: {
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '50%',
    },
    cardTitle: {
        fontSize: '1.8rem',
        color: '#f9fafb',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    cardDescription: {
        color: '#9ca3af',
        marginBottom: '2rem',
        lineHeight: 1.6,
        fontSize: '0.95rem',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 2rem 0',
        width: '100%',
        textAlign: 'left',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#d1d5db',
        marginBottom: '0.75rem',
        fontSize: '0.9rem',
    },
    cardButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '0.95rem',
        width: '100%',
        justifyContent: 'center',
    },

    // Step 2: Formulario
    formWrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1,
    },
    logoSectionSmall: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
    },
    logoContainerSmall: {
        display: 'flex',
        padding: '0.75rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '50%',
    },
    formBrandName: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    registerCard: {
        background: 'rgba(26, 31, 46, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        border: '1px solid rgba(45, 122, 62, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '2rem',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    backButton: {
        background: 'transparent',
        border: '2px solid #374151',
        borderRadius: '10px',
        padding: '0.5rem',
        cursor: 'pointer',
        color: '#d1d5db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
    },
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
        color: '#f9fafb',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
        lineHeight: 1.5,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: '600',
        color: '#d1d5db',
        fontSize: '0.9rem',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #374151',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #374151',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
        cursor: 'pointer',
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #374151',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    passwordContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    passwordInput: {
        padding: '12px 50px 12px 16px',
        border: '2px solid #374151',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
        width: '100%',
    },
    togglePassword: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#9ca3af',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.3s ease',
    },
    sectionDivider: {
        display: 'flex',
        alignItems: 'center',
        margin: '1rem 0',
        position: 'relative',
    },
    sectionTitle: {
        color: '#2d7a3e',
        fontSize: '1rem',
        fontWeight: '700',
        padding: '0.5rem 1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(45, 122, 62, 0.3)',
    },
    warningBox: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        border: '1px solid rgba(45, 122, 62, 0.3)',
        borderRadius: '10px',
        color: '#d1d5db',
        fontSize: '0.9rem',
        lineHeight: 1.6,
    },
    button: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(45, 122, 62, 0.3)',
    },
    buttonDisabled: {
        background: '#374151',
        color: '#9ca3af',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorAlert: {
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        color: '#fca5a5',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid rgba(220, 38, 38, 0.3)',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#9ca3af',
        textDecoration: 'none',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
        justifyContent: 'center',
    },
};

export default Register;    