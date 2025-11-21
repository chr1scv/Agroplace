import React, { useState, useEffect } from 'react';

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

    // Cargar reseñas al iniciar
    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = () => {
        const exampleReviews = [
            {
                id: 1,
                user: {
                    name: 'Paula Vazquez',
                },
                rating: 5,
                title: '¡Excelente calidad!',
                comment: 'Excelente producto, lo recomiendo a todos. Definitivamente volveré a comprar.',
                date: '2023-08-Definitivamente volveré a comprar.',
                date: '2024-01-15',
                verified: true
            },
        ];
        setReviews(exampleReviews);
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
            alert('Por favor selecciona una calificación');
            return;
        }

        setLoading(true);
        
        try {
            // Simular envío a la API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newReview = {
                id: editingReview ? editingReview.id : Date.now(),
                user: {
                    name: 'Tú',
                    avatar: '👤'
                },
                rating: userReview.rating,
                title: userReview.title,
                comment: userReview.comment,
                date: new Date().toISOString().split('T')[0],
                verified: false,
                isCurrentUser: true
            };

            if (editingReview) {
                // Editar reseña existente
                setReviews(prev => prev.map(review => 
                    review.id === editingReview.id ? newReview : review
                ));
            } else {
                // Agregar nueva reseña
                setReviews(prev => [newReview, ...prev]);
            }

            // Resetear formulario
            setUserReview({ rating: 0, comment: '', title: '' });
            setShowReviewForm(false);
            setEditingReview(null);
            
        } catch (error) {
            alert('Error al enviar la reseña. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReview = (review) => {
        setUserReview({
            rating: review.rating,
            comment: review.comment,
            title: review.title
        });
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = (reviewId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            setReviews(prev => prev.filter(review => review.id !== reviewId));
        }
    };

    const cancelReview = () => {
        setUserReview({ rating: 0, comment: '', title: '' });
        setShowReviewForm(false);
        setEditingReview(null);
    };

    // Calcular estadísticas
    const stats = {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0,
        ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
            rating,
            count: reviews.filter(review => review.rating === rating).length,
            percentage: reviews.length > 0 
                ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
                : 0
        }))
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Reseñas y Calificaciones</h2>
                <div style={styles.overallRating}>
                    <div style={styles.ratingSummary}>
                        <div style={styles.averageRating}>{stats.averageRating}</div>
                        <div style={styles.stars}>
                            {renderStars(stats.averageRating, 24)}
                        </div>
                        <div style={styles.totalReviews}>
                            {stats.totalReviews} {stats.totalReviews === 1 ? 'reseña' : 'reseñas'}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowReviewForm(true)}
                        style={styles.writeReviewButton}
                    >
                        ✍️ Escribir Reseña
                    </button>
                </div>
            </div>

            {/* Distribución de calificaciones */}
            <div style={styles.ratingDistribution}>
                <h4 style={styles.distributionTitle}>Distribución de Calificaciones</h4>
                {stats.ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} style={styles.ratingBar}>
                        <span style={styles.ratingLabel}>{rating} ★</span>
                        <div style={styles.barContainer}>
                            <div 
                                style={{
                                    ...styles.barFill,
                                    width: `${percentage}%`
                                }}
                            />
                        </div>
                        <span style={styles.ratingCount}>({count})</span>
                    </div>
                ))}
            </div>

            {/* Formulario de Reseña */}
            {showReviewForm && (
                <div style={styles.reviewFormContainer}>
                    <h3 style={styles.formTitle}>
                        {editingReview ? 'Editar tu Reseña' : 'Escribir Reseña'}
                    </h3>
                    <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                        <div style={styles.ratingInput}>
                            <label style={styles.label}>Tu Calificación *</label>
                            <div style={styles.starRating}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        style={styles.starButton}
                                    >
                                        {star <= userReview.rating ? '★' : '☆'}
                                    </button>
                                ))}
                            </div>
                            <div style={styles.ratingText}>
                                {userReview.rating === 0 && 'Selecciona una calificación'}
                                {userReview.rating === 1 && 'Muy Malo'}
                                {userReview.rating === 2 && 'Malo'}
                                {userReview.rating === 3 && 'Regular'}
                                {userReview.rating === 4 && 'Bueno'}
                                {userReview.rating === 5 && 'Excelente'}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Título de la Reseña</label>
                            <input
                                type="text"
                                name="title"
                                value={userReview.title}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Ej: ¡Excelente producto!"
                                maxLength="100"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Tu Reseña *</label>
                            <textarea
                                name="comment"
                                value={userReview.comment}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                placeholder="Comparte tu experiencia con este producto..."
                                rows="4"
                                required
                            />
                        </div>

                        <div style={styles.formActions}>
                            <button 
                                type="button"
                                onClick={cancelReview}
                                style={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={loading || userReview.rating === 0 || !userReview.comment.trim()}
                                style={loading ? styles.submitButtonDisabled : styles.submitButton}
                            >
                                {loading ? 'Enviando...' : editingReview ? 'Actualizar Reseña' : 'Publicar Reseña'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Reseñas */}
            <div style={styles.reviewsList}>
                <h3 style={styles.reviewsTitle}>
                    Reseñas de Clientes ({stats.totalReviews})
                </h3>
                
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
    // Distribución de calificaciones
    ratingDistribution: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
    },
    distributionTitle: {
        margin: '0 0 1rem 0',
        color: '#333',
        fontSize: '1.1rem',
    },
    ratingBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.5rem',
    },
    ratingLabel: {
        width: '60px',
        fontSize: '0.9rem',
        color: '#666',
    },
    barContainer: {
        flex: 1,
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#ffc107',
        transition: 'width 0.3s ease',
    },
    ratingCount: {
        width: '40px',
        fontSize: '0.8rem',
        color: '#666',
        textAlign: 'right',
    },
    // Formulario de reseña
    reviewFormContainer: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
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
        color: '#ffc107',
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
    input: {
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
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
    reviewsTitle: {
        fontSize: '1.4rem',
        color: '#2d5016',
        marginBottom: '1.5rem',
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
    // Estrellas
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