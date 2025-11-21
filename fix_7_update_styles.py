#!/usr/bin/env python3
"""
Script 7: Update adminStyles.css with new filter styles
"""

def update_admin_styles():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\admin\adminStyles.css'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Updating adminStyles.css...")
    
    new_styles = """

/* Nuevos estilos para Filtros Comprehensivos */
.admin-filtros-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    background: rgba(26, 31, 46, 0.6);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(45, 122, 62, 0.1);
}

.admin-filtros-row {
    display: flex;
    gap: 1.5rem;
    align-items: flex-end;
    flex-wrap: wrap;
}

.admin-filtro-input {
    padding: 10px 12px;
    background-color: rgba(26, 31, 46, 0.8);
    border: 1px solid rgba(45, 122, 62, 0.2);
    border-radius: 8px;
    color: #e5e7eb;
    font-size: 0.9rem;
    width: 100%;
    min-width: 120px;
}

.admin-filtro-input:focus {
    outline: none;
    border-color: #2d7a3e;
    box-shadow: 0 0 0 2px rgba(45, 122, 62, 0.2);
}

.admin-button-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.admin-button-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.admin-link-button {
    background: none;
    border: none;
    color: #47a855;
    text-decoration: none;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
    transition: color 0.2s;
}

.admin-link-button:hover {
    color: #2d7a3e;
    text-decoration: underline;
}

.admin-estado-aprobado {
    background-color: rgba(45, 122, 62, 0.15);
    color: #47a855;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba(45, 122, 62, 0.2);
}

/* Ajustes responsivos para filtros */
@media (max-width: 1024px) {
    .admin-filtros-row {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .admin-filtro-group {
        flex-direction: column;
        align-items: stretch;
    }
    
    .admin-filtro-select, 
    .admin-filtro-input {
        width: 100%;
    }
}
"""
    
    if ".admin-filtros-section" not in content:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(new_styles)
        print("✓ Added new filter styles to adminStyles.css")
        return True
    else:
        print("⚠ Styles already exist")
        return True

if __name__ == "__main__":
    try:
        success = update_admin_styles()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        exit(1)
