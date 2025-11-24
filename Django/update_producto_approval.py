#!/usr/bin/env python3
"""
Script to update ProductoViewSet with approval system and user-based filtering
"""

# Read the file
with open('api/views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the get_queryset method
old_get_queryset = """    def get_queryset(self):
        queryset = Producto.objects.filter(activo=True)
        
        # Filtros
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria_id=categoria)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        origen = self.request.query_params.get('origen')
        if origen:
            queryset = queryset.filter(origen=origen)
        
        precio_max = self.request.query_params.get('precio_max')
        if precio_max:
            queryset = queryset.filter(precio__lte=precio_max)
        
        # Filtrar por vendedor si es necesario
        vendedor = self.request.query_params.get('vendedor')
        if vendedor:
            queryset = queryset.filter(vendedor_id=vendedor)
        
        return queryset.select_related('categoria', 'vendedor')"""

new_get_queryset = """    def get_queryset(self):
        queryset = Producto.objects.filter(activo=True)
        user = self.request.user
        
        # FILTRADO POR TIPO DE USUARIO
        if user.is_authenticated:
            if user.tipo_usuario == 'vendedor':
                # Vendedores ven solo sus propios productos (todos los estados)
                queryset = queryset.filter(vendedor=user)
            elif user.tipo_usuario == 'admin':
                # Admin ve todos los productos (todos los estados)
                pass  # No filtrar por aprobado
            else:
                # Clientes solo ven productos aprobados
                queryset = queryset.filter(aprobado=True)
        else:
            # Usuarios no autenticados solo ven productos aprobados
            queryset = queryset.filter(aprobado=True)
        
        # Filtros adicionales
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria_id=categoria)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        origen = self.request.query_params.get('origen')
        if origen:
            queryset = queryset.filter(origen=origen)
        
        precio_max = self.request.query_params.get('precio_max')
        if precio_max:
            queryset = queryset.filter(precio__lte=precio_max)
        
        # Filtro manual de aprobado (para admin)
        aprobado = self.request.query_params.get('aprobado')
        if aprobado is not None:
            if aprobado.lower() == 'false':
                queryset = queryset.filter(aprobado=False)
            elif aprobado.lower() == 'true':
                queryset = queryset.filter(aprobado=True)
        
        # Filtrar por vendedor específico (para admin)
        vendedor = self.request.query_params.get('vendedor')
        if vendedor:
            queryset = queryset.filter(vendedor_id=vendedor)
        
        return queryset.select_related('categoria', 'vendedor')"""

content = content.replace(old_get_queryset, new_get_queryset)

# Add approval endpoints before mis_productos
approval_endpoints = """    
    @action(detail=True, methods=['post'])
    def aprobar_producto(self, request, pk=None):
        \"\"\"Aprobar un producto pendiente\"\"\"
        producto = self.get_object()
        
        # Solo admin puede aprobar
        if not request.user.is_authenticated or request.user.tipo_usuario != 'admin':
            return Response(
                {'error': 'Solo los administradores pueden aprobar productos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if producto.aprobado:
            return Response(
                {'error': 'El producto ya está aprobado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        producto.aprobado = True
        producto.save()
        
        return Response({
            'message': f'Producto "{producto.nombre}" aprobado exitosamente',
            'producto': ProductoSerializer(producto).data
        })
    
    @action(detail=True, methods=['post'])
    def rechazar_producto(self, request, pk=None):
        \"\"\"Rechazar un producto pendiente\"\"\"
        producto = self.get_object()
        
        # Solo admin puede rechazar
        if not request.user.is_authenticated or request.user.tipo_usuario != 'admin':
            return Response(
                {'error': 'Solo los administradores pueden rechazar productos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if producto.aprobado:
            return Response(
                {'error': 'El producto ya está aprobado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        producto.aprobado = False
        producto.activo = False  # Desactivar producto rechazado
        producto.save()
        
        return Response({
            'message': f'Producto "{producto.nombre}" rechazado',
            'producto': ProductoSerializer(producto).data
        })
    
    @action(detail=False, methods=['get'])
    def productos_pendientes(self, request):
        \"\"\"Obtener lista de productos pendientes de aprobación\"\"\"
        # Solo admin puede ver productos pendientes
        if not request.user.is_authenticated or request.user.tipo_usuario != 'admin':
            return Response(
                {'error': 'Solo los administradores pueden ver productos pendientes'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        productos_pendientes = Producto.objects.filter(
            activo=True,
            aprobado=False
        )
        serializer = self.get_serializer(productos_pendientes, many=True)
        return Response(serializer.data)
"""

# Insert approval endpoints before mis_productos
mis_productos_marker = "    @action(detail=False, methods=['get'])\n    def mis_productos(self, request):"
content = content.replace(mis_productos_marker, approval_endpoints + mis_productos_marker)

# Write the file back
with open('api/views.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated ProductoViewSet with approval system")
print("   - User-based filtering implemented")
print("   - Approval/rejection endpoints added")
print("   - Productos pendientes endpoint added")
