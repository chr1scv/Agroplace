#!/usr/bin/env python3
"""
Script to fix products table - remove inline description and add proper description column
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove inline description from product name cell
old_product_cell = """                                    <div className="admin-producto-info">
                                        <div>
                                            <span className="admin-producto-nombre">{producto.nombre}</span>
                                            {producto.descripcion && (
                                                <div className="admin-producto-descripcion">
                                                    {producto.descripcion.substring(0, 50)}
                                                    {producto.descripcion.length > 50 ? '...' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>"""

new_product_cell = """                                    <div className="admin-producto-info">
                                        <span className="admin-producto-nombre">{producto.nombre}</span>
                                    </div>"""

content = content.replace(old_product_cell, new_product_cell)

# Add description column after product name
old_categoria_line = """                                <td className="admin-table-cell">{producto.categoria?.nombre || 'Sin categoría'}</td>"""

new_with_description = """                                <td className="admin-table-cell">
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
                                <td className="admin-table-cell">{producto.categoria?.nombre || 'Sin categoría'}</td>"""

content = content.replace(old_categoria_line, new_with_description)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully fixed products table")
print("   - Removed inline description")
print("   - Added description column with modal link")
print("   - Category and stock columns preserved")
