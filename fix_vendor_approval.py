#!/usr/bin/env python3
"""
Script to fix vendor approval functions in AdminPanel.jsx
"""

def fix_vendor_approval():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\AdminPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing vendor approval functions...")
    
    # 1. Fix aprobarVendedor function
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
        showToast('✅ Vendedor aprobado correctamente', 'success');
        
        // Actualizar listas inmediatamente
        setVendedoresPendientes(prev => prev.filter(v => v.id !== id));
        
        // Recargar para sincronizar
        cargarVendedoresPendientes();
        cargarUsuarios();
    } catch (error) {
        console.error('Error aprobando vendedor:', error);
        showToast('❌ Error al aprobar vendedor', 'error');
    }
};'''
    
    if old_aprobar in content:
        content = content.replace(old_aprobar, new_aprobar)
        print("✓ Fixed aprobarVendedor function")
    else:
        print("⚠ aprobarVendedor function not found or already fixed")
    
    # 2. Fix rechazarVendedor function
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
        showToast('✅ Vendedor rechazado correctamente', 'success');
        
        // Actualizar listas inmediatamente
        setVendedoresPendientes(prev => prev.filter(v => v.id !== id));
        
        // Recargar para sincronizar
        cargarVendedoresPendientes();
        cargarUsuarios();
    } catch (error) {
        console.error('Error rechazando vendedor:', error);
        showToast('❌ Error al rechazar vendedor', 'error');
    }
};'''
    
    if old_rechazar in content:
        content = content.replace(old_rechazar, new_rechazar)
        print("✓ Fixed rechazarVendedor function")
    else:
        print("⚠ rechazarVendedor function not found or already fixed")
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Vendor approval functions fixed!")

if __name__ == "__main__":
    try:
        fix_vendor_approval()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
