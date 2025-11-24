from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, Categoria, Producto, Pedido, DetallePedido, DireccionEnvio
from .serializers import (
    UsuarioSerializer, CategoriaSerializer, ProductoSerializer, 
    PedidoSerializer, DireccionEnvioSerializer, RegistroSerializer,
    DetallePedidoSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
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
    
    @action(detail=True, methods=['post'])
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
        })
    
    @action(detail=True, methods=['post'])
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
        })
    
    @action(detail=False, methods=['get'])
    def vendedores_pendientes(self, request):
        """Obtener lista de vendedores pendientes de aprobación"""
        vendedores_pendientes = Usuario.objects.filter(
            tipo_usuario='vendedor', 
            estado='pendiente'
        )
        serializer = self.get_serializer(vendedores_pendientes, many=True)
        return Response(serializer.data)
    
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.filter(activa=True)
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Producto.objects.all()  # Cambiado de filter(activo=True) a all()
        
        # Si el usuario está autenticado y es vendedor/admin, mostrar todos sus productos
        if self.request.user.is_authenticated and self.request.user.tipo_usuario in ['vendedor', 'admin']:
            if self.request.user.tipo_usuario == 'vendedor':
                # Vendedores ven todos sus productos (activos e inactivos)
                queryset = Producto.objects.filter(vendedor=self.request.user)
            # Admins ven todos los productos
        else:
            # Usuarios no autenticados o clientes solo ven productos activos Y aprobados
            queryset = Producto.objects.filter(activo=True, aprobado=True)
        
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
        
        # Filtrar por estado de aprobación
        aprobado = self.request.query_params.get('aprobado')
        if aprobado is not None:
            if aprobado.lower() == 'true':
                queryset = queryset.filter(aprobado=True)
            elif aprobado.lower() == 'false':
                queryset = queryset.filter(aprobado=False)
        
        # Filtrar por estado general
        estado = self.request.query_params.get('estado')
        if estado:
            if estado == 'activo':
                queryset = queryset.filter(activo=True, aprobado=True)
            elif estado == 'pendiente':
                queryset = queryset.filter(activo=True, aprobado=False)
            elif estado == 'inactivo':
                queryset = queryset.filter(activo=False)
        
        return queryset.select_related('categoria', 'vendedor')
    
    def perform_create(self, serializer):
        # Para desarrollo: permitir crear productos sin autenticación
        # Si el usuario está autenticado y es vendedor/admin, asignarlo como vendedor
        if self.request.user.is_authenticated and self.request.user.tipo_usuario in ['vendedor', 'admin']:
            serializer.save(vendedor=self.request.user)
        else:
            # Para usuarios no autenticados o que no son vendedores, crear sin vendedor
            # o asignar un vendedor por defecto si existe
            try:
                default_vendedor = Usuario.objects.filter(tipo_usuario='vendedor').first()
                if default_vendedor:
                    serializer.save(vendedor=default_vendedor)
                else:
                    serializer.save()  # Sin vendedor
            except:
                serializer.save()  # Sin vendedor si hay error
    
    def perform_update(self, serializer):
        # Para desarrollo: permitir actualizar sin restricciones
        producto = self.get_object()
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy para manejar soft delete y evitar problemas de CSRF"""
        try:
            print(f"🗑️ Intentando eliminar producto. User: {request.user}, Authenticated: {request.user.is_authenticated}")
            instance = self.get_object()
            print(f"📦 Producto encontrado: {instance.nombre} (ID: {instance.id})")
            print(f"👤 Vendedor del producto: {instance.vendedor.username if instance.vendedor else 'Sin vendedor'}")
            
            # Soft delete
            instance.activo = False
            instance.save()
            print(f"✅ Producto {instance.nombre} marcado como inactivo")
            
            return Response(
                {'message': 'Producto eliminado correctamente'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"❌ ERROR eliminando producto: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def mis_productos(self, request):
        """Obtener productos del vendedor autenticado"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Debe estar autenticado para ver sus productos'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if request.user.tipo_usuario not in ['vendedor', 'admin']:
            return Response(
                {'error': 'Solo los vendedores pueden ver sus productos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        productos = Producto.objects.filter(vendedor=request.user)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        """Aprobar un producto"""
        producto = self.get_object()
        producto.aprobado = True
        producto.save()
        return Response({
            'message': 'Producto aprobado exitosamente',
            'producto': ProductoSerializer(producto).data
        })
    
    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        """Rechazar un producto"""
        producto = self.get_object()
        producto.aprobado = False
        producto.activo = False
        producto.save()
        return Response({
            'message': 'Producto rechazado',
            'producto': ProductoSerializer(producto).data
        })

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        user = self.request.user
        
        # Si el usuario no está autenticado, retornar todos los pedidos para desarrollo
        if not user.is_authenticated:
            return Pedido.objects.all().prefetch_related('detalles')
        
        # Usuario autenticado - aplicar filtros según tipo de usuario
        if user.tipo_usuario == 'cliente':
            return Pedido.objects.filter(cliente=user).prefetch_related('detalles')
        elif user.tipo_usuario == 'vendedor':
            # Pedidos que contienen productos del vendedor
            return Pedido.objects.filter(
                detalles__producto__vendedor=user
            ).distinct().prefetch_related('detalles')
        elif user.tipo_usuario == 'admin':
            return Pedido.objects.all().prefetch_related('detalles')
        
        return Pedido.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            from .serializers import CrearPedidoSerializer
            return CrearPedidoSerializer
        return PedidoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        items = data['items']
        
        try:
            with transaction.atomic():
                # 1. Determinar el vendedor del pedido (asumimos que todos los productos son del mismo vendedor)
                primer_producto = Producto.objects.get(id=items[0]['producto_id'])
                vendedor = primer_producto.vendedor
                
                # 2. Procesar método de pago
                metodo_pago = data['metodo_pago']
                estado_pago = 'pendiente'  # Por defecto
                tipo_tarjeta = data.get('tipo_tarjeta', '')
                ultimos_digitos = data.get('ultimos_digitos', '')
                transaccion_id = data.get('transaccion_id', '')
                
                # Si es tarjeta, simular procesamiento y marcar como pagado
                if metodo_pago in ['tarjeta_debito', 'tarjeta_credito']:
                    estado_pago = 'pagado'
                    # Generar transaccion_id si no se proporcionó
                    if not transaccion_id:
                        import uuid
                        transaccion_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
                
                # 3. Construir dirección
                direccion = data.get('direccion_texto')
                if not direccion:
                    direccion = str(data.get('direccion_envio_id', 'Dirección no especificada'))

                # 4. Crear el pedido
                pedido = Pedido.objects.create(
                    cliente=request.user if request.user.is_authenticated else None,
                    vendedor=vendedor,
                    direccion_entrega=direccion,
                    metodo_pago=metodo_pago,
                    estado_pago=estado_pago,
                    tipo_tarjeta=tipo_tarjeta,
                    ultimos_digitos=ultimos_digitos,
                    transaccion_id=transaccion_id,
                    total=data['total'],
                    estado='pendiente'
                )
                
                # 5. Procesar items y descontar stock
                detalles_creados = []
                for item in items:
                    producto_id = item['producto_id']
                    cantidad = item['cantidad']
                    
                    # Bloquear producto para evitar condiciones de carrera
                    producto = Producto.objects.select_for_update().get(id=producto_id)
                    
                    if producto.stock < cantidad:
                        raise Exception(f"Stock insuficiente para {producto.nombre}. Disponible: {producto.stock}, Solicitado: {cantidad}")
                    
                    # Descontar stock
                    producto.stock -= cantidad
                    producto.save()
                    
                    # Calcular ganancia del vendedor (por ahora, el total del producto)
                    ganancia = producto.precio * cantidad
                    
                    # Crear detalle
                    detalle = DetallePedido.objects.create(
                        pedido=pedido,
                        producto=producto,
                        cantidad=cantidad,
                        precio_unitario=producto.precio,
                        ganancia_vendedor=ganancia
                    )
                    detalles_creados.append(detalle)
                
                # 6. Retornar respuesta exitosa
                return Response({
                    'message': 'Pedido creado exitosamente',
                    'pedido_id': pedido.id,
                    'total': pedido.total,
                    'estado_pago': pedido.estado_pago,
                    'metodo_pago': pedido.metodo_pago
                }, status=status.HTTP_201_CREATED)
                
        except Producto.DoesNotExist:
            return Response({'error': 'Uno de los productos no existe'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar estado de un pedido"""
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if not nuevo_estado:
            return Response(
                {'error': 'El campo estado es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Para desarrollo: permitir cambiar estado sin restricciones
        pedido.estado = nuevo_estado
        pedido.save()
        
        serializer = self.get_serializer(pedido)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def marcar_entregado(self, request, pk=None):
        """Marcar pedido como entregado (para vendedores)"""
        from django.utils import timezone
        
        pedido = self.get_object()
        
        if pedido.estado == 'entregado':
            return Response(
                {'error': 'El pedido ya está marcado como entregado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pedido.estado = 'entregado'
        pedido.fecha_entrega = timezone.now()
        
        if pedido.metodo_pago == 'efectivo':
            pedido.estado_pago = 'pagado'
        
        pedido.save()
        
        serializer = self.get_serializer(pedido)
        return Response({
            'message': 'Pedido marcado como entregado exitosamente',
            'pedido': serializer.data
        })

    @action(detail=True, methods=['post'])
    def cancelar_pedido(self, request, pk=None):
        """Cancelar pedido (para clientes)"""
        pedido = self.get_object()
        
        if pedido.estado == 'entregado':
            return Response(
                {'error': 'No se puede cancelar un pedido ya entregado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if pedido.estado == 'cancelado':
            return Response(
                {'error': 'El pedido ya está cancelado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Restaurar stock de productos
                for detalle in pedido.detalles.all():
                    producto = Producto.objects.select_for_update().get(id=detalle.producto.id)
                    producto.stock += detalle.cantidad
                    producto.save()
                
                # Actualizar estado del pedido
                pedido.estado = 'cancelado'
                
                # Si el pago fue con tarjeta, marcar como reembolsado
                if pedido.metodo_pago in ['tarjeta_debito', 'tarjeta_credito']:
                    pedido.estado_pago = 'reembolsado'
                
                pedido.save()
                
                serializer = self.get_serializer(pedido)
                return Response({
                    'message': 'Pedido cancelado exitosamente',
                    'pedido': serializer.data
                })
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DireccionEnvioViewSet(viewsets.ModelViewSet):
    queryset = DireccionEnvio.objects.all()
    serializer_class = DireccionEnvioSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Para desarrollo: si el usuario está autenticado, mostrar solo sus direcciones
        # Si no está autenticado, mostrar todas
        if self.request.user.is_authenticated:
            return DireccionEnvio.objects.filter(usuario=self.request.user)
        return DireccionEnvio.objects.all()
    
    def perform_create(self, serializer):
        # Para desarrollo: si el usuario está autenticado, asignarlo como usuario
        if self.request.user.is_authenticated:
            # Si se marca como principal, quitar principal de otras direcciones
            if serializer.validated_data.get('principal', False):
                DireccionEnvio.objects.filter(usuario=self.request.user, principal=True).update(principal=False)
            serializer.save(usuario=self.request.user)
        else:
            # Para usuarios no autenticados, crear sin usuario
            serializer.save()
    
    def perform_update(self, serializer):
        # Para desarrollo: permitir actualizar sin restricciones
        if self.request.user.is_authenticated and serializer.validated_data.get('principal', False):
            DireccionEnvio.objects.filter(usuario=self.request.user, principal=True).update(principal=False)
        serializer.save()

# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_csrf_token(request):
    """Endpoint para obtener CSRF token - necesario para React"""
    token = get_token(request)
    response = Response({
        'message': 'CSRF token obtenido exitosamente',
        'csrfToken': token
    })
    response.set_cookie(
        'csrftoken', 
        token, 
        max_age=3600, 
        httponly=False,  # Para que React pueda leerlo
        samesite='Lax'
    )
    return response

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def registro_usuario(request):
    print("📨 Datos recibidos en registro:", request.data)  # DEBUG
    
    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        print(f"✅ Usuario {user.username} creado exitosamente en la base de datos!")  # DEBUG
        
        # Auto-login después del registro
        login(request, user)
        
        return Response({
            'user': UsuarioSerializer(user).data,
            'message': 'Usuario registrado exitosamente en la base de datos'
        }, status=status.HTTP_201_CREATED)
    
    print("❌ Errores de validación:", serializer.errors)  # DEBUG
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_usuario(request):
    print("📨 Datos recibidos en login:", request.data)  # DEBUG
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username y password son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        print(f"✅ Login exitoso para usuario: {user.username}")  # DEBUG
        return Response({
            'user': UsuarioSerializer(user).data,
            'message': 'Login exitoso'
        })
    
    print("❌ Credenciales inválidas para usuario:", username)  # DEBUG
    return Response(
        {'error': 'Credenciales inválidas'}, 
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
def logout_usuario(request):
    if request.user.is_authenticated:
        logout(request)
        return Response({'message': 'Logout exitoso'})
    
    return Response({'message': 'No estaba autenticado'})

@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
    return Response(
        {'error': 'No autenticado'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dashboard_stats(request):
    """Estadísticas para el dashboard según el tipo de usuario"""
    user = request.user
    
    # Si no está autenticado, retornar estadísticas básicas o vacías
    if not user.is_authenticated:
        stats = {
            'total_usuarios': Usuario.objects.count(),
            'total_productos': Producto.objects.filter(activo=True).count(),
            'total_pedidos': Pedido.objects.count(),
            'total_categorias': Categoria.objects.filter(activa=True).count(),
            'message': 'Estadísticas generales (usuario no autenticado)'
        }
        return Response(stats)
    
    # Usuario autenticado - aplicar lógica según tipo de usuario
    if user.tipo_usuario == 'admin':
        stats = {
            'total_usuarios': Usuario.objects.count(),
            'total_productos': Producto.objects.filter(activo=True).count(),
            'total_pedidos': Pedido.objects.count(),
            'ingresos_totales': sum(pedido.total for pedido in Pedido.objects.all() if pedido.total),
            'total_categorias': Categoria.objects.filter(activa=True).count()
        }
    elif user.tipo_usuario == 'vendedor':
        mis_productos = Producto.objects.filter(vendedor=user, activo=True)
        pedidos_vendedor = Pedido.objects.filter(
            detalles__producto__vendedor=user
        ).distinct()
        
        stats = {
            'total_productos': mis_productos.count(),
            'productos_activos': mis_productos.filter(stock__gt=0).count(),
            'total_pedidos': pedidos_vendedor.count(),
            'ingresos_totales': sum(pedido.total for pedido in pedidos_vendedor if pedido.total),
            'pedidos_pendientes': pedidos_vendedor.filter(estado='pendiente').count(),
            'productos_sin_stock': mis_productos.filter(stock=0).count()
        }
    elif user.tipo_usuario == 'cliente':
        mis_pedidos = Pedido.objects.filter(cliente=user)
        
        stats = {
            'total_pedidos': mis_pedidos.count(),
            'pedidos_pendientes': mis_pedidos.filter(estado='pendiente').count(),
            'pedidos_entregados': mis_pedidos.filter(estado='entregado').count(),
            'total_gastado': sum(pedido.total for pedido in mis_pedidos if pedido.total),
            'direcciones_envio': DireccionEnvio.objects.filter(usuario=user).count()
        }
    else:
        stats = {
            'message': 'Tipo de usuario no reconocido',
            'total_productos': Producto.objects.filter(activo=True).count()
        }
    
    return Response(stats)

# Agregar al final de views.py

from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Review.objects.all()
        
        # Filtrar por producto
        producto_id = self.request.query_params.get('producto')
        if producto_id:
            queryset = queryset.filter(producto_id=producto_id)
            
        return queryset.order_by('-fecha_creacion')

    def perform_create(self, serializer):
        print(f"📝 Intentando crear reseña. Usuario autenticado: {self.request.user.is_authenticated}")
        
        if self.request.user.is_authenticated:
            print(f"👤 Asignando usuario autenticado: {self.request.user.username}")
            serializer.save(usuario=self.request.user)
        else:
            # Fallback para desarrollo: asignar primer usuario disponible
            print("⚠️ Usuario no autenticado. Buscando usuario por defecto...")
            try:
                default_user = Usuario.objects.filter(tipo_usuario='cliente').first() or Usuario.objects.first()
                
                if default_user:
                    print(f"👤 Asignando usuario por defecto: {default_user.username}")
                    serializer.save(usuario=default_user)
                else:
                    print("❌ No se encontró ningún usuario para asignar.")
                    # Esto probablemente fallará si el modelo requiere usuario
                    serializer.save()
            except Exception as e:
                print(f"❌ Error al asignar usuario por defecto: {str(e)}")
                raise e
