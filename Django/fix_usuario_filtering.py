#!/usr/bin/env python3
"""
Script to add get_queryset to UsuarioViewSet for proper filtering
"""

# Read the file
with open('api/views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the UsuarioViewSet class and add get_queryset method
old_viewset = """class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['post'])"""

new_viewset = """class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        \"\"\"Filtrar usuarios por query parameters\"\"\"
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
    
    @action(detail=True, methods=['post'])"""

content = content.replace(old_viewset, new_viewset)

# Write the file back
with open('api/views.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully added get_queryset to UsuarioViewSet")
print("   - Now filters by 'estado' query parameter")
print("   - Now filters by 'tipo_usuario' query parameter")
