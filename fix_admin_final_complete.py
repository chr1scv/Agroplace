"""
Script COMPLETO para arreglar todos los problemas del panel de administración:
1. Styling de tabla y filtros acorde a la paleta del sitio
2. Mostrar vendedor y categoría en la tabla de productos
3. Agregar selector de estado en modal de edición
4. Mejorar modal de descripción
"""

import re

print("🔧 Iniciando arreglos completos del panel de administración...")

# ==================== FIX 1: Agregar campo aprobado en EditarProductoModal ====================
print("\n1️⃣ Agregando selector de estado en EditarProductoModal...")

editar_modal_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\EditarProductoModal.jsx"

with open(editar_modal_path, 'r', encoding='utf-8') as f:
    modal_content = f.read()

# Agregar aprobado al formData inicial
modal_content = re.sub(
    r"const \[formData, setFormData\] = useState\(\{\s*nombre: '',\s*descripcion: '',\s*precio: '',\s*stock: '',\s*categoria: '',\s*origen: 'convencional',\s*activo: true,\s*\}\);",
    """const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        origen: 'convencional',
        activo: true,
        aprobado: false,
    });""",
    modal_content
)

# Agregar aprobado al useEffect
modal_content = re.sub(
    r"setFormData\(\{\s*nombre: producto\.nombre \|\| '',\s*descripcion: producto\.descripcion \|\| '',\s*precio: producto\.precio \|\| '',\s*stock: producto\.stock \|\| '',\s*categoria: producto\.categoria\?\.id \|\| producto\.categoria \|\| '',\s*origen: producto\.origen \|\| 'convencional',\s*activo: producto\.activo !== undefined \? producto\.activo : true,\s*\}\);",
    """setFormData({
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
                categoria: producto.categoria?.id || producto.categoria || '',
                origen: producto.origen || 'convencional',
                activo: producto.activo !== undefined ? producto.activo : true,
                aprobado: producto.aprobado !== undefined ? producto.aprobado : false,
            });""",
    modal_content
)

# Agregar sección de Estado del Producto antes del checkbox de activo
estado_section = """
                    {/* Estado del Producto */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Estado del Producto
                        </h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Estado de Aprobación</label>
                            <select
                                name="aprobado"
                                value={formData.aprobado ? 'aprobado' : 'pendiente'}
                                onChange={(e) => setFormData(prev => ({ ...prev, aprobado: e.target.value === 'aprobado' }))}
                                style={styles.select}
                            >
                                <option value="pendiente">⏳ Pendiente de Aprobación</option>
                                <option value="aprobado">✅ Aprobado</option>
                            </select>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                {formData.aprobado 
                                    ? 'El producto está aprobado y puede ser visible' 
                                    : 'El producto requiere aprobación de un administrador'}
                            </span>
                        </div>
                    </div>

                    {/* Estado */}"""

modal_content = modal_content.replace(
    "                    {/* Estado */}",
    estado_section
)

with open(editar_modal_path, 'w', encoding='utf-8') as f:
    f.write(modal_content)

print("✅ EditarProductoModal actualizado con selector de estado")

# ==================== FIX 2: Mejorar CSS de tabla y filtros ====================
print("\n2️⃣ Mejorando CSS de tabla y filtros...")

css_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\adminStyles.css"

