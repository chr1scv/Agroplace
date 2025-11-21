#!/usr/bin/env python3
"""
Script to remove ALL formatPrice declarations and add only ONE
"""

def fix_formatprice_once_and_for_all():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print("Removing all formatPrice declarations...")
    
    # Find and remove ALL formatPrice declarations
    i = 0
    removed_count = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line starts a formatPrice declaration
        if 'const formatPrice = (price) =>' in line or 'const formatPrice = (price) => {' in line:
            # Remove this line and the next 6 lines (the function body)
            start_i = i
            # Find the closing brace
            brace_count = 0
            found_opening = False
            while i < len(lines):
                if '{' in lines[i]:
                    found_opening = True
                    brace_count += lines[i].count('{')
                if '}' in lines[i]:
                    brace_count -= lines[i].count('}')
                i += 1
                if found_opening and brace_count == 0:
                    break
            
            # Remove the lines
            del lines[start_i:i]
            i = start_i
            removed_count += 1
            print(f"✓ Removed formatPrice declaration #{removed_count}")
        else:
            i += 1
    
    print(f"\nTotal removed: {removed_count}")
    
    # Now add ONE formatPrice after navigate
    for i, line in enumerate(lines):
        if 'const navigate = useNavigate();' in line:
            # Insert formatPrice function after navigate
            indent = '    '
            insert_pos = i + 1
            
            # Check if there's already a blank line
            if insert_pos < len(lines) and lines[insert_pos].strip() == '':
                insert_pos += 1
            
            lines.insert(insert_pos, '\n')
            lines.insert(insert_pos + 1, f'{indent}const formatPrice = (price) => {{\n')
            lines.insert(insert_pos + 2, f'{indent}    return new Intl.NumberFormat(\'es-CL\', {{\n')
            lines.insert(insert_pos + 3, f'{indent}        style: \'currency\',\n')
            lines.insert(insert_pos + 4, f'{indent}        currency: \'CLP\',\n')
            lines.insert(insert_pos + 5, f'{indent}        minimumFractionDigits: 0\n')
            lines.insert(insert_pos + 6, f'{indent}    }}).format(price);\n')
            lines.insert(insert_pos + 7, f'{indent}}};\n')
            print("✓ Added ONE formatPrice function after navigate")
            break
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("\n✅ formatPrice fixed - only ONE declaration now!")

if __name__ == "__main__":
    try:
        fix_formatprice_once_and_for_all()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
