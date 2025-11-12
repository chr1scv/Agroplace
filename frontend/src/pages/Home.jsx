import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate(); // ✅ Agregar hook de navegación

    // Detectar scroll para efecto en el header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Carrusel automático
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const testimonials = [
        {
            text: "Productos frescos y de calidad excepcional. Agroplace cambió mi forma de comprar.",
            author: "María González",
            role: "Consumidora"
        },
        {
            text: "Como agricultor, encontré una plataforma que valora mi trabajo y me conecta directamente con clientes.",
            author: "Pedro Morales",
            role: "Productor"
        },
        {
            text: "La transparencia y el comercio justo hacen toda la diferencia. Totalmente recomendado.",
            author: "Laura Díaz",
            role: "Consumidora"
        }
    ];

    const features = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            title: "Productos Frescos",
            description: "Directo del campo a tu mesa, sin intermediarios ni procesos artificiales"
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: "Apoyo Local",
            description: "Compras directas a pequeños y medianos productores agrícolas"
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            title: "Entrega Rápida",
            description: "Sistema logístico eficiente que garantiza frescura en cada entrega"
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            title: "Comercio Justo",
            description: "Precios transparentes y equitativos para productores y consumidores"
        }
    ];

    const stats = [
        { number: "+500", label: "Productos Disponibles" },
        { number: "+200", label: "Agricultores Activos" },
        { number: "+1000", label: "Clientes Satisfechos" },
        { number: "4.8", label: "Valoración Promedio" }
    ];

    return (
        <div style={styles.pageContainer}>
            {/* Header Personalizado del Home */}
            <header style={{
                ...styles.header,
                background: isScrolled
                    ? 'rgba(4, 71, 44, 0.95)'
                    : 'rgba(4, 71, 44, 0.9)',
                backdropFilter: isScrolled ? 'blur(10px)' : 'blur(5px)',
            }}>
                <div style={styles.headerContainer}>
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <div style={styles.logoIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <span style={styles.logoText}>Agroplace</span>
                    </div>

                    <nav style={styles.nav}>
                        <div style={styles.navLink} onClick={() => navigate('/')}>Inicio</div>
                        <div style={styles.navLink} onClick={() => navigate('/productos')}>Productos</div>
                        <div style={styles.navLink} onClick={() => navigate('/nosotros')}>Nosotros</div>
                        <div style={styles.navLink} onClick={() => navigate('/contacto')}>Contacto</div>
                    </nav>

                    <div style={styles.authButtons}>
                        <div style={styles.loginBtn} onClick={() => navigate('/login')}>Iniciar Sesión</div>
                        <div style={styles.registerBtn} onClick={() => navigate('/registro')}>Registrarse</div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroOverlay}></div>
                <div style={styles.heroContent}>
                    <div style={styles.heroText}>
                        <h1 style={styles.heroTitle}>
                            Conectamos el campo <span style={styles.highlight}>con tu mesa</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Productos agrícolas frescos, directo de productores locales.
                            Calidad, transparencia y apoyo real al campo chileno.
                        </p>
                        <div style={styles.heroCTA}>
                            <div style={styles.ctaPrimary} onClick={() => navigate('/productos')}>
                                Explorar Productos
                            </div>
                            <div style={styles.ctaSecondary} onClick={() => navigate('/registro')}>
                                Unirse Ahora
                            </div>
                        </div>
                    </div>
                    <div style={styles.heroImageContainer}>
                        <img
                            src="/img/logo-banner-agroplace.png"
                            alt="Agroplace - Conectando el campo"
                            style={styles.heroImage}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>¿Por qué elegir Agroplace?</h2>
                    <div style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={styles.featureCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = '#2d7a3e';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#374151';
                                }}
                            >
                                <div style={styles.featureIcon}>{feature.icon}</div>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                                <p style={styles.featureDescription}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={styles.stats}>
                <div style={styles.container}>
                    <div style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <div key={index} style={styles.statCard}>
                                <div style={styles.statNumber}>{stat.number}</div>
                                <div style={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section style={styles.testimonials}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>Lo que dicen nuestros usuarios</h2>
                    <div style={styles.carouselContainer}>
                        <div style={styles.testimonialCard}>
                            <div style={styles.quoteIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                </svg>
                            </div>
                            <p style={styles.testimonialText}>{testimonials[currentSlide].text}</p>
                            <div style={styles.testimonialAuthor}>
                                <div style={styles.authorName}>{testimonials[currentSlide].author}</div>
                                <div style={styles.authorRole}>{testimonials[currentSlide].role}</div>
                            </div>
                        </div>
                        <div style={styles.carouselDots}>
                            {testimonials.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.dot,
                                        background: index === currentSlide ? '#2d7a3e' : '#374151'
                                    }}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.cta}>
                <div style={styles.container}>
                    <div style={styles.ctaContent}>
                        <h2 style={styles.ctaTitle}>¿Listo para comenzar?</h2>
                        <p style={styles.ctaText}>
                            Únete a nuestra comunidad y descubre la diferencia de comprar directamente del campo
                        </p>
                        <div style={styles.ctaButton} onClick={() => navigate('/registro')}>
                            Crear Cuenta Gratis
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    // Page Container
    pageContainer: {
        minHeight: '100vh',
        background: '#0f1419',
        color: '#e5e7eb',
    },

    // Header
    header: {
        position: 'relative',
        top: 0,
        zIndex: 1000,
        padding: '1rem 0',
        borderBottom: '1px solid rgba(45, 122, 62, 0.2)',
        transition: 'all 0.3s ease',
    },
    headerContainer: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        color: '#e5e7eb',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    logoIcon: {
        color: '#2d7a3e',
        display: 'flex',
        alignItems: 'center',
    },
    logoText: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    nav: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    navLink: {
        color: '#d1d5db',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    },
    authButtons: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    loginBtn: {
        color: '#d1d5db',
        textDecoration: 'none',
        padding: '0.6rem 1.5rem',
        border: '1px solid #374151',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-block',
    },
    registerBtn: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        textDecoration: 'none',
        padding: '0.6rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        border: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-block',
    },

    // Hero Section
    hero: {
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 2rem',
        overflow: 'hidden',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(45, 122, 62, 0.1) 0%, transparent 50%)',
    },
    heroContent: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
    },
    heroText: {
        maxWidth: '600px',
    },
    heroTitle: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        color: '#f9fafb',
    },
    highlight: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: '#9ca3af',
        marginBottom: '2rem',
        lineHeight: 1.6,
    },
    heroCTA: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    ctaPrimary: {
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        textDecoration: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-block',
    },
    ctaSecondary: {
        background: 'transparent',
        color: '#d1d5db',
        textDecoration: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        border: '2px solid #374151',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-block',
    },
    heroImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        maxWidth: '100%',
        width: '400px',
        height: 'auto',
        filter: 'drop-shadow(0 20px 40px rgba(45, 122, 62, 0.4))',
        transition: 'transform 0.3s ease',
    },

    // Container
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
    },

    // Features
    features: {
        padding: '6rem 2rem',
        background: '#1a1f2e',
    },
    sectionTitle: {
        fontSize: 'clamp(2rem, 4vw, 2.5rem)',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '4rem',
        color: '#f9fafb',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
    },
    featureCard: {
        background: 'rgba(31, 41, 55, 0.5)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #374151',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    featureIcon: {
        color: '#2d7a3e',
        marginBottom: '1.5rem',
    },
    featureTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#f9fafb',
    },
    featureDescription: {
        color: '#9ca3af',
        lineHeight: 1.6,
        fontSize: '0.95rem',
    },

    // Stats
    stats: {
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.1), rgba(4, 71, 44, 0.1))',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
    },
    statCard: {
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(31, 41, 55, 0.5)',
        borderRadius: '12px',
        border: '1px solid #374151',
    },
    statNumber: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
    },
    statLabel: {
        color: '#9ca3af',
        fontSize: '0.95rem',
    },

    // Testimonials
    testimonials: {
        padding: '6rem 2rem',
        background: '#0f1419',
    },
    carouselContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    testimonialCard: {
        background: 'rgba(31, 41, 55, 0.5)',
        padding: '3rem',
        borderRadius: '12px',
        border: '1px solid #374151',
        textAlign: 'center',
    },
    quoteIcon: {
        color: '#2d7a3e',
        marginBottom: '1.5rem',
        opacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
    },
    testimonialText: {
        fontSize: '1.1rem',
        color: '#d1d5db',
        marginBottom: '2rem',
        lineHeight: 1.8,
        fontStyle: 'italic',
    },
    testimonialAuthor: {
        borderTop: '1px solid #374151',
        paddingTop: '1.5rem',
    },
    authorName: {
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: '0.25rem',
    },
    authorRole: {
        color: '#9ca3af',
        fontSize: '0.9rem',
    },
    carouselDots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '2rem',
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // CTA
    cta: {
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, rgba(45, 122, 62, 0.15), rgba(4, 71, 44, 0.15))',
    },
    ctaContent: {
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
    },
    ctaTitle: {
        fontSize: 'clamp(2rem, 4vw, 2.5rem)',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#f9fafb',
    },
    ctaText: {
        fontSize: '1.1rem',
        color: '#9ca3af',
        marginBottom: '2rem',
        lineHeight: 1.6,
    },
    ctaButton: {
        display: 'inline-block',
        background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
        color: 'white',
        textDecoration: 'none',
        padding: '1rem 2.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
    },
};

export default Home;