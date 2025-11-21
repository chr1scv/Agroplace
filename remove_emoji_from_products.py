#!/usr/bin/env python3
"""
Script to remove emoji and inline description from products table
"""
import re

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the emoji and description div, keep only product name
old_pattern = r'''                                <td className="admin-table-cell">
                                    <div className="admin-producto-info">
                                        <div className="admin-producto-icon">
                                            \{producto\.categoria\?\.nombre === 'Frutas' \? '🍎' :
                                                producto\.categoria\?\.nombre === 'Verduras' \? '🥕' : '🌱'\}
                                        </div>
                                        <div>
                                            <span className="admin-producto-nombre">\{producto\.nombre\}</span>
                                        </div>
                                    </div>
                                </td>'''

new_pattern = '''                                <td className="admin-table-cell">
                                    <span className="admin-producto-nombre">{producto.nombre}</span>
                                </td>'''

content = re.sub(old_pattern, new_pattern, content)

# Write back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully removed emoji icon from products table")
print("   - Product name now displays cleanly without emoji")
print("   - Table structure preserved")
