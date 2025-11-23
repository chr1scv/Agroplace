# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crear el router
router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')
router.register(r'categorias', views.CategoriaViewSet, basename='categoria')
router.register(r'productos', views.ProductoViewSet, basename='producto')
router.register(r'pedidos', views.PedidoViewSet, basename='pedido')
router.register(r'direcciones', views.DireccionEnvioViewSet, basename='direccion')
router.register(r'reviews', views.ReviewViewSet, basename='review')

urlpatterns = [
    # Incluir las rutas del router
    path('', include(router.urls)),
    
    # Endpoints de autenticación
    path('auth/csrf/', views.get_csrf_token, name='csrf_token'),
    path('auth/registro/', views.registro_usuario, name='registro'),
    path('auth/login/', views.login_usuario, name='login'),
    path('auth/logout/', views.logout_usuario, name='logout'),
    path('auth/user/', views.get_current_user, name='current_user'),
    path('auth/dashboard/', views.dashboard_stats, name='dashboard_stats'),
]