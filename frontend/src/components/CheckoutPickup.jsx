import React, { useState } from 'react';

const CheckoutPickup = ({ onContinue, onBack }) => {
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

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Información para Retiro</h2>
            <p style={styles.subtitle}>
                Tu pedido será preparado para retiro en tienda
            </p>

            <div style={styles.pickupInfo}>
                <h3 style={styles.infoTitle}>📍 Punto de Retiro</h3>
                <p><strong>Dirección:</strong> Av. Vicuña Mackenna 1234, La Florida, Provincia de Santiago, Región Metropolitana</p>
                <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00</p>
                <p><strong>Sábados:</strong> 10:00 - 14:00</p>
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
