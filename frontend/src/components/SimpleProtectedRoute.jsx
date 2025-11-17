import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const SimpleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const currentUser = authService.getCurrentUser();
    
    console.log('🔐 SimpleProtectedRoute - Current User:', currentUser);
    console.log('🔐 SimpleProtectedRoute - Allowed Roles:', allowedRoles);
    
    // Si no hay usuario, redirigir al login
    if (!currentUser) {
        console.log('❌ No user found, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    // TEMPORAL: Permitir acceso a todos los usuarios autenticados
    // Esto te permitirá acceder mientras arreglamos el problema de roles
    console.log('⚠️ TEMPORAL: Bypassing role validation for testing');
    return children;
    
    /*
    // Código original (descomenta esto después de identificar el problema)
    if (allowedRoles.length > 0) {
        const userRole = currentUser.tipo_usuario || currentUser.role;
        
        if (!userRole) {
            return (
                <div style={styles.accessDenied}>
                    <h2>🔒 Error de Configuración</h2>
                    <p>El usuario no tiene un rol asignado.</p>
                    <p>Propiedades del usuario: {Object.keys(currentUser).join(', ')}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        style={styles.backButton}
                    >
                        ← Volver Atrás
                    </button>
                </div>
            );
        }
        
        const hasRequiredRole = allowedRoles.includes(userRole);
        
        if (!hasRequiredRole) {
            return (
                <div style={styles.accessDenied}>
                    <h2>🔒 Acceso Denegado</h2>
                    <p>No tienes permisos para acceder a esta página.</p>
                    <p>Tu rol actual: <strong>{userRole}</strong></p>
                    <p>Roles permitidos: <strong>{allowedRoles.join(', ')}</strong></p>
                    <button 
                        onClick={() => window.history.back()} 
                        style={styles.backButton}
                    >
                        ← Volver Atrás
                    </button>
                </div>
            );
        }
    }
    
    return children;
    */
};

const styles = {
    accessDenied: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        margin: '2rem',
    },
    backButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem',
    },
};

export default SimpleProtectedRoute;