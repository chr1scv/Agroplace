import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const user = authService.getCurrentUser();
    
    console.log('🔐 ProtectedRoute - User:', user);
    console.log('🔐 ProtectedRoute - Required Roles:', requiredRoles);
    
    // Si no hay usuario, redirigir al login
    if (!user) {
        console.log('❌ No user found, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    // Si se especifican roles requeridos, verificar permisos
    if (requiredRoles.length > 0) {
        const userRole = user.tipo_usuario || user.role || user.tipoUsuario;
        console.log('🔐 ProtectedRoute - User Role found:', userRole);
        
        // Verificar si el usuario tiene al menos uno de los roles requeridos
        // Usamos comparación flexible para evitar problemas de case sensitivity
        const hasRequiredRole = requiredRoles.some(role => 
            userRole && role.toLowerCase() === userRole.toLowerCase()
        );
        
        console.log('🔐 ProtectedRoute - Has required role?', hasRequiredRole);
        
        if (!hasRequiredRole) {
            console.log('❌ Access denied - User role not in required roles');
            return <Navigate to="/acceso-denegado" replace />;
        }
    }
    
    console.log('✅ Access granted to:', user.tipo_usuario);
    return children;
};

export default ProtectedRoute;