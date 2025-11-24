import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const EsperaAprobacion = () => {
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
    const [estaVerificando, setEstaVerificando] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Verificación simple del estado
    const verificarEstadoSimple = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/user/', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Estado actual desde API:', userData.estado);
                console.log('👤 Tipo de usuario:', userData.tipo_usuario);

                if (userData.estado === 'activo') {
                    // SAFETY CHECK: If admin, go to admin panel
                    if (userData.tipo_usuario === 'admin') {
                        console.log('🛡️ Usuario es ADMIN - Redirigiendo a panel admin');
                        navigate('/admin');
                        return true;
                    }

                    console.log('🎉 APROBADO - Redirigiendo!');
                    localStorage.setItem('user', JSON.stringify(userData));
                    setTimeout(() => navigate('/vendedor'), 1000);
                    return true;
                }
                return false;
            }
            return false;
        } catch (error) {
            console.error('Error verificando estado:', error);
            return false;
        }
    };

    // Efecto principal
    useEffect(() => {
        const initialize = async () => {
            console.log('🚀 Inicializando página de espera...');

            // Verificar estado inmediatamente
            const estaAprobado = await verificarEstadoSimple();
            if (estaAprobado) return;

            // Configurar intervalos
            const timer = setInterval(() => {
                setTiempoTranscurrido(prev => prev + 1);
            }, 1000);

            const verificationInterval = setInterval(async () => {
                if (!estaVerificando) {
                    await verificarEstadoSimple();
                }
            }, 8000);

            return () => {
                clearInterval(timer);
                clearInterval(verificationInterval);
            };
        };

        initialize();
    }, [navigate, estaVerificando]);

    const handleSalir = () => {
        authService.logout();
        navigate('/');
    };

    const formatTiempo = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;

        if (horas > 0) {
            return `${horas}h ${minutos}m ${segs}s`;
        } else if (minutos > 0) {
            return `${minutos}m ${segs}s`;
        } else {
            return `${segs}s`;
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.backgroundPattern}></div>

            <div style={styles.contentWrapper}>
                <div style={styles.card}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.logoContainer}>
                            <span style={styles.logo}>🌱</span>
                        </div>
                        <h1 style={styles.title}>Esperando Aprobación</h1>
                        <p style={styles.subtitle}>
                            Tu cuenta está siendo revisada por nuestro equipo
                        </p>
                    </div>

                    {/* Estado */}
                    <div style={styles.statusSection}>
                        <div style={styles.statusIcon}>
                            <div style={styles.loadingSpinner}></div>
                        </div>
                        <h2 style={styles.statusTitle}>En Revisión</h2>
                        <p style={styles.statusText}>
                            Tu solicitud está siendo procesada. Te notificaremos cuando tu cuenta sea activada.
                            <br />
                            <span style={styles.autoCheckText}>Verificaciones automáticas cada 8 segundos</span>
                        </p>

                        <div style={styles.timer}>
                            <span style={styles.timerLabel}>Tiempo en espera:</span>
                            <span style={styles.timerValue}>{formatTiempo(tiempoTranscurrido)}</span>
                        </div>
                    </div>

                    {/* Acciones principales */}
                    <div style={styles.actions}>
                        <button
                            onClick={handleSalir}
                            style={styles.buttonSecondary}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
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
        maxWidth: '600px',
        position: 'relative',
        zIndex: 1,
    },
    card: {
        background: 'rgba(26, 31, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2.5rem',
        border: '1px solid rgba(45, 122, 62, 0.3)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        width: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logoContainer: {
        display: 'inline-flex',
        padding: '1rem',
        background: 'rgba(45, 122, 62, 0.2)',
        borderRadius: '50%',
        marginBottom: '1rem',
    },
    logo: {
        fontSize: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: '1.1rem',
    },
    statusSection: {
        marginBottom: '2rem',
        padding: '2rem',
        background: 'rgba(45, 122, 62, 0.1)',
        borderRadius: '15px',
        border: '1px solid rgba(45, 122, 62, 0.2)',
        textAlign: 'center',
    },
    statusIcon: {
        marginBottom: '1.5rem',
    },
    loadingSpinner: {
        width: '60px',
        height: '60px',
        border: '4px solid rgba(45, 122, 62, 0.3)',
        borderTop: '4px solid #2d7a3e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
    },
    statusTitle: {
        fontSize: '1.5rem',
        color: '#f9fafb',
        marginBottom: '1rem',
    },
    statusText: {
        color: '#d1d5db',
        lineHeight: 1.6,
        marginBottom: '1.5rem',
        fontSize: '1rem',
    },
    autoCheckText: {
        fontSize: '0.9rem',
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    timer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
    },
    timerLabel: {
        color: '#9ca3af',
        fontSize: '0.9rem',
    },
    timerValue: {
        color: '#2d7a3e',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '0',
    },
    buttonSecondary: {
        background: 'transparent',
        color: '#9ca3af',
        border: '2px solid #374151',
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

// Añadir la animación de spin
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`, styleSheet.cssRules.length);

export default EsperaAprobacion;