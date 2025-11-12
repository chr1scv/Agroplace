import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/admin/AdminPanel';
import VendedorPanel from './pages/vendedor/VendedorPanel';
import ClientePanel from './pages/cliente/ClientePanel';
import AccessDenied from './pages/AccessDenied';
import SimpleProtectedRoute from './components/SimpleProtectedRoute';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/notificaciones" element={<Notifications />} />
                
                {/* Paneles de usuario - PROTEGIDOS */}
                <Route 
                  path="/admin" 
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </SimpleProtectedRoute>
                  } 
                />
                <Route 
                  path="/vendedor" 
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin', 'vendedor']}>
                      <VendedorPanel />
                    </SimpleProtectedRoute>
                  } 
                />
                <Route 
                  path="/cliente" 
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin', 'vendedor', 'cliente']}>
                      <ClientePanel />
                    </SimpleProtectedRoute>
                  } 
                />
                
                {/* Ruta para acceso denegado */}
                <Route path="/acceso-denegado" element={<AccessDenied />} />
                
                {/* Ruta 404 - Página no encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </NotificationProvider>
  );
}

// Componente para página no encontrada
const NotFound = () => {
  return (
    <div style={styles.notFound}>
      <div style={styles.notFoundContent}>
        <h1 style={styles.notFoundTitle}>404</h1>
        <h2 style={styles.notFoundSubtitle}>Página No Encontrada</h2>
        <p style={styles.notFoundText}>
          La página que estás buscando no existe o ha sido movida.
        </p>
        <a href="/" style={styles.homeLink}>
          🏠 Volver al Inicio
        </a>
      </div>
    </div>
  );
};

const styles = {
  notFound: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
  },
  notFoundContent: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  notFoundTitle: {
    fontSize: '6rem',
    color: '#2d5016',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  notFoundSubtitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
  },
  notFoundText: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  homeLink: {
    display: 'inline-block',
    backgroundColor: '#4a7c1f',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
};

export default App;