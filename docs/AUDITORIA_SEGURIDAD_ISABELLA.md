# Auditoria de seguridad ISABELLA / ISOLE

## 1. Resumen ejecutivo

Se audito el repositorio actual, que combina un frontend Next.js estatico con
una API FastAPI para catalogo, usuarios, autenticacion, imagenes y settings. Se
encontraron controles server-side ya presentes, como JWT, refresh-token
rotation, roles, CORS explicito en produccion, rate limiting, validacion de
NoSQL injection, soft delete, indices unicos y headers de seguridad.

Se corrigieron tres riesgos principales:

- El rol `user` tenia permisos de lectura y carga de imagenes.
- El primer registro publico podia convertirse en administrador.
- Los esquemas Pydantic ignoraban propiedades desconocidas, lo que debilitaba
  la defensa contra mass assignment.

No se bloquearon DevTools, no se cambiaron imagenes y no se modificaron estilos.

## 2. Arquitectura encontrada

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS.
- Backend: FastAPI, Python 3.13.
- Base de datos: MongoDB con Beanie/Motor.
- Autenticacion: OAuth2 bearer tokens, JWT access tokens y refresh tokens.
- Sesiones: tokens bearer con refresh-token rotation; no hay cookies HttpOnly.
- Roles: `admin` y `user`.
- ORM/ODM: Beanie.
- Imagenes: Cloudinary con metadata en MongoDB.
- Deploy: Vercel para frontend estatico y recomendaciones para API/entorno.

## 3. Modelo de amenazas

- Visitante anonimo: solo puede leer rutas publicas y catalogo publicado.
- Usuario autenticado sin privilegios: puede gestionar perfil, no catalogo ni
  imagenes.
- Usuario con DevTools: puede modificar UI/payloads, pero el servidor valida.
- Cliente directo API/cURL/Postman: requiere bearer valido y rol admin en rutas
  administrativas.
- Bot automatizado: limitado por middleware de rate limiting local y requiere
  reglas Vercel adicionales.
- Sesion administrativa robada: riesgo residual alto; requiere rotacion,
  revocacion, 2FA y vigilancia.
- Acceso parcial al repositorio: riesgo de descubrir nombres de variables y
  estructura; no se deben versionar valores reales.
- Clave expuesta: se debe revocar y rotar; quitarla del codigo no basta.
- Administrador legitimo accidental: soft delete e informes reducen dano, pero
  faltan confirmaciones fuertes para acciones destructivas.

## 4. Superficie de ataque

Protegida o revisada: catalogo, productos, colecciones, tipos de ropa,
variantes, imagenes, usuarios, roles, tokens, settings, API admin, Cloudinary,
variables de entorno, CORS, headers, rate limiting y build.

## 5. Rutas publicas

- Frontend: `/`, `/catalogo/[slug]`, `/product/[slug]`, `/robots.txt`,
  `/sitemap.xml`.
- API: `GET /api/v1/health`, `GET /api/v1/products`,
  `GET /api/v1/products/{id}`, `GET /api/v1/categories`,
  `GET /api/v1/categories/{id}`, `GET /api/v1/settings/public`,
  `GET /api/v1/settings/public/{key}`, auth login/refresh/reset/verify/register.

## 6. Rutas administrativas

- `/admin` en frontend.
- `/api/v1/admin/catalog/**`
- mutaciones bajo `/api/v1/products`, `/api/v1/categories`, `/api/v1/images`,
  `/api/v1/uploads`, `/api/v1/settings`, `/api/v1/users`.

## 7. Endpoints de escritura

- Auth: register, login, logout, refresh, password forgot/reset, email verify.
- Catalogo: create/update/delete products, publish/archive/duplicate products,
  create/update/delete groups.
- Productos: create/update/delete.
- Categorias: create/update/delete.
- Imagenes/uploads: upload, update metadata, replace, delete.
- Settings: create/update/delete.
- Users: update/delete.
- Profile: update/change password.

