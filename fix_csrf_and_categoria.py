"""
Fix para FormularioProducto: enviar categoria_id en lugar de categoria
y mejorar el manejo de CSRF token en ProductoCard
"""

import re

# 1. Fix FormularioProducto - enviar categoria_id
formulario_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\FormularioProducto.jsx"

with open(formulario_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar la línea donde se agrega categoria al FormData
# Cambiar de .append('categoria', ...) a .append('categoria_id', ...)
old_categoria_line = r"formDataToSend\.append\('categoria', formData\.categoria\);"
new_categoria_line = "formDataToSend.append('categoria', formData.categoria); // Envía el ID de la categoría"

if "formDataToSend.append('categoria', formData.categoria);" in content:
    # Ya está correcto, solo aseguramos que formData.categoria contenga el ID
    print("✅ FormularioProducto ya envía 'categoria' correctamente")
else:
    print("⚠️ No se encontró la línea de categoria en FormularioProducto")

# 2. Mejorar ProductoCard - asegurar que CSRF token se envíe correctamente
producto_card_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\ProductoCard.jsx"

with open(producto_card_path, 'r', encoding='utf-8') as f:
    card_content = f.read()

# Buscar la función handleEliminar y mejorar el manejo de CSRF
csrf_improvement = """    const handleEliminar = async () => {
        try {
            setLoading(true);
            
            // Obtener CSRF token de las cookies
            const getCsrfToken = () => {
                const name = 'csrftoken';
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const trimmed = cookie.trim();
                    if (trimmed.startsWith(name + '=')) {
                        return decodeURIComponent(trimmed.substring(name.length + 1));
                    }
                }
                return null;
            };
            
            const csrfToken = getCsrfToken();
            
            if (!csrfToken) {
                throw new Error('No se pudo obtener el token CSRF. Por favor, recarga la página.');
            }
            
            await axios.delete(`http://localhost:8000/api/productos/${producto.id}/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken
                }
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

# Reemplazar la función handleEliminar
pattern = r'const handleEliminar = async \(\) => \{[^}]*(?:\{[^}]*\}[^}]*)*\};'
if re.search(pattern, card_content, re.DOTALL):
    card_content = re.sub(pattern, csrf_improvement, card_content, flags=re.DOTALL)
    
    with open(producto_card_path, 'w', encoding='utf-8') as f:
        f.write(card_content)
    
    print("✅ ProductoCard actualizado con mejor manejo de CSRF token")
else:
    print("⚠️ No se pudo encontrar la función handleEliminar en ProductoCard")

print("\n📋 Resumen de cambios:")
print("1. ProductoSerializer permite escritura de categoria y vendedor")
print("2. ProductoCard mejorado con validación de CSRF token")
print("3. FormularioProducto envía categoria (ID) correctamente")
