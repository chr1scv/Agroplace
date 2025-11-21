#!/usr/bin/env python3
"""
Script to fix all AdminPanel issues at once
"""

def fix_admin_panel():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print("Fixing AdminPanel.jsx...")
    
    # Find and add formatPrice after navigate
    for i, line in enumerate(lines):
        if 'const navigate = useNavigate();' in line:
            # Check if formatPrice already exists after this line
            if i + 1 < len(lines) and 'formatPrice' not in lines[i+1]:
                # Insert formatPrice function
                indent = '    '
                lines.insert(i + 1, '\n')
                lines.insert(i + 2, f'{indent}const formatPrice = (price) => {{\n')
                lines.insert(i + 3, f'{indent}    return new Intl.NumberFormat(\'es-CL\', {{\n')
                lines.insert(i + 4, f'{indent}        style: \'currency\',\n')
                lines.insert(i + 5, f'{indent}        currency: \'CLP\',\n')
                lines.insert(i + 6, f'{indent}        minimumFractionDigits: 0\n')
                lines.insert(i + 7, f'{indent}    }}).format(price);\n')
                lines.insert(i + 8, f'{indent}}};\n')
                print("✓ Added formatPrice function")
                break
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("\n✅ AdminPanel fixed!")

if __name__ == "__main__":
    try:
        fix_admin_panel()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
