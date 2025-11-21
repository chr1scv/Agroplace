import re

def fix_admin_optimistic():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Applying optimistic updates to AdminPanel.jsx...")
    
    # 1. Fix aprobarProducto
    old_aprobar_prod = r"const aprobarProducto = async \(id\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(`http://localhost:8000/api/productos/\$\{id\}/`, \{[\s\S]*?aprobado: true[\s\S]*?\}\);[\s\S]*?showToast\('✅ Producto aprobado', 'success'\);[\s\S]*?await cargarProductosPendientes\(\);[\s\S]*?await cargarProductos\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error aprobando producto:', error\);[\s\S]*?showToast\('❌ Error al aprobar producto', 'error'\);[\s\S]*?\}\r?\n\s*?\};"
    
    new_aprobar_prod = """const aprobarProducto = async (id) => {
        try {
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes(prev => prev.filter(p => p.id !== id));

            await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
                aprobado: true
            });

            showToast('✅ Producto aprobado', 'success');

            // Update other lists in background
            cargarProductos();
            cargarEstadisticas();

        } catch (error) {
            console.error('Error aprobando producto:', error);
            showToast('❌ Error al aprobar producto', 'error');
            // Revert on error
            cargarProductosPendientes();
        }
    };"""
    
    # 2. Fix rechazarProducto
    old_rechazar_prod = r"const rechazarProducto = async \(id\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(`http://localhost:8000/api/productos/\$\{id\}/`, \{[\s\S]*?aprobado: false,[\s\S]*?rechazado: true[\s\S]*?\}\);[\s\S]*?showToast\('❌ Producto rechazado', 'success'\);[\s\S]*?await cargarProductosPendientes\(\);[\s\S]*?await cargarProductos\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error rechazando producto:', error\);[\s\S]*?showToast\('❌ Error al rechazar producto', 'error'\);[\s\S]*?\}\r?\n\s*?\};"
    
    new_rechazar_prod = """const rechazarProducto = async (id) => {
        try {
            // Optimistic update: Remove from pending list immediately
            setProductosPendientes(prev => prev.filter(p => p.id !== id));

            await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
                aprobado: false,
                rechazado: true
            });

            showToast('❌ Producto rechazado', 'success');

            cargarProductos();
            cargarEstadisticas();

        } catch (error) {
            console.error('Error rechazando producto:', error);
            showToast('❌ Error al rechazar producto', 'error');
            cargarProductosPendientes();
        }
    };"""

    # 3. Fix aprobarVendedor
    old_aprobar_vend = r"const aprobarVendedor = async \(id\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(`http://localhost:8000/api/usuarios/\$\{id\}/`, \{[\s\S]*?estado: 'aprobado'[\s\S]*?\}\);[\s\S]*?showToast\('✅ Vendedor aprobado', 'success'\);[\s\S]*?await cargarVendedoresPendientes\(\);[\s\S]*?await cargarUsuarios\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error aprobando vendedor:', error\);[\s\S]*?showToast\('❌ Error al aprobar vendedor', 'error'\);[\s\S]*?\}\r?\n\s*?\};"
    
    new_aprobar_vend = """const aprobarVendedor = async (id) => {
        try {
            // Optimistic update
            setVendedoresPendientes(prev => prev.filter(v => v.id !== id));

            // Note: 'activo' is the standard state for approved users, not 'aprobado'
            await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
                estado: 'activo' 
            });

            showToast('✅ Vendedor aprobado', 'success');

            cargarUsuarios();
            cargarEstadisticas();

        } catch (error) {
            console.error('Error aprobando vendedor:', error);
            showToast('❌ Error al aprobar vendedor', 'error');
            cargarVendedoresPendientes();
        }
    };"""

    # 4. Fix rechazarVendedor
    old_rechazar_vend = r"const rechazarVendedor = async \(id\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(`http://localhost:8000/api/usuarios/\$\{id\}/`, \{[\s\S]*?estado: 'rechazado'[\s\S]*?\}\);[\s\S]*?showToast\('❌ Vendedor rechazado', 'success'\);[\s\S]*?await cargarVendedoresPendientes\(\);[\s\S]*?await cargarUsuarios\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error rechazando vendedor:', error\);[\s\S]*?showToast\('❌ Error al rechazar vendedor', 'error'\);[\s\S]*?\}\r?\n\s*?\};"
    
    new_rechazar_vend = """const rechazarVendedor = async (id) => {
        try {
            // Optimistic update
            setVendedoresPendientes(prev => prev.filter(v => v.id !== id));

            await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
                estado: 'rechazado'
            });

            showToast('❌ Vendedor rechazado', 'success');

            cargarUsuarios();
            cargarEstadisticas();

        } catch (error) {
            console.error('Error rechazando vendedor:', error);
            showToast('❌ Error al rechazar vendedor', 'error');
            cargarVendedoresPendientes();
        }
    };"""

    # 5. Fix editarUsuario
    old_editar_user = r"const editarUsuario = async \(usuarioId, datosActualizados\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(\r?\n\s*?`http://localhost:8000/api/usuarios/\$\{usuarioId\}/`,\r?\n\s*?datosActualizados\r?\n\s*?\);[\s\S]*?await cargarUsuarios\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?showToast\('✅ Usuario actualizado exitosamente', 'success'\);[\s\S]*?setUsuarioEditar\(null\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error al actualizar usuario:', error\);[\s\S]*?showToast\('❌ Error al actualizar el usuario', 'error'\);[\s\S]*?\}\r?\n\s*?\};"

    new_editar_user = """const editarUsuario = async (usuarioId, datosActualizados) => {
        try {
            // Optimistic update
            setUsuarios(prev => prev.map(u => u.id === usuarioId ? { ...u, ...datosActualizados } : u));
            setUsuarioEditar(null); // Close modal immediately

            await axios.patch(
                `http://localhost:8000/api/usuarios/${usuarioId}/`,
                datosActualizados
            );

            showToast('✅ Usuario actualizado exitosamente', 'success');
            
            // Refresh to ensure consistency
            cargarEstadisticas();

        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            showToast('❌ Error al actualizar el usuario', 'error');
            cargarUsuarios(); // Revert on error
        }
    };"""

    # 6. Fix editarProducto
    old_editar_prod = r"const editarProducto = async \(productoId, datosActualizados\) => \{[\s\S]*?try \{[\s\S]*?await axios\.patch\(\r?\n\s*?`http://localhost:8000/api/productos/\$\{productoId\}/`,\r?\n\s*?datosActualizados\r?\n\s*?\);[\s\S]*?await cargarProductos\(\);[\s\S]*?await cargarEstadisticas\(\);[\s\S]*?showToast\('✅ Producto actualizado exitosamente', 'success'\);[\s\S]*?setProductoEditar\(null\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error al actualizar producto:', error\);[\s\S]*?showToast\('❌ Error al actualizar el producto', 'error'\);[\s\S]*?\}\r?\n\s*?\};"

    new_editar_prod = """const editarProducto = async (productoId, datosActualizados) => {
        try {
            // Optimistic update
            setProductos(prev => prev.map(p => p.id === productoId ? { ...p, ...datosActualizados } : p));
            setProductoEditar(null); // Close modal immediately

            await axios.patch(
                `http://localhost:8000/api/productos/${productoId}/`,
                datosActualizados
            );

            showToast('✅ Producto actualizado exitosamente', 'success');
            
            cargarEstadisticas();

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            showToast('❌ Error al actualizar el producto', 'error');
            cargarProductos(); // Revert on error
        }
    };"""

    # Apply replacements
    content = re.sub(old_aprobar_prod, new_aprobar_prod, content)
    content = re.sub(old_rechazar_prod, new_rechazar_prod, content)
    content = re.sub(old_aprobar_vend, new_aprobar_vend, content)
    content = re.sub(old_rechazar_vend, new_rechazar_vend, content)
    content = re.sub(old_editar_user, new_editar_user, content)
    content = re.sub(old_editar_prod, new_editar_prod, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ AdminPanel.jsx updated with optimistic UI logic!")
    return True

if __name__ == "__main__":
    try:
        fix_admin_optimistic()
    except Exception as e:
        print(f"❌ Error: {e}")
