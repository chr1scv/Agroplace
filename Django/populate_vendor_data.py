import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroplace_backend.settings')
django.setup()

from api.models import Usuario, Producto

def populate_data():
    # 1. Update Vendor (diego1)
    try:
        vendor = Usuario.objects.get(username='diego1')
        vendor.descripcion = "Más de 10 años cultivando productos orgánicos de la más alta calidad."
        vendor.titulo = "Productor Verificado"
        vendor.save()
        print(f"✅ Updated vendor: {vendor.username}")
    except Usuario.DoesNotExist:
        print("❌ Vendor 'diego1' not found")

    # 2. Update Product (ID 36)
    try:
        product = Producto.objects.get(id=36)
        product.region = "Maule"
        product.provincia = "Linares"
        # Ensure comuna is set too if it wasn't
        if not product.comuna:
            product.comuna = "Linares"
        product.save()
        print(f"✅ Updated product: {product.nombre} (ID: {product.id})")
    except Producto.DoesNotExist:
        print("❌ Product 36 not found")

if __name__ == '__main__':
    populate_data()
