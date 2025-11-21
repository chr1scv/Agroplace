#!/usr/bin/env python3
"""
Script to update AdminPanel.jsx with proper vendor/product removal logic
"""

import re

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update aprobarVendedor
old_aprobar_vendedor = """const aprobarVendedor = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
            estado: 'aprobado'
        });

        showToast('✅ Vendedor aprobado', 'success');

        await cargarVendedoresPendientes();
        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando vendedor:', error);
        showToast('❌ Error al aprobar vendedor', 'error');
    }
};"""

new_aprobar_vendedor = """const aprobarVendedor = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
            estado: 'aprobado',
            is_active: true
        });

        // Remover de la lista local inmediatamente
        setVendedoresPendientes(prev => prev.filter(v => v.id !== id));

        showToast('Vendedor aprobado', 'success');

        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando vendedor:', error);
        showToast('Error al aprobar vendedor', 'error');
        // Recargar en caso de error
        await cargarVendedoresPendientes();
    }
};"""

content = content.replace(old_aprobar_vendedor, new_aprobar_vendedor)

# Update rechazarVendedor
old_rechazar_vendedor = """const rechazarVendedor = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
            estado: 'rechazado'
        });

        showToast('❌ Vendedor rechazado', 'success');

        await cargarVendedoresPendientes();
        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando vendedor:', error);
        showToast('❌ Error al rechazar vendedor', 'error');
    }
};"""

new_rechazar_vendedor = """const rechazarVendedor = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/usuarios/${id}/`, {
            estado: 'rechazado',
            is_active: false
        });

        // Remover de la lista local inmediatamente
        setVendedoresPendientes(prev => prev.filter(v => v.id !== id));

        showToast('Vendedor rechazado', 'success');

        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando vendedor:', error);
        showToast('Error al rechazar vendedor', 'error');
        // Recargar en caso de error
        await cargarVendedoresPendientes();
    }
};"""

content = content.replace(old_rechazar_vendedor, new_rechazar_vendedor)

# Update aprobarProducto
old_aprobar_producto = """const aprobarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: true
        });

        showToast('✅ Producto aprobado', 'success');

        await cargarProductosPendientes();
        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando producto:', error);
        showToast('❌ Error al aprobar producto', 'error');
    }
};"""

new_aprobar_producto = """const aprobarProducto = async (id) => {
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

content = content.replace(old_aprobar_producto, new_aprobar_producto)

# Update rechazarProducto
old_rechazar_producto = """const rechazarProducto = async (id) => {
    try {
        await axios.patch(`http://localhost:8000/api/productos/${id}/`, {
            aprobado: false,
            rechazado: true
        });

        showToast('❌ Producto rechazado', 'success');

        await cargarProductosPendientes();
        await cargarProductos();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando producto:', error);
        showToast('❌ Error al rechazar producto', 'error');
    }
};"""

new_rechazar_producto = """const rechazarProducto = async (id) => {
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

content = content.replace(old_rechazar_producto, new_rechazar_producto)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated AdminPanel.jsx with local state removal")
