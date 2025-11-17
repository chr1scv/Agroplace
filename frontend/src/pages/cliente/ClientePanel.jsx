import React, { useState, useEffect } from 'react';

const ClientePanel = () => {
    const [activeTab, setActiveTab] = useState('pedidos');
    const [pedidos, setPedidos] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPedidos([
                {
                    id: 1001,
                    fecha: '2024-01-16',
                    estado: 'entregado',
                    total: 25500,
                    productos: [
                        { nombre: 'Manzanas Orgánicas', cantidad: 2, precio: 2500 },
                        { nombre: 'Zanahorias Frescas', cantidad: 5, precio: 1800 }
                    ],
                    direccion: 'Av. Principal 123, Santiago'
                },
                {
                    id: 1002,
                    fecha: '2024-01-15',
                    estado: 'enviado',
                    total: 18750,
                    productos: [
                        { nombre: 'Tomates Cherry', cantidad: 3, precio: 3000 },
                        { nombre: 'Lechuga Romana', cantidad: 2, precio: 1500 }
                    ],
                    direccion: 'Av. Principal 123, Santiago'
                }
            ]);

            setDirecciones([
                {
                    id: 1,
                    direccion: 'Av. Principal 123, Santiago',
                    ciudad: 'Santiago',
                    codigo_postal: '8320000',
                    principal: true
                }
            ]);

            setFavoritos([
                {
                    id: 1,
                    nombre: 'Manzanas Orgánicas',
                    precio: 2500,
                    categoria: 'Frutas',
                    vendedor: 'Granja Orgánica',
                    imagen: null
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    // Función para formatear precios en CLP
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleCancelarPedido = (pedidoId) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
            setPedidos(prev => prev.map(pedido =>
                pedido.id === pedidoId ? { ...pedido, estado: 'cancelado' } : pedido
            ));
        }
    };

    const handleAgregarDireccion = (nuevaDireccion) => {
        const nuevaDir = {
            id: Date.now(),
            ...nuevaDireccion,
            principal: direcciones.length === 0
        };
        setDirecciones(prev => [...prev, nuevaDir]);
    };

    const handleEliminarFavorito = (productoId) => {
        setFavoritos(prev => prev.filter(fav => fav.id !== productoId));
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}>🔄</div>
                <p>Cargando panel de cliente...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Mis Compras</h1>
                <p style={styles.subtitle}>Gestiona tus pedidos, favoritos y direcciones</p>
            </div>

            <div style={styles.tabs}>
                <button 
                    style={activeTab === 'pedidos' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('pedidos')}
                >
                    📦 Mis Pedidos
                </button>
                <button 
                    style={activeTab === 'favoritos' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('favoritos')}
                >
                    ❤️ Favoritos
                </button>
                <button 
                    style={activeTab === 'direcciones' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('direcciones')}
                >
                    📍 Direcciones
                </button>
                <button 
                    style={activeTab === 'perfil' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('perfil')}
                >
                    👤 Mi Perfil
                </button>
            </div>

            <div style={styles.content}>
                {activeTab === 'pedidos' && (
                    <PedidosTab 
                        pedidos={pedidos}
                        onCancelarPedido={handleCancelarPedido}
                        formatPrice={formatPrice}
                    />
                )}
                {activeTab === 'favoritos' && (
                    <FavoritosTab 
                        favoritos={favoritos}
                        onEliminarFavorito={handleEliminarFavorito}
                        formatPrice={formatPrice}
                    />
                )}
                {activeTab === 'direcciones' && (
                    <DireccionesTab 
                        direcciones={direcciones}
                        onAgregarDireccion={handleAgregarDireccion}
                    />
                )}
                {activeTab === 'perfil' && <PerfilTab formatPrice={formatPrice} />}
            </div>
        </div>
    );
};

