#!/usr/bin/env python3
"""
Script to add missing formatPrice function and fix scope issues
"""

def fix_eslint_errors():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing ESLint errors...")
    
    # 1. Add formatPrice function after navigate declaration
    old_navigate = "const navigate = useNavigate();"
    new_navigate = """const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };"""
    
    if old_navigate in content and "const formatPrice" not in content:
        content = content.replace(old_navigate, new_navigate)
        print("✓ Added formatPrice function")
    else:
        print("⚠ formatPrice already exists or navigate not found")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ ESLint errors fixed!")

if __name__ == "__main__":
    try:
        fix_eslint_errors()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
