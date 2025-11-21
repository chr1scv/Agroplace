#!/usr/bin/env python3
"""
Add get_queryset method to UsuarioViewSet to enable filtering
"""

# Read the file
with open('Django/api/views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the UsuarioViewSet class and add get_queryset method
old_class = '''class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['post'])'''

new_class = '''class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Filtrar usuarios por query parameters"""
        queryset = Usuario.objects.all()
        
        # Filtrar por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtrar por tipo de usuario
        tipo_usuario = self.request.query_params.get('tipo_usuario')
        if tipo_usuario:
            queryset = queryset.filter(tipo_usuario=tipo_usuario)
        
        return queryset
    
    @action(detail=True, methods=['post'])'''

content = content.replace(old_class, new_class)

# Write back
with open('Django/api/views.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added get_queryset method to UsuarioViewSet!")
print("   - Now filtering by estado and tipo_usuario works correctly")
print("   - Only pending users will appear in 'Vendedores Pendientes'")
