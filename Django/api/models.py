from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    TIPO_USUARIO = [
        ('cliente', 'Cliente'),
        ('vendedor', 'Vendedor'),
        ('admin', 'Administrador'),
    ]
    
    ESTADO_USUARIO = [
        ('activo', 'Activo'),
        ('pendiente', 'Pendiente'),
        ('rechazado', 'Rechazado'),
        ('inactivo', 'Inactivo'),
    ]
    
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_USUARIO, default='cliente')
    estado = models.CharField(max_length=20, choices=ESTADO_USUARIO, default='activo')  # ← NUEVO CAMPO
    telefono = models.CharField(max_length=15, blank=True)
    direccion = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='usuario_set',
        related_query_name='usuario',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='usuario_set',
        related_query_name='usuario',
    )
    
    def __str__(self):
        return f"{self.username} - {self.tipo_usuario}"

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre

class Producto(models.Model):
    TIPO_ORIGEN = [
        ('organico', 'Orgánico'),
        ('convencional', 'Convencional'),
    ]
    
    vendedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'tipo_usuario': 'vendedor'})
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='products/', blank=True, null=True)
    origen = models.CharField(max_length=20, choices=TIPO_ORIGEN, default='convencional')
    certificado_organico = models.FileField(upload_to='certificados/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    aprobado = models.BooleanField(default=False)  # ← AGREGAR ESTA LÍNEA
    ciudad = models.CharField(max_length=100, blank=True)  # ← AGREGAR ESTA LÍNEA
    comuna = models.CharField(max_length=100, blank=True)  # ← AGREGAR ESTA LÍNEA
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return self.nombre

class Pedido(models.Model):
    ESTADO_PEDIDO = [
        ('pendiente', 'Pendiente'),
        ('preparacion', 'En preparación'),
        ('transito', 'En tránsito'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'tipo_usuario': 'cliente'})
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_PEDIDO, default='pendiente')
    direccion_entrega = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    metodo_pago = models.CharField(max_length=50, default='efectivo')
    transaccion_id = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-fecha_pedido']
    
    def __str__(self):
        return f"Pedido {self.id} - {self.cliente.username}"

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre}"

class DireccionEnvio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='direcciones')
    direccion = models.TextField()
    ciudad = models.CharField(max_length=100)
    region = models.CharField(max_length=100, default='Maule')
    codigo_postal = models.CharField(max_length=10)
    principal = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Direcciones de envío"
    
    def __str__(self):
        return f"{self.usuario.username} - {self.ciudad}"
    

class Notificacion(models.Model):
    TIPOS_NOTIFICACION = [
        ('producto_aprobado', 'Producto Aprobado'),
        ('producto_rechazado', 'Producto Rechazado'),
        ('nuevo_pedido', 'Nuevo Pedido'),
        ('pedido_actualizado', 'Pedido Actualizado'),
        ('sistema', 'Sistema'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=50, choices=TIPOS_NOTIFICACION)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    leida = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)
    
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
    
    def __str__(self):
        return f"{self.usuario.username} - {self.titulo}"
    