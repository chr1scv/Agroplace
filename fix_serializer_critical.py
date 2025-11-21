"""
Fix crítico: El ProductoSerializer tiene categoria y vendedor como read_only
lo que impide crear productos. Necesitamos permitir escritura pero mantener
la representación anidada para lectura.
"""

serializer_content = """from rest_framework import serializers
from .models import Usuario, Categoria, Producto, Pedido, DetallePedido, DireccionEnvio

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'tipo_usuario', 'estado', 'telefono', 'direccion', 'fecha_registro']
        read_only_fields = ['fecha_registro']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar nombres
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'
    
    def to_representation(self, instance):
        \"\"\"
        Personalizar la representación para incluir objetos anidados en lectura
        \"\"\"
        data = super().to_representation(instance)
        
        # Para desarrollo: convertir URL absoluta a relativa
        if data.get('imagen') and 'http://localhost:8000' in data['imagen']:
            data['imagen'] = data['imagen'].replace('http://localhost:8000', '')
        
        # Agregar objetos anidados para lectura
        if instance.categoria:
            data['categoria'] = {
                'id': instance.categoria.id,
                'nombre': instance.categoria.nombre,
            }
        
        if instance.vendedor:
            data['vendedor'] = {
                'id': instance.vendedor.id,
                'username': instance.vendedor.username,
                'email': instance.vendedor.email,
            }
        
        return data

class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.DecimalField(source='producto.precio', read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = DetallePedido
        fields = ['id', 'producto', 'producto_nombre', 'producto_precio', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.username', read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'

class DireccionEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DireccionEnvio
        fields = '__all__'

# Serializer para registro de usuarios
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'password_confirm', 
                 'tipo_usuario', 'telefono', 'direccion']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # ✅ Vendedores quedan como "pendiente", clientes como "activo"
        if validated_data['tipo_usuario'] == 'vendedor':
            validated_data['estado'] = 'pendiente'
        else:
            validated_data['estado'] = 'activo'
        
        user = Usuario.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
"""

# Escribir el archivo serializers.py actualizado
serializers_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\Django\api\serializers.py"
with open(serializers_path, 'w', encoding='utf-8') as f:
    f.write(serializer_content)

print("✅ ProductoSerializer arreglado - categoria y vendedor ahora permiten escritura")
print("   Los objetos anidados solo se retornan en to_representation() para lectura")
