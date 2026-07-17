import { existsSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

const root = process.cwd()

for (const envFile of ['.env.local', '.env']) {
  const envPath = resolve(root, envFile)

  if (!existsSync(envPath)) continue

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed)
    if (!match) continue

    const [, key, rawValue] = match
    const value = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, '$2')

    process.env[key] ??= value
  }
}

const GRAPH_API_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION ?? 'v23.0'
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const IG_USER_ID = process.env.INSTAGRAM_USER_ID
const SOURCE = process.env.INSTAGRAM_SOURCE ?? 'tagged'
const SYNC_REQUIRED = process.env.INSTAGRAM_SYNC_REQUIRED === 'true'
const TAGGED_LABEL = process.env.INSTAGRAM_TAGGED_LABEL ?? 'isabellla.co'
const HASHTAGS = (process.env.INSTAGRAM_HASHTAGS ?? 'isolemomentos,isolestudio')
  .split(',')
  .map((tag) => tag.trim().replace(/^#/, ''))
  .filter(Boolean)
const POST_LIMIT = Number.parseInt(process.env.INSTAGRAM_POST_LIMIT ?? '6', 10)

const dataPath = resolve(root, 'public/data/community-posts.json')
const imageDir = resolve(root, 'public/images/instagram')

if (!ACCESS_TOKEN || !IG_USER_ID) {
  const message = [
    'Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID.',
    'Community feed was not updated.',
  ].join(' ')

  if (SYNC_REQUIRED) {
    throw new Error(message)
  }

  console.warn(`${message} Keeping existing community feed.`)
  process.exit(0)
}

if (SOURCE === 'hashtags' && HASHTAGS.length === 0) {
  const message = 'Missing INSTAGRAM_HASHTAGS. Community feed was not updated.'

  if (SYNC_REQUIRED) {
    throw new Error(message)
  }

  console.warn(`${message} Keeping existing community feed.`)
  process.exit(0)
}

if (SOURCE === 'tagged') {
  console.log(
    `Syncing Instagram media tagged on ${TAGGED_LABEL} from /${IG_USER_ID}/tags.`,
  )
}

await mkdir(imageDir, { recursive: true })

function graphUrl(path, params) {
  const url = new URL(`${GRAPH_API_BASE}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  url.searchParams.set('access_token', ACCESS_TOKEN)
  return url
}

async function fetchJson(url) {
  const response = await fetch(url)
  const body = await response.text()

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }

  return JSON.parse(body)
}

async function findHashtagId(tag) {
  const payload = await fetchJson(
    graphUrl('/ig_hashtag_search', {
      user_id: IG_USER_ID,
      q: tag,
    }),
  )

  return payload.data?.[0]?.id
}

function getMediaImageUrl(media) {
  if (media.thumbnail_url) return media.thumbnail_url
  if (media.media_url && media.media_type !== 'VIDEO') return media.media_url

  const child = media.children?.data?.find(
    (item) => item.thumbnail_url || item.media_url,
  )

  return child?.thumbnail_url ?? child?.media_url ?? ''
}

function extensionFromContentType(contentType, sourceUrl) {
  if (contentType.includes('image/png')) return '.png'
  if (contentType.includes('image/webp')) return '.webp'
  if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
    return '.jpg'
  }

  const parsedExt = extname(new URL(sourceUrl).pathname)
  return parsedExt || '.jpg'
}

async function downloadImage(mediaId, sourceUrl) {
  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error(`Image download failed for ${mediaId}: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const ext = extensionFromContentType(contentType, sourceUrl)
  const fileName = `${mediaId}${ext}`
  const filePath = resolve(imageDir, fileName)
  const buffer = Buffer.from(await response.arrayBuffer())

  await writeFile(filePath, buffer)

  return `/images/instagram/${fileName}`
}

function compactCaption(caption, tag) {
  const normalized = (caption ?? '').replace(/\s+/g, ' ').trim()

  if (normalized.length === 0) {
    return `Publicacion de la comunidad ISOLE desde ${tag}`
  }

  return normalized.length > 180
    ? `${normalized.slice(0, 177).trim()}...`
    : normalized
}

async function getRecentMediaForTag(tag) {
  const hashtagId = await findHashtagId(tag)

  if (!hashtagId) return []

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'children{media_type,media_url,thumbnail_url}',
  ].join(',')

  const payload = await fetchJson(
    graphUrl(`/${hashtagId}/recent_media`, {
      user_id: IG_USER_ID,
      fields,
      limit: String(Math.max(POST_LIMIT, 12)),
    }),
  )

  return (payload.data ?? []).map((media) => ({ ...media, tag }))
}

async function getTaggedMedia() {
  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'username',
    'children{media_type,media_url,thumbnail_url}',
  ].join(',')

  const payload = await fetchJson(
    graphUrl(`/${IG_USER_ID}/tags`, {
      fields,
      limit: String(Math.max(POST_LIMIT, 12)),
    }),
  )

  return (payload.data ?? []).map((media) => ({
    ...media,
    tag: media.username ? `@${media.username}` : TAGGED_LABEL,
  }))
}

const mediaById = new Map()

if (SOURCE === 'tagged') {
  const media = await getTaggedMedia()

  for (const item of media) {
    if (!mediaById.has(item.id)) mediaById.set(item.id, item)
  }
} else if (SOURCE === 'hashtags') {
  for (const tag of HASHTAGS) {
    const media = await getRecentMediaForTag(tag)

    for (const item of media) {
      if (!mediaById.has(item.id)) mediaById.set(item.id, item)
    }
  }
} else {
  throw new Error(
    `Unsupported INSTAGRAM_SOURCE "${SOURCE}". Use "tagged" or "hashtags".`,
  )
}

const posts = []

for (const media of mediaById.values()) {
  if (posts.length >= POST_LIMIT) break

  const imageUrl = getMediaImageUrl(media)

  if (!imageUrl || !media.permalink) continue

  try {
    const src = await downloadImage(media.id, imageUrl)
    const caption = compactCaption(media.caption, media.tag)

    posts.push({
      id: media.id,
      src,
      alt: caption,
      href: media.permalink,
      tag: media.tag,
      caption,
      timestamp: media.timestamp,
    })
  } catch (error) {
    console.warn(error.message)
  }
}

await writeFile(dataPath, `${JSON.stringify(posts, null, 2)}\n`)

console.log(`Synced ${posts.length} Instagram community posts.`)
