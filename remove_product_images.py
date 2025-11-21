#!/usr/bin/env python3
"""
Script to remove product images and keep only vendor names in AdminPanel
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the image display and go back to simple product name
old_product_display = """                                    <div className="admin-producto-info">
                                        <div className="admin-producto-imagen">
                                            {producto.imagen ? (
                                                <img 
                                                    src={producto.imagen} 
                                                    alt={producto.nombre}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: 'rgba(45, 122, 62, 0.2)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    📦
                                                </div>
                                            )}
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
                                    </div>"""

new_product_display = """                                    <div className="admin-producto-info">
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

content = content.replace(old_product_display, new_product_display)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully removed product images from AdminPanel")
print("   - Kept vendor names for admin reference")
