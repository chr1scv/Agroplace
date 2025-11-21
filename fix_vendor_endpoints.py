#!/usr/bin/env python3
"""
Script to fix AdminPanel.jsx to use correct vendor approval endpoints
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix aprobarVendedor to use POST to aprobar_vendedor endpoint
old_aprobar = """const aprobarVendedor = async (id) => {
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

new_aprobar = """const aprobarVendedor = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/usuarios/${id}/aprobar_vendedor/`);

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

content = content.replace(old_aprobar, new_aprobar)

# Fix rechazarVendedor to use POST to rechazar_vendedor endpoint
old_rechazar = """const rechazarVendedor = async (id) => {
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

new_rechazar = """const rechazarVendedor = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/usuarios/${id}/rechazar_vendedor/`);

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

content = content.replace(old_rechazar, new_rechazar)

# Write the file back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated AdminPanel.jsx to use correct vendor approval endpoints")
print("   - aprobarVendedor now uses POST /api/usuarios/{id}/aprobar_vendedor/")
print("   - rechazarVendedor now uses POST /api/usuarios/{id}/rechazar_vendedor/")
