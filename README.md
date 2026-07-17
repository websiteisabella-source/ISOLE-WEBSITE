# ISOLE Digital Showroom

Landing editorial construida con Next.js 16, React 19 y TypeScript. El proyecto funciona como showroom digital y lookbook, con una home principal y paginas estaticas por producto.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Motion

## Requisitos

- Node.js 20 o superior recomendado
- `pnpm` recomendado por el proyecto (`packageManager` configurado en `package.json`)

## Instalacion

```bash
pnpm install
```

Si prefieres `npm`, tambien puedes usar:

```bash
npm install
```

## Desarrollo local

```bash
pnpm dev
```

Abrir en:

```text
http://localhost:3000
```

## Scripts disponibles

- `pnpm dev`: inicia el entorno de desarrollo
- `pnpm build`: genera el build de produccion
- `pnpm start`: sirve el proyecto con `next start`
- `pnpm lint`: ejecuta chequeo de TypeScript
- `pnpm typecheck`: ejecuta chequeo de TypeScript

## Como funciona el deploy

Este proyecto esta configurado como export estatico en [next.config.mjs](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\next.config.mjs) con:

```js
output: "export"
```

Eso significa que al ejecutar:

```bash
pnpm build
```

Next genera una carpeta `out/` lista para publicar en hosting estatico.

## Deploy recomendado

### Opcion 1: Vercel

Puedes desplegarlo en Vercel como sitio estatico.

- Framework preset: `Next.js`
- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: `out`

Tambien puedes hacerlo con CLI:

```bash
pnpm build
vercel deploy
```

Si Vercel detecta el proyecto automaticamente, asegurate de que publique la carpeta `out`.

### Opcion 2: Netlify

Configuracion sugerida:

- Build command: `pnpm build`
- Publish directory: `out`

### Opcion 3: cualquier hosting estatico

Como el build termina en `out/`, puedes desplegar esa carpeta en:

- GitHub Pages
- Cloudflare Pages
- Firebase Hosting
- Amazon S3 + CloudFront
- cualquier CDN o servidor estatico

## Preview local del build

Despues de compilar:

```bash
pnpm build
```

puedes servir `out/` localmente, por ejemplo con Python:

```bash
python -m http.server 4173 --directory out
```

Y abrir:

```text
http://127.0.0.1:4173
```

## Variables de entorno

El proyecto funciona sin variables obligatorias, pero soporta estas variables publicas:

- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Se usan en [lib/site.ts](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\lib\site.ts).

Ejemplo:

```env
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/tu-cuenta
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

## Sincronizar publicaciones de Instagram

La seccion Comunidad no llama a Instagram desde el navegador. Para proteger el
token, primero se sincronizan las publicaciones y se guardan como archivos
estaticos antes del build.

Para traer las publicaciones que aparecen en una pagina como
`https://www.instagram.com/isabellla.co/tagged/`, usa la fuente `tagged`. Esta
fuente consulta el endpoint oficial de Meta para publicaciones donde la cuenta
profesional fue etiquetada.

Variables requeridas para publicaciones etiquetadas:

```env
INSTAGRAM_ACCESS_TOKEN=token-de-meta
INSTAGRAM_USER_ID=id-de-la-cuenta-profesional
INSTAGRAM_SOURCE=tagged
INSTAGRAM_TAGGED_LABEL=isabellla.co
INSTAGRAM_POST_LIMIT=6
INSTAGRAM_SYNC_REQUIRED=true
```

Tambien se puede usar una fuente por hashtags:

```env
INSTAGRAM_ACCESS_TOKEN=token-de-meta
INSTAGRAM_USER_ID=id-de-la-cuenta-profesional
INSTAGRAM_SOURCE=hashtags
INSTAGRAM_HASHTAGS=isolemomentos,isolestudio
INSTAGRAM_POST_LIMIT=6
```

Luego ejecuta:

```bash
npm run sync:instagram
npm run build
```

El script busca publicaciones etiquetadas o por hashtag, descarga las imagenes
a `public/images/instagram/` y actualiza `public/data/community-posts.json`. Si
no hay credenciales, el sitio mantiene las imagenes editoriales de respaldo.

## Estructura importante del proyecto

### Rutas

- [app/page.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\page.tsx): home principal
- [app/product/[slug]/page.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\product\[slug]\page.tsx): detalle de producto
- [app/layout.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\layout.tsx): metadata global, layout base y analytics
- [app/globals.css](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\globals.css): estilos globales

### Componentes

Los componentes de UI del sitio viven en:

- [components/site](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site)

Algunos importantes:

- [components/site/hero.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\hero.tsx): hero principal
- [components/site/masonry-gallery.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\masonry-gallery.tsx): galeria editorial
- [components/site/new-arrivals.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\new-arrivals.tsx): listado de productos destacados
- [components/site/product-card.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\product-card.tsx): tarjeta de producto
- [components/site/whatsapp-float.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\whatsapp-float.tsx): boton flotante de WhatsApp

