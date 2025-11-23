import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutShipping = ({ onContinue, onBack }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: '',
        instrucciones: ''
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
        if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.comuna || !formData.region) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        onContinue(formData);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Información de Envío</h2>
            <p style={styles.subtitle}>
                ✓ Tu pedido califica para envío gratis
            </p>

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
                    <label style={styles.label}>Dirección Completa *</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Calle, número, departamento"
                    />
                </div>

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Comuna *</label>
                        <input
                            type="text"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Comuna"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Región *</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Selecciona región</option>
                            <option value="metropolitana">Región Metropolitana</option>
                            <option value="valparaiso">Valparaíso</option>
                            <option value="biobio">Biobío</option>
                            <option value="araucania">La Araucanía</option>
                            <option value="loslagos">Los Lagos</option>
                        </select>
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Instrucciones de entrega (opcional)</label>
                    <textarea
                        name="instrucciones"
                        value={formData.instrucciones}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Ej: Timbre 2 veces, dejar con conserjería, etc."
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
        color: '#4caf50',
        marginBottom: '2rem',
        fontWeight: '600',
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

export default CheckoutShipping;
