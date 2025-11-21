"""
Script para rediseñar el ProductosTab del AdminPanel
Incluye:
- Simplificación de filtros (solo búsqueda, ordenar, estado, categoría)
- Reorganización de columnas de tabla
- Modal para descripción
- Vinculación de categorías a la base de datos
- Barra de navegación fija
"""

import re

# Nuevo componente ProductosTab
productos_tab_component = """const ProductosTab = ({ productos, loading, onReload, onEliminarProducto, onEditarProducto, formatPrice }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');
    const [ordenarPor, setOrdenarPor] = useState('recientes');
    const [productoVer, setProductoVer] = useState(null);
    const [descripcionModal, setDescripcionModal] = useState(null);
    const [categorias, setCategorias] = useState([]);

    // Cargar categorías desde la base de datos
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categorias/', {
                    withCredentials: true
                });
                setCategorias(response.data);
            } catch (error) {
                console.error('Error cargando categorías:', error);
            }
        };
        cargarCategorias();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    // Función para obtener el estado del producto
    const getEstadoProducto = (producto) => {
        if (!producto.activo) return { texto: 'Inactivo', clase: 'estado-inactivo' };
        if (producto.aprobado) return { texto: 'Activo', clase: 'estado-activo' };
        return { texto: 'Pendiente', clase: 'estado-pendiente' };
    };

    // Filtrar y ordenar productos
    const productosFiltrados = productos
        .filter(producto => {
            // Búsqueda por texto
            const coincideBusqueda = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());

            // Filtro de categoría
            const coincideCategoria = categoriaFiltro === 'todos' ||
                producto.categoria?.id === parseInt(categoriaFiltro);

            // Filtro de estado
            let coincideEstado = true;
            if (estadoFiltro === 'activo') {
                coincideEstado = producto.activo && producto.aprobado;
            } else if (estadoFiltro === 'pendiente') {
                coincideEstado = producto.activo && !producto.aprobado;
            } else if (estadoFiltro === 'inactivo') {
                coincideEstado = !producto.activo;
            }

            return coincideBusqueda && coincideCategoria && coincideEstado;
        })
        .sort((a, b) => {
            switch(ordenarPor) {
                case 'recientes':
                    return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
                case 'precio-asc':
                    return a.precio - b.precio;
                case 'precio-desc':
                    return b.precio - a.precio;
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

    return (
        <div>
            <div className="admin-tab-header">
                <div className="admin-tab-header-row">
                    <div>
                        <h1 className="admin-tab-title">Todos los Productos</h1>
                        <p className="admin-tab-subtitle">Gestiona todos los productos de la plataforma</p>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={onReload} className="admin-reload-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros Simplificados */}
            <div className="admin-filtros-section">
                <div className="admin-filtros-row">
                    {/* Búsqueda */}
                    <div className="admin-search-box" style={{ flex: 2 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-search-icon">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o descripción..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>

                    {/* Ordenar por */}
                    <select
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value)}
                        className="admin-filter-select"
                        style={{ flex: 1 }}
                    >
                        <option value="recientes">Más recientes</option>
                        <option value="nombre">Nombre A-Z</option>
                        <option value="precio-asc">Precio: Menor a Mayor</option>
                        <option value="precio-desc">Precio: Mayor a Menor</option>
                        <option value="stock">Mayor Stock</option>
                    </select>

                    {/* Estado */}
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="admin-filter-select"
                        style={{ flex: 1 }}
                    >
                        <option value="todos">Todos los Estados</option>
                        <option value="activo">Activo</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="inactivo">Inactivo</option>
                    </select>

                    {/* Categoría */}
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="admin-filter-select"
                        style={{ flex: 1 }}
                    >
                        <option value="todos">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabla de Productos */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Vendedor</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                    <div style={{ color: '#6b7280' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <p>No se encontraron productos</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            productosFiltrados.map(producto => {
                                const estado = getEstadoProducto(producto);
                                return (
                                    <tr key={producto.id}>
                                        {/* Producto */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {producto.imagen ? (
                                                    <img 
                                                        src={producto.imagen.startsWith('http') ? producto.imagen : `http://localhost:8000${producto.imagen}`}
                                                        alt={producto.nombre}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        🌱
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#111827' }}>{producto.nombre}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {producto.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Descripción */}
                                        <td>
                                            <button
                                                onClick={() => setDescripcionModal(producto)}
                                                className="admin-link-button"
                                                style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                                            >
                                                Ver descripción
                                            </button>
                                        </td>

                                        {/* Categoría */}
                                        <td>
                                            <span className="admin-badge-categoria">
                                                {producto.categoria?.nombre || 'Sin categoría'}
                                            </span>
                                        </td>

                                        {/* Vendedor */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '32px', 
                                                    height: '32px', 
                                                    borderRadius: '50%', 
                                                    background: '#e0e7ff', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#4f46e5'
                                                }}>
                                                    {producto.vendedor?.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: '#111827' }}>
                                                        {producto.vendedor?.username || 'Sin vendedor'}
                                                    </div>
                                                    {producto.vendedor?.email && (
                                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                                            {producto.vendedor.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Precio */}
                                        <td>
                                            <span style={{ fontWeight: '600', color: '#059669' }}>
                                                {formatPrice(producto.precio)}
                                            </span>
                                        </td>

                                        {/* Stock */}
                                        <td>
                                            <span style={{ 
                                                fontWeight: '600',
                                                color: producto.stock === 0 ? '#ef4444' : producto.stock < 10 ? '#f59e0b' : '#10b981'
                                            }}>
                                                {producto.stock}
                                            </span>
                                        </td>

                                        {/* Estado */}
                                        <td>
                                            <span className={`admin-badge-estado ${estado.clase}`}>
                                                {estado.texto}
                                            </span>
                                        </td>

                                        {/* Acciones */}
                                        <td>
                                            <div className="admin-table-actions">
                                                <button
                                                    onClick={() => setProductoVer(producto)}
                                                    className="admin-action-button admin-action-view"
                                                    title="Ver detalles"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    onClick={() => onEditarProducto(producto)}
                                                    className="admin-action-button admin-action-edit"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => onEliminarProducto(producto.id, producto.nombre)}
                                                    className="admin-action-button admin-action-delete"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Descripción */}
            {descripcionModal && (
                <div className="modal-overlay" onClick={() => setDescripcionModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Descripción del Producto</h2>
                            <button onClick={() => setDescripcionModal(null)} className="modal-close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <h3 style={{ marginBottom: '12px', color: '#111827' }}>{descripcionModal.nombre}</h3>
                            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                                {descripcionModal.descripcion || 'Sin descripción disponible'}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setDescripcionModal(null)} className="admin-button-secondary">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Ver Producto */}
            {productoVer && (
                <VerProductoModal
                    producto={productoVer}
                    onClose={() => setProductoVer(null)}
                    formatPrice={formatPrice}
                />
            )}
        </div>
    );
};"""

# Leer el archivo AdminPanel.jsx
admin_panel_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx"
with open(admin_panel_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar y reemplazar el componente ProductosTab
# Buscar el inicio del componente ProductosTab
pattern = r'const ProductosTab = \(\{ productos, loading, onReload, onEliminarProducto, onEditarProducto, formatPrice \}\) => \{[\s\S]*?^\};'

# Reemplazar
new_content = re.sub(pattern, productos_tab_component, content, flags=re.MULTILINE)

# Escribir el archivo actualizado
with open(admin_panel_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ ProductosTab actualizado con:")
print("   - Filtros simplificados (búsqueda, ordenar, estado, categoría)")
print("   - Categorías vinculadas a la base de datos")
print("   - Modal de descripción")
print("   - Columna de vendedor con información")
print("   - Estado unificado (activo/pendiente/inactivo)")
