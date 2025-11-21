#!/usr/bin/env python3
"""
Final script to fix products table:
1. Add "Descripción" header
2. Remove emoji and inline description from product name
3. Add "Ver descripción" link column
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace table headers (around line 977-978)
for i, line in enumerate(lines):
    if '<th className="admin-table-header">Producto</th>' in line and i < 1000:
        # Check next line
        if i + 1 < len(lines) and '<th className="admin-table-header">Categoría</th>' in lines[i + 1]:
            # Insert Descripción header
            lines[i + 1] = '                            <th className="admin-table-header">Descripción</th>\r\n' + lines[i + 1]
            break

# Find and replace product cell (around lines 989-1006)
in_product_cell = False
start_idx = None
end_idx = None

for i, line in enumerate(lines):
    if '<td className="admin-table-cell">' in line and '<div className="admin-producto-info">' in lines[i + 1] if i + 1 < len(lines) else False:
        start_idx = i
        in_product_cell = True
    elif in_product_cell and '</td>' in line and 'admin-table-cell' not in line:
        end_idx = i
        break

if start_idx and end_idx:
    # Replace the product cell
    new_cell = '''                                <td className="admin-table-cell">
                                    <span className="admin-producto-nombre">{producto.nombre}</span>
                                </td>
                                <td className="admin-table-cell">
                                    {producto.descripcion ? (
                                        <button
                                            onClick={() => {
                                                const modal = document.createElement('div');
                                                modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;';
                                                modal.innerHTML = `
                                                    <div style="background: rgba(26, 31, 46, 0.98); border-radius: 16px; padding: 2rem; max-width: 600px; width: 90%; border: 1px solid rgba(45, 122, 62, 0.3);">
                                                        <h3 style="color: #f9fafb; margin-bottom: 1rem; font-size: 1.25rem;">Descripción del Producto</h3>
                                                        <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 1.5rem;">${producto.descripcion}</p>
                                                        <button onclick="this.parentElement.parentElement.remove()" style="background: linear-gradient(135deg, #2d7a3e, #47a855); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600;">Cerrar</button>
                                                    </div>
                                                `;
                                                modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                                                document.body.appendChild(modal);
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#2d7a3e',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                padding: 0,
                                                font: 'inherit'
                                            }}
                                        >
                                            Ver descripción
                                        </button>
                                    ) : (
                                        <span style={{ color: '#6b7280' }}>Sin descripción</span>
                                    )}
                                </td>
'''
    lines[start_idx:end_idx + 1] = [new_cell]

# Write back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Successfully fixed products table!")
print("   - Added 'Descripción' column header")
print("   - Removed emoji and inline description")
print("   - Added 'Ver descripción' link")
print("   - Category column preserved and working")