const PedidosTab = ({ pedidos, onCancelarPedido, formatPrice }) => {
    const getEstadoStyle = (estado) => {
        const estilos = {
            entregado: { backgroundColor: '#4caf50', color: 'white' },
            enviado: { backgroundColor: '#2196f3', color: 'white' },
            preparacion: { backgroundColor: '#ff9800', color: 'white' },
            pendiente: { backgroundColor: '#ffc107', color: 'black' },
            cancelado: { backgroundColor: '#f44336', color: 'white' }
        };
        return { ...styles.estadoBadge, ...estilos[estado] };
    };

    return (
        <div>
            <h2 style={styles.tabTitle}>Historial de Pedidos</h2>
            
            <div style={styles.pedidosList}>
                {pedidos.map(pedido => (
                    <div key={pedido.id} style={styles.pedidoCard}>
                        <div style={styles.pedidoHeader}>
                            <div>
                                <h3 style={styles.pedidoId}>Pedido #{pedido.id}</h3>
                                <p style={styles.pedidoFecha}>Fecha: {pedido.fecha}</p>
                                <p style={styles.pedidoDireccion}>{pedido.direccion}</p>
                            </div>
                            <div style={styles.pedidoInfo}>
                                <span style={getEstadoStyle(pedido.estado)}>
                                    {pedido.estado}
                                </span>
                                <div style={styles.pedidoTotal}>
                                    Total: <strong>{formatPrice(pedido.total)}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.productosList}>
                            <h4>Productos:</h4>
                            {pedido.productos.map((producto, index) => (
                                <div key={index} style={styles.productoItem}>
                                    <span>{producto.cantidad} x {producto.nombre}</span>
                                    <span>{formatPrice(producto.cantidad * producto.precio)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div style={styles.pedidoActions}>
                            <button style={styles.detallesButton}>
                                👁️ Ver Detalles
                            </button>
                            {pedido.estado === 'pendiente' && (
                                <button 
                                    onClick={() => onCancelarPedido(pedido.id)}
                                    style={styles.cancelarButton}
                                >
                                    ❌ Cancelar Pedido
                                </button>
                            )}
                            {pedido.estado === 'entregado' && (
                                <button style={styles.repetirButton}>
                                    🔄 Repetir Pedido
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FavoritosTab = ({ favoritos, onEliminarFavorito, formatPrice }) => {
    return (
        <div>
            <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Mis Productos Favoritos</h2>
                <p style={styles.tabSubtitle}>
                    {favoritos.length} producto{favoritos.length !== 1 ? 's' : ''} en favoritos
                </p>
            </div>

            {favoritos.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>❤️</div>
                    <h3>No tienes productos favoritos</h3>
                    <p>Agrega productos a tus favoritos para verlos aquí</p>
                    <a href="/productos" style={styles.explorarButton}>
                        🛍️ Explorar Productos
                    </a>
                </div>
            ) : (
                <div style={styles.favoritosGrid}>
                    {favoritos.map(producto => (
                        <div key={producto.id} style={styles.favoritoCard}>
                            <div style={styles.favoritoImage}>
                                <div style={styles.placeholderImage}>
                                    {producto.categoria === 'Frutas' ? '🍎' : 
                                     producto.categoria === 'Verduras' ? '🥕' : '🌱'}
                                </div>
                            </div>
                            
                            <div style={styles.favoritoInfo}>
                                <h4 style={styles.favoritoNombre}>{producto.nombre}</h4>
                                <p style={styles.favoritoCategoria}>{producto.categoria}</p>
                                <p style={styles.favoritoVendedor}>Vendedor: {producto.vendedor}</p>
                                <div style={styles.favoritoPrecio}>
                                    {formatPrice(producto.precio)}
                                </div>
                            </div>
                            
                            <div style={styles.favoritoActions}>
                                <button style={styles.comprarButton}>
                                    🛒 Comprar
                                </button>
                                <button 
                                    onClick={() => onEliminarFavorito(producto.id)}
                                    style={styles.eliminarFavoritoButton}
                                    title="Eliminar de favoritos"
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DireccionesTab = ({ direcciones, onAgregarDireccion }) => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevaDireccion, setNuevaDireccion] = useState({
        direccion: '',
        ciudad: '',
        codigo_postal: '',
        principal: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNuevaDireccion(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAgregarDireccion(nuevaDireccion);
        setNuevaDireccion({
            direccion: '',
            ciudad: '',
            codigo_postal: '',
            principal: false
        });
        setMostrarFormulario(false);
    };

    return (
        <div>
            <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Mis Direcciones</h2>
                <button 
                    onClick={() => setMostrarFormulario(true)}
                    style={styles.agregarButton}
                >
                    ➕ Agregar Dirección
                </button>
            </div>

            {mostrarFormulario && (
                <div style={styles.formularioDireccion}>
                    <h3>Agregar Nueva Dirección</h3>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Dirección *</label>
                            <input
                                type="text"
                                name="direccion"
                                value={nuevaDireccion.direccion}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                                placeholder="Calle, número, departamento"
                            />
                        </div>
                        
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Ciudad *</label>
                                <input
                                    type="text"
                                    name="ciudad"
                                    value={nuevaDireccion.ciudad}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                    placeholder="Ciudad"
                                />
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Código Postal</label>
                                <input
                                    type="text"
                                    name="codigo_postal"
                                    value={nuevaDireccion.codigo_postal}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Código postal"
                                />
                            </div>
                        </div>
                        
                        <div style={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                name="principal"
                                checked={nuevaDireccion.principal}
                                onChange={handleInputChange}
                                style={styles.checkbox}
                            />
                            <label style={styles.checkboxLabel}>
                                Establecer como dirección principal
                            </label>
                        </div>
                        
                        <div style={styles.formActions}>
                            <button type="submit" style={styles.guardarButton}>
                                💾 Guardar Dirección
                            </button>
                            <button 
                                type="button"
                                onClick={() => setMostrarFormulario(false)}
                                style={styles.cancelarButton}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={styles.direccionesGrid}>
                {direcciones.map(direccion => (
                    <div key={direccion.id} style={styles.direccionCard}>
                        <div style={styles.direccionHeader}>
                            <h4 style={styles.direccionTitulo}>
                                Dirección {direccion.principal && '(Principal)'}
                            </h4>
                            {direccion.principal && (
                                <span style={styles.principalBadge}>⭐ Principal</span>
                            )}
                        </div>
                        
                        <div style={styles.direccionInfo}>
                            <p style={styles.direccionTexto}>{direccion.direccion}</p>
                            <p style={styles.direccionCiudad}>
                                {direccion.ciudad} {direccion.codigo_postal && `- ${direccion.codigo_postal}`}
                            </p>
                        </div>
                        
                        <div style={styles.direccionActions}>
                            <button style={styles.editarButton}>
                                ✏️ Editar
                            </button>
                            {!direccion.principal && (
                                <button style={styles.eliminarButton}>
                                    🗑️ Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PerfilTab = ({ formatPrice }) => {
    const [perfil, setPerfil] = useState({
        nombre: 'Hemil',
        email: 'hemil@agroplace.com',
        telefono: '+56 9 1234 5678',
        fecha_registro: '2024-01-10',
        tipo_cuenta: 'Cliente Premium',
        direccionPrincipal: 'Av. Principal 123, Santiago',
        preferencias: ['Frutas Orgánicas', 'Verduras Frescas', 'Productos Locales'],
        nivelFidelidad: 'Oro'
    });

    return (
        <div>
            <h2 style={styles.tabTitle}>Mi Perfil - Cliente</h2>
            
            <div style={styles.perfilCard}>
                <div style={styles.perfilHeader}>
                    <div style={styles.perfilAvatarCliente}>🛒</div>
                    <div style={styles.perfilInfo}>
                        <h3 style={styles.perfilNombre}>{perfil.nombre}</h3>
                        <p style={styles.perfilEmail}>{perfil.email}</p>
                        <span style={styles.rolBadgeCliente}>🛒 Cliente {perfil.nivelFidelidad}</span>
                    </div>
                </div>
                
                <div style={styles.perfilDetalles}>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Teléfono:</span>
                        <span style={styles.detalleValor}>{perfil.telefono}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Dirección Principal:</span>
                        <span style={styles.detalleValor}>{perfil.direccionPrincipal}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Fecha de registro:</span>
                        <span style={styles.detalleValor}>{perfil.fecha_registro}</span>
                    </div>
                    <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Nivel de Fidelidad:</span>
                        <span style={styles.detalleValor}>{perfil.nivelFidelidad}</span>
                    </div>
                </div>

                <div style={styles.preferenciasSection}>
                    <h4>Mis Preferencias</h4>
                    <div style={styles.preferenciasGrid}>
                        {perfil.preferencias.map((preferencia, index) => (
                            <div key={index} style={styles.preferenciaItem}>
                                <span style={styles.preferenciaIcon}>❤️</span>
                                <span style={styles.preferenciaText}>{preferencia}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.estadisticasCliente}>
                    <h4>Mi Actividad</h4>
                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>15</span>
                            <span style={styles.statLabel}>Pedidos Realizados</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>3</span>
                            <span style={styles.statLabel}>Productos Favoritos</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>2</span>
                            <span style={styles.statLabel}>Direcciones Guardadas</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{formatPrice(458750)}</span>
                            <span style={styles.statLabel}>Total Gastado</span>
                        </div>
                    </div>
                </div>
                
                <div style={styles.perfilActions}>
                    <button style={styles.editarPerfilButton}>
                        ✏️ Editar Perfil
                    </button>
                    <button style={styles.cambiarPasswordButton}>
                        🔒 Cambiar Contraseña
                    </button>
                    <button style={styles.gestionDireccionesButton}>
                        📍 Gestionar Direcciones
                    </button>
                    <button style={styles.preferenciasButton}>
                        ⚙️ Preferencias de Compra
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2d5016',
        marginBottom: '1rem',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
    },
    spinner: {
        fontSize: '3rem',
        marginBottom: '1rem',
        animation: 'spin 1s linear infinite',
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
    },
    tab: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderRadius: '8px 8px 0 0',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.3s',
    },
    tabActive: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: '#4a7c1f',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '8px 8px 0 0',
        fontSize: '1rem',
        fontWeight: '500',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '2rem',
    },
    tabTitle: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '1.5rem',
    },
    tabHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    tabSubtitle: {
        color: '#666',
        fontSize: '1rem',
    },
    pedidosList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    pedidoCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    pedidoHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    pedidoId: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    pedidoFecha: {
        color: '#666',
        marginBottom: '0.25rem',
    },
    pedidoDireccion: {
        color: '#666',
        fontSize: '0.9rem',
    },
    pedidoInfo: {
        textAlign: 'right',
    },
    estadoBadge: {
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '0.5rem',
    },
    pedidoTotal: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    productosList: {
        marginBottom: '1rem',
    },
    productoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    pedidoActions: {
        display: 'flex',
        gap: '1rem',
    },
    detallesButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    cancelarButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    repetirButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    explorarButton: {
        display: 'inline-block',
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '1rem',
    },
    favoritosGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    favoritoCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
    },
    favoritoImage: {
        height: '120px',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    placeholderImage: {
        fontSize: '3rem',
        opacity: 0.7,
    },
    favoritoInfo: {
        flex: 1,
        marginBottom: '1rem',
    },
    favoritoNombre: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    favoritoCategoria: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '0.25rem',
    },
    favoritoVendedor: {
        color: '#666',
        fontSize: '0.8rem',
        marginBottom: '0.5rem',
    },
    favoritoPrecio: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2d5016',
    },
    favoritoActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    comprarButton: {
        flex: 2,
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    eliminarFavoritoButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    agregarButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    formularioDireccion: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem',
    },
    input: {
        padding: '10px 12px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '0.9rem',
        outline: 'none',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    checkbox: {
        width: '18px',
        height: '18px',
    },
    checkboxLabel: {
        fontSize: '0.9rem',
        color: '#333',
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
    },
    guardarButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    direccionesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
    },
    direccionCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    direccionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    direccionTitulo: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        margin: 0,
    },
    principalBadge: {
        backgroundColor: '#ffc107',
        color: 'black',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    direccionInfo: {
        marginBottom: '1rem',
    },
    direccionTexto: {
        color: '#333',
        marginBottom: '0.5rem',
        lineHeight: '1.4',
    },
    direccionCiudad: {
        color: '#666',
        fontSize: '0.9rem',
    },
    direccionActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    editarButton: {
        backgroundColor: '#ffc107',
        color: 'black',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    eliminarButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    },
    perfilCard: {
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
    },
    perfilHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    perfilAvatarCliente: {
        width: '80px',
        height: '80px',
        backgroundColor: '#4a7c1f',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: 'white',
    },
    perfilInfo: {
        flex: 1,
    },
    perfilNombre: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    perfilEmail: {
        color: '#666',
        marginBottom: '0.5rem',
    },
    rolBadgeCliente: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    perfilDetalles: {
        marginBottom: '2rem',
    },
    detalleItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e0e0e0',
    },
    detalleLabel: {
        fontWeight: '600',
        color: '#333',
    },
    detalleValor: {
        color: '#666',
    },
    preferenciasSection: {
        marginBottom: '2rem',
    },
    preferenciasGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },
    preferenciaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
    },
    preferenciaIcon: {
        fontSize: '1rem',
    },
    preferenciaText: {
        fontSize: '0.9rem',
    },
    estadisticasCliente: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },
    statItem: {
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    statNumber: {
        display: 'block',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#666',
    },
    perfilActions: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    editarPerfilButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    cambiarPasswordButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    gestionDireccionesButton: {
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    preferenciasButton: {
        backgroundColor: '#9c27b0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default ClientePanel;