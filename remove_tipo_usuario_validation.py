#!/usr/bin/env python3
"""
Remove tipo_usuario validation from aprobar_vendedor and rechazar_vendedor endpoints
"""

# Read the file
with open('Django/api/views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the tipo_usuario validation from aprobar_vendedor
old_aprobar = '''    @action(detail=True, methods=['post'])
    def aprobar_vendedor(self, request, pk=None):
        """Aprobar un vendedor pendiente"""
        usuario = self.get_object()
        
        if usuario.tipo_usuario != 'vendedor':
            return Response(
                {'error': 'Solo se pueden aprobar usuarios vendedores'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if usuario.estado != 'pendiente':
            return Response(
                {'error': 'El vendedor ya fue procesado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.estado = 'activo'
        usuario.save()
        
        return Response({
            'message': f'Vendedor {usuario.username} aprobado exitosamente',
            'usuario': UsuarioSerializer(usuario).data
        })'''

new_aprobar = '''    @action(detail=True, methods=['post'])
    def aprobar_vendedor(self, request, pk=None):
        """Aprobar un usuario pendiente"""
        usuario = self.get_object()
        
        if usuario.estado != 'pendiente':
            return Response(
                {'error': 'El usuario ya fue procesado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.estado = 'activo'
        usuario.is_active = True
        usuario.save()
        
        return Response({
            'message': f'Usuario {usuario.username} aprobado exitosamente',
            'usuario': UsuarioSerializer(usuario).data
        })'''

content = content.replace(old_aprobar, new_aprobar)

# Remove the tipo_usuario validation from rechazar_vendedor
old_rechazar = '''    @action(detail=True, methods=['post'])
    def rechazar_vendedor(self, request, pk=None):
        """Rechazar un vendedor pendiente"""
        usuario = self.get_object()
        
        if usuario.tipo_usuario != 'vendedor':
            return Response(
                {'error': 'Solo se pueden rechazar usuarios vendedores'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if usuario.estado != 'pendiente':
            return Response(
                {'error': 'El vendedor ya fue procesado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.estado = 'rechazado'
        usuario.save()
        
        return Response({
            'message': f'Vendedor {usuario.username} rechazado',
            'usuario': UsuarioSerializer(usuario).data
        })'''

new_rechazar = '''    @action(detail=True, methods=['post'])
    def rechazar_vendedor(self, request, pk=None):
        """Rechazar un usuario pendiente"""
        usuario = self.get_object()
        
        if usuario.estado != 'pendiente':
            return Response(
                {'error': 'El usuario ya fue procesado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.estado = 'rechazado'
        usuario.is_active = False
        usuario.save()
        
        return Response({
            'message': f'Usuario {usuario.username} rechazado',
            'usuario': UsuarioSerializer(usuario).data
        })'''

content = content.replace(old_rechazar, new_rechazar)

# Write back
with open('Django/api/views.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Removed tipo_usuario validation from approval endpoints!")
print("   - aprobar_vendedor now accepts any pending user")
print("   - rechazar_vendedor now accepts any pending user")
print("   - Both endpoints now also update is_active field")
