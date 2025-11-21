#!/usr/bin/env python3
"""
Script 8: Fix UsuarioSerializer to include 'estado' field
"""

def fix_usuario_serializer():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\Django\api\serializers.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Updating UsuarioSerializer...")
    
    old_fields = """    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'tipo_usuario', 'telefono', 'direccion', 'fecha_registro']"""
    
    new_fields = """    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'tipo_usuario', 'estado', 'telefono', 'direccion', 'fecha_registro']"""
    
    if old_fields in content:
        content = content.replace(old_fields, new_fields)
        print("✓ Added 'estado' to UsuarioSerializer fields")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("\n✅ UsuarioSerializer updated successfully!")
        return True
    else:
        print("⚠ Pattern not found - checking if already updated...")
        if "'estado'" in content and "class UsuarioSerializer" in content:
             print("✓ 'estado' already in fields")
             return True
        
        print("❌ Could not match pattern. Manual review needed.")
        return False

if __name__ == "__main__":
    try:
        success = fix_usuario_serializer()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        exit(1)
