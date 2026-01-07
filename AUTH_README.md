# Sistema de Autenticación

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://servicecar.fullsolutionappmx.info
```

Puedes copiar `.env.local.example` como plantilla.

### 2. Endpoints del Backend

El sistema utiliza los siguientes endpoints:

- **POST /auth/login** - Iniciar sesión
- **POST /auth/refresh** - Refrescar token de acceso
- **POST /auth/logout** - Cerrar sesión

## Estructura de Datos

### Respuesta de Login (201)

```json
{
  "ok": true,
  "message": "login ok",
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci...",
    "user": {
      "id": "695e98cd8d25c69967c69103",
      "email": "usuario@ejemplo.com",
      "username": "Usuario",
      "role": "superadmin",
      "branch_id": "global"
    }
  }
}
```

## Componentes Principales

### 1. AuthContext (`app/context/AuthContext.tsx`)

Maneja el estado global de autenticación:

```typescript
const { user, isAuthenticated, login, logout, refreshAccessToken } = useAuth();
```

**Propiedades:**
- `user`: Objeto con datos del usuario (id, email, username, role, branch_id)
- `isAuthenticated`: Boolean que indica si el usuario está autenticado
- `accessToken`: Token JWT de acceso
- `refreshToken`: Token JWT de refresco
- `isLoading`: Estado de carga inicial

**Métodos:**
- `login(email, password)`: Inicia sesión con el backend
- `logout()`: Cierra sesión y limpia tokens
- `refreshAccessToken()`: Refresca el access token usando el refresh token

### 2. AuthService (`app/services/authService.ts`)

Maneja las peticiones HTTP a los endpoints de autenticación:

```typescript
import { authService } from '@/app/services/authService';

// Login
const response = await authService.login(email, password);

// Refresh
const response = await authService.refresh(refreshToken);

// Logout
await authService.logout(accessToken);
```

### 3. ApiClient (`app/lib/apiClient.ts`)

Cliente HTTP para hacer peticiones autenticadas:

```typescript
import { ApiClient } from '@/app/lib/apiClient';

// GET con autenticación automática
const response = await ApiClient.get('/ruta');

// POST con autenticación automática
const response = await ApiClient.post('/ruta', { data: 'valor' });

// PUT
const response = await ApiClient.put('/ruta', { data: 'valor' });

// DELETE
const response = await ApiClient.delete('/ruta');
```

El ApiClient automáticamente:
- Agrega el header `Authorization: Bearer {token}`
- Usa el access_token de localStorage
- Configura Content-Type como application/json

## Almacenamiento

Los datos se guardan en localStorage:

- `access_token`: Token JWT de acceso
- `refresh_token`: Token JWT de refresco
- `user`: Objeto JSON con datos del usuario

## Flujo de Autenticación

1. **Login:**
   - Usuario ingresa email y password
   - Se llama a `login()` del AuthContext
   - AuthContext llama a `authService.login()`
   - Backend responde con tokens y datos de usuario
   - Se guardan en localStorage
   - Se actualiza el estado global
   - Se redirige a página protegida

2. **Verificación:**
   - Al cargar la app, AuthContext verifica localStorage
   - Si hay tokens válidos, restaura la sesión
   - Si no, el usuario debe hacer login

3. **Logout:**
   - Usuario hace clic en "Cerrar Sesión"
   - Se llama a `logout()` del AuthContext
   - Se notifica al backend (opcional)
   - Se limpian los tokens de localStorage
   - Se redirige a /login

4. **Refresh Token:**
   - Cuando el access_token expira
   - Se llama a `refreshAccessToken()`
   - Se envía el refresh_token al backend
   - Backend devuelve nuevo access_token
   - Se actualiza en localStorage

## Páginas

### Login (`app/login/page.tsx`)
- Formulario de inicio de sesión
- Validación de campos
- Estado de carga
- Manejo de errores

### Página Protegida (`app/paginaProtegida/page.tsx`)
- Verifica autenticación al montar
- Muestra datos del usuario
- Permite cerrar sesión
- Redirige a /login si no está autenticado

## Uso en Otros Componentes

### Verificar si el usuario está autenticado

```typescript
'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function MiComponente() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <p>Debes iniciar sesión</p>;
  }

  return <p>Hola {user.username}</p>;
}
```

### Hacer peticiones autenticadas

```typescript
import { ApiClient } from '@/app/lib/apiClient';

async function obtenerDatos() {
  try {
    const response = await ApiClient.get('/mi-endpoint');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Proteger una página

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function PaginaProtegida() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Contenido protegido</div>;
}
```

## Manejo de Errores

El sistema maneja errores comunes:

- **Credenciales inválidas**: Muestra mensaje de error del backend
- **Red no disponible**: Captura errores de conexión
- **Token expirado**: Usa refresh token automáticamente
- **Sesión inválida**: Redirige a login

## Seguridad

⚠️ **Consideraciones de seguridad:**

1. **localStorage vs httpOnly cookies**:
   - Actualmente usa localStorage (vulnerable a XSS)
   - Para mayor seguridad, considera usar httpOnly cookies

2. **HTTPS obligatorio**:
   - Asegúrate de usar HTTPS en producción
   - Los tokens viajan en headers

3. **Refresh Token Rotation**:
   - Implementa rotación de refresh tokens
   - Invalida tokens viejos después de uso

4. **Timeout de sesión**:
   - Considera implementar auto-logout por inactividad
   - Verifica expiración de tokens

## Próximos Pasos

- [ ] Implementar auto-refresh de tokens antes de expiración
- [ ] Agregar middleware para proteger rutas automáticamente
- [ ] Implementar "Recordar sesión"
- [ ] Agregar "Olvidé mi contraseña"
- [ ] Implementar 2FA (autenticación de dos factores)
