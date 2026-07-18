# Configuracion de seguridad Vercel

Esta guia contiene acciones manuales para el proyecto ISABELLA / ISOLE. No
incluye valores secretos.

## 1. Variables Sensitive

Marcar como Sensitive o Secret en Vercel:

- `MONGODB_URI`
- `JWT_SECRET_KEY`
- `JWT_REFRESH_SECRET_KEY`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`

## 2. Variables que deben rotarse

Rotar si alguna vez estuvieron en repositorio, logs, capturas, chats o equipos
compartidos:

- `JWT_SECRET_KEY`
- `JWT_REFRESH_SECRET_KEY`
- `MONGODB_URI`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`
- `INSTAGRAM_ACCESS_TOKEN`

Despues de rotar JWT, invalidar sesiones activas o forzar re-login.

## 3. Variables que no pueden ser publicas

No usar prefijo `NEXT_PUBLIC_` para:

- MongoDB.
- JWT.
- Cloudinary API secret.
- Cloudinary URL con secreto.
- Instagram/Meta access token.
- Cualquier service key o token administrativo.

Variables publicas permitidas:

- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`

## 4. Deployment Protection para previews

Activar Vercel Deployment Protection para Preview Deployments:

1. Project Settings.
2. Deployment Protection.
3. Proteger previews con Vercel Authentication o SSO.
4. Permitir acceso solo a miembros/autorizados.
5. Revisar que previews no expongan panel admin ni API admin sin proteccion.

## 5. Reglas de Firewall recomendadas

Configurar reglas por ruta:

- Bloquear o desafiar trafico sospechoso hacia `/admin`.
- Rate limit fuerte para `/api/v1/auth/login`.
- Rate limit para `/api/v1/auth/register`.
- Rate limit para `/api/v1/auth/password/forgot`.
- Rate limit para `/api/v1/auth/password/reset`.
- Rate limit para `/api/v1/uploads`.
- Rate limit para `/api/v1/images`.
- Rate limit para `/api/v1/admin/catalog`.
- Permitir solo metodos esperados por ruta.

No usar CORS como sustituto de autenticacion.

## 6. Rutas con rate limiting

Prioridad alta:

- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/refresh`
- `/api/v1/auth/password/forgot`
- `/api/v1/auth/password/reset`
- `/api/v1/uploads`
- `/api/v1/images`
- `/api/v1/admin/catalog/**`

Prioridad media:

- `/api/v1/products`
- `/api/v1/categories`
- `/api/v1/settings/public`

## 7. 2FA / MFA

Exigir 2FA/MFA en:

- GitHub organization/repository.
- Vercel team.
- MongoDB Atlas.
- Cloudinary.
- Cuenta de Meta/Instagram usada para sincronizacion.

Las cuentas admin del panel deben usar MFA cuando el proveedor de identidad lo
soporte.

## 8. Miembros y roles

Revisar mensualmente:

- Miembros del proyecto Vercel.
- Owners/admins de GitHub.
- Usuarios de MongoDB Atlas.
- Usuarios Cloudinary.
- Tokens personales y deploy keys.

Aplicar privilegio minimo. Retirar accesos de personas que no participen.

## 9. Activity Log

Revisar Activity Log despues de cada despliegue:

- Cambios de variables de entorno.
- Nuevos dominios.
- Cambios de build settings.
- Deployments manuales inesperados.
- Accesos a previews.
- Cambios de miembros o roles.

## 10. Verificacion posterior al despliegue

Despues de desplegar:

1. Confirmar que `/` carga.
2. Confirmar que `/catalogo/todos-los-articulos` carga.
3. Confirmar que una pagina `/product/...` carga.
4. Confirmar que `/admin` no concede permisos sin token valido.
5. Confirmar que una llamada anonima a API admin devuelve 401.
6. Confirmar que un usuario no admin recibe 403 en uploads/admin.
7. Confirmar headers: `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy`, HSTS en produccion y CSP donde aplique.
8. Confirmar que no aparecen secretos privados en HTML inicial, JSON ni bundle.
9. Confirmar que previews estan protegidos.
10. Confirmar que los logs no contienen tokens, cookies completas ni secretos.
