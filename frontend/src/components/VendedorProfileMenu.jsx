import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const VendedorProfileMenu = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
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

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error durante logout:', error);
        }
    };

    const handleSwitchToBuyer = () => {
        navigate('/productos');
    };

    if (!user) return null;

    const displayName = user.first_name || user.username || 'Vendedor';

    return (
        <>
            <div className="profile-menu-vendedor" ref={dropdownRef}>
                <div 
                    className="profile-trigger-vendedor"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="avatar-vendedor">
                        {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'V'}
                    </div>
                    <div className="user-info-vendedor">
                        <span className="user-name-vendedor">{displayName}</span>
                        <span className="user-role-vendedor">Vendedor</span>
                    </div>
                    <div className={`dropdown-arrow-vendedor ${showDropdown ? 'open' : ''}`}>
                        ▼
                    </div>
                </div>

                {showDropdown && (
                    <div className="dropdown-menu-vendedor">
                        {/* Header del dropdown */}
                        <div className="dropdown-header-vendedor">
                            <div className="dropdown-avatar-vendedor">
                                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'V'}
                            </div>
                            <div className="dropdown-user-info-vendedor">
                                <div className="dropdown-name-vendedor">{displayName}</div>
                                <div className="dropdown-email-vendedor">
                                    {user.email || `${user.username}@agroplace.com`}
                                </div>
                                <div className="role-badge-vendedor">Vendedor</div>
                            </div>
                        </div>

                        <div className="dropdown-divider-vendedor"></div>

                        {/* Opciones del menú */}
                        <div className="dropdown-options-vendedor">
                            <div 
                                className="dropdown-option-vendedor"
                                onClick={handleSwitchToBuyer}
                            >
                                <span className="option-icon-vendedor">🛒</span>
                                <span className="option-text-vendedor">Modo Comprador</span>
                            </div>
                            
                            <div 
                                className="dropdown-option-vendedor"
                                onClick={() => {
                                    setShowEditModal(true);
                                    setShowDropdown(false);
                                }}
                            >
                                <span className="option-icon-vendedor">👤</span>
                                <span className="option-text-vendedor">Editar Perfil</span>
                            </div>
                            
                            <div 
                                className="dropdown-option-vendedor"
                                onClick={() => {
                                    // Aquí iría la lógica para configuraciones
                                    alert('Configuraciones - Próximamente');
                                    setShowDropdown(false);
                                }}
                            >
                                <span className="option-icon-vendedor">⚙️</span>
                                <span className="option-text-vendedor">Configuración</span>
                            </div>

                            <div className="dropdown-divider-vendedor"></div>

                            <div 
                                className="dropdown-option-vendedor logout-option"
                                onClick={handleLogout}
                            >
                                <span className="option-icon-vendedor">🚪</span>
                                <span className="option-text-vendedor">Cerrar Sesión</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de edición de perfil (puedes expandir esto) */}
            {showEditModal && (
                <div className="modal-overlay-vendedor">
                    <div className="modal-content-vendedor">
                        <div className="modal-header-vendedor">
                            <h3>Editar Perfil</h3>
                            <button 
                                className="close-button-vendedor"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body-vendedor">
                            <p>Funcionalidad de edición de perfil - Próximamente</p>
                            <div className="modal-actions-vendedor">
                                <button 
                                    className="btn-cancel-vendedor"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .profile-menu-vendedor {
                    position: relative;
                }

                .profile-trigger-vendedor {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .profile-trigger-vendedor:hover {
                    background: rgba(45, 122, 62, 0.1);
                    border-color: rgba(45, 122, 62, 0.3);
                }

                .avatar-vendedor {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2d7a3e, #47a855);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .user-info-vendedor {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }

                .user-name-vendedor {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #f9fafb;
                    white-space: nowrap;
                }

                .user-role-vendedor {
                    font-size: 0.7rem;
                    color: #2d7a3e;
                    background: rgba(45, 122, 62, 0.1);
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 600;
                    white-space: nowrap;
                    text-align: center;
                }

                .dropdown-arrow-vendedor {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    transition: transform 0.3s ease;
                }

                .dropdown-arrow-vendedor.open {
                    transform: rotate(180deg);
                }

                .dropdown-menu-vendedor {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: rgba(26, 31, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(45, 122, 62, 0.2);
                    border-radius: 12px;
                    min-width: 280px;
                    margin-top: 0.5rem;
                    overflow: hidden;
                    z-index: 1001;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                }

                .dropdown-header-vendedor {
                    padding: 1.5rem;
                    background: rgba(45, 122, 62, 0.1);
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .dropdown-avatar-vendedor {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2d7a3e, #47a855);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .dropdown-user-info-vendedor {
                    flex: 1;
                    min-width: 0;
                }

                .dropdown-name-vendedor {
                    font-weight: 600;
                    color: #f9fafb;
                    font-size: 1rem;
                    margin-bottom: 0.2rem;
                }

                .dropdown-email-vendedor {
                    color: #9ca3af;
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .role-badge-vendedor {
                    color: white;
                    background: linear-gradient(135deg, #2d7a3e, #47a855);
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    display: inline-block;
                }

                .dropdown-divider-vendedor {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(45, 122, 62, 0.3), transparent);
                }

                .dropdown-options-vendedor {
                    padding: 0.5rem 0;
                }

                .dropdown-option-vendedor {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 1.5rem;
                    color: #d1d5db;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                }

                .dropdown-option-vendedor:hover {
                    background: rgba(45, 122, 62, 0.1);
                    color: #47a855;
                }

                .logout-option:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .option-icon-vendedor {
                    font-size: 1rem;
                    width: 20px;
                    text-align: center;
                }

                .option-text-vendedor {
                    flex: 1;
                }

                /* Modal Styles */
                .modal-overlay-vendedor {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }

                .modal-content-vendedor {
                    background: rgba(26, 31, 46, 0.95);
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(45, 122, 62, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '400px',
                    width: '90%',
                }

                .modal-header-vendedor {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .modal-header-vendedor h3 {
                    color: #f9fafb;
                    margin: 0;
                    font-size: 1.5rem;
                }

                .close-button-vendedor {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .close-button-vendedor:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .modal-body-vendedor {
                    color: #d1d5db;
                    line-height: 1.6;
                }

                .modal-actions-vendedor {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                }

                .btn-cancel-vendedor {
                    background: #374151;
                    color: #d1d5db;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-cancel-vendedor:hover {
                    background: #4b5563;
                }
            `}</style>
        </>
    );
};

export default VendedorProfileMenu;