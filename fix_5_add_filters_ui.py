#!/usr/bin/env python3
"""
Script 5: Add Comprehensive Filter UI to ProductosTab
"""

def add_comprehensive_filters_ui():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Adding comprehensive filter UI...")
    
    # Replace the old simple filter UI with comprehensive filters
    old_filters_ui = """            {/* Filtros */}
            <div className="admin-filtros-container">
                <div className="admin-search-box">
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
    
    new_filters_ui = """            {/* Filtros Comprehensivos */}
            <div className="admin-filtros-section">
                {/* Fila 1: Búsqueda y Ordenar */}
                <div className="admin-filtros-row">
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

                    <div className="admin-filtro-group">
                        <label className="admin-filtro-label">🔄 Ordenar por:</label>
                        <select
                            value={ordenarPor}
                            onChange={(e) => setOrdenarPor(e.target.value)}
                            className="admin-filtro-select"
                        >
                            <option value="recientes">Más recientes</option>
                            <option value="nombre">Nombre (A-Z)</option>
                            <option value="precio-asc">Precio (menor a mayor)</option>
                            <option value="precio-desc">Precio (mayor a menor)</option>
                            <option value="stock">Mayor stock</option>
                        </select>
                    </div>
                </div>

                {/* Fila 2: Filtros de Categoría, Vendedor, Estado */}
                <div className="admin-filtros-row">
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
                        <label className="admin-filtro-label">👤 Vendedor:</label>
                        <select
                            value={vendedorFiltro}
                            onChange={(e) => setVendedorFiltro(e.target.value)}
                            className="admin-filtro-select"
                        >
                            <option value="todos">Todos</option>
                            {vendedores.map(vendedor => (
                                <option key={vendedor.id} value={vendedor.id}>
                                    {vendedor.username}
                                </option>
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

                {/* Fila 3: Filtros de Precio y Stock */}
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
                                setVendedorFiltro('todos');
                                setPrecioMinFiltro('');
                                setPrecioMaxFiltro('');
                                setStockMinFiltro('');
                                setOrdenarPor('recientes');
                            }}
                            className="admin-button-secondary"
                            style={{ marginTop: '20px', width: '100%' }}
                        >
                            🔄 Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>"""
    
    if old_filters_ui in content:
        content = content.replace(old_filters_ui, new_filters_ui)
        print("✓ Added comprehensive filter UI")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("\n✅ Comprehensive filters UI added successfully!")
        return True
    else:
        print("⚠ Old filter UI pattern not found - may already be updated")
        return False

if __name__ == "__main__":
    try:
        success = add_comprehensive_filters_ui()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
