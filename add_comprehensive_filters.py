#!/usr/bin/env python3
"""
Script to add comprehensive filters to AdminPanel ProductosTab
"""

def add_comprehensive_filters():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Adding comprehensive filters...")
    
    # 1. Add filter states after categoriaFiltro
    old_states = "const [categoriaFiltro, setCategoriaFiltro] = useState('todos');"
    new_states = """const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');
    const [precioMinFiltro, setPrecioMinFiltro] = useState('');
    const [precioMaxFiltro, setPrecioMaxFiltro] = useState('');
    const [stockMinFiltro, setStockMinFiltro] = useState('');"""
    
    if old_states in content and new_states not in content:
        content = content.replace(old_states, new_states)
        print("✓ Added filter states")
    else:
        print("⚠ Filter states already exist or not found")
    
    # 2. Update filter logic
    old_filter_logic = """const productosFiltrados = productos.filter(producto => {
        const matchFiltro = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                           producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());
        const matchCategoria = categoriaFiltro === 'todos' || producto.categoria?.nombre === categoriaFiltro;
        return matchFiltro && matchCategoria;
    });"""
    
    new_filter_logic = """const productosFiltrados = productos.filter(producto => {
        // Filtro de búsqueda
        const matchFiltro = producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                           producto.descripcion?.toLowerCase().includes(filtro.toLowerCase());
        
        // Filtro de categoría
        const matchCategoria = categoriaFiltro === 'todos' || producto.categoria?.nombre === categoriaFiltro;
        
        // Filtro de estado
        const matchEstado = estadoFiltro === 'todos' || 
                           (estadoFiltro === 'activo' && producto.activo) ||
                           (estadoFiltro === 'inactivo' && !producto.activo);
        
        // Filtro de precio mínimo
        const matchPrecioMin = !precioMinFiltro || producto.precio >= parseFloat(precioMinFiltro);
        
        // Filtro de precio máximo
        const matchPrecioMax = !precioMaxFiltro || producto.precio <= parseFloat(precioMaxFiltro);
        
        // Filtro de stock mínimo
        const matchStockMin = !stockMinFiltro || producto.stock >= parseInt(stockMinFiltro);
        
        return matchFiltro && matchCategoria && matchEstado && matchPrecioMin && matchPrecioMax && matchStockMin;
    });"""
    
    if old_filter_logic in content:
        content = content.replace(old_filter_logic, new_filter_logic)
        print("✓ Updated filter logic")
    else:
        print("⚠ Filter logic not found or already updated")
    
    # 3. Replace filter UI
    old_filter_ui = """            <div className="admin-filtros-row">
                <div className="admin-search-group">
                    <label className="admin-search-label">Buscar:</label>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-filtro-group">
                    <label className="admin-filtro-label">Filtrar por categoría:</label>
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="admin-filtro-select"
                    >
                        <option value="todos">Todas las categorías</option>
                        {categorias.map(categoria => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
            </div>"""
    
    new_filter_ui = """            <div className="admin-filtros-section">
                <div className="admin-filtros-row">
                    <div className="admin-search-group">
                        <label className="admin-search-label">🔍 Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>

                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">📂 Categoría:</label>
                        <select
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                            className="admin-filtro-select"
                        >
                            <option value="todos">Todas</option>
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">📊 Estado:</label>
                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="admin-filtro-select"
                        >
                            <option value="todos">Todos</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="admin-filtros-row">
                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">💰 Precio Mínimo:</label>
                        <input
                            type="number"
                            placeholder="Ej: 1000"
                            value={precioMinFiltro}
                            onChange={(e) => setPrecioMinFiltro(e.target.value)}
                            className="admin-filtro-input"
                            min="0"
                        />
                    </div>

                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">💰 Precio Máximo:</label>
                        <input
                            type="number"
                            placeholder="Ej: 10000"
                            value={precioMaxFiltro}
                            onChange={(e) => setPrecioMaxFiltro(e.target.value)}
                            className="admin-filtro-input"
                            min="0"
                        />
                    </div>

                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">📦 Stock Mínimo:</label>
                        <input
                            type="number"
                            placeholder="Ej: 10"
                            value={stockMinFiltro}
                            onChange={(e) => setStockMinFiltro(e.target.value)}
                            className="admin-filtro-input"
                            min="0"
                        />
                    </div>

                    <div className="admin-filtro-group">
                        <button
                            onClick={() => {
                                setFiltro('');
                                setCategoriaFiltro('todos');
                                setEstadoFiltro('todos');
                                setPrecioMinFiltro('');
                                setPrecioMaxFiltro('');
                                setStockMinFiltro('');
                            }}
                            className="admin-button-secondary"
                            style={{ marginTop: '20px' }}
                        >
                            🔄 Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>"""
    
    if old_filter_ui in content:
        content = content.replace(old_filter_ui, new_filter_ui)
        print("✓ Updated filter UI")
    else:
        print("⚠ Filter UI not found or already updated")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Comprehensive filters added!")

if __name__ == "__main__":
    try:
        add_comprehensive_filters()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
