import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const ProfileMenu = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cargar datos del usuario en el formulario
    useEffect(() => {
        if (user && showEditModal) {
            setEditForm({
                nombre: user.nombre || user.first_name || '',
                email: user.email || '',
                telefono: user.telefono || '',
                direccion: user.direccion || ''
            });
        }
    }, [user, showEditModal]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setShowDropdown(false);
            navigate('/');
        } catch (error) {
            console.error('Error durante logout:', error);
        }
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            await authService.updateProfile(editForm);
            setShowEditModal(false);
            setShowDropdown(false);
            // Recargar la página para actualizar los datos
            window.location.reload();
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error al actualizar el perfil: ' + error.message);
        }
    };

    const getRoleBadge = (tipoUsuario) => {
        const badges = {
            admin: { text: 'Admin', color: '#d32f2f', emoji: '👑' },
            vendedor: { text: 'Vendedor', color: '#1976d2', emoji: '👨‍🌾' },
            cliente: { text: 'Comprador', color: '#2d7a3e', emoji: '🛒' }
        };
        return badges[tipoUsuario] || { text: 'Usuario', color: '#666', emoji: '👤' };
    };

    if (!user) return null;

    const roleBadge = getRoleBadge(user.tipo_usuario);
    const displayName = user.nombre || user.first_name || user.username || 'Usuario';

    return (
        <>
            <div className="profile-menu" ref={dropdownRef}>
                <div 
                    className="profile-trigger"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div 
                        className="user-avatar"
                        style={{ backgroundColor: roleBadge.color }}
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="avatar-image" />
                        ) : (
                            roleBadge.emoji
                        )}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{displayName}</span>
                        <span 
                            className="user-role"
                            style={{ backgroundColor: roleBadge.color }}
                        >
                            {roleBadge.text}
                        </span>
                    </div>
                    <div className="dropdown-arrow">
                        {showDropdown ? '▲' : '▼'}
                    </div>
                </div>

                {showDropdown && (
                    <div className="profile-dropdown">
                        <div className="dropdown-header">
                            <div 
                                className="dropdown-avatar"
                                style={{ backgroundColor: roleBadge.color }}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="avatar-image" />
                                ) : (
                                    roleBadge.emoji
                                )}
                            </div>
                            <div className="dropdown-user-info">
                                <div className="dropdown-name">{displayName}</div>
                                <div className="dropdown-email">
                                    {user.email || `${user.username}@agroplace.com`}
                                </div>
                                <div 
                                    className="role-badge"
                                    style={{ backgroundColor: roleBadge.color }}
                                >
                                    {roleBadge.emoji} {roleBadge.text}
                                </div>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="dropdown-menu">
                            <div 
                                className="dropdown-item"
                                onClick={() => {
                                    setShowEditModal(true);
                                    setShowDropdown(false);
                                }}
                            >
                                <span className="dropdown-icon">👤</span>
                                Editar Perfil
                            </div>
                            
                            <div 
                                className="dropdown-item"
                                onClick={() => {
                                    // Aquí iría la lógica para cambiar foto de perfil
                                    alert('Funcionalidad para cambiar foto de perfil próximamente');
                                    setShowDropdown(false);
                                }}
                            >
                                <span className="dropdown-icon">🖼️</span>
                                Cambiar Foto
                            </div>

                            <div className="dropdown-divider"></div>

                            <div 
                                className="dropdown-item"
                                onClick={handleLogout}
                            >
                                <span className="dropdown-icon">🚪</span>
                                Cerrar Sesión
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Edición de Perfil */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Perfil</h3>
                            <button 
                                className="close-button"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditProfile} className="edit-form">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={editForm.nombre}
                                    onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    value={editForm.telefono}
                                    onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Dirección</label>
                                <textarea
                                    value={editForm.direccion}
                                    onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="save-button"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileMenu;