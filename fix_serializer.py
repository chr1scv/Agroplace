#!/usr/bin/env python3
"""
Script to update ProductoSerializer to include nested objects
"""

def fix_serializer():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\Django\api\serializers.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Updating ProductoSerializer...")
    
    # Update ProductoSerializer
    old_serializer = '''class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Para desarrollo: convertir URL absoluta a relativa
        if data.get('imagen') and 'http://localhost:8000' in data['imagen']:
            data['imagen'] = data['imagen'].replace('http://localhost:8000', '')
        return data'''
    
    new_serializer = '''class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    vendedor = UsuarioSerializer(read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Para desarrollo: convertir URL absoluta a relativa
        if data.get('imagen') and 'http://localhost:8000' in data['imagen']:
            data['imagen'] = data['imagen'].replace('http://localhost:8000', '')
        return data'''
    
    if old_serializer in content:
        content = content.replace(old_serializer, new_serializer)
        print("✓ Updated ProductoSerializer with nested objects")
    else:
        print("⚠ ProductoSerializer not found or already updated")
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Serializer updated!")

if __name__ == "__main__":
    try:
        fix_serializer()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
