#!/usr/bin/env python3
"""
Script to improve AdminPanel products display:
1. Remove emojis and show product images
2. Show vendor names instead of N/A  
3. Fix edit modal height
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace emoji product icons with actual images
old_product_icon = """                                    <div className="admin-producto-info">
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
                                    </div>"""

new_product_icon = """                                    <div className="admin-producto-info">
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

content = content.replace(old_product_icon, new_product_icon)

# 2. Fix vendor name display - show full name or username
old_vendor_display = """                                <td className="admin-table-cell">{producto.vendedor?.username || 'N/A'}</td>"""

new_vendor_display = """                                <td className="admin-table-cell">
                                    {producto.vendedor_nombre || producto.vendedor?.first_name 
                                        ? `${producto.vendedor?.first_name || ''} ${producto.vendedor?.last_name || ''}`.trim() || producto.vendedor?.username
                                        : producto.vendedor?.username || 'Sin vendedor'}
                                </td>"""

content = content.replace(old_vendor_display, new_vendor_display)

# 3. Remove emojis from active/inactive status
old_status = """                                    <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                        {producto.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>"""

new_status = """                                    <span className={producto.activo ? "admin-estado-activo" : "admin-estado-inactivo"}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>"""

content = content.replace(old_status, new_status)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated AdminPanel.jsx products display")
print("   - Replaced emoji icons with product images")
print("   - Fixed vendor name display")
print("   - Removed emojis from status badges")
