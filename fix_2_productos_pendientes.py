#!/usr/bin/env python3
"""
Script 2: Fix ProductosPendientesTab - Remove emoji, show vendor
"""

def fix_productos_pendientes():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing ProductosPendientesTab...")
    
    # Find and fix the ProductosPendientesTab component
    # Remove emoji from product name and add vendor info
    
    # This is a complex replacement, so we'll do it carefully
    # Look for the card structure in ProductosPendientesTab
    
    old_card_start = '''                        <div key={producto.id} className="admin-pending-card">
                            <div className="admin-pending-card-header">
                                <h3 className="admin-pending-product-name">'''
    
    # Check if this pattern exists
    if old_card_start in content:
        print("✓ Found ProductosPendientesTab card structure")
        
        # We need to find the specific line with emoji and replace it
        # Let's search for the pattern more specifically
        lines = content.split('\n')
        modified = False
        
        for i, line in enumerate(lines):
            # Look for product name with emoji
            if 'admin-pending-product-name' in line and i + 1 < len(lines):
                next_line = lines[i + 1]
                # Check if next line has emoji logic
                if 'getProductIcon' in next_line or '🌿' in next_line or '🏭' in next_line:
                    # Replace with simple name
                    lines[i + 1] = '                                    {producto.nombre}'
                    print(f"✓ Removed emoji from line {i+1}")
                    modified = True
            
            # Look for vendor info section and add username if missing
            if 'admin-pending-info' in line and 'Vendedor' not in ''.join(lines[max(0, i-5):i+10]):
                # Find the right place to add vendor info
                # Look for the closing of precio or categoria section
                for j in range(i, min(i + 20, len(lines))):
                    if '</p>' in lines[j] and 'Precio' in lines[j-1]:
                        # Add vendor info after precio
                        indent = '                                '
                        lines.insert(j + 1, f'{indent}<p><strong>Vendedor:</strong> {{producto.vendedor?.username || "Desconocido"}}</p>')
                        print(f"✓ Added vendor info at line {j+1}")
                        modified = True
                        break
        
        if modified:
            content = '\n'.join(lines)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ ProductosPendientesTab fixed!")

if __name__ == "__main__":
    try:
        fix_productos_pendientes()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
