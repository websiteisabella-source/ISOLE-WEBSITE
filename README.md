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
