import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const ReviewSystem = ({ productId, productName }) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({
        rating: 0,
        comment: '',
        title: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const { showToast } = useToast();

    // Cargar reseñas al iniciar
    useEffect(() => {
        if (productId) {
            loadReviews();
        }
    }, [productId]);

    const loadReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/reviews/?producto=${productId}`);
            if (response.ok) {
                const data = await response.json();
                // Transformar datos de la API al formato del componente
                const formattedReviews = data.map(review => ({
                    id: review.id,
                    user: {
                        name: review.usuario_nombre || 'Usuario',
                        avatar: '👤'
                    },
                    rating: review.calificacion,
                    title: '', // El modelo actual no tiene título
                    comment: review.comentario,
                    date: review.fecha_creacion,
                    verified: true,
                    isCurrentUser: false // Se podría validar con usuario actual si estuviera disponible
                }));
                setReviews(formattedReviews);
            }
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
        }
    };

    const handleRatingChange = (rating) => {
        setUserReview(prev => ({ ...prev, rating }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserReview(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (userReview.rating === 0) {
            showToast('Por favor selecciona una calificación', 'warning');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch('http://localhost:8000/api/reviews/', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    producto: productId,
                    calificacion: userReview.rating,
                    comentario: userReview.comment
                })
            });

            if (response.ok) {
                showToast('Reseña enviada con éxito', 'success');
                setShowReviewForm(false);
                setUserReview({ rating: 0, comment: '', title: '' });
                loadReviews(); // Recargar reseñas
            } else {
                const errorData = await response.json();
                showToast('Error al enviar la reseña: ' + JSON.stringify(errorData), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error de conexión al enviar la reseña', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReview = (review) => {
        // Implementar lógica de edición si es necesario
        console.log("Editar reseña", review);
    };

    const handleDeleteReview = (reviewId) => {
        // Implementar lógica de eliminación si es necesario
        console.log("Eliminar reseña", reviewId);
    };

    // Calcular promedio
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Opiniones de clientes</h2>
                    <div style={styles.overallRating}>
                        <div style={styles.ratingSummary}>
                            <div style={styles.averageRating}>{averageRating}</div>
                            <div style={styles.stars}>{renderStars(Math.round(averageRating), 24)}</div>
                            <div style={styles.totalReviews}>{reviews.length} calificaciones</div>
                        </div>
                    </div>
                </div>
                <button style={styles.writeReviewButton} onClick={() => setShowReviewForm(true)}>
                    Escribir Reseña
                </button>
            </div>

            {/* Modal Formulario */}
            {showReviewForm && (
                <div style={styles.modalOverlay} onClick={() => setShowReviewForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeModalButton} onClick={() => setShowReviewForm(false)}>×</button>
                        <h3 style={styles.formTitle}>Escribe tu reseña</h3>
                        <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                            <div style={styles.ratingInput}>
                                <label style={styles.label}>Calificación</label>
                                <div style={styles.starRating}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            style={{
                                                ...styles.starButton,
                                                color: star <= userReview.rating ? '#ffc107' : '#e0e0e0'
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <span style={styles.ratingText}>
                                    {userReview.rating === 1 && 'Malo'}
                                    {userReview.rating === 2 && 'Regular'}
                                    {userReview.rating === 3 && 'Bueno'}
                                    {userReview.rating === 4 && 'Muy bueno'}
                                    {userReview.rating === 5 && 'Excelente'}
                                </span>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tu opinión</label>
                                <textarea
                                    name="comment"
                                    value={userReview.comment}
                                    onChange={handleInputChange}
                                    placeholder="¿Qué te pareció este producto?"
                                    style={styles.textarea}
                                    required
                                />
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    style={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={loading ? styles.submitButtonDisabled : styles.submitButton}
                                >
                                    {loading ? 'Enviando...' : 'Publicar Reseña'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de Reseñas */}
            <div style={styles.reviewsList}>
                {reviews.length === 0 ? (
                    <div style={styles.noReviews}>
                        <div style={styles.noReviewsIcon}>💬</div>
                        <p>Este producto aún no tiene reseñas.</p>
                        <p>Sé el primero en compartir tu experiencia.</p>
                    </div>
                ) : (
                    <div style={styles.reviewsContainer}>
                        {reviews.map(review => (
                            <div key={review.id} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <div style={styles.userInfo}>
                                        <div style={styles.userAvatar}>
                                            {review.user.avatar}
                                        </div>
                                        <div>
                                            <div style={styles.userName}>
                                                {review.user.name}
                                                {review.verified && (
                                                    <span style={styles.verifiedBadge}>✅ Verificado</span>
                                                )}
                                                {review.isCurrentUser && (
                                                    <span style={styles.currentUserBadge}>👤 Tú</span>
                                                )}
                                            </div>
                                            <div style={styles.reviewDate}>
                                                {formatDate(review.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.reviewRating}>
                                        {renderStars(review.rating, 18)}
                                    </div>
                                </div>

                                {review.title && (
                                    <h4 style={styles.reviewTitle}>{review.title}</h4>
                                )}

                                <p style={styles.reviewComment}>{review.comment}</p>

                                {review.isCurrentUser && (
                                    <div style={styles.reviewActions}>
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            style={styles.editButton}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            style={styles.deleteButton}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente auxiliar para renderizar estrellas
const renderStars = (rating, size = 20) => {
    return (
        <div style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    style={{
                        ...styles.star,
                        color: star <= rating ? '#ffc107' : '#e0e0e0',
                        fontSize: `${size}px`
                    }}
                >
                    {star <= rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

// Función para formatear fecha
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '2rem 0',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: '1.8rem',
        color: '#2d5016',
        margin: 0,
    },
    overallRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    ratingSummary: {
        textAlign: 'center',
    },
    averageRating: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#2d5016',
        lineHeight: 1,
    },
    stars: {
        margin: '0.5rem 0',
    },
    totalReviews: {
        color: '#666',
        fontSize: '0.9rem',
    },
    writeReviewButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
    },
    // Modal
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modalContent: {
        backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px',
        position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    closeModalButton: {
        position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'
    },
    formTitle: {
        margin: '0 0 1.5rem 0',
        color: '#2d5016',
        fontSize: '1.3rem',
    },
    reviewForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    ratingInput: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem',
    },
    starRating: {
        display: 'flex',
        gap: '0.25rem',
    },
    starButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '2rem',
        cursor: 'pointer',
        padding: '0.25rem',
        borderRadius: '4px',
        transition: 'transform 0.2s',
    },
    ratingText: {
        fontSize: '0.9rem',
        color: '#666',
        fontStyle: 'italic',
        minHeight: '1.2rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        minHeight: '100px',
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: '#666',
        border: '2px solid #666',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#4a7c1f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        color: '#666',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontWeight: 'bold',
    },
    // Lista de reseñas
    reviewsList: {
        marginTop: '2rem',
    },
    noReviews: {
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
    },
    noReviewsIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    reviewsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    reviewCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#4a7c1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: 'white',
        flexShrink: 0,
    },
    userName: {
        fontWeight: 'bold',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    verifiedBadge: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    currentUserBadge: {
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    reviewDate: {
        color: '#666',
        fontSize: '0.8rem',
        marginTop: '0.25rem',
    },
    reviewRating: {
        flexShrink: 0,
    },
    reviewTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#2d5016',
        margin: '0 0 0.5rem 0',
    },
    reviewComment: {
        color: '#333',
        lineHeight: '1.6',
        margin: '0',
        whiteSpace: 'pre-wrap',
    },
    reviewActions: {
        display: 'flex',
        gap: '0.5rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e0e0e0',
    },
    editButton: {
        backgroundColor: '#ffc107',
        color: 'black',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    starsContainer: {
        display: 'flex',
        gap: '2px',
    },
    star: {
        display: 'inline-block',
        fontWeight: 'bold',
    },
};

export default ReviewSystem;