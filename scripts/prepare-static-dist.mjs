import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const outDir = resolve(root, "out")
const distDir = resolve(root, "dist")
const clientDir = resolve(distDir, "client")
const serverDir = resolve(distDir, "server")
const hostingDir = resolve(root, ".openai")
const distHostingDir = resolve(distDir, ".openai")

if (!existsSync(outDir)) {
  throw new Error("Expected Next static export in out/. Run next build first.")
}

rmSync(distDir, { recursive: true, force: true })
mkdirSync(clientDir, { recursive: true })
mkdirSync(serverDir, { recursive: true })

cpSync(outDir, clientDir, { recursive: true })
cpSync(hostingDir, distHostingDir, { recursive: true })

writeFileSync(
  resolve(serverDir, "index.js"),
  `const NOT_FOUND_PATH = "/404.html"
const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com",
    "frame-src https://www.instagram.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
}

function candidatePaths(pathname) {
  const paths = [pathname]
  const hasExtension = /\\/[^/]+\\.[^/]+$/.test(pathname)

  if (pathname.endsWith("/")) {
    paths.push(pathname + "index.html")
  } else if (!hasExtension) {
    paths.push(pathname + ".html", pathname + "/index.html")
  }

  return [...new Set(paths)]
}

async function fetchAsset(request, env, pathname) {
  if (!env.ASSETS) {
    return new Response("Missing asset binding", { status: 500 })
  }

  const assetUrl = new URL(request.url)
  assetUrl.pathname = pathname
  return env.ASSETS.fetch(new Request(assetUrl, request))
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      })
    }

    const url = new URL(request.url)

    for (const pathname of candidatePaths(url.pathname)) {
      const response = await fetchAsset(request, env, pathname)
      if (response.status !== 404) return withSecurityHeaders(response)
    }

    const notFound = await fetchAsset(request, env, NOT_FOUND_PATH)
    return withSecurityHeaders(new Response(notFound.body, {
      status: 404,
      headers: notFound.headers,
    }))
  },
}
`,
)
