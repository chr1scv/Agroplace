import os
from django.core.management.base import BaseCommand
from api.models import Usuario, Categoria, Producto

class Command(BaseCommand):
    help = 'Crea datos de prueba para Agroplace'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Creando datos de prueba para Agroplace...')
        
        # Crear categorías
        categorias = [
            {'nombre': 'Frutas', 'descripcion': 'Frutas frescas de temporada'},
            {'nombre': 'Verduras', 'descripcion': 'Verduras orgánicas y convencionales'},
            {'nombre': 'Granos', 'descripcion': 'Granos y cereales nutritivos'},
            {'nombre': 'Lácteos', 'descripcion': 'Productos lácteos frescos'},
            {'nombre': 'Hierbas', 'descripcion': 'Hierbas aromáticas y medicinales'},
        ]
        
        for cat_data in categorias:
            categoria, created = Categoria.objects.get_or_create(
                nombre=cat_data['nombre'],
                defaults={'descripcion': cat_data['descripcion']}
            )
            if created:
                self.stdout.write(f'   ✅ Categoría: {cat_data["nombre"]}')
        
        # Crear usuarios de prueba
        usuarios = [
            {'username': 'admin', 'tipo_usuario': 'admin', 'email': 'admin@agroplace.com', 'password': 'admin123'},
            {'username': 'vendedor1', 'tipo_usuario': 'vendedor', 'email': 'vendedor1@agroplace.com', 'password': 'vendedor123'},
            {'username': 'vendedor2', 'tipo_usuario': 'vendedor', 'email': 'vendedor2@agroplace.com', 'password': 'vendedor123'},
            {'username': 'cliente1', 'tipo_usuario': 'cliente', 'email': 'cliente1@agroplace.com', 'password': 'cliente123'},
            {'username': 'cliente2', 'tipo_usuario': 'cliente', 'email': 'cliente2@agroplace.com', 'password': 'cliente123'},
        ]
        
        for user_data in usuarios:
            usuario, created = Usuario.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'tipo_usuario': user_data['tipo_usuario']
                }
            )
            if created:
                usuario.set_password(user_data['password'])
                usuario.save()
                self.stdout.write(f'   ✅ Usuario: {user_data["username"]} ({user_data["tipo_usuario"]})')
        
        # Crear productos de prueba
        vendedor1 = Usuario.objects.get(username='vendedor1')
        vendedor2 = Usuario.objects.get(username='vendedor2')
        frutas = Categoria.objects.get(nombre='Frutas')
        verduras = Categoria.objects.get(nombre='Verduras')
        granos = Categoria.objects.get(nombre='Granos')
        
        productos = [
            {
                'nombre': 'Manzanas Rojas Orgánicas',
                'descripcion': 'Manzanas rojas cultivadas sin pesticidas, dulces y jugosas',
                'precio': 2.80,
                'stock': 150,
                'categoria': frutas,
                'origen': 'organico',
                'vendedor': vendedor1
            },
            {
                'nombre': 'Zanahorias Frescas',
                'descripcion': 'Zanahorias frescas recién cosechadas, ideales para jugos y ensaladas',
                'precio': 1.50,
                'stock': 200,
                'categoria': verduras,
                'origen': 'convencional',
                'vendedor': vendedor1
            },
            {
                'nombre': 'Tomates Orgánicos',
                'descripcion': 'Tomates maduros cultivados de manera orgánica, perfectos para salsas',
                'precio': 3.20,
                'stock': 80,
                'categoria': verduras,
                'origen': 'organico',
                'vendedor': vendedor2
            },
            {
                'nombre': 'Arroz Integral',
                'descripcion': 'Arroz integral de grano largo, rico en fibra y nutrientes',
                'precio': 4.50,
                'stock': 120,
                'categoria': granos,
                'origen': 'convencional',
                'vendedor': vendedor2
            },
        ]
        
        for prod_data in productos:
            producto, created = Producto.objects.get_or_create(
                nombre=prod_data['nombre'],
                vendedor=prod_data['vendedor'],
                defaults={
                    'descripcion': prod_data['descripcion'],
                    'precio': prod_data['precio'],
                    'stock': prod_data['stock'],
                    'categoria': prod_data['categoria'],
                    'origen': prod_data['origen']
                }
            )
            if created:
                self.stdout.write(f'   ✅ Producto: {prod_data["nombre"]} - ${prod_data["precio"]}')
        
        self.stdout.write(self.style.SUCCESS('🎉 ¡Todos los datos de prueba han sido creados exitosamente!'))
        self.stdout.write('')
        self.stdout.write('👤 Usuarios de prueba:')
        self.stdout.write('   admin / admin123')
        self.stdout.write('   vendedor1 / vendedor123')
        self.stdout.write('   cliente1 / cliente123')
        self.stdout.write('')
        self.stdout.write('🌐 URLs para probar:')
        self.stdout.write('   Admin Django: http://localhost:8000/admin')
        self.stdout.write('   API Productos: http://localhost:8000/api/productos/')
        self.stdout.write('   API Usuarios: http://localhost:8000/api/usuarios/')