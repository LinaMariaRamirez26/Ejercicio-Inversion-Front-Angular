# Configuración del Backend para BTG Fondos App

## Descripción
Esta aplicación Angular ahora está configurada para conectarse a un backend real en lugar de usar datos simulados. Los servicios han sido actualizados para hacer llamadas HTTP reales a las APIs.

## URLs de API Configuradas

### Desarrollo (environment.ts)
- **Base URL**: `http://localhost:8080/api`
- **Usuarios**: `http://localhost:8080/api/usuarios`
- **Fondos**: `http://localhost:8080/api/fondos`
- **Transacciones**: `http://localhost:8080/api/transacciones`

### Producción (environment.prod.ts)
- **Base URL**: `https://api.btg-fondos.com/api`

## Endpoints Requeridos en el Backend

### Usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios/{id}/fondos/{fondoId}?monto={monto}` - Suscribir usuario a un fondo
- `DELETE /api/usuarios/{usuarioId}/fondos/{fondoId}` - Cancelar suscripción
- `GET /api/usuarios/{usuarioId}/transacciones` - Obtener historial de transacciones

### Fondos
- `GET /api/fondos` - Obtener todos los fondos
- `GET /api/fondos/{id}` - Obtener fondo por ID

### Transacciones
- Las transacciones se manejan a través del endpoint de usuarios:
- `GET /api/usuarios/{usuarioId}/transacciones` - Obtener transacciones por usuario

## Modelos de Datos

### Usuario
```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  saldo: number;
  notificacionEmail: boolean;
  notificacionSMS: boolean;
  fondosSuscritos: string[]; // Array de IDs de fondos
}
```

### Fondo
```typescript
interface Fondo {
  id: string;
  nombre: string;
  montoMinimo: number;
  categoria: string;
}
```

### Transacción
```typescript
interface Transaccion {
  id: number;
  usuarioId: number;
  fondoId: string;
  tipo: 'APERTURA' | 'CANCELACION';
  fecha: string; // Formato: YYYY-MM-DD
  monto: number;
}
```

## Configuración de CORS

El backend debe estar configurado para permitir solicitudes desde:
- `http://localhost:4200` (desarrollo)
- El dominio de producción de la aplicación Angular

## Manejo de Errores

La aplicación incluye un interceptor HTTP que maneja errores comunes:
- **Error 0**: No se puede conectar al servidor
- **Error 404**: Recurso no encontrado
- **Error 500**: Error interno del servidor

## Instrucciones para Desarrollo

1. **Asegúrate de que el backend esté ejecutándose en `http://localhost:8080`**
2. **Verifica que todos los endpoints estén implementados**
3. **Configura CORS correctamente**
4. **Ejecuta la aplicación Angular con `ng serve`**

## Estado Actual

✅ **Aplicación Angular configurada correctamente**
- Todos los servicios actualizados para usar HTTP real
- Datos simulados completamente removidos
- Interceptor de errores configurado
- Variables de entorno configuradas

⚠️ **Backend requerido**
- La aplicación intentará conectarse a `http://localhost:8080/api`
- Sin backend, verás errores de conexión (ECONNREFUSED)
- Esto es comportamiento esperado hasta que implementes el backend

## Cambio de URL del Backend

Para cambiar la URL del backend, modifica el archivo:
- **Desarrollo**: `src/environments/environment.ts`
- **Producción**: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-servidor:puerto/api'
};
```

## Notas Importantes

- Los datos simulados han sido completamente removidos
- Todos los servicios ahora hacen llamadas HTTP reales
- La aplicación mostrará errores si el backend no está disponible
- Se recomienda implementar un sistema de autenticación para producción