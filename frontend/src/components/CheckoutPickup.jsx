import React, { useState, useEffect } from 'react';

const CheckoutPickup = ({ items, onContinue, onBack }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        fechaRetiro: '',
        horaRetiro: '',
        notas: ''
    });

    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        if (items && items.length > 0) {
            const uniqueVendors = {};
            items.forEach(item => {
                if (item.vendedor) {
                    // Usar el ID del vendedor como clave para evitar duplicados
                    const vendorId = item.vendedor.id;
                    if (!uniqueVendors[vendorId]) {
                        uniqueVendors[vendorId] = item.vendedor;
                    }
                }
            });
            setVendors(Object.values(uniqueVendors));
        }
    }, [items]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.nombre || !formData.email || !formData.telefono || !formData.rut || !formData.fechaRetiro || !formData.horaRetiro) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        onContinue(formData);
    };

    const getFormattedAddress = (v) => {
        // Detectar si es el placeholder antiguo
        const isPlaceholder = v.direccion_retiro && v.direccion_retiro.includes("Av. Vicuña Mackenna 1234");

        if (!v.direccion_retiro || isPlaceholder) {
            return <span style={{ color: '#dc3545', fontStyle: 'italic' }}>Dirección no disponible. Contactar al vendedor.</span>;
        }

        let direccionCompleta = v.direccion_retiro;
        if (v.provincia) {
            direccionCompleta += `, Provincia de ${v.provincia}`;
        }
        return direccionCompleta;
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Información para Retiro</h2>
            <p style={styles.subtitle}>
                Tu pedido será preparado para retiro en los siguientes puntos:
            </p>

            <div style={styles.pickupInfo}>
                <h3 style={styles.infoTitle}>📍 Puntos de Retiro</h3>

                {vendors.length > 0 ? (
                    vendors.map((v, index) => {
                        // Detectar si el horario es el placeholder antiguo
                        const isPlaceholderHorario = v.horario_atencion && v.horario_atencion.includes("Lunes a Viernes 9:00 - 18:00");
                        const showHorario = v.horario_atencion && !isPlaceholderHorario;

                        return (
                            <div key={v.id || index} style={{
                                marginBottom: '1.5rem',
                                borderBottom: index < vendors.length - 1 ? '1px solid #e0e0e0' : 'none',
                                paddingBottom: index < vendors.length - 1 ? '1rem' : '0'
                            }}>
                                <h4 style={{ color: '#2d5016', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                                    Tienda: {v.titulo || v.username || v.first_name}
                                </h4>

                                <div style={styles.infoBlock}>
                                    <p style={styles.infoLabel}>Dirección:</p>
                                    <p style={styles.infoValue}>
                                        {getFormattedAddress(v)}
                                    </p>
                                </div>

                                <div style={styles.infoBlock}>
                                    <p style={styles.infoLabel}>Horario de Atención:</p>
                                    <div style={styles.infoValue}>
                                        {showHorario ? (
                                            v.horario_atencion.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))
                                        ) : (
                                            <span style={{ color: '#666', fontStyle: 'italic' }}>Horario por coordinar</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Cargando información de puntos de retiro...</p>
                )}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Apellido *</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Tu apellido"
                        />
                    </div>
                </div>

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Teléfono *</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="+56 9 1234 5678"
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>RUT *</label>
                    <input
                        type="text"
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="12.345.678-9"
                    />
                </div>

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Fecha de Retiro *</label>
                        <input
                            type="date"
                            name="fechaRetiro"
                            value={formData.fechaRetiro}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Hora Preferida *</label>
                        <select
                            name="horaRetiro"
                            value={formData.horaRetiro}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Selecciona hora</option>
                            <option value="09:00">09:00 - 10:00</option>
                            <option value="10:00">10:00 - 11:00</option>
                            <option value="11:00">11:00 - 12:00</option>
                            <option value="12:00">12:00 - 13:00</option>
                            <option value="14:00">14:00 - 15:00</option>
                            <option value="15:00">15:00 - 16:00</option>
                            <option value="16:00">16:00 - 17:00</option>
                            <option value="17:00">17:00 - 18:00</option>
                        </select>
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Notas adicionales (opcional)</label>
                    <textarea
                        name="notas"
                        value={formData.notas}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Cualquier información adicional"
                        rows="3"
                    />
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={onBack}
                        style={styles.backButton}
                    >
                        ← Volver al Carrito
                    </button>
                    <button
                        type="submit"
                        style={styles.continueButton}
                    >
                        Continuar a Revisión →
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
    },
    title: {
        fontSize: '1.8rem',
        color: '#2d5016',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '1.5rem',
    },
    pickupInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    infoTitle: {
        fontSize: '1.1rem',
        color: '#2d5016',
        marginBottom: '1rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem',
    },
    infoBlock: {
        marginBottom: '1rem',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '0.25rem',
        fontSize: '0.9rem',
    },
    infoValue: {
        color: '#333',
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none',
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '2px solid #f0f0f0',
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#4a7c1f',
        border: '2px solid #4a7c1f',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    continueButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
};

export default CheckoutPickup;
