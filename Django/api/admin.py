from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Categoria, Producto, Pedido, DetallePedido, DireccionEnvio, Notificacion

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['username', 'email', 'tipo_usuario', 'fecha_registro', 'is_active']
    list_filter = ['tipo_usuario', 'fecha_registro', 'is_active']
    search_fields = ['username', 'email']
    fieldsets = UserAdmin.fieldsets + (
        ('Información Agroplace', {
            'fields': ('tipo_usuario', 'telefono', 'direccion')
        }),
    )

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activa']
    list_filter = ['activa']
    search_fields = ['nombre']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'vendedor', 'precio', 'stock', 'categoria', 'origen', 'activo', 'aprobado']
    list_filter = ['categoria', 'origen', 'activo', 'aprobado', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    raw_id_fields = ['vendedor']
    actions = ['aprobar_productos', 'rechazar_productos']
    
    def aprobar_productos(self, request, queryset):
        count = 0
        for producto in queryset:
            if not producto.aprobado:
                producto.aprobado = True
                producto.save()
                count += 1
                
                Notificacion.objects.create(
                    usuario=producto.vendedor,
                    tipo='producto_aprobado',
                    titulo='Producto Aprobado',
                    mensaje=f'Tu producto "{producto.nombre}" ha sido aprobado y ya está visible en la tienda',
                    producto=producto
                )
        
        self.message_user(request, f"{count} producto(s) aprobado(s) y notificacion(es) enviada(s)")
    
    aprobar_productos.short_description = "Aprobar productos seleccionados"
    
    def rechazar_productos(self, request, queryset):
        count = 0
        for producto in queryset:
            if producto.aprobado:
                producto.aprobado = False
                producto.save()
                count += 1
                
                Notificacion.objects.create(
                    usuario=producto.vendedor,
                    tipo='producto_rechazado',
                    titulo='Producto No Aprobado',
                    mensaje=f'Tu producto "{producto.nombre}" no ha sido aprobado. Por favor revisa los requisitos.',
                    producto=producto
                )
        
        self.message_user(request, f"{count} producto(s) rechazado(s)")
    
    rechazar_productos.short_description = "Rechazar productos seleccionados"
    list_display = ['nombre', 'vendedor', 'precio', 'stock', 'categoria', 'origen', 'activo', 'aprobado']
    list_filter = ['categoria', 'origen', 'activo', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    raw_id_fields = ['vendedor']
    actions = ['aprobar_productos', 'rechazar_productos']

    def aprobar_productos(self, request, queryset):
        """Aprobar productos seleccionados y notificar a los vendedores"""
        count = 0
        for producto in queryset:
            if not producto.aprobado:
                producto.aprobado = True
                producto.save()
                count += 1
                
                # Crear notificación
                Notificacion.objects.create(
                    usuario=producto.vendedor,
                    tipo='producto_aprobado',
                    titulo='🎉 Producto Aprobado',
                    mensaje=f'Tu producto "{producto.nombre}" ha sido aprobado y ya está visible en la tienda',
                    producto=producto
                )
        
        self.message_user(request, f"{count} producto(s) aprobado(s) y notificación(es) enviada(s)")
    
    aprobar_productos.short_description = "✅ Aprobar productos seleccionados"
    
    def rechazar_productos(self, request, queryset):
        """Rechazar productos seleccionados"""
        count = 0
        for producto in queryset:
            if producto.aprobado:
                producto.aprobado = False
                producto.save()
                count += 1
                
                # Crear notificación de rechazo
                Notificacion.objects.create(
                    usuario=producto.vendedor,
                    tipo='producto_rechazado',
                    titulo='❌ Producto No Aprobado',
                    mensaje=f'Tu producto "{producto.nombre}" no ha sido aprobado. Por favor revisa los requisitos.',
                    producto=producto
                )
        
        self.message_user(request, f"{count} producto(s) rechazado(s)")
    
    rechazar_productos.short_description = "❌ Rechazar productos seleccionados"



class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 1

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'fecha_pedido', 'estado', 'total']
    list_filter = ['estado', 'fecha_pedido']
    search_fields = ['cliente__username', 'id']
    inlines = [DetallePedidoInline]

@admin.register(DireccionEnvio)
class DireccionEnvioAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'ciudad', 'region', 'principal']
    list_filter = ['ciudad', 'region', 'principal']
    search_fields = ['usuario__username', 'direccion']

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo', 'titulo', 'leida', 'fecha']
    list_filter = ['tipo', 'leida', 'fecha']
    search_fields = ['usuario__username', 'titulo', 'mensaje']
    readonly_fields = ['fecha']