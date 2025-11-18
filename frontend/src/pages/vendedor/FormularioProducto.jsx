import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioProducto = ({ 
    productoEditar = null, 
    onGuardar, 
    onCancelar, 
    onRecargar,
    categorias = [] 
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        origen: 'convencional',
        ciudad: '',      // ✅ NUEVO
        comuna: '',      // ✅ NUEVO
        activo: true
    });
    const [imagen, setImagen] = useState(null);
    const [certificadoOrganico, setCertificadoOrganico] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [certificadoPreview, setCertificadoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vendedorId, setVendedorId] = useState(null);

    // Obtener el ID del vendedor logueado al cargar el componente
    useEffect(() => {
        const obtenerVendedorId = () => {
            try {
                const usuario = JSON.parse(localStorage.getItem('user'));
                if (usuario && usuario.id) {
                    setVendedorId(usuario.id);
                    console.log('👨‍🌾 Vendedor ID:', usuario.id);
                } else {
                    console.error('No se pudo obtener el ID del vendedor');
                }
            } catch (error) {
                console.error('Error obteniendo vendedor ID:', error);
            }
        };

        obtenerVendedorId();

        // Cargar datos si estamos editando
        if (productoEditar) {
            setFormData({
                nombre: productoEditar.nombre || '',
                descripcion: productoEditar.descripcion || '',
                precio: productoEditar.precio?.toString() || '',
                stock: productoEditar.stock?.toString() || '',
                categoria: productoEditar.categoria?.toString() || '',
                origen: productoEditar.origen || 'convencional',
                ciudad: productoEditar.ciudad || '',      // ✅ NUEVO
                comuna: productoEditar.comuna || '',      // ✅ NUEVO
                activo: productoEditar.activo !== false
            });
            
            if (productoEditar.imagen) {
                const imageUrl = productoEditar.imagen.startsWith('/media/') 
                    ? `http://localhost:8000${productoEditar.imagen}`
                    : productoEditar.imagen;
                setImagenPreview(imageUrl);
            }
        }
    }, [productoEditar]);

    // Función para obtener el token CSRF de las cookies
    const getCsrfToken = () => {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagenPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagenPreview(null);
        }
    };

    const handleCertificadoChange = (e) => {
        const file = e.target.files[0];
        setCertificadoOrganico(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCertificadoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setCertificadoPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validaciones
            if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
                throw new Error('Por favor completa todos los campos requeridos');
            }

            if (formData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            if (formData.stock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            if (!vendedorId && !productoEditar) {
                throw new Error('No se pudo identificar al vendedor. Por favor, inicia sesión nuevamente.');
            }

            const formDataToSend = new FormData();
            
            // Campos básicos
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('descripcion', formData.descripcion);
            formDataToSend.append('precio', formData.precio);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('categoria', formData.categoria);
            formDataToSend.append('origen', formData.origen);
            formDataToSend.append('activo', formData.activo.toString());
            
            // ✅ AGREGAR CIUDAD Y COMUNA
            if (formData.ciudad) {
                formDataToSend.append('ciudad', formData.ciudad);
            }
            if (formData.comuna) {
                formDataToSend.append('comuna', formData.comuna);
            }

            // ✅ AGREGAR VENDEDOR AUTOMÁTICAMENTE (solo para productos nuevos)
            if (!productoEditar && vendedorId) {
                formDataToSend.append('vendedor', vendedorId.toString());
                console.log('👨‍🌾 Agregando vendedor ID:', vendedorId);
            }

            // ✅ Para edición, usar el vendedor del producto existente
            if (productoEditar && productoEditar.vendedor) {
                formDataToSend.append('vendedor', productoEditar.vendedor.toString());
                 console.log('👨‍🌾 Usando vendedor del producto:', productoEditar.vendedor);
            }

            // IMPORTANTE: Para productos nuevos, no están aprobados inicialmente
            if (!productoEditar) {
                formDataToSend.append('aprobado', 'false');
            } else {
                // Productos editados: mantener su estado de aprobación actual
                formDataToSend.append('aprobado', productoEditar.aprobado ? 'true' : 'false');
                console.log('✅ Manteniendo aprobación:', productoEditar.aprobado);
            }

            // Archivos
            if (imagen) {
                formDataToSend.append('imagen', imagen);
                console.log('📸 Imagen agregada:', imagen.name);
            }
            if (certificadoOrganico) {
                formDataToSend.append('certificado_organico', certificadoOrganico);
                console.log('📄 Certificado agregado:', certificadoOrganico.name);
            }

            // Debug: mostrar todos los campos del FormData
            console.log('📤 Campos del FormData:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            // Obtener token CSRF
            const csrfToken = getCsrfToken();
            console.log('🔐 CSRF Token:', csrfToken);

            if (!csrfToken) {
                throw new Error('No se pudo obtener el token de seguridad. Por favor, recarga la página.');
            }

            // Configurar headers con CSRF
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                }
            };

            let response;
            if (productoEditar) {
                // Editar producto existente
                console.log('✏️ Editando producto existente...');
                response = await axios.put(
                    `http://localhost:8000/api/productos/${productoEditar.id}/`,
                    formDataToSend,
                    config
                );
                console.log('✅ Respuesta completa:', response.data);
                console.log('✅ Status:', response.data.id);
                console.log('✅ Producto actualizado:', response.data);
            } else {
                // Crear nuevo producto (requiere aprobación)
                console.log('➕ Creando nuevo producto...');
                response = await axios.post(
                    'http://localhost:8000/api/productos/',
                    formDataToSend,
                    config
                );
                console.log('✅ Producto creado (pendiente de aprobación):', response.data);
            }

            // Éxito
            if (onGuardar) {
                onGuardar(response.data);
            }
            if (onRecargar) {
                await onRecargar();
            }

            // Mostrar mensaje según si es nuevo o editado
            if (!productoEditar) {
                alert('🎉 Producto creado exitosamente! \n\n📋 Ahora debe ser aprobado por un administrador antes de aparecer en la tienda.');
            } else {
                alert('✅ Producto actualizado exitosamente!');
            }

            // Limpiar formulario si es creación nueva
            if (!productoEditar) {
                resetForm();
            }

        } catch (error) {
            console.error('❌ Error guardando producto:', error);
            let errorMessage = 'Error al guardar el producto';
            
            if (error.response) {
                console.error('📡 Error del servidor:', error.response.data);
                
                // Manejar errores específicos de Django
                if (error.response.data.vendedor) {
                    errorMessage = 'Error de vendedor: ' + error.response.data.vendedor.join(', ');
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.request) {
                console.error('🌐 No hay conexión con el servidor');
                errorMessage = 'Error: No se puede conectar al servidor. Verifica que esté corriendo en http://localhost:8000';
            } else {
                console.error('⚙️ Error:', error.message);
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: '',
            origen: 'convencional',
            ciudad: '',      // ✅ NUEVO
            comuna: '',      // ✅ NUEVO
            activo: true
        });
        setImagen(null);
        setCertificadoOrganico(null);
        setImagenPreview(null);
        setCertificadoPreview(null);
    };

    const handleCancel = () => {
        resetForm();
        if (onCancelar) {
            onCancelar();
        }
    };

    return (
        <div className="formulario-producto">
            <div className="formulario-header">
                <h3>{productoEditar ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}</h3>
                {!productoEditar && (
                    <div className="aprobacion-info">
                        ⚠️ Requiere aprobación del administrador
                    </div>
                )}
                <button 
                    onClick={handleCancel}
                    className="btn-cerrar"
                    disabled={loading}
                >
                    ×
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {!vendedorId && !productoEditar && (
                <div className="warning-message">
                    ⚠️ No se pudo identificar tu cuenta de vendedor. Por favor, recarga la página.
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario-form">
                {/* Información del Vendedor (solo lectura) */}
                {vendedorId && !productoEditar && (
                    <div className="vendedor-info">
                        <div className="vendedor-label">Vendedor:</div>
                        <div className="vendedor-value">Tu cuenta (ID: {vendedorId})</div>
                    </div>
                )}

                {/* Nombre y Categoría */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nombre del Producto *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Ej: Manzanas Orgánicas Premium"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Categoría *</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleInputChange}
                            required
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Precio y Stock */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Precio (CLP) *</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="100"
                            className="form-input"
                            placeholder="2500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="form-input"
                            placeholder="50"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* ✅ CIUDAD Y COMUNA - NUEVO */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">📍 Ciudad</label>
                        <input
                            type="text"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Ej: Talca, Curicó, Linares..."
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">🏘️ Comuna</label>
                        <input
                            type="text"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Ej: San Clemente, Molina..."
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Descripción */}
                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Describe tu producto... (calidad, origen, beneficios)"
                        rows="4"
                        disabled={loading}
                    />
                </div>

                {/* Origen */}
                <div className="form-group">
                    <label className="form-label">Tipo de Cultivo</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="origen"
                                value="convencional"
                                checked={formData.origen === 'convencional'}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            🏭 Convencional
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="origen"
                                value="organico"
                                checked={formData.origen === 'organico'}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            🌿 Orgánico
                        </label>
                    </div>
                </div>

                {/* Imagen del Producto */}
                <div className="form-group">
                    <label className="form-label">
                        Imagen del Producto {!productoEditar && '(Opcional)'}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="form-file-input"
                        disabled={loading}
                    />
                    {imagenPreview && (
                        <div className="image-preview">
                            <img 
                                src={imagenPreview} 
                                alt="Vista previa" 
                                className="preview-image"
                            />
                            <p className="file-info">
                                {imagen ? imagen.name : 'Imagen actual del producto'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Certificado Orgánico (solo si es orgánico) */}
                {formData.origen === 'organico' && (
                    <div className="form-group">
                        <label className="form-label">Certificado Orgánico (Opcional)</label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertificadoChange}
                            className="form-file-input"
                            disabled={loading}
                        />
                        {certificadoPreview && (
                            <div className="image-preview">
                                <img 
                                    src={certificadoPreview} 
                                    alt="Vista previa certificado" 
                                    className="preview-image"
                                />
                                <p className="file-info">
                                    {certificadoOrganico ? certificadoOrganico.name : 'Certificado actual'}
                                </p>
                            </div>
                        )}
                        {productoEditar?.certificado_organico && !certificadoPreview && (
                            <p className="file-info">
                                📄 Certificado actual: {productoEditar.certificado_organico}
                            </p>
                        )}
                    </div>
                )}

                {/* Estado Activo */}
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleInputChange}
                            className="form-checkbox"
                            disabled={loading}
                        />
                        📦 Producto visible y disponible para la venta
                    </label>
                    {!productoEditar && (
                        <div className="help-text">
                            ⚠️ El producto estará visible solo después de la aprobación del administrador
                        </div>
                    )}
                </div>

                {/* Información de Aprobación */}
                {!productoEditar && (
                    <div className="info-box">
                        <div className="info-icon">📋</div>
                        <div className="info-content">
                            <strong>Proceso de Aprobación:</strong>
                            <p>Tu producto será revisado por un administrador antes de aparecer en la tienda. 
                            Recibirás una notificación cuando sea aprobado.</p>
                        </div>
                    </div>
                )}

                {/* Acciones */}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn-guardar"
                        disabled={loading || (!vendedorId && !productoEditar)}
                    >
                        {loading ? '🔄 Guardando...' : (productoEditar ? '💾 Actualizar Producto' : '➕ Crear Producto')}
                    </button>
                    <button 
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancelar"
                        disabled={loading}
                    >
                        ❌ Cancelar
                    </button>
                </div>
            </form>

            <style jsx>{`
                .formulario-producto {
                    background: rgba(26, 31, 46, 0.9);
                    border: 1px solid rgba(45, 122, 62, 0.3);
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    backdrop-filter: blur(10px);
                }

                .formulario-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(45, 122, 62, 0.2);
                }

                .formulario-header h3 {
                    color: #f9fafb;
                    margin: 0;
                    font-size: 1.3rem;
                }

                .aprobacion-info {
                    background: rgba(255, 152, 0, 0.1);
                    color: #ff9800;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid rgba(255, 152, 0, 0.3);
                }

                .btn-cerrar {
                    background: rgba(220, 38, 38, 0.1);
                    color: #fca5a5;
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .error-message {
                    background: rgba(220, 38, 38, 0.1);
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    color: #fca5a5;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }

                .warning-message {
                    background: rgba(255, 152, 0, 0.1);
                    border: 1px solid rgba(255, 152, 0, 0.3);
                    color: #ff9800;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }

                .vendedor-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(45, 122, 62, 0.1);
                    border: 1px solid rgba(45, 122, 62, 0.3);
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .vendedor-label {
                    font-weight: 600;
                    color: #2d7a3e;
                }

                .vendedor-value {
                    color: #e5e7eb;
                    font-size: 0.9rem;
                }

                .formulario-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-weight: 600;
                    color: #d1d5db;
                    font-size: 0.9rem;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    padding: 12px;
                    background: rgba(15, 20, 25, 0.5);
                    border: 1px solid rgba(45, 122, 62, 0.2);
                    border-radius: 8px;
                    color: #e5e7eb;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #2d7a3e;
                    box-shadow: 0 0 0 2px rgba(45, 122, 62, 0.2);
                }

                .form-input:disabled,
                .form-select:disabled,
                .form-textarea:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }

                .radio-group {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .radio-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: #e5e7eb;
                    font-size: 0.9rem;
                }

                .radio-label input[type="radio"] {
                    accent-color: #2d7a3e;
                }

                .form-file-input {
                    padding: 8px;
                    background: rgba(15, 20, 25, 0.5);
                    border: 1px solid rgba(45, 122, 62, 0.2);
                    border-radius: 8px;
                    color: #e5e7eb;
                    cursor: pointer;
                }

                .form-file-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .image-preview {
                    margin-top: 0.5rem;
                    text-align: center;
                }

                .preview-image {
                    max-width: 200px;
                    max-height: 150px;
                    border-radius: 8px;
                    border: 1px solid rgba(45, 122, 62, 0.3);
                }

                .file-info {
                    font-size: 0.8rem;
                    color: #9ca3af;
                    margin-top: 0.25rem;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: #e5e7eb;
                    font-size: 0.9rem;
                }

                .form-checkbox {
                    accent-color: #2d7a3e;
                }

                .help-text {
                    font-size: 0.8rem;
                    color: #ff9800;
                    margin-top: 0.25rem;
                }

                .info-box {
                    background: rgba(33, 150, 243, 0.1);
                    border: 1px solid rgba(33, 150, 243, 0.3);
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .info-icon {
                    font-size: 1.5rem;
                    color: #2196f3;
                }

                .info-content {
                    flex: 1;
                }

                .info-content strong {
                    color: #2196f3;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .info-content p {
                    color: #e5e7eb;
                    font-size: 0.9rem;
                    margin: 0;
                    line-height: 1.4;
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .btn-guardar {
                    flex: 2;
                    background: linear-gradient(135deg, #2d7a3e, #47a855);
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .btn-guardar:hover:not(:disabled) {
                    background: linear-gradient(135deg, #47a855, #5cb85c);
                    transform: translateY(-1px);
                }

                .btn-guardar:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-cancelar {
                    flex: 1;
                    background: rgba(107, 114, 128, 0.1);
                    color: #9ca3af;
                    border: 1px solid rgba(107, 114, 128, 0.3);
                    padding: 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .btn-cancelar:hover:not(:disabled) {
                    background: rgba(107, 114, 128, 0.2);
                    transform: translateY(-1px);
                }

                .btn-cancelar:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .formulario-producto {
                        padding: 1.5rem;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .radio-group {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    
                    .formulario-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }
                    
                    .vendedor-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FormularioProducto;