### Datos del sitio

- [lib/products.ts](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\lib\products.ts): catalogo de productos
- [lib/site.ts](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\lib\site.ts): nombre del sitio, Instagram y WhatsApp
- [lib/utils.ts](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\lib\utils.ts): utilidades compartidas

## Donde van las imagenes

### Carpeta principal de imagenes del sitio

Las imagenes viven principalmente en:

- [public/images](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\public\images)

Ejemplos actuales:

- `hero.png`
- `collection-1.png` a `collection-4.png`
- `arrival-1-product.png`, `arrival-1-model.png`
- `arrival-2-product.png`, `arrival-2-model.png`
- `arrival-3-product.png`, `arrival-3-model.png`
- `detail-back.png`
- `detail-texture.png`
- `detail-lifestyle.png`
- `community-1.png` a `community-6.png`

### Iconos y assets generales

En la raiz de `public/` tambien hay assets de branding y placeholders:

- [public](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\public)

Ejemplos:

- `icon.svg`
- `apple-icon.png`
- `icon-dark-32x32.png`
- `icon-light-32x32.png`
- `placeholder.svg`

### Como se referencian

En Next, los archivos dentro de `public/` se consumen desde la raiz del sitio:

- `public/images/hero.png` se usa como `"/images/hero.png"`
- `public/icon.svg` se usa como `"/icon.svg"`

Ejemplo real en [components/site/hero.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\components\site\hero.tsx):

```tsx
<Image src="/images/hero.png" ... />
```

## Como agregar o actualizar productos

La fuente de verdad del catalogo esta en [lib/products.ts](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\lib\products.ts).

Cada producto define:

- `slug`
- `name`
- `category`
- `description`
- `fabric`
- `colors`
- `product`
- `model`
- `gallery`

### Flujo recomendado

1. Subir las imagenes nuevas a `public/images/`
2. Crear o actualizar la entrada del producto en `lib/products.ts`
3. Verificar que `product`, `model` y `gallery` apunten a rutas tipo `"/images/archivo.png"`
4. Ejecutar `pnpm build` para regenerar las paginas estaticas

## Como se generan las paginas de producto

Las paginas dinamicas estan en [app/product/[slug]/page.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\product\[slug]\page.tsx).

La generacion estatica ocurre con:

- `generateStaticParams()`: crea una pagina por cada `slug`
- `generateMetadata()`: crea metadatos por producto

Si agregas un producto nuevo en `lib/products.ts`, al hacer build se generara su URL automaticamente:

```text
/product/tu-slug
```

## Mapa rapido de la home

La home esta compuesta en [app/page.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\page.tsx) y monta estas secciones:

- `Navbar`
- `Hero`
- `EditorialSection`
- `MasonryGallery`
- `NewArrivals`
- `QuoteSection`
- `CommunityGallery`
- `Footer`
- `WhatsAppFloat`

## Notas importantes para deploy

- El proyecto hoy esta pensado para salir como sitio estatico.
- El build final se publica desde `out/`.
- `next/image` esta configurado con `unoptimized: true`, lo que evita depender del optimizador de imagenes del servidor.
- `@vercel/analytics` solo se renderiza en produccion desde [app/layout.tsx](C:\Users\Pablo Tomas Vargas\Desktop\isole-digital-showroom-design\app\layout.tsx).

## Checklist antes de publicar

- `pnpm install`
- `pnpm build`
- revisar que exista la carpeta `out/`
- validar links, imagenes y paginas de producto
- configurar variables publicas si quieres cambiar Instagram o WhatsApp
- publicar la carpeta `out/` en tu hosting

## Backend FastAPI

Este repositorio tambien incluye un backend Python 3.13 listo para servir el
showroom como API de produccion. La API usa FastAPI, MongoDB con Motor y
Beanie, Cloudinary para imagenes, JWT con refresh-token rotation, bcrypt,
middlewares de seguridad, rate limiting, logs rotativos, Docker, CI y pruebas.

La API vive como paquete Python dentro de `app/` junto a la app Next.js. Los
archivos TypeScript existentes siguen siendo el frontend; los submodulos Python
son `app/api`, `app/auth`, `app/config`, `app/database`, `app/models`,
`app/repositories`, `app/services`, `app/security`, `app/middleware`,
`app/schemas`, `app/validators`, `app/cloudinary` y `app/tests`.

### Arquitectura backend

- `main.py`: entrypoint de Uvicorn.
- `app/main.py`: factory FastAPI, lifespan, CORS, middlewares y router v1.
- `app/config`: settings tipados con Pydantic Settings.
- `app/database`: conexion centralizada async a MongoDB.
- `app/models`: documentos Beanie con timestamps, indices y soft delete.
- `app/repositories`: acceso a datos y queries optimizadas.
- `app/services`: casos de uso de autenticacion, catalogo, settings e imagenes.
- `app/api/v1/routes`: endpoints bajo `/api/v1/`.
- `app/exceptions`: manejo seguro y uniforme de errores.

