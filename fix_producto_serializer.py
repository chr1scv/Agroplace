#!/usr/bin/env python3
"""
Script to fix ProductoSerializer for read/write operations
"""

def fix_producto_serializer():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\Django\api\serializers.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing ProductoSerializer...")
    
    old_serializer = '''class ProductoSerializer(serializers.ModelSerializer):
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
    
    new_serializer = '''class ProductoSerializer(serializers.ModelSerializer):
    # Para escritura: acepta IDs
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        source='categoria',
        write_only=True,
        required=False
    )
    vendedor_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='vendedor',
        write_only=True,
        required=False
    )
    
    # Para lectura: objetos completos
    categoria = CategoriaSerializer(read_only=True)
    vendedor = UsuarioSerializer(read_only=True)
    
    # Campos adicionales de conveniencia
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
        print("✓ Fixed ProductoSerializer")
    else:
        print("⚠ ProductoSerializer not found or already fixed")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Serializer fixed!")

if __name__ == "__main__":
    try:
        fix_producto_serializer()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
