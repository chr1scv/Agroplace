import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
            {/* Fondo decorativo animado */}
            <div style={styles.backgroundPattern}></div>
            <div style={styles.backgroundGlobe}></div>

            <div style={styles.contentWrapper}>
                {/* Logo y header */}
                <div style={styles.logoSection}>
                    <div style={styles.logoContainer}>
                        <span style={styles.logoEmoji}>🌾</span>
                    </div>
                    <h1 style={styles.brandName}>Agroplace</h1>
                    <p style={styles.brandTagline}>Conectando el campo con tu mesa</p>
                </div>

                {/* Card de Login */}
                <div style={styles.loginCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Bienvenido de Vuelta</h2>
                        <p style={styles.subtitle}>Accede a tu cuenta para explorar productos frescos del campo</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.errorAlert}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.25)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px', minWidth: '20px' }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', color: '#4ade80' }}>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Usuario o Email
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="tu_usuario@ejemplo.com"
                                autoComplete="username"
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', color: '#4ade80' }}>
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
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.togglePassword}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
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
                            <label style={styles.checkboxLabel}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                            >
                                <input type="checkbox" style={styles.checkbox} />
                                <span style={styles.checkboxText}>Recordarme en este dispositivo</span>
                            </label>
                            <Link to="/recuperar-contrasena" style={styles.forgotLink}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#2d7a3e'}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? styles.buttonDisabled : styles.button}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 25px rgba(74, 222, 128, 0.5)')}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.3)')}
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
                        <span style={styles.dividerText}>¿No tienes cuenta?</span>
                    </div>

                    <Link to="/registro" style={styles.registerLink}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#4ade80';
                            e.currentTarget.style.color = '#4ade80';
                            e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#374151';
                            e.currentTarget.style.color = '#d1d5db';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
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
                <Link to="/" style={styles.backLink}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
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
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    input:focus {
                        outline: none !important;
                        border-color: #4ade80 !important;
                        box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1) !important;
                        background: rgba(15, 20, 25, 0.8) !important;
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#0a0d10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(74, 222, 128, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
    },
    backgroundGlobe: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(74, 222, 128, 0.1), transparent)',
        top: '-100px',
        right: '-100px',
        pointerEvents: 'none',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        zIndex: 1,
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    logoContainer: {
        display: 'inline-flex',
        padding: '1.2rem',
        background: 'rgba(74, 222, 128, 0.1)',
        borderRadius: '16px',
        marginBottom: '1.2rem',
        border: '1px solid rgba(74, 222, 128, 0.2)',
    },
    logoEmoji: {
        fontSize: '2.5rem',
        display: 'block',
    },
    brandName: {
        fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #4ade80, #78ff99)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
        letterSpacing: '-0.5px',
    },
    brandTagline: {
        color: '#9ca3af',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    loginCard: {
        background: 'rgba(26, 31, 46, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: 'clamp(2rem, 5vw, 2.8rem)',
        border: '1px solid rgba(74, 222, 128, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
    },
    cardHeader: {
        marginBottom: '2.5rem',
        textAlign: 'center',
    },
    title: {
        fontSize: 'clamp(1.6rem, 3.5vw, 2rem)',
        color: '#f9fafb',
        marginBottom: '0.75rem',
        fontWeight: '900',
        letterSpacing: '-0.3px',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        lineHeight: 1.6,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    label: {
        fontWeight: '700',
        color: '#d1d5db',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #374151',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
        fontWeight: '500',
    },
    passwordContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    passwordInput: {
        padding: '12px 50px 12px 16px',
        border: '2px solid #374151',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        background: 'rgba(15, 20, 25, 0.6)',
        color: '#f9fafb',
        width: '100%',
        fontWeight: '500',
    },
    togglePassword: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#9ca3af',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
    },
    optionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#4ade80',
    },
    checkboxText: {
        color: '#d1d5db',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    forgotLink: {
        color: '#2d7a3e',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    button: {
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        color: '#0a0d10',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
    },
    buttonDisabled: {
        background: '#374151',
        color: '#9ca3af',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorAlert: {
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        color: '#fca5a5',
        padding: '14px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        transition: 'all 0.3s ease',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        margin: '2rem 0',
        position: 'relative',
    },
    dividerText: {
        color: '#6b7280',
        fontSize: '0.85rem',
        padding: '0 1rem',
        background: 'rgba(26, 31, 46, 0.85)',
        position: 'relative',
        zIndex: 1,
        margin: '0 auto',
        fontWeight: '600',
    },
    registerLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 24px',
        borderRadius: '12px',
        border: '2px solid #374151',
        color: '#d1d5db',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '700',
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
        marginTop: '2rem',
        transition: 'all 0.3s ease',
        fontWeight: '500',
    },
};

export default Login;