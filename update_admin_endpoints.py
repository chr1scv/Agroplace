#!/usr/bin/env python3
"""
Script to update AdminPanel.jsx to use new approval endpoints
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update aprobarProducto to use new endpoint
old_aprobar = """const aprobarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: true
        });

        // Remover de la lista local inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));

        showToast('Producto aprobado', 'success');

        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando producto:', error);
        showToast('Error al aprobar producto', 'error');
        // Recargar en caso de error
        await cargarProductosPendientes();
    }
};"""

new_aprobar = """const aprobarProducto = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/productos/${id}/aprobar_producto/`);

        // Remover de la lista local inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));

        showToast('Producto aprobado', 'success');

        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando producto:', error);
        showToast('Error al aprobar producto', 'error');
        // Recargar en caso de error
        await cargarProductosPendientes();
    }
};"""

content = content.replace(old_aprobar, new_aprobar)

# Update rechazarProducto to use new endpoint
old_rechazar = """const rechazarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: false,
            activo: false
        });

        // Remover de la lista local inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));

        showToast('Producto rechazado', 'success');

        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando producto:', error);
        showToast('Error al rechazar producto', 'error');
        // Recargar en caso de error
        await cargarProductosPendientes();
    }
};"""

new_rechazar = """const rechazarProducto = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/productos/${id}/rechazar_producto/`);

        // Remover de la lista local inmediatamente
        setProductosPendientes(prev => prev.filter(p => p.id !== id));

        showToast('Producto rechazado', 'success');

        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando producto:', error);
        showToast('Error al rechazar producto', 'error');
        // Recargar en caso de error
        await cargarProductosPendientes();
    }
};"""

content = content.replace(old_rechazar, new_rechazar)

# Update cargarProductosPendientes to use new endpoint
old_cargar_pendientes = """    const cargarProductosPendientes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/productos/?aprobado=false');
            setProductosPendientes(response.data);
        } catch (error) {
            console.error('Error cargando productos pendientes:', error);
        }
    };"""

new_cargar_pendientes = """    const cargarProductosPendientes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/productos/productos_pendientes/');
            setProductosPendientes(response.data);
        } catch (error) {
            console.error('Error cargando productos pendientes:', error);
        }
    };"""

content = content.replace(old_cargar_pendientes, new_cargar_pendientes)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated AdminPanel.jsx to use new approval endpoints")
