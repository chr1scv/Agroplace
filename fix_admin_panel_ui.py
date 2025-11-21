#!/usr/bin/env python3
"""
Final script to add "Ver descripción" functionality and remove remaining emojis.
"""

def final_ui_fixes():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Applying final UI fixes...")
    
    # 1. Remove emoji icon div from ProductosTab
    old_product_cell = '''                                <td className="admin-table-cell">
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
                                </td>'''
    
    new_product_cell = '''                                <td className="admin-table-cell">
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
                                </td>'''
    
    if old_product_cell in content:
        content = content.replace(old_product_cell, new_product_cell)
        print("✓ Removed emoji and added 'Ver descripción' button in ProductosTab")
    else:
        print("⚠ ProductosTab product cell not found or already modified")
    
    # 2. Add "Descripción" column header in ProductosTab
    old_headers = '''                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Categoría</th>'''
    
    new_headers = '''                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Descripción</th>
                            <th className="admin-table-header">Categoría</th>'''
    
    if old_headers in content:
        content = content.replace(old_headers, new_headers)
        print("✓ Added 'Descripción' column header in ProductosTab")
    else:
        print("⚠ ProductosTab headers not found or already modified")
    
    # 3. Add "Ver descripción" to ProductosPendientesTab
    # Find the description display in ProductosPendientesTab and replace with button
    old_pending_desc = '''                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Descripción:</span>
                                    <span className="admin-detalle-valor">
                                        {producto.descripcion?.substring(0, 100)}
                                        {producto.descripcion?.length > 100 ? '...' : ''}
                                    </span>
                                </div>'''
    
    new_pending_desc = '''                                <div className="admin-detalle-item">
                                    <span className="admin-detalle-label">Descripción:</span>
                                    <button 
                                        onClick={() => setProductoVer(producto)}
                                        className="admin-link-button"
                                        style={{ background: 'none', border: 'none', color: '#2d7a3e', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                                    >
                                        Ver descripción
                                    </button>
                                </div>'''
    
    if old_pending_desc in content:
        content = content.replace(old_pending_desc, new_pending_desc)
        print("✓ Added 'Ver descripción' button in ProductosPendientesTab")
    else:
        print("⚠ ProductosPendientesTab description not found or already modified")
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Final UI fixes completed!")
    print("\nAll changes:")
    print("1. Removed emoji icons from ProductosTab")
    print("2. Added 'Descripción' column header")
    print("3. Added 'Ver descripción' button in ProductosTab")
    print("4. Added 'Ver descripción' button in ProductosPendientesTab")

if __name__ == "__main__":
    try:
        final_ui_fixes()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
