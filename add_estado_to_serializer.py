#!/usr/bin/env python3
"""
Add 'estado' field to UsuarioSerializer
"""

# Read the file
with open('Django/api/serializers.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the fields line to include 'estado'
old_fields = """        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'tipo_usuario', 'telefono', 'direccion', 'fecha_registro']"""

new_fields = """        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'tipo_usuario', 'estado', 'telefono', 'direccion', 'fecha_registro']"""

content = content.replace(old_fields, new_fields)

# Write back
with open('Django/api/serializers.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added 'estado' field to UsuarioSerializer!")
print("   - Now the estado field can be updated via the API")
print("   - User edit modal will now save estado changes")
