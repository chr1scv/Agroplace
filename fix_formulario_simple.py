"""
Script simple y directo para arreglar FormularioProducto con CSRF
"""

formulario_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\FormularioProducto.jsx"

with open(formulario_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar import si no existe
if "getAxiosConfigMultipart" not in content:
    content = content.replace(
        "import axios from 'axios';",
        "import axios from 'axios';\nimport { getAxiosConfigMultipart } from '../../utils/csrf';"
    )
    print("✅ Import agregado")

# 2. Buscar y reemplazar el bloque de config EXACTO
old_config_block = """            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error('No se pudo obtener el token de seguridad. Por favor, recarga la página.');
            }

            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                }
            };"""

new_config_block = """            const config = getAxiosConfigMultipart();"""

if old_config_block in content:
    content = content.replace(old_config_block, new_config_block)
    print("✅ Config reemplazado")
else:
    print("⚠️ No se encontró el bloque de config exacto, buscando alternativa...")
    # Buscar solo el bloque de config sin la validación
    alt_config = """            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                }
            };"""
    
    if alt_config in content:
        content = content.replace(alt_config, new_config_block)
        print("✅ Config alternativo reemplazado")

# 3. Eliminar la función getCsrfToken local si existe
if "const getCsrfToken = () =>" in content:
    # Buscar y eliminar la función completa
    import re
    pattern = r"const getCsrfToken = \(\) => \{[^}]+\};"
    content = re.sub(pattern, "", content, flags=re.DOTALL)
    print("✅ Función getCsrfToken local eliminada")

with open(formulario_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n🎉 FormularioProducto actualizado correctamente")
