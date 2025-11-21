"""
Script completo para arreglar TODOS los problemas de CSRF en el frontend
"""

import re

# 1. Actualizar FormularioProducto para usar la utilidad CSRF
formulario_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\FormularioProducto.jsx"

with open(formulario_path, 'r', encoding='utf-8') as f:
    formulario_content = f.read()

# Agregar import de la utilidad CSRF
if "import { getCsrfToken, getAxiosConfigMultipart } from '../../utils/csrf';" not in formulario_content:
    # Buscar la línea de imports de axios
    formulario_content = formulario_content.replace(
        "import axios from 'axios';",
        "import axios from 'axios';\nimport { getCsrfToken, getAxiosConfigMultipart } from '../../utils/csrf';"
    )

# Reemplazar la función getCsrfToken local con el uso de la utilidad
# Buscar y eliminar la función getCsrfToken local si existe
csrf_function_pattern = r'const getCsrfToken = \(\) => \{[^}]*(?:\{[^}]*\}[^}]*)*\};'
formulario_content = re.sub(csrf_function_pattern, '', formulario_content, flags=re.DOTALL)

# Reemplazar el config en el handleSubmit
old_config = r'''const config = \{
            withCredentials: true,
            headers: \{
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': csrfToken
            \}
        \};'''

new_config = "const config = getAxiosConfigMultipart();"

formulario_content = re.sub(old_config, new_config, formulario_content, flags=re.DOTALL)

# También eliminar la validación de csrfToken ya que la utilidad lo maneja
formulario_content = re.sub(
    r"const csrfToken = getCsrfToken\(\);\s*if \(!csrfToken\) \{[^}]*\}",
    "",
    formulario_content,
    flags=re.DOTALL
)

with open(formulario_path, 'w', encoding='utf-8') as f:
    f.write(formulario_content)

print("✅ FormularioProducto actualizado con utilidad CSRF centralizada")

# 2. Actualizar AdminPanel para usar la utilidad CSRF
admin_panel_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx"

with open(admin_panel_path, 'r', encoding='utf-8') as f:
    admin_content = f.read()

# Agregar import
if "import { getCsrfToken, getAxiosConfig } from '../../utils/csrf';" not in admin_content:
    admin_content = admin_content.replace(
        "import axios from 'axios';",
        "import axios from 'axios';\nimport { getCsrfToken, getAxiosConfig } from '../../utils/csrf';"
    )

# Actualizar aprobarProducto
old_aprobar = r'''const aprobarProducto = async \(id\) => \{
        try \{
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes\(prev => prev\.filter\(p => p\.id !== id\)\);

            await axios\.patch\(`http://localhost:8000/api/productos/\$\{id\}/`, \{
                aprobado: true
            \}\);'''

new_aprobar = '''const aprobarProducto = async (id) => {
        try {
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes(prev => prev.filter(p => p.id !== id));

            await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
                aprobado: true
            }, getAxiosConfig());'''

admin_content = re.sub(old_aprobar, new_aprobar, admin_content, flags=re.DOTALL)

# Actualizar rechazarProducto
old_rechazar_section = r'''const rechazarProducto = async \(id\) => \{
        try \{
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes\(prev => prev\.filter\(p => p\.id !== id\)\);

            // Usar el endpoint de rechazo si existe, sino usar patch
            try \{
                await axios\.post\(`http://localhost:8000/api/productos/\$\{id\}/rechazar/`, \{\}, \{
                    withCredentials: true
                \}\);
            \} catch \(e\) \{
                // Fallback a patch
                await axios\.patch\(`http://localhost:8000/api/productos/\$\{id\}/`, \{
                    aprobado: false,
                    activo: false
                \}, \{
                    withCredentials: true
                \}\);
            \}'''

new_rechazar_section = '''const rechazarProducto = async (id) => {
        try {
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes(prev => prev.filter(p => p.id !== id));

            // Usar el endpoint de rechazo si existe, sino usar patch
            try {
                await axios.post(`http://localhost:8000/api/productos/${id}/rechazar/`, {}, getAxiosConfig());
            } catch (e) {
                // Fallback a patch
                await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
                    aprobado: false,
                    activo: false
                }, getAxiosConfig());
            }'''

