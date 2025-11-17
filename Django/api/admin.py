from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Categoria, Producto, Pedido, DetallePedido, DireccionEnvio

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
    list_display = ['nombre', 'vendedor', 'precio', 'stock', 'categoria', 'origen', 'activo']
    list_filter = ['categoria', 'origen', 'activo', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    raw_id_fields = ['vendedor']

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