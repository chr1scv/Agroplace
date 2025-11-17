import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.icon}>🚫</div>
                <h1 style={styles.title}>Acceso Denegado</h1>
                <p style={styles.message}>
                    No tienes permisos para acceder a esta página.
                </p>
                <p style={styles.subMessage}>
                    Si crees que esto es un error, contacta al administrador.
                </p>
                <div style={styles.actions}>
                    <Link to="/" style={styles.button}>
                        🏠 Volver al Inicio
                    </Link>
                    <Link to="/login" style={styles.buttonSecondary}>
                        🔑 Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
    },
    content: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '2rem',
        color: '#d32f2f',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '0.5rem',
    },
    subMessage: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '2rem',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    button: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
};

export default AccessDenied;