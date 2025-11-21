#!/usr/bin/env python3
"""
Fix vendor approval/rejection to use dedicated POST endpoints
"""

# Read the file
with open('frontend/src/pages/admin/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace aprobarVendedor function
old_aprobar = '''const aprobarVendedor = async (id) => {
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
};'''

new_aprobar = '''const aprobarVendedor = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/usuarios/${id}/aprobar_vendedor/`);

        showToast('✅ Vendedor aprobado', 'success');

        await cargarVendedoresPendientes();
        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error aprobando vendedor:', error);
        showToast('❌ Error al aprobar vendedor', 'error');
    }
};'''

content = content.replace(old_aprobar, new_aprobar)

# Replace rechazarVendedor function
old_rechazar = '''const rechazarVendedor = async (id) => {
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
};'''

new_rechazar = '''const rechazarVendedor = async (id) => {
    try {
        await axios.post(`http://localhost:8000/api/usuarios/${id}/rechazar_vendedor/`);

        showToast('❌ Vendedor rechazado', 'success');

        await cargarVendedoresPendientes();
        await cargarUsuarios();
        await cargarEstadisticas();

    } catch (error) {
        console.error('Error rechazando vendedor:', error);
        showToast('❌ Error al rechazar vendedor', 'error');
    }
};'''

content = content.replace(old_rechazar, new_rechazar)

# Write back
with open('frontend/src/pages/admin/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed vendor approval/rejection endpoints!")
print("   - aprobarVendedor now uses POST to /aprobar_vendedor/")
print("   - rechazarVendedor now uses POST to /rechazar_vendedor/")
print("   - Vendors will now disappear from pending list after approval/rejection")
