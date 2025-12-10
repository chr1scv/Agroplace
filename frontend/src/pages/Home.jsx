import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            role: "Consumidora",
            image: "👩‍🌾"
        },
        {
            text: "Como agricultor, encontré una plataforma que valora mi trabajo y me conecta directamente con clientes.",
            author: "Pedro Morales",
            role: "Productor",
            image: "👨‍🌾"
        },
        {
            text: "La transparencia y el comercio justo hacen toda la diferencia. Totalmente recomendado.",
            author: "Laura Díaz",
            role: "Consumidora",
            image: "👩‍💼"
        }
    ];

    const features = [
        {
            icon: '🥬',
            title: "Productos Frescos",
            description: "Recibe frutas y verduras del día a tu puerta, garantizando máxima frescura y nutrientes"
        },
        {
            icon: '🌱',
            title: "Apoyo Local",
            description: "Conecta directamente con agricultores locales y pequeños productores de tu región"
        },
        {
            icon: '🚚',
            title: "Entrega Rápida",
            description: "Logística eficiente con entregas en 24-48 horas en toda el área metropolitana"
        },
        {
            icon: '💚',
            title: "Comercio Justo",
            description: "Precios transparentes y justos que benefician tanto a productores como consumidores"
        }
    ];

    const stats = [
        { number: "+500", label: "Productos", sublabel: "Disponibles" },
        { number: "+200", label: "Agricultores", sublabel: "Activos" },
        { number: "+5K", label: "Clientes", sublabel: "Satisfechos" },
        { number: "4.8★", label: "Valoración", sublabel: "Promedio" }
    ];

    const categories = [
        { name: "Frutas Frescas", emoji: "🍎", count: "120+" },
        { name: "Verduras", emoji: "🥕", count: "85+" },
        { name: "Orgánicos", emoji: "🌿", count: "60+" },
        { name: "Productos Locales", emoji: "🏡", count: "150+" }
    ];

    return (
        <div style={styles.pageContainer}>
            {/* Header Mejorado */}
            <header style={{
                ...styles.header,
                position: 'fixed',
                background: isScrolled
                    ? 'rgba(10, 13, 16, 0.98)'
                    : 'rgba(10, 13, 16, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: isScrolled 
                    ? '0 10px 30px rgba(74, 222, 128, 0.1)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
                borderBottom: `1px solid rgba(74, 222, 128, ${isScrolled ? 0.2 : 0.05})`,
            }}>
                <div style={styles.headerContainer}>
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <div style={styles.logoIcon}>🌾</div>
                        <div>
                            <span style={styles.logoText}>Agroplace</span>
                            <div style={styles.logoSubtext}>Campo a Mesa</div>
                        </div>
                    </div>

                    <nav style={styles.nav}>
                        {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item, idx) => (
                            <div
                                key={idx}
                                style={styles.navLink}
                                onClick={() => navigate(item === 'Inicio' ? '/' : `/${item.toLowerCase()}`)}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                            >
                                {item}
                            </div>
                        ))}
                    </nav>

                    <div style={styles.authButtons}>
                        <div 
                            style={styles.loginBtn}
                            onClick={() => navigate('/login')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#4ade80';
                                e.currentTarget.style.color = '#4ade80';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#2d3748';
                                e.currentTarget.style.color = '#d1d5db';
                            }}
                        >
                            Iniciar Sesión
                        </div>
                        <div 
                            style={styles.registerBtn}
                            onClick={() => navigate('/registro')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(74, 222, 128, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(74, 222, 128, 0.3)';
                            }}
                        >
                            Registrarse
                        </div>
                    </div>
                </div>
            </header>
            
            <div style={{ height: '4.5rem' }}></div>

            {/* Hero Section Mejorado */}
            <section style={styles.hero}>
                {/* Imagen de fondo alargada + blur */}
                <div style={styles.heroBgWrap} aria-hidden="true">
                    <img
                        src="https://img.freepik.com/fotos-premium/trabajar-como-ingeniero-agronomo_891336-3656.jpg?w=2000"
                        alt=""
                        loading="lazy"
                        style={styles.heroBgImage}
                    />
                </div>

                {/* Overlay sutil para contraste */}
                <div style={styles.heroOverlay}></div>

                <div style={styles.heroContent}>
                    <div style={styles.heroText}>
                        <div style={styles.heroTag}>🚀 Revolución Agrícola Digital</div>
                        <h1 style={styles.heroTitle}>
                            Conectamos el <span style={styles.highlight}>campo</span> con <span style={styles.highlight}>tu mesa</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Descubre productos agrícolas frescos directos de pequeños productores locales. 
                            Calidad garantizada, precios justos y apoyo real al campo chileno.
                        </p>
                        <div style={styles.heroCTA}>
                            <div 
                                style={styles.ctaPrimary}
                                onClick={() => navigate('/productos')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(74, 222, 128, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(74, 222, 128, 0.3)';
                                }}
                            >
                                Explorar Productos
                            </div>
                            <div 
                                style={styles.ctaSecondary}
                                onClick={() => navigate('/registro')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#4ade80';
                                    e.currentTarget.style.color = '#4ade80';
                                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#2d3748';
                                    e.currentTarget.style.color = '#f9fafb';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                Unirse Ahora
                            </div>
                        </div>
                        <div style={styles.heroStats}>
                            <div style={styles.heroStat}>
                                <span style={styles.heroStatNumber}>2000+</span>
                                <span style={styles.heroStatLabel}>pedidos/mes</span>
                            </div>
                            <div style={styles.heroStat}>
                                <span style={styles.heroStatNumber}>4.8/5</span>
                                <span style={styles.heroStatLabel}>satisfacción</span>
                            </div>
                            <div style={styles.heroStat}>
                                <span style={styles.heroStatNumber}>24h</span>
                                <span style={styles.heroStatLabel}>entrega</span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.heroImageContainer}>
                        <div style={styles.heroImageBox}>
                            <img
                                src="/img/logo-banner-agroplace.png"
                                alt="Agroplace"
                                style={styles.heroImage}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categorías Section */}
            <section style={styles.categoriesSection}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>Explora por Categoría</h2>
                    <div style={styles.categoriesGrid}>
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                style={styles.categoryCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = '#4ade80';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#2d3748';
                                }}
                            >
                                <div style={styles.categoryEmoji}>{cat.emoji}</div>
                                <h3 style={styles.categoryName}>{cat.name}</h3>
                                <p style={styles.categoryCount}>{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section Mejorado */}
            <section style={styles.features}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>¿Por qué Agroplace?</h2>
                    <div style={styles.featuresGrid}>
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                style={{
                                    ...styles.featureCard,
                                    borderColor: hoveredFeature === idx ? '#4ade80' : '#2d3748',
                                    transform: hoveredFeature === idx ? 'translateY(-10px)' : 'translateY(0)',
                                }}
                                onMouseEnter={() => setHoveredFeature(idx)}
                                onMouseLeave={() => setHoveredFeature(null)}
                            >
                                <div style={styles.featureIconNew}>{feature.icon}</div>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                                <p style={styles.featureDescription}>{feature.description}</p>
                                <div style={styles.featureArrow}>→</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section Mejorado */}
            <section style={styles.stats}>
                <div style={styles.container}>
                    <div style={styles.statsGrid}>
                        {stats.map((stat, idx) => (
                            <div 
                                key={idx} 
                                style={styles.statCard}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4ade80'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2d3748'}
                            >
                                <div style={styles.statNumber}>{stat.number}</div>
                                <div style={styles.statLabel}>{stat.label}</div>
                                <div style={styles.statSublabel}>{stat.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Mejorado */}
            <section style={styles.testimonials}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>Historias de Nuestros Usuarios</h2>
                    <div style={styles.carouselContainer}>
                        <div style={styles.testimonialCard}>
                            <div style={styles.testimonialImage}>
                                {testimonials[currentSlide].image}
                            </div>
                            <div style={styles.quoteIcon}>❝</div>
                            <p style={styles.testimonialText}>{testimonials[currentSlide].text}</p>
                            <div style={styles.testimonialAuthor}>
                                <div style={styles.authorName}>{testimonials[currentSlide].author}</div>
                                <div style={styles.authorRole}>{testimonials[currentSlide].role}</div>
                                <div style={styles.authorRating}>⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        <div style={styles.carouselDots}>
                            {testimonials.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        ...styles.dot,
                                        background: idx === currentSlide ? '#4ade80' : '#374151',
                                        transform: idx === currentSlide ? 'scale(1.3)' : 'scale(1)',
                                    }}
                                    onClick={() => setCurrentSlide(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section Final */}
            <section style={styles.cta}>
                <div style={styles.container}>
                    <div style={styles.ctaContent}>
                        <h2 style={styles.ctaTitle}>¿Listo para Comprar Diferente?</h2>
                        <p style={styles.ctaText}>
                            Únete a miles de clientes que ya disfrutan de productos frescos directamente del campo
                        </p>
                        <div 
                            style={styles.ctaButton}
                            onClick={() => navigate('/registro')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(74, 222, 128, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(74, 222, 128, 0.3)';
                            }}
                        >
                            Crear Cuenta Gratis
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Básico */}
            <footer style={styles.footer}>
                <div style={styles.container}>
                    <div style={styles.footerContent}>
                        <div style={styles.footerSection}>
                            <h4 style={styles.footerTitle}>Agroplace</h4>
                            <p style={styles.footerText}>Conectando el campo con tu mesa</p>
                        </div>
                        <div style={styles.footerSection}>
                            <h4 style={styles.footerTitle}>Enlaces</h4>
                            <p style={styles.footerLink}>Productos</p>
                            <p style={styles.footerLink}>Nosotros</p>
                            <p style={styles.footerLink}>Contacto</p>
                        </div>
                        <div style={styles.footerSection}>
                            <h4 style={styles.footerTitle}>Legal</h4>
                            <p style={styles.footerLink}>Términos y Condiciones</p>
                            <p style={styles.footerLink}>Privacidad</p>
                        </div>
                    </div>
                    <div style={styles.footerBottom}>
                        <p>© 2025 Agroplace. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: '#0a0d10',
        color: '#f9fafb',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },

    // Header
    header: {
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        padding: '1rem 0',
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
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: '700',
    },
    logoIcon: {
        fontSize: '2rem',
    },
    logoText: {
        background: 'linear-gradient(135deg, #4ade80, #78ff99)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'block',
    },
    logoSubtext: {
        fontSize: '0.7rem',
        color: '#9ca3af',
        fontWeight: '400',
        marginTop: '2px',
    },
    nav: {
        display: 'flex',
        gap: '3rem',
        alignItems: 'center',
    },
    navLink: {
        color: '#d1d5db',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    },
    authButtons: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    loginBtn: {
        color: '#d1d5db',
        padding: '0.7rem 1.6rem',
        border: '1px solid #2d3748',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        background: 'transparent',
    },
    registerBtn: {
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        color: '#0a0d10',
        padding: '0.7rem 1.6rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '700',
        border: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(74, 222, 128, 0.3)',
    },

    // Hero
    hero: {
        position: 'relative',
        minHeight: '750px',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 2rem 4rem',
        overflow: 'hidden',
    },
    heroBgWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        display: 'block',
    },
    heroBgImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        filter: 'blur(6px) brightness(0.55)',
        transform: 'scale(1.05)',
        transition: 'transform 0.6s ease',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(74, 222, 128, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
    },
    heroContent: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%',
    },
    heroText: {
        maxWidth: '650px',
    },
    heroTag: {
        display: 'inline-block',
        background: 'rgba(74, 222, 128, 0.1)',
        color: '#4ade80',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        border: '1px solid rgba(74, 222, 128, 0.3)',
    },
    heroTitle: {
        fontSize: '3.5rem',
        fontWeight: '900',
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        color: '#f9fafb',
        letterSpacing: '-1px',
    },
    highlight: {
        background: 'linear-gradient(90deg, #4ade80, #78ff99)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        fontSize: '1.2rem',
        color: '#c0c0c0',
        marginBottom: '2.5rem',
        lineHeight: 1.8,
    },
    heroCTA: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '3rem',
    },
    ctaPrimary: {
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        color: '#0a0d10',
        padding: '1.1rem 2.8rem',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(74, 222, 128, 0.3)',
    },
    ctaSecondary: {
        background: 'transparent',
        color: '#f9fafb',
        padding: '1.1rem 2.8rem',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '1.1rem',
        border: '2px solid #2d3748',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    heroStats: {
        display: 'flex',
        gap: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(74, 222, 128, 0.1)',
    },
    heroStat: {
        display: 'flex',
        flexDirection: 'column',
    },
    heroStatNumber: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#4ade80',
    },
    heroStatLabel: {
        fontSize: '0.85rem',
        color: '#9ca3af',
    },
    heroImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImageBox: {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        aspectRatio: '1',
        background: 'radial-gradient(circle at 30% 30%, rgba(74, 222, 128, 0.1), transparent)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    heroImage: {
        maxWidth: '100%',
        height: 'auto',
        filter: 'drop-shadow(0 25px 50px rgba(74, 222, 128, 0.2))',
        transition: 'transform 0.3s ease',
    },

    // Categorías
    categoriesSection: {
        padding: '6rem 2rem',
        background: '#131821',
    },
    categoriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
    },
    categoryCard: {
        background: '#1a1f2c',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #2d3748',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    categoryEmoji: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    categoryName: {
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        color: '#f9fafb',
    },
    categoryCount: {
        fontSize: '0.9rem',
        color: '#4ade80',
        fontWeight: '600',
    },

    // Container
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
    },

    // Section Title
    sectionTitle: {
        fontSize: '2.8rem',
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: '4rem',
        color: '#f9fafb',
        letterSpacing: '-0.5px',
    },

    // Features
    features: {
        padding: '8rem 2rem',
        background: '#0a0d10',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
    },
    featureCard: {
        background: '#1a1f2c',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid #2d3748',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
    },
    featureIconNew: {
        fontSize: '3rem',
        marginBottom: '1.5rem',
        display: 'block',
    },
    featureTitle: {
        fontSize: '1.4rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#f9fafb',
    },
    featureDescription: {
        color: '#c0c0c0',
        lineHeight: 1.7,
        fontSize: '1rem',
    },
    featureArrow: {
        position: 'absolute',
        right: '1.5rem',
        bottom: '1.5rem',
        fontSize: '2rem',
        color: '#4ade80',
        opacity: 0,
        transition: 'all 0.3s ease',
    },

    // Stats
    stats: {
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.05), rgba(10, 13, 16, 0.5))',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
    },
    statCard: {
        textAlign: 'center',
        padding: '2.5rem',
        background: '#1a1f2c',
        borderRadius: '16px',
        border: '1px solid #2d3748',
        transition: 'all 0.3s ease',
    },
    statNumber: {
        fontSize: '2.8rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #4ade80, #78ff99)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
    },
    statLabel: {
        color: '#d1d5db',
        fontSize: '1rem',
        fontWeight: '700',
    },
    statSublabel: {
        color: '#9ca3af',
        fontSize: '0.85rem',
        marginTop: '0.25rem',
    },

    // Testimonials
    testimonials: {
        padding: '8rem 2rem',
        background: '#131821',
    },
    carouselContainer: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    testimonialCard: {
        background: '#1a1f2c',
        padding: '3rem',
        borderRadius: '16px',
        border: '1px solid #2d3748',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    },
    testimonialImage: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    quoteIcon: {
        fontSize: '4rem',
        color: '#4ade80',
        opacity: 0.4,
        marginBottom: '1rem',
    },
    testimonialText: {
        fontSize: '1.3rem',
        color: '#f9fafb',
        marginBottom: '2rem',
        lineHeight: 1.8,
        fontStyle: 'italic',
    },
    testimonialAuthor: {
        borderTop: '1px solid #2d3748',
        paddingTop: '1.5rem',
    },
    authorName: {
        fontWeight: '700',
        color: '#4ade80',
        fontSize: '1.1rem',
        marginBottom: '0.25rem',
    },
    authorRole: {
        color: '#c0c0c0',
        fontSize: '0.95rem',
        marginBottom: '0.5rem',
    },
    authorRating: {
        fontSize: '0.9rem',
        marginTop: '0.5rem',
    },
    carouselDots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        marginTop: '2.5rem',
    },
    dot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // CTA
    cta: {
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #1a1f2c, #0a0d10)',
    },
    ctaContent: {
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '3.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #1a1f2c, #131821)',
        border: '1px solid rgba(74, 222, 128, 0.2)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
    },
    ctaTitle: {
        fontSize: '2.8rem',
        fontWeight: '900',
        marginBottom: '1rem',
        color: '#f9fafb',
    },
    ctaText: {
        fontSize: '1.1rem',
        color: '#c0c0c0',
        marginBottom: '2.5rem',
        lineHeight: 1.8,
    },
    ctaButton: {
        display: 'inline-block',
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        color: '#0a0d10',
        padding: '1.2rem 3.5rem',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(74, 222, 128, 0.3)',
    },

    // Footer
    footer: {
        padding: '3rem 2rem',
        background: '#131821',
        borderTop: '1px solid #2d3748',
    },
    footerContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '2rem',
    },
    footerSection: {
        color: '#d1d5db',
    },
    footerTitle: {
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#f9fafb',
    },
    footerText: {
        color: '#9ca3af',
        fontSize: '0.95rem',
    },
    footerLink: {
        color: '#9ca3af',
        fontSize: '0.95rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },
    footerBottom: {
        textAlign: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid #2d3748',
        color: '#9ca3af',
        fontSize: '0.95rem',
    },
};

export default Home;