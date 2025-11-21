#!/usr/bin/env python3
"""
Script 4: Complete ProductosTab Redesign - COMPREHENSIVE & SAFE
This script will:
1. Add new filter states
2. Update filter logic
3. Redesign table structure
4. Add comprehensive filter UI
"""

def redesign_productos_tab():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Starting ProductosTab comprehensive redesign...")
    
    # ========== STEP 1: Add new filter states ==========
    print("\n[1/5] Adding new filter states...")
    
    old_states = """const ProductosTab = ({ productos, loading, onReload, onEliminarProducto, onEditarProducto, formatPrice }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('todos');"""
    
    new_states = """const ProductosTab = ({ productos, loading, onReload, onEliminarProducto, onEditarProducto, formatPrice }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');
    const [vendedorFiltro, setVendedorFiltro] = useState('todos');
    const [precioMinFiltro, setPrecioMinFiltro] = useState('');
    const [precioMaxFiltro, setPrecioMaxFiltro] = useState('');
    const [stockMinFiltro, setStockMinFiltro] = useState('');
    const [ordenarPor, setOrdenarPor] = useState('recientes');
    const [productoVer, setProductoVer] = useState(null);"""
    
    if old_states in content:
        content = content.replace(old_states, new_states)
        print("✓ Added new filter states")
    else:
        print("⚠ States pattern not found - may already be updated")
    
    # ========== STEP 2: Update filter logic ==========
    print("\n[2/5] Updating filter and sort logic...")
    
    old_filter_logic = """    // Filtrar productos
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());

        const coincideCategoria = categoriaFiltro === 'todos' ||
            producto.categoria?.nombre === categoriaFiltro;

        return coincideBusqueda && coincideCategoria;
    });

    const categorias = [...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))];"""
    
    new_filter_logic = """    // Filtrar y ordenar productos
    const productosFiltrados = productos
        .filter(producto => {
            // Búsqueda por texto
            const coincideBusqueda = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());

            // Filtro de categoría
            const coincideCategoria = categoriaFiltro === 'todos' ||
                producto.categoria?.nombre === categoriaFiltro;

            // Filtro de estado
            const coincideEstado = estadoFiltro === 'todos' ||
                (estadoFiltro === 'activo' && producto.activo) ||
                (estadoFiltro === 'inactivo' && !producto.activo);

            // Filtro de vendedor
            const coincideVendedor = vendedorFiltro === 'todos' ||
                producto.vendedor?.id === parseInt(vendedorFiltro);

            // Filtro de precio mínimo
            const coincidePrecioMin = !precioMinFiltro || producto.precio >= parseFloat(precioMinFiltro);

            // Filtro de precio máximo
            const coincidePrecioMax = !precioMaxFiltro || producto.precio <= parseFloat(precioMaxFiltro);

            // Filtro de stock mínimo
            const coincideStockMin = !stockMinFiltro || producto.stock >= parseInt(stockMinFiltro);

            return coincideBusqueda && coincideCategoria && coincideEstado && 
                   coincideVendedor && coincidePrecioMin && coincidePrecioMax && coincideStockMin;
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

    const categorias = [...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))];
    const vendedores = [...new Set(productos.map(p => p.vendedor).filter(Boolean))];"""
    
    if old_filter_logic in content:
        content = content.replace(old_filter_logic, new_filter_logic)
        print("✓ Updated filter and sort logic")
    else:
        print("⚠ Filter logic pattern not found")
    
    # ========== STEP 3: Update table headers ==========
    print("\n[3/5] Updating table structure...")
    
    old_table_headers = """                    <thead>
                        <tr>
                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Categoría</th>
                            <th className="admin-table-header">Precio</th>
                            <th className="admin-table-header">Stock</th>
                            <th className="admin-table-header">Vendedor</th>
                            <th className="admin-table-header">Estado</th>
                            <th className="admin-table-header">Acciones</th>
                        </tr>
                    </thead>"""
    
    new_table_headers = """                    <thead>
                        <tr>
                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Descripción</th>
                            <th className="admin-table-header">Categoría</th>
                            <th className="admin-table-header">Vendedor</th>
                            <th className="admin-table-header">Precio</th>
                            <th className="admin-table-header">Stock</th>
                            <th className="admin-table-header">Estado</th>
                            <th className="admin-table-header">Aprobación</th>
                            <th className="admin-table-header">Acciones</th>
                        </tr>
                    </thead>"""
    
    if old_table_headers in content:
        content = content.replace(old_table_headers, new_table_headers)
        print("✓ Updated table headers")
    else:
        print("⚠ Table headers pattern not found")
    
    # ========== STEP 4: Update table row (remove emoji, add description column) ==========
    print("\n[4/5] Updating table row structure...")
    
    # This is the most complex replacement - the product cell
    old_product_cell = """                                <td className="admin-table-cell">
                                    <div className="admin-producto-info">
                                        <div className="admin-producto-icon">
                                            {producto.categoria?.nombre === 'Frutas' ? '🍎' :
                                                producto.categoria?.nombre === 'Verduras' ? '🥕' : '🌱'}
                                        </div>
                                        <div>
                                            <span className="admin-producto-nombre">{producto.nombre}</span>
                                            {producto.descripcion && (
                                                <div className="admin-producto-descripcion">
                                                    {producto.descripcion.substring(0, 50)}
                                                    {producto.descripcion.length > 50 ? '...' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="admin-table-cell">{producto.categoria?.nombre || 'Sin categoría'}</td>
                                <td className="admin-table-cell">{formatPrice(producto.precio)}</td>
                                <td className="admin-table-cell">
                                    <span className={producto.stock > 0 ? "admin-stock-disponible" : "admin-stock-agotado"}>
                                        {producto.stock} unidades
                                    </span>
                                </td>
                                <td className="admin-table-cell">{producto.vendedor?.username || 'N/A'}</td>
                                <td className="admin-table-cell">
                                    <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                        {producto.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </td>"""
    
    new_product_cell = """                                <td className="admin-table-cell">
                                    <span className="admin-producto-nombre">{producto.nombre}</span>
                                </td>
                                <td className="admin-table-cell">
                                    <button
                                        onClick={() => setProductoVer(producto)}
                                        className="admin-link-button"
                                        style={{ background: 'none', border: 'none', color: '#2d7a3e', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                                    >
                                        Ver descripción
                                    </button>
                                </td>
                                <td className="admin-table-cell">{producto.categoria?.nombre || 'Sin categoría'}</td>
                                <td className="admin-table-cell">{producto.vendedor?.username || 'N/A'}</td>
                                <td className="admin-table-cell">{formatPrice(producto.precio)}</td>
                                <td className="admin-table-cell">
                                    <span className={producto.stock > 0 ? "admin-stock-disponible" : "admin-stock-agotado"}>
                                        {producto.stock} unidades
                                    </span>
                                </td>
                                <td className="admin-table-cell">
                                    <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                        {producto.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </td>
                                <td className="admin-table-cell">
                                    <span className={producto.aprobado ? "admin-estado-aprobado" : "admin-estado-pendiente"}>
                                        {producto.aprobado ? '✅ Aprobado' : '⏳ Pendiente'}
                                    </span>
                                </td>"""
    
    if old_product_cell in content:
        content = content.replace(old_product_cell, new_product_cell)
        print("✓ Updated table row structure")
    else:
        print("⚠ Product cell pattern not found")
    
    # Save intermediate result
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ ProductosTab table structure updated!")
    print("Next: Run script 5 to add comprehensive filter UI")
    return True

if __name__ == "__main__":
    try:
        success = redesign_productos_tab()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
