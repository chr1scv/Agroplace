"""
Script SEGURO para arreglar ProductoCard sin corromper el archivo
"""

producto_card_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\ProductoCard.jsx"

with open(producto_card_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar import si no existe
if "getAxiosConfig" not in content:
    content = content.replace(
        "import axios from 'axios';",
        "import axios from 'axios';\nimport { getAxiosConfig } from '../../utils/csrf';"
    )
    print("✅ Import agregado")

# 2. Reemplazar SOLO la llamada a axios.delete
old_delete = """await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, {
                withCredentials: true,
                headers: csrfToken ? {
                    'X-CSRFToken': csrfToken
                } : {}
            });"""

new_delete = """await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, getAxiosConfig());"""

if old_delete in content:
    content = content.replace(old_delete, new_delete)
    print("✅ Llamada axios.delete actualizada")
else:
    print("⚠️ No se encontró el patrón exacto de axios.delete")

# 3. Eliminar la función getCsrfToken LOCAL (dentro de handleEliminar)
# Buscar el bloque completo desde "// Obtener CSRF token" hasta "const csrfToken = getCsrfToken();"
csrf_block = """            // Obtener CSRF token
            const getCsrfToken = () => {
                const name = 'csrftoken';
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const trimmed = cookie.trim();
                    if (trimmed.startsWith(name + '=')) {
                        return trimmed.substring(name.length + 1);
                    }
                }
                return null;
            };
            
            const csrfToken = getCsrfToken();
            
            """

if csrf_block in content:
    content = content.replace(csrf_block, "            ")
    print("✅ Bloque CSRF local eliminado")

with open(producto_card_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n🎉 ProductoCard actualizado correctamente SIN corrupción")
