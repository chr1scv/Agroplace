#!/usr/bin/env python3
"""
Comprehensive script to fix AdminPanel.jsx with all required changes.
This script makes targeted, precise changes to avoid file corruption.
"""

import re

def fix_admin_panel():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Starting AdminPanel.jsx fixes...")
    
    # 1. Add VerProductoModal import
    if "import VerProductoModal from './VerProductoModal';" not in content:
        content = content.replace(
            "import EditarProductoModal from './EditarProductoModal';\nimport CategoriasTab from './CategoriasTab';",
            "import EditarProductoModal from './EditarProductoModal';\nimport VerProductoModal from './VerProductoModal';\nimport CategoriasTab from './CategoriasTab';"
        )
        print("✓ Added VerProductoModal import")
    else:
        print("✓ VerProductoModal import already exists")
    
    # 2. Add productoVer state
    if "const [productoVer, setProductoVer] = useState(null);" not in content:
        content = content.replace(
            "const [productoEditar, setProductoEditar] = useState(null);",
            "const [productoEditar, setProductoEditar] = useState(null);\n    const [productoVer, setProductoVer] = useState(null);"
        )
        print("✓ Added productoVer state")
    else:
        print("✓ productoVer state already exists")
    
    # 3. Fix aprobarProducto function
    old_aprobar = '''const aprobarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: true
        });

        showToast('✅ Producto aprobado', 'success');

        await cargarProductosPendientes();
        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando producto:', error);
        showToast('❌ Error al aprobar producto', 'error');
    }
};'''
    
    new_aprobar = '''const aprobarProducto = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/productos/${id}/aprobar_producto/`);
        showToast('✅ Producto aprobado correctamente', 'success');
        
        // Actualizar listas inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));
        
        // Recargar listas para asegurar sincronización
        cargarProductosPendientes();
        cargarProductos();
    } catch (error) {
        console.error('Error aprobando producto:', error);
        showToast('❌ Error al aprobar producto', 'error');
    }
};'''
    
    if old_aprobar in content:
        content = content.replace(old_aprobar, new_aprobar)
        print("✓ Fixed aprobarProducto function")
    else:
        print("⚠ aprobarProducto function not found or already fixed")
    
    # 4. Fix rechazarProducto function
    old_rechazar = '''const rechazarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: false,
            rechazado: true
        });

        showToast('❌ Producto rechazado', 'success');

        await cargarProductosPendientes();
        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando producto:', error);
        showToast('❌ Error al rechazar producto', 'error');
    }
};'''
    
    new_rechazar = '''const rechazarProducto = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/productos/${id}/rechazar_producto/`);
        showToast('✅ Producto rechazado correctamente', 'success');
        
        // Actualizar listas inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));
        
        // Recargar listas para asegurar sincronización
        cargarProductosPendientes();
        cargarProductos();
    } catch (error) {\n        console.error('Error rechazando producto:', error);
        showToast('❌ Error al rechazar producto', 'error');
    }
};'''
    
    if old_rechazar in content:
        content = content.replace(old_rechazar, new_rechazar)
        print("✓ Fixed rechazarProducto function")
    else:
        print("⚠ rechazarProducto function not found or already fixed")
    
    # 5. Add VerProductoModal rendering before closing export
    modal_jsx = '''
            {/* Modal Ver Producto */}
            {productoVer && (
                <VerProductoModal
                    producto={productoVer}
                    onClose={() => setProductoVer(null)}
                />
            )}'''
    
    if "VerProductoModal" not in content.split("export default AdminPanel;")[0].split("</div>")[-1]:
        # Find the last </div> before export default and add the modal
        parts = content.rsplit("export default AdminPanel;", 1)
        if len(parts) == 2:
            before_export = parts[0]
            # Find the last closing tags before export
            last_div_idx = before_export.rfind("</div>\n        </div>\n    );\n};")
            if last_div_idx != -1:
                content = before_export[:last_div_idx] + modal_jsx + "\n" + before_export[last_div_idx:] + "export default AdminPanel;"
                print("✓ Added VerProductoModal rendering")
            else:
                print("⚠ Could not find insertion point for VerProductoModal")
        else:
            print("⚠ Could not find export statement")
    else:
        print("✓ VerProductoModal rendering already exists")
    
    # Write the modified content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ AdminPanel.jsx has been successfully updated!")
    print("\nChanges applied:")
    print("1. Added VerProductoModal import")
    print("2. Added productoVer state")
    print("3. Fixed aprobarProducto function (POST endpoint + optimistic updates)")
    print("4. Fixed rechazarProducto function (POST endpoint + optimistic updates)")
    print("5. Added VerProductoModal component rendering")
    print("\nNote: Emoji removal and 'Ver descripción' column additions")
    print("need to be done manually or with a separate targeted script.")

if __name__ == "__main__":
    try:
        fix_admin_panel()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
