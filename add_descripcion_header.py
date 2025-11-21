#!/usr/bin/env python3
"""
Script to add "Descripción" header to products table
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Descripción header
old_headers = """                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Categoría</th>"""

new_headers = """                            <th className="admin-table-header">Producto</th>
                            <th className="admin-table-header">Descripción</th>
                            <th className="admin-table-header">Categoría</th>"""

content = content.replace(old_headers, new_headers)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully added 'Descripción' column header to products table")
