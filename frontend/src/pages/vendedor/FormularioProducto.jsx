// Contenido completo para: chr1scv/agroplace/Agroplace-dev_mati/frontend/src/pages/vendedor/FormularioProducto.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAxiosConfigMultipart } from '../../utils/csrf';
import './FormularioProducto.css'; // <--- IMPORTAR EL CSS EXTERNO AQUÍ

const FormularioProducto = ({
    productoEditar = null,
    onGuardar,
    onCancelar,
    onRecargar,
    categorias = [],
    // Se añade showToast para mejor manejo de mensajes
    showToast = (msg, type) => { console.log(`Toast: [${type}] ${msg}`) }
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        origen: 'convencional',
        region: '',
        provincia: '',
        comuna: '',
        activo: true
    });
    const [imagen, setImagen] = useState(null);
    const [certificadoOrganico, setCertificadoOrganico] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [certificadoPreview, setCertificadoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- CAMBIO CLAVE 1: Almacenar la información completa del vendedor (ID y Nombre) ---
    const [vendedorInfo, setVendedorInfo] = useState({ id: null, nombre: 'Cargando...' });

    // Obtener el ID y Nombre del vendedor logueado al cargar el componente
    useEffect(() => {
        const obtenerVendedorInfo = () => {
            try {
                const usuario = JSON.parse(localStorage.getItem('user'));
                if (usuario && usuario.id) {
                    // Crea el nombre completo usando first_name y last_name, o recurre al username
                    const fullName = `${usuario.first_name || usuario.username || 'Vendedor'} ${usuario.last_name || ''}`.trim();

                    setVendedorInfo({
                        id: usuario.id,
                        nombre: fullName
                    });
                    console.log('👨‍🌾 Vendedor ID:', usuario.id, 'Nombre:', fullName);
                } else {
                    console.error('No se pudo obtener el ID del vendedor');
                }
            } catch (error) {
                console.error('Error obteniendo vendedor info:', error);
            }
        };

        obtenerVendedorInfo();

        // Cargar datos si estamos editando
        if (productoEditar) {
            setFormData({
                nombre: productoEditar.nombre || '',
                descripcion: productoEditar.descripcion || '',
                precio: productoEditar.precio?.toString() || '',
                stock: productoEditar.stock?.toString() || '',
                categoria: productoEditar.categoria?.toString() || '',
                origen: productoEditar.origen || 'convencional',
                region: productoEditar.region || '',
                provincia: productoEditar.provincia || '',
                comuna: productoEditar.comuna || '',
                activo: productoEditar.activo !== false
            });

            if (productoEditar.imagen) {
                const imageUrl = productoEditar.imagen.startsWith('/media/')
                    ? `http://localhost:8000${productoEditar.imagen}`
                    : productoEditar.imagen;
                setImagenPreview(imageUrl);
            }
            // Muestra una indicación de que el certificado está cargado en edición
            if (productoEditar.certificado_organico) {
                setCertificadoPreview('Certificado cargado');
            }
        }
    }, [productoEditar]);

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
            if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria || !formData.descripcion || !formData.region || !formData.provincia || !formData.comuna) {
                throw new Error('Por favor completa todos los campos requeridos');
            }

            if (formData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            if (formData.stock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            if (!vendedorInfo.id && !productoEditar) {
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

            formDataToSend.append('region', formData.region);
            formDataToSend.append('provincia', formData.provincia);
            formDataToSend.append('comuna', formData.comuna);

            // AGREGAR VENDEDOR
            if (!productoEditar) {
                formDataToSend.append('vendedor', vendedorInfo.id.toString());
            } else if (productoEditar && productoEditar.vendedor) {
                formDataToSend.append('vendedor', productoEditar.vendedor.toString());
            }

            // Aprobación
            if (!productoEditar) {
                formDataToSend.append('aprobado', 'false');
            } else {
                formDataToSend.append('aprobado', productoEditar.aprobado ? 'true' : 'false');
            }

            // Archivos
            if (imagen) {
                formDataToSend.append('imagen', imagen);
            }
            if (certificadoOrganico) {
                formDataToSend.append('certificado_organico', certificadoOrganico);
            }

            const config = getAxiosConfigMultipart();

            let response;
            const baseUrl = 'http://localhost:8000/api/productos/';

            if (productoEditar) {
                // Editar producto existente (PUT)
                response = await axios.put(
                    `${baseUrl}${productoEditar.id}/`,
                    formDataToSend,
                    config
                );
            } else {
                // Crear nuevo producto (POST)
                response = await axios.post(
                    baseUrl,
                    formDataToSend,
                    config
                );
            }

            // Éxito
            if (onGuardar) {
                onGuardar(response.data);
            }
            if (onRecargar) {
                await onRecargar();
            }

            const successMessage = productoEditar
                ? '✅ Producto actualizado exitosamente!'
                : '🎉 Producto creado exitosamente! Ahora debe ser aprobado por un administrador.';

            showToast(successMessage, 'success');

            // Limpiar formulario si es creación nueva
            if (!productoEditar) {
                resetForm();
            }

        } catch (error) {
            console.error('❌ Error guardando producto:', error);
            let errorMessage = 'Error al guardar el producto. ';

            if (error.response) {
                const data = error.response.data;

                if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.vendedor) {
                    errorMessage += 'Error de vendedor: ' + data.vendedor.join(', ');
                } else {
                    errorMessage += 'Revisa los campos. Detalles: ' + JSON.stringify(data);
                }
            } else if (error.request) {
                errorMessage = 'Error: No se puede conectar al servidor. Verifica que esté corriendo.';
            } else {
                errorMessage = error.message;
            }

            showToast(`❌ ${errorMessage}`, 'error');
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
            region: '',
            provincia: '',
            comuna: '',
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

            {!vendedorInfo.id && !productoEditar && (
                <div className="warning-message">
                    ⚠️ No se pudo identificar tu cuenta de vendedor. Por favor, recarga la página.
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario-form">
                {/* Información del Vendedor (solo lectura) - Muestra el nombre/usuario en lugar del ID */}
                <div className="vendedor-info">
                    <div className="vendedor-label">Vendedor:</div>
                    <div className="vendedor-value">{vendedorInfo.nombre}</div>
                </div>

                {/* Nombre y Categoría */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="nombre">Nombre del Producto *</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Ej: Manzanas Orgánicas Premium"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="categoria">Categoría *</label>
                        <select
                            name="categoria"
                            id="categoria"
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
                        <label className="form-label" htmlFor="precio">Precio (CLP) *</label>
                        <input
                            type="number"
                            name="precio"
                            id="precio"
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
                        <label className="form-label" htmlFor="stock">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            id="stock"
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

                {/* Descripción */}
                <div className="form-group">
                    <label className="form-label" htmlFor="descripcion">Descripción *</label>
                    <textarea
                        name="descripcion"
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                        className="form-textarea"
                        placeholder="Describe tu producto... (calidad, origen, beneficios)"
                        rows="4"
                        disabled={loading}
                    />
                </div>

                {/* REGIÓN, PROVINCIA Y COMUNA */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="region">🌎 Región *</label>
                        <input
                            type="text"
                            name="region"
                            id="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Ej: Maule, O'Higgins..."
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="provincia">📍 Provincia *</label>
                        <input
                            type="text"
                            name="provincia"
                            id="provincia"
                            value={formData.provincia}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Ej: Talca, Curicó, Linares..."
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="comuna">🏘️ Comuna *</label>
                    <input
                        type="text"
                        name="comuna"
                        id="comuna"
                        value={formData.comuna}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Ej: San Clemente, Molina..."
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
                <div className="form-group file-group">
                    <label className="form-label" htmlFor="imagen-file">
                        Imagen del Producto {!productoEditar && '(Opcional)'}
                    </label>
                    <input
                        type="file"
                        id="imagen-file"
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
                    <div className="form-group file-group">
                        <label className="form-label" htmlFor="certificado-file">Certificado Orgánico (Opcional)</label>
                        <input
                            type="file"
                            id="certificado-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertificadoChange}
                            className="form-file-input"
                            disabled={loading}
                        />
                        {certificadoPreview === 'Certificado cargado' && (
                            <p className="file-info current-cert-info">
                                📄 Certificado cargado actualmente. (No visible en preview)
                            </p>
                        )}
                        {productoEditar?.certificado_organico && !certificadoPreview && (
                            <p className="file-info current-cert-info">
                                📄 Certificado actual: {productoEditar.certificado_organico.split('/').pop()}
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
                        disabled={loading || (!vendedorInfo.id && !productoEditar)}
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
        </div>
    );
};

export default FormularioProducto;