## 8. Hallazgos

### Alto: usuario comun podia cargar imagenes

- Descripcion: `ROLE_PERMISSIONS[USER]` incluia `images:upload` e
  `images:read`; `/images` y `/uploads` aceptaban ese permiso.
- Riesgo: usuarios no admin podian crear metadata e intentar modificar el
  almacenamiento de imagenes.
- Evidencia: `app/auth/permissions.py`, `app/api/v1/routes/images.py`,
  `app/api/v1/routes/uploads.py`.
- Estado: corregido.
- Correccion: se eliminaron permisos de imagen para `user` y todas las rutas de
  imagen/upload ahora usan `get_current_admin`.
- Riesgo residual: si se roba token admin, esas rutas siguen disponibles.

### Alto: primer registro publico podia ser admin

- Descripcion: el primer usuario registrado por `/auth/register` se convertia
  en admin automaticamente.
- Riesgo: en una base vacia o reinicializada, un visitante podria obtener
  privilegios si el endpoint esta expuesto.
- Evidencia: `app/services/auth_service.py`.
- Estado: corregido.
- Correccion: se agrego `INITIAL_ADMIN_BOOTSTRAP_ENABLED=false` por defecto; en
  produccion se rechaza `true`.
- Riesgo residual: el bootstrap local debe desactivarse despues de crear el
  primer admin.

### Medio: payloads ignoraban campos desconocidos

- Descripcion: Pydantic ignoraba propiedades extra por defecto.
- Riesgo: pruebas de mass assignment podian parecer exitosas o esconder campos
  manipulados; futuras asignaciones amplias aumentarian el riesgo.
- Evidencia: esquemas en `app/schemas/*`.
- Estado: corregido.
- Correccion: `ConfigDict(extra="forbid")` en payloads de producto, categoria,
  imagen, setting, usuario y auth.
- Riesgo residual: los campos permitidos siguen dependiendo de politicas de
  negocio y pruebas.

### Medio: tokens admin en localStorage

- Descripcion: el panel admin frontend guarda el access token en `localStorage`.
- Riesgo: una vulnerabilidad XSS podria exfiltrar el token.
- Evidencia: `components/admin/admin-catalog-app.tsx`.
- Estado: documentado; no migrado en esta intervencion para no reescribir auth.
- Correccion recomendada: migrar a sesiones HttpOnly/Secure/SameSite con CSRF u
  Origin checks antes de exponer administracion publica.

### Informativo: CSP del backend es estricta para API

- Descripcion: el middleware agrega CSP defensiva `default-src 'none'` para API.
- Riesgo: bajo para API JSON; no sustituye CSP del frontend estatico.
- Estado: aceptado y documentado.

## 9. Autenticacion

La API usa OAuth2 bearer, access tokens JWT y refresh tokens persistidos por
hash. Logout blocklistea el access token y revoca refresh token cuando se envia.
El registro publico ya no crea administradores salvo bootstrap local explicito.

## 10. Autorizacion

La politica efectiva es deny-by-default para rutas admin mediante
`get_current_admin`. Las rutas de productos publicos filtran `PUBLISHED` e
`is_active`. Las rutas de imagenes quedaron cerradas a admin.

## 11. Sesiones

No se usan cookies de sesion; por eso HttpOnly/SameSite/CSRF no aplica todavia.
Riesgo pendiente: tokens en `localStorage`. Recomendacion: migrar el panel admin
a cookie HttpOnly con `Secure` en produccion, `SameSite=Lax` o `Strict` segun el
flujo, rotacion al login y revocacion en logout.

## 12. CSRF

Al usar bearer tokens enviados por JavaScript en `Authorization`, el navegador
no los adjunta automaticamente en formularios cross-site. CSRF clasico es de
bajo riesgo en el estado actual. Si se migra a cookies HttpOnly, implementar
token CSRF u Origin/Host checks en POST/PUT/PATCH/DELETE.

