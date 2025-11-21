#!/usr/bin/env python3
"""
Script to add formatPrice prop to VerProductoModal in AdminPanel.jsx
"""

def fix_modal_props():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Adding formatPrice prop to VerProductoModal...")
    
    # Fix VerProductoModal props
    old_modal = '''            {productoVer && (
                <VerProductoModal
                    producto={productoVer}
                    onClose={() => setProductoVer(null)}
                />
            )}'''
    
    new_modal = '''            {productoVer && (
                <VerProductoModal
                    producto={productoVer}
                    onClose={() => setProductoVer(null)}
                    formatPrice={formatPrice}
                />
            )}'''
    
    if old_modal in content:
        content = content.replace(old_modal, new_modal)
        print("✓ Added formatPrice prop to VerProductoModal")
    else:
        print("⚠ VerProductoModal props not found or already fixed")
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Modal props fixed!")

if __name__ == "__main__":
    try:
        fix_modal_props()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
