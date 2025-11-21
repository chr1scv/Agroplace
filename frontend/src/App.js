import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
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
import EsperaAprobacion from './pages/vendedor/EsperaAprobacion';

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <main>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/vendedor/espera" element={<EsperaAprobacion />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/notificaciones" element={<Notifications />} />

                {/* ⬇️ VERSIÓN DE PRUEBA - Ruta cliente pública temporalmente ⬇️ */}
                <Route path="/cliente/*" element={<ClientePanel />} />

                {/* Rutas protegidas */}
                <Route
                  path="/admin/*"
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </SimpleProtectedRoute>
                  }
                />
                <Route
                  path="/vendedor/*"
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin', 'vendedor']}>
                      <VendedorPanel />
                    </SimpleProtectedRoute>
                  }
                />
                
                {/* ⬇️ COMENTA ESTA VERSIÓN PROTEGIDA TEMPORALMENTE ⬇️ */}
                {/*
                <Route
                  path="/cliente/*"
                  element={
                    <SimpleProtectedRoute allowedRoles={['admin', 'vendedor', 'cliente']}>
                      <ClientePanel />
                    </SimpleProtectedRoute>
                  }
                />
                */}

                <Route path="/acceso-denegado" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </NotificationProvider>
  );
}

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      backgroundColor: '#0f1419',
      color: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '6rem', color: '#2d7a3e', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Página No Encontrada</h2>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          La página que estás buscando no existe o ha sido movida.
        </p>
        <a href="/" style={{
          background: 'linear-gradient(135deg, #2d7a3e, #47a855)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          🏠 Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default App;