admin_content = re.sub(old_rechazar_section, new_rechazar_section, admin_content, flags=re.DOTALL)

# Actualizar editarProducto
old_editar = r'''await axios\.patch\(
                `http://localhost:8000/api/productos/\$\{productoId\}/`,
                datosActualizados
            \);'''

new_editar = '''await axios.patch(
                `http://localhost:8000/api/productos/${productoId}/`,
                datosActualizados,
                getAxiosConfig()
            );'''

admin_content = re.sub(old_editar, new_editar, admin_content)

# Actualizar eliminarProducto
old_eliminar_producto = r'''await axios\.delete\(`http://localhost:8000/api/productos/\$\{productoId\}/`\);'''
new_eliminar_producto = '''await axios.delete(`http://localhost:8000/api/productos/${productoId}/`, getAxiosConfig());'''

admin_content = re.sub(old_eliminar_producto, new_eliminar_producto, admin_content)

# Actualizar eliminarUsuario
old_eliminar_usuario = r'''await axios\.delete\(`http://localhost:8000/api/usuarios/\$\{usuarioId\}/`\);'''
new_eliminar_usuario = '''await axios.delete(`http://localhost:8000/api/usuarios/${usuarioId}/`, getAxiosConfig());'''

admin_content = re.sub(old_eliminar_usuario, new_eliminar_usuario, admin_content)

# Actualizar editarUsuario
old_editar_usuario = r'''await axios\.patch\(
                `http://localhost:8000/api/usuarios/\$\{usuarioId\}/`,
                datosActualizados
            \);'''

new_editar_usuario = '''await axios.patch(
                `http://localhost:8000/api/usuarios/${usuarioId}/`,
                datosActualizados,
                getAxiosConfig()
            );'''

admin_content = re.sub(old_editar_usuario, new_editar_usuario, admin_content)

with open(admin_panel_path, 'w', encoding='utf-8') as f:
    f.write(admin_content)

print("✅ AdminPanel actualizado con utilidad CSRF centralizada")

# 3. Actualizar ProductoCard
producto_card_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\ProductoCard.jsx"

with open(producto_card_path, 'r', encoding='utf-8') as f:
    card_content = f.read()

# Agregar import
if "import { getCsrfToken, getAxiosConfig } from '../../utils/csrf';" not in card_content:
    card_content = card_content.replace(
        "import axios from 'axios';",
        "import axios from 'axios';\nimport { getCsrfToken, getAxiosConfig } from '../../utils/csrf';"
    )

# Simplificar handleEliminar
old_handle_eliminar = r'''const handleEliminar = async \(\) => \{
        try \{
            setLoading\(true\);
            
            // Obtener CSRF token de las cookies
            const getCsrfToken = \(\) => \{[^}]*\};
            
            const csrfToken = getCsrfToken\(\);
            
            if \(!csrfToken\) \{
                throw new Error\('No se pudo obtener el token CSRF\. Por favor, recarga la página\.'\);
            \}
            
            await axios\.delete\(`http://localhost:8000/api/productos/\$\{producto\.id\}/`, \{
                withCredentials: true,
                headers: \{
                    'X-CSRFToken': csrfToken
                \}
            \}\);'''

new_handle_eliminar = '''const handleEliminar = async () => {
        try {
            setLoading(true);
            
            await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, getAxiosConfig());'''

card_content = re.sub(old_handle_eliminar, new_handle_eliminar, card_content, flags=re.DOTALL)

with open(producto_card_path, 'w', encoding='utf-8') as f:
    f.write(card_content)

print("✅ ProductoCard actualizado con utilidad CSRF centralizada")

print("\n🎉 TODOS LOS COMPONENTES ACTUALIZADOS CON CSRF CENTRALIZADO")
print("   - FormularioProducto.jsx")
print("   - AdminPanel.jsx")
print("   - ProductoCard.jsx")
print("\n📝 Próximos pasos:")
print("   1. El servidor React se recargará automáticamente")
print("   2. Prueba crear, editar y eliminar productos")
print("   3. Los errores 403 deberían desaparecer")
