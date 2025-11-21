"""
Script para agregar estilos CSS y hacer la barra de navegación fija
"""

# CSS adicional para los nuevos componentes
css_adicional = """
/* ===== NAVEGACIÓN FIJA ===== */
.admin-sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
}

.admin-main-content {
    margin-left: 280px; /* Ancho del sidebar */
}

/* ===== ESTILOS PARA BADGES DE ESTADO ===== */
.admin-badge-estado {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
}

.estado-activo {
    background: #d1fae5;
    color: #065f46;
}

.estado-pendiente {
    background: #fef3c7;
    color: #92400e;
}

.estado-inactivo {
    background: #fee2e2;
    color: #991b1b;
}

/* ===== BADGE DE CATEGORÍA ===== */
.admin-badge-categoria {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    background: #e0e7ff;
    color: #4f46e5;
    display: inline-block;
}

/* ===== BOTÓN DE LINK ===== */
.admin-link-button {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    font-size: 14px;
    transition: color 0.2s;
}

.admin-link-button:hover {
    color: #2563eb;
}

/* ===== MODAL OVERLAY Y CONTENT ===== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

.modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.modal-close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
}

.modal-close-button:hover {
    background: #f3f4f6;
    color: #111827;
}

.modal-body {
    padding: 24px;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.admin-button-secondary {
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.admin-button-secondary:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}

/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* ===== MEJORAS EN LA TABLA ===== */
.admin-table tbody tr {
    transition: all 0.2s;
}

.admin-table tbody tr:hover {
    background: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.admin-table-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.admin-action-button {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
}

.admin-action-view {
    background: #eff6ff;
    color: #1e40af;
}

.admin-action-view:hover {
    background: #dbeafe;
    transform: scale(1.1);
}

.admin-action-edit {
    background: #fef3c7;
    color: #92400e;
}

.admin-action-edit:hover {
    background: #fde68a;
    transform: scale(1.1);
}

.admin-action-delete {
    background: #fee2e2;
    color: #991b1b;
}

.admin-action-delete:hover {
    background: #fecaca;
    transform: scale(1.1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
    .admin-sidebar {
        position: relative !important;
        height: auto;
    }
    
    .admin-main-content {
        margin-left: 0;
    }
}
"""

# Leer el archivo CSS actual
css_path = r"c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\adminStyles.css"
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Agregar los nuevos estilos al final
css_content += "\n\n/* ===== ESTILOS AGREGADOS PARA REDISEÑO ===== */\n"
css_content += css_adicional

# Escribir el archivo actualizado
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("✅ CSS actualizado con:")
print("   - Navegación fija (sidebar)")
print("   - Estilos para badges de estado")
print("   - Estilos para modal de descripción")
print("   - Mejoras en la tabla")
print("   - Animaciones")
