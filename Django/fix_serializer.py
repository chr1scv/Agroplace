#!/usr/bin/env python3
"""
Script to add vendedor object to ProductoSerializer
"""

# Read the file
with open('api/serializers.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add vendedor field to ProductoSerializer
old_serializer = """class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'"""

new_serializer = """class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True)
    vendedor = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'"""

content = content.replace(old_serializer, new_serializer)

# Write the file back
with open('api/serializers.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully added vendedor object to ProductoSerializer")