## 13. CORS

Produccion rechaza wildcard, exige origenes HTTPS explicitos y no refleja
origenes arbitrarios. `allow_credentials=True` esta activo, por lo que el
dashboard de Vercel/API debe mantener una lista cerrada de dominios.

## 14. XSS

El backend sanitiza texto con escape HTML y rechaza claves NoSQL peligrosas. El
frontend renderiza texto React por defecto. Existe `dangerouslySetInnerHTML`
solo para JSON-LD controlado por codigo, no para contenido de usuario.

## 15. Base de datos

Beanie/MongoDB usa modelos tipados, indices unicos para slug/SKU y soft delete.
No se ejecutaron migraciones destructivas ni se reinicio la base. Se recomienda
usuario de DB con privilegios minimos y backups habilitados en Atlas.

## 16. Uploads

Se valida MIME, filename, tamano maximo y carpeta Cloudinary. Se rechazan rutas
con `..`, backslash o doble slash. Las rutas de upload quedaron solo admin.

## 17. Variables de entorno

Variables privadas: `MONGODB_URI`, `JWT_SECRET_KEY`,
`JWT_REFRESH_SECRET_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
`CLOUDINARY_URL`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`.

Variables publicas aceptadas por frontend: `NEXT_PUBLIC_INSTAGRAM_URL`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`.

No se imprimieron valores reales.

## 18. Vercel

Ver `docs/CONFIGURACION_SEGURIDAD_VERCEL.md` para acciones manuales. No se
afirma haber cambiado el dashboard.

## 19. Dependencias

Se ejecuto auditoria con pnpm. Inicialmente aparecio un advisory moderado de
PostCSS porque `pnpm-lock.yaml` resolvia `postcss@8.4.31` a traves de Next. Se
corrigio con un override de pnpm en `pnpm-workspace.yaml` y lockfile actualizado
para resolver `postcss@8.5.16`.

Resultado final: `pnpm audit --audit-level high` no reporta vulnerabilidades
conocidas.

## 20. Pruebas ejecutadas

- `.venv\Scripts\python.exe -m pytest app/tests`: 42 passed, 1 skipped,
  coverage 92.82%.
- `.venv\Scripts\python.exe -m ruff check app main.py`: OK.
- `.venv\Scripts\python.exe -m black --check app main.py`: OK.
- `.venv\Scripts\python.exe -m mypy app main.py`: OK.
- `npm run typecheck`: OK.
- `npm run build`: OK con red habilitada para descargar Google Fonts.
- `pnpm audit --audit-level high`: OK, sin vulnerabilidades conocidas.
- Revision de bundle `out` y `.next` por nombres de secretos privados: sin
  coincidencias.
- Rutas locales verificadas en `http://127.0.0.1:4173`: `/`,
  `/catalogo/todos-los-articulos`, `/product/vestido-atardecer`, `/admin`.

## 21. Limitaciones reales

- No se probo contra produccion.
- No se realizaron escaneos masivos ni ataques de disponibilidad.
- No se accedio al dashboard de Vercel.
- No se rotaron secretos desde aqui.
- No se migro el panel admin a cookies HttpOnly.

## 22. Acciones manuales pendientes

- Rotar cualquier secreto real que haya estado expuesto en entornos o logs.
- Activar 2FA/MFA para GitHub, Vercel, MongoDB Atlas y Cloudinary.
- Configurar Deployment Protection para previews.
- Configurar Vercel Firewall/rate limiting.
- Desactivar `INITIAL_ADMIN_BOOTSTRAP_ENABLED` despues del bootstrap local.
- Migrar tokens admin a cookies HttpOnly si el panel admin queda publico.

## 23. Confirmaciones

- No se intento bloquear DevTools.
- No se agregaron bloqueos de F12, click derecho, debugger loops ni ofuscacion.
- No se cambiaron imagenes.
- No se cambiaron estilos.
- No se incluyeron credenciales en este informe.
