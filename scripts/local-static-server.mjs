import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL("../", import.meta.url)))
const publicDir = resolve(root, "dist", "client")
const requestedPort = Number.parseInt(
  process.env.PORT || process.argv.find((arg) => arg.startsWith("--port="))?.slice(7) || "4173",
  10,
)

const mimeTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
])

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com",
    "media-src 'self' https://res.cloudinary.com",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com",
    "frame-src https://www.instagram.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me",
    "object-src 'none'",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
}

function toSafeFilePath(pathname) {
  const decodedPath = decodeURIComponent(pathname)
  const normalizedPath = normalize(decodedPath).replace(/^([/\\])+/, "")
  const filePath = resolve(publicDir, normalizedPath)

  if (filePath !== publicDir && !filePath.startsWith(publicDir + sep)) {
    return null
  }

  return filePath
}

function candidateFiles(pathname) {
  const directPath = toSafeFilePath(pathname)
  if (!directPath) return []

  const hasExtension = Boolean(extname(directPath))
  const paths = [directPath]

  if (pathname.endsWith("/")) {
    paths.push(resolve(directPath, "index.html"))
  } else if (!hasExtension) {
    paths.push(`${directPath}.html`, resolve(directPath, "index.html"))
  }

  return paths
}

function findFile(pathname) {
  for (const filePath of candidateFiles(pathname)) {
    if (!existsSync(filePath)) continue

    const stats = statSync(filePath)
    if (stats.isFile()) return filePath
  }

  return null
}

function sendFile(response, filePath, statusCode = 200) {
  const contentType = mimeTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream"

  response.writeHead(statusCode, {
    "Content-Type": contentType,
    ...securityHeaders,
  })

  createReadStream(filePath).pipe(response)
}

if (!existsSync(resolve(publicDir, "index.html"))) {
  console.error("Missing dist/client/index.html. Run npm run build first.")
  process.exit(1)
}

const server = createServer((request, response) => {
  if (!request.url) {
    response.writeHead(400)
    response.end("Bad request")
    return
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" })
    response.end("Method not allowed")
    return
  }

  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`)
  const filePath = findFile(url.pathname)

  if (filePath) {
    sendFile(response, filePath)
    return
  }

  const notFoundPath = resolve(publicDir, "404.html")
  if (existsSync(notFoundPath)) {
    sendFile(response, notFoundPath, 404)
    return
  }

  response.writeHead(404)
  response.end("Not found")
})

server.listen(requestedPort, "127.0.0.1", () => {
  console.log(`Isole Digital Showroom running at http://127.0.0.1:${requestedPort}`)
})
