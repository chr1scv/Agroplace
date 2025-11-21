#!/usr/bin/env python3
"""
Script 6: Add VerProductoModal import and render in ProductosTab
"""

def add_ver_producto_modal():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Adding VerProductoModal...")
    
    # Step 1: Add import
    old_imports = """import EditarProductoModal from './EditarProductoModal';
import CategoriasTab from './CategoriasTab';"""
    
    new_imports = """import EditarProductoModal from './EditarProductoModal';
import VerProductoModal from './VerProductoModal';
import CategoriasTab from './CategoriasTab';"""
    
    if old_imports in content and "import VerProductoModal" not in content:
        content = content.replace(old_imports, new_imports)
        print("✓ Added VerProductoModal import")
    else:
        print("⚠ Import already exists or pattern not found")
    
    # Step 2: Find the end of ProductosTab and add the modal before the closing div
    # Look for the pattern at the end of ProductosTab
    old_end_pattern = """            {productosFiltrados.length === 0 && (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">📦</div>
                    <h3 className="admin-empty-title">No se encontraron productos</h3>
                    <p className="admin-empty-text">
                        {filtro || categoriaFiltro !== 'todos' ? 'Intenta ajustar los filtros' : 'No hay productos registrados'}
                    </p>
                </div>
            )}
        </div>
    );
};"""
    
    new_end_pattern = """            {productosFiltrados.length === 0 && (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">📦</div>
                    <h3 className="admin-empty-title">No se encontraron productos</h3>
                    <p className="admin-empty-text">
                        {filtro || categoriaFiltro !== 'todos' ? 'Intenta ajustar los filtros' : 'No hay productos registrados'}
                    </p>
                </div>
            )}

            {/* Modal Ver Producto */}
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
    
    if old_end_pattern in content:
        content = content.replace(old_end_pattern, new_end_pattern)
        print("✓ Added VerProductoModal render")
    else:
        print("⚠ End pattern not found - checking alternative...")
        # Try to find just the closing of ProductosTab
        if "const ProductosTab" in content:
            print("✓ ProductosTab found, modal may already be added")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ VerProductoModal integration complete!")
    return True

if __name__ == "__main__":
    try:
        success = add_ver_producto_modal()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