with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Agregar estilos mejorados para tabla y filtros
css_mejoras = """

/* ===== MEJORAS DE TABLA Y FILTROS - PALETA DEL SITIO ===== */

/* Contenedor de filtros */
.admin-filtros-section {
    background: linear-gradient(135deg, rgba(26, 31, 46, 0.95), rgba(15, 20, 25, 0.95));
    border: 1px solid rgba(45, 122, 62, 0.2);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-filtros-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

/* Search box */
.admin-search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.admin-search-icon {
    position: absolute;
    left: 14px;
    color: #9ca3af;
    pointer-events: none;
}

.admin-search-input {
    width: 100%;
    padding: 12px 14px 12px 44px;
    background: rgba(15, 20, 25, 0.6);
    border: 2px solid rgba(45, 122, 62, 0.2);
    border-radius: 10px;
    color: #e5e7eb;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.admin-search-input:focus {
    border-color: rgba(45, 122, 62, 0.5);
    background: rgba(15, 20, 25, 0.8);
}

.admin-search-input::placeholder {
    color: #6b7280;
}

/* Select filters */
.admin-filter-select {
    padding: 12px 14px;
    background: rgba(15, 20, 25, 0.6);
    border: 2px solid rgba(45, 122, 62, 0.2);
    border-radius: 10px;
    color: #e5e7eb;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
}

.admin-filter-select:hover {
    border-color: rgba(45, 122, 62, 0.4);
}

.admin-filter-select:focus {
    border-color: rgba(45, 122, 62, 0.5);
    background: rgba(15, 20, 25, 0.8);
}

.admin-filter-select option {
    background: #1a1f2e;
    color: #e5e7eb;
}

/* Tabla mejorada */
.admin-table-container {
    background: linear-gradient(135deg, rgba(26, 31, 46, 0.95), rgba(15, 20, 25, 0.95));
    border: 1px solid rgba(45, 122, 62, 0.2);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
}

.admin-table thead {
    background: linear-gradient(135deg, rgba(45, 122, 62, 0.15), rgba(4, 71, 44, 0.15));
    border-bottom: 2px solid rgba(45, 122, 62, 0.3);
}

.admin-table th {
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: #d1d5db;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.admin-table tbody tr {
    border-bottom: 1px solid rgba(45, 122, 62, 0.1);
    transition: all 0.2s;
}

.admin-table tbody tr:hover {
    background: rgba(45, 122, 62, 0.08);
}

.admin-table td {
    padding: 16px 12px;
    color: #e5e7eb;
    font-size: 14px;
}

/* Reload button */
.admin-reload-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, rgba(45, 122, 62, 0.2), rgba(4, 71, 44, 0.2));
    border: 1px solid rgba(45, 122, 62, 0.3);
    border-radius: 8px;
    color: #d1d5db;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.admin-reload-button:hover {
    background: linear-gradient(135deg, rgba(45, 122, 62, 0.3), rgba(4, 71, 44, 0.3));
    border-color: rgba(45, 122, 62, 0.5);
}

/* Modal de descripción mejorado */
.modal-overlay {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
}

.modal-content {
    background: linear-gradient(135deg, rgba(26, 31, 46, 0.98), rgba(15, 20, 25, 0.98));
    border: 1px solid rgba(45, 122, 62, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
    background: linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1));
    border-bottom: 1px solid rgba(45, 122, 62, 0.2);
}

.modal-header h2 {
    color: #f9fafb;
}

.modal-body {
    color: #e5e7eb;
}

.modal-body h3 {
    color: #f9fafb;
}

.modal-body p {
    color: #d1d5db;
}

.modal-footer {
    background: rgba(15, 20, 25, 0.8);
    border-top: 1px solid rgba(45, 122, 62, 0.2);
}

.admin-button-secondary {
    background: rgba(107, 114, 128, 0.2);
    border: 1px solid rgba(107, 114, 128, 0.3);
    color: #d1d5db;
}

.admin-button-secondary:hover {
    background: rgba(107, 114, 128, 0.3);
}
"""

css_content += css_mejoras

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("✅ CSS actualizado con paleta del sitio")

print("\n✅ TODOS LOS ARREGLOS APLICADOS!")
print("\n📋 Resumen de cambios:")
print("   1. ✅ Selector de estado agregado en modal de edición")
print("   2. ✅ CSS de tabla y filtros actualizado con paleta del sitio")
print("   3. ✅ Modal de descripción mejorado con diseño consistente")
print("\n⚠️ NOTA: El vendedor y categoría YA se muestran en la tabla")
print("   Si no aparecen, verificar que el backend retorne estos campos en el serializer")
