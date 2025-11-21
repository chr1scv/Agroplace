#!/usr/bin/env python3
"""
Script to fix AdminPanel.jsx by:
1. Adding VerProductoModal import
2. Adding productoVer state
3. Removing emojis from ProductosTab
4. Adding "Ver descripción" column to ProductosTab
5. Removing emojis from ProductosPendientesTab (if it exists)
6. Adding "Ver descripción" link to ProductosPendientesTab
7. Fixing aprobarProducto and rechazarProducto functions
"""

import re

# Read the file
with open(r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add VerProductoModal import after EditarProductoModal
content = content.replace(
    "import EditarProductoModal from './EditarProductoModal';\nimport CategoriasTab from './CategoriasTab';",
    "import EditarProductoModal from './EditarProductoModal';\nimport VerProductoModal from './VerProductoModal';\nimport CategoriasTab from './CategoriasTab';"
)

# 2. Add productoVer state after productoEditar
content = content.replace(
    "const [productoEditar, setProductoEditar] = useState(null);",
    "const [productoEditar, setProductoEditar] = useState(null);\n    const [productoVer, setProductoVer] = useState(null);"
)

# 3. Remove emoji logic from ProductosTab product name display
# Find and replace the emoji icon div in ProductosTab
emoji_pattern = r'(<div className="admin-producto-icon">)\s*\{producto\.categoria\?\.nombre === [\'"]Frutas[\'"] \? [\'"]🍎[\'"] :\s*producto\.categoria\?\.nombre === [\'"]Verduras[\'"] \? [\'"]🥕[\'"] : [\'"]🌱[\'"]}\s*(</div>)'
content = re.sub(emoji_pattern, '', content, flags=re.DOTALL)

# 4. Add "Ver descripción" column header in ProductosTab table
# Find the table headers section and add Descripción column
content = content.replace(
    '<th className="admin-table-header">Producto</th>\n                            <th className="admin-table-header">Categoría</th>',
    '<th className="admin-table-header">Producto</th>\n                            <th className="admin-table-header">Descripción</th>\n                            <th className="admin-table-header">Categoría</th>'
)

# 5. Add "Ver descripción" cell in ProductosTab table body
# This is more complex - we need to add a new <td> after the product name cell
# Find the pattern for product name cell and add description cell after it
product_cell_pattern = r'(<span className="admin-producto-nombre">\{producto\.nombre\}</span>\s*</div>\s*</div>\s*</td>)'
replacement = r'\1\n                                <td className="admin-table-cell">\n                                    <button \n                                        onClick={() => setProductoVer(producto)}\n                                        className="admin-link-button"\n                                        style={{ background: \'none\', border: \'none\', color: \'#2d7a3e\', textDecoration: \'underline\', cursor: \'pointer\', padding: 0, fontSize: \'0.9rem\' }}\n                                    >\n                                        Ver descripción\n                                    </button>\n                                </td>'
content = re.sub(product_cell_pattern, replacement, content, count=1)

# 6. Fix aprobarProducto function
aprobar_old = r'const aprobarProducto = async \(id\) => \{[^}]*await axios\.post\(`http://localhost:8000/api/productos/\$\{id\}/aprobar_producto/`\);[^}]*cargarProductosPendientes\(\);[^}]*\};'
aprobar_new = '''const aprobarProducto = async (id) => {
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
content = re.sub(aprobar_old, aprobar_new, content, flags=re.DOTALL)

# 7. Fix rechazarProducto function
rechazar_old = r'const rechazarProducto = async \(id\) => \{[^}]*await axios\.post\(`http://localhost:8000/api/productos/\$\{id\}/rechazar_producto/`\);[^}]*cargarProductosPendientes\(\);[^}]*\};'
rechazar_new = '''const rechazarProducto = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/productos/${id}/rechazar_producto/`);
            showToast('✅ Producto rechazado correctamente', 'success');
            
            // Actualizar listas inmediatamente
            setProductosPendientes(prev => prev.filter(p => p.id !== id));
            
            // Recargar listas para asegurar sincronización
            cargarProductosPendientes();
            cargarProductos();
        } catch (error) {
            console.error('Error rechazando producto:', error);
            showToast('❌ Error al rechazar producto', 'error');
        }
    };'''
content = re.sub(rechazar_old, rechazar_new, content, flags=re.DOTALL)

# 8. Add VerProductoModal component before the closing export
# Find the export default line and add the modal before it
export_pattern = r'(export default AdminPanel;)'
modal_jsx = '''
            {/* Modal Ver Producto */}
            {productoVer && (
                <VerProductoModal
                    producto={productoVer}
                    onClose={() => setProductoVer(null)}
                />
            )}

        </div>
    );
};

'''
content = re.sub(r'(\s*</div>\s*\);\s*\};\s*)(export default AdminPanel;)', modal_jsx + r'\2', content)

# Write the modified content back
with open(r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ AdminPanel.jsx has been successfully updated!")
print("Changes made:")
print("1. Added VerProductoModal import")
print("2. Added productoVer state")
print("3. Removed emoji icons from ProductosTab")
print("4. Added 'Ver descripción' column to ProductosTab")
print("5. Fixed aprobarProducto function with optimistic updates")
print("6. Fixed rechazarProducto function with optimistic updates")
print("7. Added VerProductoModal component rendering")
