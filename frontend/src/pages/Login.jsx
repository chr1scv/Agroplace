import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await authService.login(formData.username, formData.password);

            console.log('🔍 Usuario logueado:', {
                username: result.user.username,
                tipo: result.user.tipo_usuario,
                estado: result.user.estado
            });

            // ✅ REDIRECCIÓN SIMPLE Y DIRECTA
            if (result.user.tipo_usuario === 'admin') {
                navigate('/admin');
            } else if (result.user.tipo_usuario === 'vendedor') {
                // Usar el estado que viene directamente del login
                if (result.user.estado === 'activo') {
                    console.log('✅ Vendedor activo - redirigiendo al panel');
                    navigate('/vendedor');
                } else {
                    console.log('⏳ Vendedor pendiente - redirigiendo a espera');
                    navigate('/vendedor/espera');
                }
            } else {
                navigate('/productos');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* Fondo decorativo */}
            <div style={styles.backgroundPattern}></div>

            <div style={styles.contentWrapper}>
                {/* Logo y header */}
                <div style={styles.logoSection}>
                    <div style={styles.logoContainer}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2d7a3e" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h1 style={styles.brandName}>Agroplace</h1>
                    <p style={styles.brandTagline}>Conectando el campo con tu mesa</p>
                </div>

                {/* Card de Login */}
                <div style={styles.loginCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Iniciar Sesión</h2>
                        <p style={styles.subtitle}>Accede a tu cuenta y explora productos frescos</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.errorAlert}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="Ingresa tu usuario"
                                autoComplete="username"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Contraseña
                            </label>
                            <div style={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={styles.passwordInput}
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
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

                        <div style={styles.optionsRow}>
                            <label style={styles.checkboxLabel}>
                                <input type="checkbox" style={styles.checkbox} />
                                <span style={styles.checkboxText}>Recordarme</span>
                            </label>
                            <Link to="/recuperar-contrasena" style={styles.forgotLink}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

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
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerText}>¿Nuevo en Agroplace?</span>
                    </div>

                    <Link to="/registro" state={{ from: location.state?.from }} style={styles.registerLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        Crear una cuenta nueva
                    </Link>
                </div>

                {/* Link de regreso */}
                <Link to="/" style={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Volver al inicio
                </Link>
            </div>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    input:focus {
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
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#0f1419',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
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
    contentWrapper: {
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logoContainer: {
        display: 'inline-flex',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '50%',
        marginBottom: '1rem',
    },
    brandName: {
        fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
    },
    brandTagline: {
        color: '#9ca3af',
        fontSize: '0.95rem',
    },
    loginCard: {
        background: 'rgba(26, 31, 46, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        border: '1px solid rgba(45, 122, 62, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    cardHeader: {
        marginBottom: '2rem',
        textAlign: 'center',
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
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: '600',
        color: '#d1d5db',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
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
    optionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '-0.5rem',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#2d7a3e',
    },
    checkboxText: {
        color: '#d1d5db',
        fontSize: '0.9rem',
    },
    forgotLink: {
        color: '#2d7a3e',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'color 0.3s ease',
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
        border: '1px solid rgba(220, 38, 38, 0.3)',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        margin: '1.5rem 0',
        position: 'relative',
    },
    dividerText: {
        color: '#6b7280',
        fontSize: '0.85rem',
        padding: '0 1rem',
        background: 'rgba(26, 31, 46, 0.8)',
        position: 'relative',
        zIndex: 1,
        margin: '0 auto',
    },
    registerLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: '10px',
        border: '2px solid #374151',
        color: '#d1d5db',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        background: 'transparent',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        textDecoration: 'none',
        fontSize: '0.9rem',
        marginTop: '1.5rem',
        transition: 'color 0.3s ease',
    },
};

export default Login;