import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroplace_backend.settings')
django.setup()

from api.models import Usuario

def update_pipe1():
    try:
        vendor = Usuario.objects.get(username='pipe1')
        vendor.descripcion = "Agricultor local de Linares, especializado en cebollas y hortalizas de estación."
        vendor.titulo = "Productor Local"
        vendor.save()
        print(f"✅ Updated vendor: {vendor.username}")
    except Usuario.DoesNotExist:
        print("❌ Vendor 'pipe1' not found")

if __name__ == '__main__':
    update_pipe1()
