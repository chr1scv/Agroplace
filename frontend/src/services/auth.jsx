class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.API_BASE = 'http://localhost:8000/api';
    }

    async login(username, password) {
        try {
            console.log('🔄 ===== INICIANDO LOGIN =====');
            console.log('🔐 Usuario:', username);

            // 1. Obtener CSRF token primero
            const csrfToken = await this.ensureCSRFToken();
            console.log('🔐 CSRF Token obtenido:', csrfToken ? 'SÍ' : 'NO');

            // 2. Preparar datos
            const loginData = {
                username: username,
                password: password
            };

            console.log('📤 Datos a enviar:', JSON.stringify(loginData, null, 2));
            console.log('🌐 URL destino:', `${this.API_BASE}/auth/login/`);

            // 3. Headers con CSRF
            const headers = {
                'Content-Type': 'application/json',
            };

            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }

            console.log('📨 Headers:', headers);

            // 4. Hacer la petición
            console.log('🚀 Enviando petición POST...');
            const response = await fetch(`${this.API_BASE}/auth/login/`, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(loginData),
            });

            console.log('📥 RESPUESTA RECIBIDA:');
            console.log('   Status:', response.status);
            console.log('   Status Text:', response.statusText);
            console.log('   OK:', response.ok);
            console.log('   Headers:', Object.fromEntries(response.headers.entries()));

            // 5. Procesar respuesta
            if (response.ok) {
                console.log('✅ LOGIN EXITOSO - Procesando respuesta...');
                const data = await response.json();
                console.log('✅ DATOS DEL USUARIO:', data);

                this.user = data.user;
                this.token = 'session-token';

                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);

                // Disparar evento para notificar cambios
                window.dispatchEvent(new Event('storage'));

                return {
                    user: this.user,
                    message: data.message || '✅ Login exitoso'
                };
            } else {
                console.log('❌ ERROR HTTP - Procesando error...');

                const responseText = await response.text();
                console.log('❌ Contenido de la respuesta:', responseText);

                let errorMessage;

                try {
                    const errorData = JSON.parse(responseText);
                    console.log('❌ Error parseado (JSON):', errorData);
                    errorMessage = this.formatDjangoErrors(errorData);
                } catch (e) {
                    console.log('❌ Error no es JSON, usando texto plano');
                    errorMessage = `Error ${response.status}: ${responseText.substring(0, 200)}`;
                }

                console.log('❌ Mensaje de error final:', errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('💥 ERROR CAPTURADO EN CATCH:');
            console.error('   Mensaje:', error.message);
            console.error('   Stack:', error.stack);

            // SOLO usar modo demo si es error de red
            if (error.message.includes('Failed to fetch') ||
                error.message.includes('Network') ||
                error.message.includes('fetch')) {
                console.log('🔄 Usando modo demo por error de red...');
                return await this.fallbackLogin(username, password);
            }

            console.log('🚫 Propagando error de validación...');
            throw error;
        }
    }

    async register(userData) {
        try {
            console.log('🔄 ===== INICIANDO REGISTRO =====');

            // 1. Obtener CSRF token primero
            console.log('🔐 Obteniendo CSRF token...');
            const csrfToken = await this.ensureCSRFToken();
            console.log('🔐 CSRF Token obtenido:', csrfToken ? 'SÍ' : 'NO');

            // 2. Preparar datos
            const registerData = {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                password_confirm: userData.confirmPassword,
                tipo_usuario: userData.userType,
                telefono: userData.telefono,
                direccion: userData.direccion,
                first_name: userData.nombre,
                last_name: userData.apellido,
                // Campos específicos de vendedor
                rut: userData.rut,
                razon_social: userData.razon_social,
                tipo_productos: userData.tipo_productos,
                certificaciones: userData.certificaciones,
                region: userData.region,
                comuna: userData.comuna,
                provincia: userData.provincia,
                direccion_retiro: userData.direccion_retiro,
                horario_atencion: userData.horario_atencion,
                // Mapeamos descripcion_negocio a descripcion (campo del modelo)
                descripcion: userData.descripcion_negocio || '',
                titulo: userData.razon_social || '', // Usamos razón social como título por defecto
            };

            console.log('📤 Datos a enviar:', JSON.stringify(registerData, null, 2));
            console.log('🌐 URL destino:', `${this.API_BASE}/auth/registro/`);

            // 3. Headers con CSRF
            const headers = {
                'Content-Type': 'application/json',
            };

            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }

            console.log('📨 Headers:', headers);

            // 4. Hacer la petición
            console.log('🚀 Enviando petición POST...');
            const response = await fetch(`${this.API_BASE}/auth/registro/`, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(registerData),
            });

            console.log('📥 RESPUESTA RECIBIDA:');
            console.log('   Status:', response.status);
            console.log('   Status Text:', response.statusText);
            console.log('   OK:', response.ok);
            console.log('   URL:', response.url);
            console.log('   Headers:', Object.fromEntries(response.headers.entries()));

            // 5. Procesar respuesta
            if (response.ok) {
                console.log('✅ REGISTRO EXITOSO - Procesando respuesta...');
                const data = await response.json();
                console.log('✅ DATOS DEL USUARIO CREADO:', data);

                this.user = data.user;
                this.token = 'session-token';

                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);

                // Disparar evento para notificar cambios
                window.dispatchEvent(new Event('storage'));

                return {
                    user: this.user,
                    message: '✅ Usuario registrado exitosamente en la base de datos'
                };
            } else {
                console.log('❌ ERROR HTTP - Procesando error...');

                // Obtener el contenido de la respuesta
                const responseText = await response.text();
                console.log('❌ Contenido de la respuesta:', responseText);

                let errorMessage;

                try {
                    // Intentar parsear como JSON
                    const errorData = JSON.parse(responseText);
                    console.log('❌ Error parseado (JSON):', errorData);
                    errorMessage = this.formatDjangoErrors(errorData);
                } catch (e) {
                    console.log('❌ Error no es JSON, usando texto plano');
                    errorMessage = `Error ${response.status}: ${responseText.substring(0, 200)}`;
                }

                console.log('❌ Mensaje de error final:', errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('💥 ERROR CAPTURADO EN CATCH:');
            console.error('   Mensaje:', error.message);
            console.error('   Stack:', error.stack);

            // SOLO usar modo demo si es error de red
            if (error.message.includes('Failed to fetch') ||
                error.message.includes('Network') ||
                error.message.includes('fetch')) {
                console.log('🔄 Usando modo demo por error de red...');
                return await this.fallbackRegister(userData);
            }

            console.log('🚫 Propagando error de validación...');
            throw error;
        }
    }

    async checkVendedorApproval() {
        try {
            console.log('🔄 Verificando estado de aprobación...');
            const response = await fetch(`${this.API_BASE}/auth/user/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                console.log('✅ Estado del usuario:', user.estado);
                return user.estado === 'activo';
            }
            return false;
        } catch (error) {
            console.error('❌ Error verificando aprobación:', error);
            return false;
        }
    }

    async waitForApproval(checkInterval = 5000) {
        return new Promise((resolve) => {
            const checkApproval = async () => {
                const isApproved = await this.checkVendedorApproval();
                if (isApproved) {
                    resolve(true);
                } else {
                    setTimeout(checkApproval, checkInterval);
                }
            };
            checkApproval();
        });
    }

    async debugUserState() {
        try {
            console.log('🔍 DEBUG - Estado actual del usuario:');
            console.log('   - localStorage user:', localStorage.getItem('user'));
            console.log('   - this.user:', this.user);

            const response = await fetch(`${this.API_BASE}/auth/user/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                console.log('   - API user:', user);
                console.log('   - Estado:', user.estado);
                console.log('   - Tipo usuario:', user.tipo_usuario);
                return user;
            } else {
                console.log('   - Error API:', response.status);
            }
        } catch (error) {
            console.log('   - Error:', error);
        }
    }

    async logout() {
        try {
            console.log('🔄 ===== INICIANDO LOGOUT =====');

            const csrfToken = this.getCSRFToken();
            console.log('🔐 CSRF Token:', csrfToken ? 'SÍ' : 'NO');

            await fetch(`${this.API_BASE}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
            });

            console.log('✅ Logout API completado');
        } catch (error) {
            console.error('❌ Logout API error:', error);
        } finally {
            this.clearAuthData();
            console.log('✅ Logout completado - Estado y localStorage limpiados');
        }
    }

    async getCurrentUser() {
        // Primero intentar con localStorage (más rápido)
        if (this.user) {
            console.log('✅ Usuario obtenido de cache');
            return this.user;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                console.log('✅ Usuario obtenido de localStorage');
                return this.user;
            } catch (error) {
                console.error('❌ Error parsing stored user:', error);
                this.clearAuthData();
                return null;
            }
        }

        // Si no hay usuario en localStorage, intentar con API
        try {
            console.log('🔄 Obteniendo usuario desde API...');
            const response = await fetch(`${this.API_BASE}/auth/user/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                this.user = user;
                localStorage.setItem('user', JSON.stringify(user));
                console.log('✅ Usuario obtenido desde API');
                return user;
            } else {
                console.log('❌ No se pudo obtener usuario desde API, status:', response.status);
                this.clearAuthData();
                return null;
            }
        } catch (error) {
            console.error('❌ Error getting current user from API:', error);
            this.clearAuthData();
            return null;
        }
    }

    clearAuthData() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('cart');

        console.log('✅ Datos de autenticación limpiados completamente');

        // Disparar evento para notificar a otros componentes
        window.dispatchEvent(new Event('storage'));
    }

    // ===== MÉTODOS AUXILIARES =====

    async ensureCSRFToken() {
        try {
            // Primero hacer una petición GET para obtener la cookie CSRF
            await fetch(`${this.API_BASE}/auth/csrf/`, {
                method: 'GET',
                credentials: 'include',
            });

            // Luego leer la cookie del navegador
            return this.getCSRFToken();
        } catch (error) {
            console.warn('⚠️ No se pudo obtener CSRF token:', error);
            return this.getCSRFToken(); // Intentar de todas formas
        }
    }

    getCSRFToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    formatDjangoErrors(errorData) {
        if (typeof errorData === 'string') {
            return errorData;
        }

        if (errorData.error) {
            return errorData.error;
        }

        if (typeof errorData === 'object') {
            const errors = [];
            for (const [field, messages] of Object.entries(errorData)) {
                if (Array.isArray(messages)) {
                    errors.push(...messages);
                } else {
                    errors.push(messages);
                }
            }
            return errors.join(', ');
        }

        return 'Error en el registro';
    }

    // ===== MÉTODOS DE FALLBACK (DEMO) =====

    async fallbackLogin(username, password) {
        console.log('🔄 Usando modo demo para login...');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const demoUsers = {
                    'admin': {
                        password: 'admin123',
                        user: {
                            id: 1,
                            username: 'admin',
                            first_name: 'Christopher',
                            last_name: 'Admin',
                            email: 'admin@agroplace.com',
                            tipo_usuario: 'admin',
                            telefono: '+56 9 1234 5678',
                            direccion: 'Oficina Central',
                            fecha_registro: new Date().toISOString(),
                        }
                    },
                    'vendedor1': {
                        password: 'vendedor123',
                        user: {
                            id: 2,
                            username: 'vendedor1',
                            first_name: 'Pamela',
                            last_name: 'Vendedora',
                            email: 'pamela@agroplace.com',
                            tipo_usuario: 'vendedor',
                            telefono: '+56 9 2345 6789',
                            direccion: 'Región del Maule',
                            fecha_registro: new Date().toISOString(),
                        }
                    },
                    'cliente1': {
                        password: 'cliente123',
                        user: {
                            id: 3,
                            username: 'cliente1',
                            first_name: 'Hemil',
                            last_name: 'Cliente',
                            email: 'hemil@agroplace.com',
                            tipo_usuario: 'cliente',
                            telefono: '+56 9 3456 7890',
                            direccion: 'Santiago Centro',
                            fecha_registro: new Date().toISOString(),
                        }
                    }
                };

                if (demoUsers[username] && demoUsers[username].password === password) {
                    const user = demoUsers[username].user;
                    this.user = user;
                    this.token = 'demo-token-' + Date.now();

                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', this.token);

                    // Disparar evento para notificar cambios
                    window.dispatchEvent(new Event('storage'));

                    resolve({
                        user,
                        message: '✅ Login exitoso (modo demo)'
                    });
                } else {
                    reject(new Error('❌ Credenciales incorrectas en modo demo'));
                }
            }, 1000);
        });
    }

    async fallbackRegister(userData) {
        console.log('🔄 Usando modo demo para registro...');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const newUser = {
                        id: Date.now(),
                        username: userData.username,
                        first_name: userData.nombre,
                        last_name: userData.apellido,
                        email: userData.email,
                        telefono: userData.telefono,
                        direccion: userData.direccion,
                        tipo_usuario: userData.userType,
                        fecha_registro: new Date().toISOString(),
                    };

                    this.user = newUser;
                    this.token = 'demo-token-' + Date.now();

                    localStorage.setItem('user', JSON.stringify(newUser));
                    localStorage.setItem('token', this.token);

                    // Disparar evento para notificar cambios
                    window.dispatchEvent(new Event('storage'));

                    resolve({
                        user: newUser,
                        message: userData.userType === 'vendedor'
                            ? '✅ Registro exitoso (modo demo). Tu cuenta está pendiente de validación.'
                            : '✅ Registro exitoso (modo demo)'
                    });
                } catch (error) {
                    reject(new Error('❌ Error en el registro demo'));
                }
            }, 1500);
        });
    }

    // ===== MÉTODOS DE VERIFICACIÓN =====

    isAuthenticated() {
        return !!this.user;
    }

    isAdmin() {
        return this.user && this.user.tipo_usuario === 'admin';
    }

    isVendedor() {
        return this.user && this.user.tipo_usuario === 'vendedor';
    }

    isCliente() {
        return this.user && this.user.tipo_usuario === 'cliente';
    }

    getFullName() {
        if (!this.user) return '';
        if (this.user.first_name && this.user.last_name) {
            return `${this.user.first_name} ${this.user.last_name}`;
        }
        return this.user.username;
    }

    getFirstName() {
        if (!this.user) return '';
        return this.user.first_name || this.user.username;
    }

    canSellProducts() {
        return this.isVendedor();
    }

    getUserStatus() {
        if (!this.user) return 'no_autenticado';
        return this.user.estado || 'pendiente';
    }

    async updateProfile(profileData) {
        try {
            const csrfToken = await this.ensureCSRFToken();

            const response = await fetch(`${this.API_BASE}/usuarios/${this.user.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                this.user = { ...this.user, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(this.user));

                // Disparar evento para notificar cambios
                window.dispatchEvent(new Event('storage'));

                return updatedUser;
            } else {
                const errorData = await response.json();
                throw new Error(this.formatDjangoErrors(errorData));
            }
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            throw error;
        }
    }

    // Método para verificar permisos de ruta
    hasPermission(allowedRoles) {
        if (!this.user) return false;
        return allowedRoles.includes(this.user.tipo_usuario);
    }

    // Método para obtener información del usuario para debugging
    debugUserInfo() {
        return {
            user: this.user,
            isAuthenticated: this.isAuthenticated(),
            isAdmin: this.isAdmin(),
            isVendedor: this.isVendedor(),
            isCliente: this.isCliente(),
            localStorageUser: localStorage.getItem('user'),
            localStorageToken: localStorage.getItem('token')
        };
    }
}

// SOLO UNA INSTANCIA - Patrón Singleton
const authService = new AuthService();

export default authService;