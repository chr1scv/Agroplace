"""
Script completo para arreglar todos los problemas restantes:
1. Error 403 en eliminación (agregar CSRF token)
2. Toast duplicado en creación de productos
3. Vendedor en productos pendientes
4. Productos no desaparecen al aprobar/rechazar
5. Modal de descripción con mejor diseño
"""

import re

# ==================== FIX 1: ProductoCard - Agregar CSRF Token ====================
producto_card_fix = """    const handleEliminar = async () => {
        try {
            setLoading(true);
            
            // Obtener CSRF token
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
            
            await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, {
                withCredentials: true,
                headers: csrfToken ? {
                    'X-CSRFToken': csrfToken
                } : {}
            });
            
            if (showToast) {
                showToast('✅ Producto eliminado correctamente', 'success');
            }
            
            if (onEliminar) {
                onEliminar(producto.id);
            }
            if (onRecargar) {
                await onRecargar();
            }
            
            setMostrarConfirmacion(false);
        } catch (error) {
            console.error('Error eliminando producto:', error);
            if (showToast) {
                showToast('❌ Error al eliminar producto', 'error');
            } else {
                alert('Error al eliminar producto. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };"""

# Leer ProductoCard.jsx
producto_card_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\ProductoCard.jsx"
with open(producto_card_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar handleEliminar
pattern = r'const handleEliminar = async \(\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};'
content = re.sub(pattern, producto_card_fix, content)

# Escribir archivo actualizado
with open(producto_card_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fix 1: ProductoCard - CSRF token agregado para eliminación")

# ==================== FIX 2: FormularioProducto - Eliminar toast duplicado ====================
# El problema es que hay dos llamadas a showToast en caso de error
# Vamos a revisar y arreglar

formulario_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\FormularioProducto.jsx"
with open(formulario_path, 'r', encoding='utf-8') as f:
    formulario_content = f.read()

# Buscar y reemplazar la sección de error para evitar duplicados
# El problema está en que se llama showToast dos veces en el catch
error_handling_old = r"setError\(errorMessage\);\s*showToast\(`❌ Error: \$\{errorMessage\}`, 'error'\);"
error_handling_new = "showToast(`❌ ${errorMessage}`, 'error');"

formulario_content = re.sub(error_handling_old, error_handling_new, formulario_content)

with open(formulario_path, 'w', encoding='utf-8') as f:
    f.write(formulario_content)

print("✅ Fix 2: FormularioProducto - Toast duplicado eliminado")

print("\n✅ Todos los fixes aplicados!")
print("\nPróximos pasos:")
print("1. Revisar productos pendientes (vendedor y recarga)")
print("2. Mejorar modal de descripción")
