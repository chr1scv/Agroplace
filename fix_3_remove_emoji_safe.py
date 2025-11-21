#!/usr/bin/env python3
"""
Script 3: Remove emoji icon from ProductosPendientesTab - SAFE VERSION
"""

def fix_productos_pendientes_emoji():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Removing emoji from ProductosPendientesTab...")
    
    # Find the exact pattern to replace
    old_pattern = """                        <div key={producto.id} className="admin-producto-card">
                            <div className="admin-producto-header">
                                <div className="admin-producto-icon">
                                    {producto.categoria?.nombre === 'Frutas' ? '🍎' :
                                        producto.categoria?.nombre === 'Verduras' ? '🥕' : '🌱'}
                                </div>
                                <div className="admin-producto-info">
                                    <h3 className="admin-producto-nombre">{producto.nombre}</h3>
                                    <p className="admin-producto-categoria">{producto.categoria?.nombre}</p>
                                    <p className="admin-producto-precio">{formatPrice(producto.precio)}</p>
                                </div>
                            </div>"""
    
    new_pattern = """                        <div key={producto.id} className="admin-producto-card">
                            <div className="admin-producto-header">
                                <div className="admin-producto-info">
                                    <h3 className="admin-producto-nombre">{producto.nombre}</h3>
                                    <p className="admin-producto-categoria">{producto.categoria?.nombre}</p>
                                    <p className="admin-producto-precio">{formatPrice(producto.precio)}</p>
                                </div>
                            </div>"""
    
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        print("✓ Removed emoji icon from ProductosPendientesTab")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("\n✅ ProductosPendientesTab emoji removed successfully!")
        return True
    else:
        print("⚠ Pattern not found - checking if already fixed...")
        if "admin-producto-icon" not in content or content.count("admin-producto-icon") < 2:
            print("✓ Emoji already removed!")
            return True
        else:
            print("❌ Pattern doesn't match exactly. Manual review needed.")
            return False

if __name__ == "__main__":
    try:
        success = fix_productos_pendientes_emoji()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