Todas las respuestas siguen el contrato:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {},
  "errors": null
}
```

### Endpoints principales

- `/api/v1/auth/register`
- `/api/v1/auth/login`
- `/api/v1/auth/logout`
- `/api/v1/auth/refresh`
- `/api/v1/profile`
- `/api/v1/users`
- `/api/v1/uploads`
- `/api/v1/images`
- `/api/v1/products`
- `/api/v1/categories`
- `/api/v1/settings`
- `/api/v1/health`

Swagger, OpenAPI y Redoc quedan disponibles en:

```text
http://localhost:8000/docs
http://localhost:8000/openapi.json
http://localhost:8000/redoc
```

### Variables de entorno backend

El archivo `.env.example` incluye las variables del frontend y estas variables
del backend:

```env
APP_NAME=ISOLE API
ENVIRONMENT=development
DEBUG=false
HOST=0.0.0.0
PORT=8000
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=isole_showroom
JWT_SECRET_KEY=change-me-access-token-secret-key-at-least-32-chars
JWT_REFRESH_SECRET_KEY=change-me-refresh-token-secret-key-at-least-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=14
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Alternativa compacta:
# CLOUDINARY_URL=cloudinary://<api-key>:<api-secret>@sguhbpc0
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
LOG_LEVEL=INFO
```

Para MongoDB Atlas, usa el connection string `mongodb+srv` del cluster. Con el
usuario de base de datos de Atlas, el formato queda asi:

```env
MONGODB_URI=mongodb+srv://websiteisabella_db_user:<password>@<cluster-host>/isole_showroom?retryWrites=true&w=majority
DATABASE_NAME=isole_showroom
```

Reemplaza `<password>` por la clave del usuario de Atlas y `<cluster-host>` por
el host real del cluster, por ejemplo `cluster0.xxxxx.mongodb.net`. Mantén esos
datos solo en `.env`; ese archivo ya esta ignorado por Git.

En `ENVIRONMENT=production`, la API rechaza secretos JWT debiles y CORS
wildcard. El primer usuario registrado se crea como `admin`; los siguientes se
crean como `user`.

### Instalacion backend

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
```

Configura `.env` con MongoDB, JWT y Cloudinary. Luego ejecuta:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Compose

```bash
docker compose up --build
```

Compose levanta:

- `api`: FastAPI en `http://localhost:8000`
- `mongo`: MongoDB 7 con healthcheck
- volumen `api_logs` para logs rotativos
- volumen `mongo_data` para persistencia

### Calidad y pruebas

```bash
black app main.py
ruff check app
mypy app main.py
pytest
```

El objetivo de cobertura configurado es 90%. Las pruebas de MongoDB estan
marcadas como integracion y se activan con:

```bash
RUN_MONGODB_TESTS=1 pytest -m integration
```

### Cloudinary

Las imagenes nunca se guardan en disco. `ImageService` envia archivos a
Cloudinary y MongoDB conserva solamente metadata como `public_id`, `asset_id`,
`secure_url`, `format`, `width`, `height`, `bytes`, `folder`, `resource_type` y
timestamps.

Cloudinary puede configurarse con las tres variables separadas o con una sola
`CLOUDINARY_URL`:

```env
CLOUDINARY_URL=cloudinary://<api-key>:<api-secret>@sguhbpc0
```

Ese enlace entre Cloudinary y MongoDB sucede en el flujo de uploads:

- `CloudinaryService` sube el archivo y normaliza la respuesta de Cloudinary.
- `ImageService` guarda esa metadata en la coleccion `image_assets`.
- Las rutas `/api/v1/uploads` y `/api/v1/images` exponen el flujo de carga,
  consulta, reemplazo, borrado y URL firmada.

### Seguridad

La API incluye:

- OAuth2 Password Bearer.
- Access tokens y refresh tokens JWT con rotacion.
- Logout con blocklist de access tokens y revocacion de refresh tokens.
- Hash bcrypt con Passlib.
- Roles `admin` y `user`.
- Dependencias para proteger rutas por rol o permiso.
- Rate limiting por cliente y ruta.
- CORS configurable por entorno.
- Headers de seguridad.
- Rechazo de claves MongoDB peligrosas como `$ne` o campos con `.`.
- Manejo de excepciones sin exponer errores internos.
- Logs separados para aplicacion, accesos y seguridad.

### CI/CD

El workflow `.github/workflows/backend-ci.yml` instala Python 3.13, ejecuta
Ruff, Black, Mypy y Pytest con MongoDB de servicio. El `Dockerfile` usa usuario
no root, healthcheck y entrypoint Uvicorn. `deploy/nginx/default.conf` contiene
una configuracion base para proxy reverso hacia la API.
