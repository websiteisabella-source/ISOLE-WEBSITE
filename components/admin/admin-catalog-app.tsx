'use client'

import {
  Archive,
  Copy,
  Image as ImageIcon,
  Layers3,
  ListFilter,
  LogIn,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProductStatus = 'draft' | 'published' | 'archived'
type CatalogGroupKind = 'collection' | 'clothing_type'
type ViewKey = 'summary' | 'products' | CatalogGroupKind

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  errors?: { field?: string | null; message: string; code?: string | null }[] | null
}

type ProductVariant = {
  color?: string | null
  size?: string | null
  sku?: string | null
  stock?: number | null
  price?: number | null
  is_active?: boolean
}

type Product = {
  id: string
  name: string
  slug: string
  description?: string | null
  short_description?: string | null
  price?: number | null
  compare_at_price?: number | null
  currency: string
  sku?: string | null
  stock?: number | null
  status: ProductStatus
  publication_errors: string[]
  collection_ids: string[]
  clothing_type_ids: string[]
  image_ids: string[]
  primary_image_id?: string | null
  variants: ProductVariant[]
  is_featured: boolean
  sort_order: number
  is_active: boolean
  updated_at?: string
}

type CatalogGroup = {
  id: string
  name: string
  slug: string
  description?: string | null
  kind: CatalogGroupKind
  cover_image_id?: string | null
  sort_order: number
  is_active: boolean
}

type Summary = {
  total_products: number
  published_products: number
  draft_products: number
  archived_products: number
  incomplete_products: number
  total_collections: number
  total_clothing_types: number
  recent_products: Product[]
  collections: CatalogGroup[]
  clothing_types: CatalogGroup[]
}

type ProductForm = {
  id?: string
  name: string
  slug: string
  short_description: string
  description: string
  price: string
  compare_at_price: string
  sku: string
  stock: string
  status: ProductStatus
  collection_ids: string[]
  clothing_type_ids: string[]
  image_ids_text: string
  primary_image_id: string
  variant_text: string
  is_featured: boolean
  sort_order: string
}

type GroupForm = {
  id?: string
  kind: CatalogGroupKind
  name: string
  slug: string
  description: string
  cover_image_id: string
  sort_order: string
  is_active: boolean
}

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000'

const fieldClass =
  'h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20'
const areaClass =
  'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20'
const labelClass = 'grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70'

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyProductForm(): ProductForm {
  return {
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    stock: '',
    status: 'draft',
    collection_ids: [],
    clothing_type_ids: [],
    image_ids_text: '',
    primary_image_id: '',
    variant_text: '',
    is_featured: false,
    sort_order: '0',
  }
}

function productToForm(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    price: product.price?.toString() ?? '',
    compare_at_price: product.compare_at_price?.toString() ?? '',
    sku: product.sku ?? '',
    stock: product.stock?.toString() ?? '',
    status: product.status,
    collection_ids: product.collection_ids ?? [],
    clothing_type_ids: product.clothing_type_ids ?? [],
    image_ids_text: (product.image_ids ?? []).join('\n'),
    primary_image_id: product.primary_image_id ?? '',
    variant_text: (product.variants ?? [])
      .map((variant) => [variant.color, variant.size, variant.sku].filter(Boolean).join(' / '))
      .join('\n'),
    is_featured: product.is_featured,
    sort_order: product.sort_order?.toString() ?? '0',
  }
}

function emptyGroupForm(kind: CatalogGroupKind): GroupForm {
  return {
    kind,
    name: '',
    slug: '',
    description: '',
    cover_image_id: '',
    sort_order: '0',
    is_active: true,
  }
}

function groupToForm(group: CatalogGroup): GroupForm {
  return {
    id: group.id,
    kind: group.kind,
    name: group.name,
    slug: group.slug,
    description: group.description ?? '',
    cover_image_id: group.cover_image_id ?? '',
    sort_order: group.sort_order?.toString() ?? '0',
    is_active: group.is_active,
  }
}

function splitIds(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseVariants(value: string): ProductVariant[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [color, size, sku] = line.split('/').map((part) => part.trim())
      return { color: color || null, size: size || null, sku: sku || null, is_active: true }
    })
}

function nullableNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

function groupName(kind: CatalogGroupKind) {
  return kind === 'collection' ? 'Colecciones' : 'Tipos de ropa'
}

function statusName(status: ProductStatus) {
  const names: Record<ProductStatus, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    archived: 'Archivado',
  }
  return names[status]
}

export function AdminCatalogApp() {
  const [token, setToken] = useState<string | null>(null)
  const [view, setView] = useState<ViewKey>('summary')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [groups, setGroups] = useState<CatalogGroup[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [productForm, setProductForm] = useState<ProductForm | null>(null)
  const [groupForm, setGroupForm] = useState<GroupForm | null>(null)

  const collections = useMemo(
    () => groups.filter((group) => group.kind === 'collection'),
    [groups],
  )
  const clothingTypes = useMemo(
    () => groups.filter((group) => group.kind === 'clothing_type'),
    [groups],
  )

  useEffect(() => {
    setToken(window.localStorage.getItem('isole_admin_token'))
  }, [])

  useEffect(() => {
    if (token) {
      void refreshData()
    }
  }, [token])

  async function request<T>(path: string, options: RequestInit = {}) {
    const response = await fetch(`${apiBase}/api/v1${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
    const payload = (await response.json()) as ApiEnvelope<T>
    if (!response.ok || !payload.success) {
      const details = payload.errors?.map((item) => item.message).join(' ')
      throw new Error(details || payload.message || 'No fue posible completar la accion.')
    }
    return payload.data
  }

  async function refreshData() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page_size: '100' })
      if (search.trim()) params.set('search', search.trim())
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const [summaryData, productData, groupData] = await Promise.all([
        request<Summary>('/admin/catalog/summary'),
        request<{ items: Product[]; total: number }>(`/admin/catalog/products?${params}`),
        request<{ items: CatalogGroup[]; total: number }>('/admin/catalog/groups?page_size=100'),
      ])
      setSummary(summaryData)
      setProducts(productData.items)
      setGroups(groupData.items)
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Error cargando catálogo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const body = new URLSearchParams()
    body.set('username', String(formData.get('email') ?? ''))
    body.set('password', String(formData.get('password') ?? ''))

    try {
      const response = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      const payload = (await response.json()) as ApiEnvelope<{
        access_token: string
        token_type: string
      }>
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Credenciales invalidas.')
      }
      window.localStorage.setItem('isole_admin_token', payload.data.access_token)
      setToken(payload.data.access_token)
      setNotice('Sesión iniciada.')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No fue posible iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    window.localStorage.removeItem('isole_admin_token')
    setToken(null)
    setSummary(null)
    setProducts([])
    setGroups([])
    setProductForm(null)
    setGroupForm(null)
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!productForm) return

    const body = {
      name: productForm.name,
      slug: productForm.slug,
      short_description: productForm.short_description || null,
      description: productForm.description || null,
      price: nullableNumber(productForm.price),
      compare_at_price: nullableNumber(productForm.compare_at_price),
      sku: productForm.sku || null,
      stock: nullableNumber(productForm.stock),
      status: productForm.status,
      collection_ids: productForm.collection_ids,
      clothing_type_ids: productForm.clothing_type_ids,
      image_ids: splitIds(productForm.image_ids_text),
      primary_image_id: productForm.primary_image_id || null,
      variants: parseVariants(productForm.variant_text),
      is_featured: productForm.is_featured,
      sort_order: Number(productForm.sort_order || 0),
    }

    setLoading(true)
    setError(null)
    try {
      if (productForm.id) {
        await request<Product>(`/admin/catalog/products/${productForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      } else {
        await request<Product>('/admin/catalog/products', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
      setNotice('Producto guardado.')
      setProductForm(null)
      await refreshData()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No fue posible guardar.')
    } finally {
      setLoading(false)
    }
  }

  async function saveGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!groupForm) return

    const body = {
      kind: groupForm.kind,
      name: groupForm.name,
      slug: groupForm.slug,
      description: groupForm.description || null,
      cover_image_id: groupForm.cover_image_id || null,
      sort_order: Number(groupForm.sort_order || 0),
      is_active: groupForm.is_active,
    }

    setLoading(true)
    setError(null)
    try {
      if (groupForm.id) {
        await request<CatalogGroup>(`/admin/catalog/groups/${groupForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      } else {
        await request<CatalogGroup>('/admin/catalog/groups', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
      setNotice('Grupo guardado.')
      setGroupForm(null)
      await refreshData()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No fue posible guardar.')
    } finally {
      setLoading(false)
    }
  }

  async function productAction(product: Product, action: 'publish' | 'archive' | 'duplicate' | 'delete') {
    const labels = {
      publish: 'publicar',
      archive: 'archivar',
      duplicate: 'duplicar',
      delete: 'eliminar',
    }
    if (
      (action === 'archive' || action === 'delete') &&
      !window.confirm(`Confirma que quieres ${labels[action]} "${product.name}"?`)
    ) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      if (action === 'delete') {
        await request<Product>(`/admin/catalog/products/${product.id}`, { method: 'DELETE' })
      } else {
        await request<Product>(`/admin/catalog/products/${product.id}/${action}`, { method: 'POST' })
      }
      const doneLabels = {
        publish: 'publicado',
        archive: 'archivado',
        duplicate: 'duplicado',
        delete: 'eliminado',
      }
      setNotice(`Producto ${doneLabels[action]}.`)
      await refreshData()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Acción no completada.')
    } finally {
      setLoading(false)
    }
  }

  async function deleteGroup(group: CatalogGroup) {
    if (!window.confirm(`Confirma que quieres eliminar "${group.name}"?`)) return

    setLoading(true)
    setError(null)
    try {
      await request<{ related_products: number }>(`/admin/catalog/groups/${group.id}`, {
        method: 'DELETE',
      })
      setNotice('Grupo eliminado. Los productos relacionados se conservaron.')
      await refreshData()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'No fue posible eliminar.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-cream px-5 py-8 text-foreground">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="brand-subtitle text-5xl text-coral sm:text-6xl">ISOLE</p>
            <h1 className="editorial-title mt-4 max-w-2xl text-4xl text-ink sm:text-6xl">
              Administración del catálogo
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/70">
              Gestiona productos, colecciones, tipos de ropa, variantes e imágenes desde
              un espacio protegido por el rol administrador.
            </p>
          </div>
          <form
            onSubmit={handleLogin}
            className="rounded-lg border border-border bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-coral text-white">
                <LogIn className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Ingreso admin</h2>
                <p className="text-sm text-ink/60">Usa tu usuario administrador.</p>
              </div>
            </div>
            <label className={labelClass}>
              Correo
              <input className={fieldClass} name="email" type="email" required />
            </label>
            <label className={cn(labelClass, 'mt-4')}>
              Contraseña
              <input className={fieldClass} name="password" type="password" required />
            </label>
            {error && <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm text-coral">{error}</p>}
            <Button className="mt-5 w-full" disabled={loading} type="submit">
              <LogIn className="size-4" />
              Entrar
            </Button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream text-foreground">
      <header className="border-b border-border bg-white/85 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="brand-subtitle text-4xl text-coral">ISOLE</p>
            <h1 className="editorial-title text-2xl text-ink">Admin catálogo</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
              Actualizar
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="size-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-lg border border-border bg-white p-2">
          <NavButton active={view === 'summary'} onClick={() => setView('summary')}>
            <Package className="size-4" />
            Resumen
          </NavButton>
          <NavButton active={view === 'products'} onClick={() => setView('products')}>
            <ListFilter className="size-4" />
            Productos
          </NavButton>
          <NavButton active={view === 'collection'} onClick={() => setView('collection')}>
            <Layers3 className="size-4" />
            Colecciones
          </NavButton>
          <NavButton active={view === 'clothing_type'} onClick={() => setView('clothing_type')}>
            <Layers3 className="size-4" />
            Tipos de ropa
          </NavButton>
        </aside>

        <section className="min-w-0 space-y-5">
          {(notice || error) && (
            <div
              className={cn(
                'rounded-lg border p-3 text-sm',
                error
                  ? 'border-coral/30 bg-coral/10 text-coral'
                  : 'border-lavender/25 bg-lavender/10 text-lavender',
              )}
            >
              {error || notice}
            </div>
          )}

          {view === 'summary' && summary && (
            <SummaryView
              summary={summary}
              onCreateProduct={() => {
                setView('products')
                setProductForm(emptyProductForm())
              }}
            />
          )}

          {view === 'products' && (
            <ProductsView
              products={products}
              collections={collections}
              clothingTypes={clothingTypes}
              search={search}
              statusFilter={statusFilter}
              productForm={productForm}
              loading={loading}
              onSearch={setSearch}
              onStatusFilter={setStatusFilter}
              onRefresh={refreshData}
              onNew={() => setProductForm(emptyProductForm())}
              onEdit={(product) => setProductForm(productToForm(product))}
              onCancel={() => setProductForm(null)}
              onChange={setProductForm}
              onSubmit={saveProduct}
              onAction={productAction}
            />
          )}

          {(view === 'collection' || view === 'clothing_type') && (
            <GroupsView
              kind={view}
              groups={groups.filter((group) => group.kind === view)}
              groupForm={groupForm}
              loading={loading}
              onNew={() => setGroupForm(emptyGroupForm(view))}
              onEdit={(group) => setGroupForm(groupToForm(group))}
              onCancel={() => setGroupForm(null)}
              onChange={setGroupForm}
              onSubmit={saveGroup}
              onDelete={deleteGroup}
            />
          )}
        </section>
      </div>
    </main>
  )
}

function NavButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'mb-1 flex h-10 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-semibold transition',
        active ? 'bg-nude text-ink' : 'text-ink/70 hover:bg-muted hover:text-ink',
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function SummaryView({
  summary,
  onCreateProduct,
}: {
  summary: Summary
  onCreateProduct: () => void
}) {
  const stats = [
    ['Total productos', summary.total_products],
    ['Publicados', summary.published_products],
    ['Borradores', summary.draft_products],
    ['Incompletos', summary.incomplete_products],
    ['Colecciones', summary.total_collections],
    ['Tipos de ropa', summary.total_clothing_types],
  ]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-subtitle text-4xl text-coral">Catálogo vivo</p>
          <h2 className="editorial-title text-3xl text-ink">Resumen operativo</h2>
        </div>
        <Button onClick={onCreateProduct}>
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-lavender">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="text-lg font-semibold text-ink">Actividad reciente</h3>
        <div className="mt-3 divide-y divide-border">
          {summary.recent_products.length === 0 && (
            <p className="py-4 text-sm text-ink/60">Aun no hay productos creados.</p>
          )}
          {summary.recent_products.map((product) => (
            <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="text-sm text-ink/60">{product.slug}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ProductsView({
  products,
  collections,
  clothingTypes,
  search,
  statusFilter,
  productForm,
  loading,
  onSearch,
  onStatusFilter,
  onRefresh,
  onNew,
  onEdit,
  onCancel,
  onChange,
  onSubmit,
  onAction,
}: {
  products: Product[]
  collections: CatalogGroup[]
  clothingTypes: CatalogGroup[]
  search: string
  statusFilter: ProductStatus | 'all'
  productForm: ProductForm | null
  loading: boolean
  onSearch: (value: string) => void
  onStatusFilter: (value: ProductStatus | 'all') => void
  onRefresh: () => void
  onNew: () => void
  onEdit: (product: Product) => void
  onCancel: () => void
  onChange: (form: ProductForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onAction: (product: Product, action: 'publish' | 'archive' | 'duplicate' | 'delete') => void
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-subtitle text-4xl text-coral">Prendas</p>
          <h2 className="editorial-title text-3xl text-ink">Productos</h2>
        </div>
        <Button onClick={onNew}>
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-white p-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/45" />
          <input
            className={cn(fieldClass, 'pl-9')}
            placeholder="Buscar por nombre, slug o SKU"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <select
          className={fieldClass}
          value={statusFilter}
          onChange={(event) => onStatusFilter(event.target.value as ProductStatus | 'all')}
        >
          <option value="all">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <Search className="size-4" />
          Filtrar
        </Button>
      </div>

      {productForm && (
        <ProductEditor
          form={productForm}
          collections={collections}
          clothingTypes={clothingTypes}
          loading={loading}
          onCancel={onCancel}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="hidden min-w-[780px] grid-cols-[1.5fr_140px_150px_190px] gap-3 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 md:grid">
          <span>Producto</span>
          <span>Estado</span>
          <span>Publicacion</span>
          <span>Acciones</span>
        </div>
        <div className="divide-y divide-border">
          {products.length === 0 && (
            <p className="p-4 text-sm text-ink/60">No hay productos con esos filtros.</p>
          )}
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              collections={collections}
              clothingTypes={clothingTypes}
              onEdit={onEdit}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function ProductEditor({
  form,
  collections,
  clothingTypes,
  loading,
  onCancel,
  onChange,
  onSubmit,
}: {
  form: ProductForm
  collections: CatalogGroup[]
  clothingTypes: CatalogGroup[]
  loading: boolean
  onCancel: () => void
  onChange: (form: ProductForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  function update(next: Partial<ProductForm>) {
    onChange({ ...form, ...next })
  }

  function toggle(field: 'collection_ids' | 'clothing_type_ids', id: string) {
    const values = new Set(form[field])
    if (values.has(id)) values.delete(id)
    else values.add(id)
    update({ [field]: [...values] } as Partial<ProductForm>)
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-lavender/25 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">
            {form.id ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <p className="text-sm text-ink/60">Los productos incompletos permanecen en borrador.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="size-4" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          Nombre
          <input
            className={fieldClass}
            required
            value={form.name}
            onChange={(event) => {
              const name = event.target.value
              update({
                name,
                slug: form.slug && form.id ? form.slug : slugify(name),
              })
            }}
          />
        </label>
        <label className={labelClass}>
          Slug
          <input
            className={fieldClass}
            required
            value={form.slug}
            onChange={(event) => update({ slug: slugify(event.target.value) })}
          />
        </label>
        <label className={labelClass}>
          Estado
          <select
            className={fieldClass}
            value={form.status}
            onChange={(event) => update({ status: event.target.value as ProductStatus })}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </label>
        <label className={labelClass}>
          SKU
          <input
            className={fieldClass}
            value={form.sku}
            onChange={(event) => update({ sku: event.target.value })}
          />
        </label>
        <label className={labelClass}>
          Precio COP
          <input
            className={fieldClass}
            min="0"
            step="1"
            type="number"
            value={form.price}
            onChange={(event) => update({ price: event.target.value })}
          />
        </label>
        <label className={labelClass}>
          Precio antes
          <input
            className={fieldClass}
            min="0"
            step="1"
            type="number"
            value={form.compare_at_price}
            onChange={(event) => update({ compare_at_price: event.target.value })}
          />
        </label>
        <label className={labelClass}>
          Stock
          <input
            className={fieldClass}
            min="0"
            step="1"
            type="number"
            value={form.stock}
            onChange={(event) => update({ stock: event.target.value })}
          />
        </label>
        <label className={labelClass}>
          Orden
          <input
            className={fieldClass}
            type="number"
            value={form.sort_order}
            onChange={(event) => update({ sort_order: event.target.value })}
          />
        </label>
        <label className={cn(labelClass, 'lg:col-span-2')}>
          Descripción corta
          <textarea
            className={areaClass}
            value={form.short_description}
            onChange={(event) => update({ short_description: event.target.value })}
          />
        </label>
        <label className={cn(labelClass, 'lg:col-span-2')}>
          Descripción completa
          <textarea
            className={areaClass}
            value={form.description}
            onChange={(event) => update({ description: event.target.value })}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CheckboxGroup
          title="Colecciones"
          items={collections}
          selected={form.collection_ids}
          onToggle={(id) => toggle('collection_ids', id)}
        />
        <CheckboxGroup
          title="Tipos de ropa"
          items={clothingTypes}
          selected={form.clothing_type_ids}
          onToggle={(id) => toggle('clothing_type_ids', id)}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          IDs de imagen
          <textarea
            className={areaClass}
            placeholder="Un ID por linea o separados por coma"
            value={form.image_ids_text}
            onChange={(event) => update({ image_ids_text: event.target.value })}
          />
        </label>
        <div className="space-y-4">
          <label className={labelClass}>
            Imagen principal
            <input
              className={fieldClass}
              value={form.primary_image_id}
              onChange={(event) => update({ primary_image_id: event.target.value })}
            />
          </label>
          <label className={labelClass}>
            Variantes
            <textarea
              className={areaClass}
              placeholder="Color / Talla / SKU"
              value={form.variant_text}
              onChange={(event) => update({ variant_text: event.target.value })}
            />
          </label>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <input
          checked={form.is_featured}
          type="checkbox"
          onChange={(event) => update({ is_featured: event.target.checked })}
        />
        Producto destacado en la tienda
      </label>
    </form>
  )
}

function CheckboxGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string
  items: CatalogGroup[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <fieldset className="rounded-lg border border-border bg-cream/50 p-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
        {title}
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2 text-sm text-ink">
            <input
              checked={selected.includes(item.id)}
              type="checkbox"
              onChange={() => onToggle(item.id)}
            />
            {item.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ProductRow({
  product,
  collections,
  clothingTypes,
  onEdit,
  onAction,
}: {
  product: Product
  collections: CatalogGroup[]
  clothingTypes: CatalogGroup[]
  onEdit: (product: Product) => void
  onAction: (product: Product, action: 'publish' | 'archive' | 'duplicate' | 'delete') => void
}) {
  const related = [...collections, ...clothingTypes]
    .filter((group) =>
      [...(product.collection_ids ?? []), ...(product.clothing_type_ids ?? [])].includes(group.id),
    )
    .map((group) => group.name)
    .join(', ')

  return (
    <div className="grid gap-3 p-4 md:grid-cols-[1.5fr_140px_150px_190px] md:items-center">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-ink">{product.name}</p>
          {product.image_ids.length > 0 ? (
            <ImageIcon className="size-4 text-lavender" />
          ) : (
            <Upload className="size-4 text-coral" />
          )}
        </div>
        <p className="truncate text-sm text-ink/60">{product.slug}</p>
        <p className="mt-1 truncate text-xs text-ink/50">{related || 'Sin grupo asignado'}</p>
      </div>
      <StatusBadge status={product.status} />
      <div className="text-sm text-ink/65">
        {product.publication_errors.length === 0
          ? 'Completo'
          : `${product.publication_errors.length} pendiente(s)`}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <IconButton label="Editar" onClick={() => onEdit(product)}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton label="Publicar" onClick={() => onAction(product, 'publish')}>
          <Package className="size-4" />
        </IconButton>
        <IconButton label="Archivar" onClick={() => onAction(product, 'archive')}>
          <Archive className="size-4" />
        </IconButton>
        <IconButton label="Duplicar" onClick={() => onAction(product, 'duplicate')}>
          <Copy className="size-4" />
        </IconButton>
        <IconButton label="Eliminar" onClick={() => onAction(product, 'delete')}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

function GroupsView({
  kind,
  groups,
  groupForm,
  loading,
  onNew,
  onEdit,
  onCancel,
  onChange,
  onSubmit,
  onDelete,
}: {
  kind: CatalogGroupKind
  groups: CatalogGroup[]
  groupForm: GroupForm | null
  loading: boolean
  onNew: () => void
  onEdit: (group: CatalogGroup) => void
  onCancel: () => void
  onChange: (form: GroupForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onDelete: (group: CatalogGroup) => void
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-subtitle text-4xl text-coral">{groupName(kind)}</p>
          <h2 className="editorial-title text-3xl text-ink">Organización del catálogo</h2>
        </div>
        <Button onClick={onNew}>
          <Plus className="size-4" />
          Nuevo grupo
        </Button>
      </div>
      {groupForm && (
        <GroupEditor
          form={groupForm}
          loading={loading}
          onCancel={onCancel}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink">{group.name}</h3>
                <p className="text-sm text-ink/60">{group.slug}</p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-semibold',
                  group.is_active ? 'bg-lavender/10 text-lavender' : 'bg-muted text-ink/55',
                )}
              >
                {group.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {group.description && <p className="mt-3 text-sm text-ink/65">{group.description}</p>}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => onEdit(group)}>
                <Pencil className="size-4" />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => onDelete(group)}>
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function GroupEditor({
  form,
  loading,
  onCancel,
  onChange,
  onSubmit,
}: {
  form: GroupForm
  loading: boolean
  onCancel: () => void
  onChange: (form: GroupForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  function update(next: Partial<GroupForm>) {
    onChange({ ...form, ...next })
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-lavender/25 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">
          {form.id ? 'Editar grupo' : `Nuevo grupo: ${groupName(form.kind)}`}
        </h3>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="size-4" />
            Guardar
          </Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          Nombre
          <input
            className={fieldClass}
            required
            value={form.name}
            onChange={(event) => {
              const name = event.target.value
              update({ name, slug: form.id ? form.slug : slugify(name) })
            }}
          />
        </label>
        <label className={labelClass}>
          Slug
          <input
            className={fieldClass}
            required
            value={form.slug}
            onChange={(event) => update({ slug: slugify(event.target.value) })}
          />
        </label>
        <label className={labelClass}>
          Orden
          <input
            className={fieldClass}
            type="number"
            value={form.sort_order}
            onChange={(event) => update({ sort_order: event.target.value })}
          />
        </label>
        <label className={labelClass}>
          Imagen portada ID
          <input
            className={fieldClass}
            value={form.cover_image_id}
            onChange={(event) => update({ cover_image_id: event.target.value })}
          />
        </label>
        <label className={cn(labelClass, 'lg:col-span-2')}>
          Descripción
          <textarea
            className={areaClass}
            value={form.description}
            onChange={(event) => update({ description: event.target.value })}
          />
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <input
          checked={form.is_active}
          type="checkbox"
          onChange={(event) => update({ is_active: event.target.checked })}
        />
        Grupo activo
      </label>
    </form>
  )
}

function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'published' && 'bg-lavender/10 text-lavender',
        status === 'draft' && 'bg-nude text-ink',
        status === 'archived' && 'bg-muted text-ink/60',
      )}
    >
      {statusName(status)}
    </span>
  )
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      title={label}
      aria-label={label}
      type="button"
      onClick={onClick}
      className="grid size-8 place-items-center rounded-md border border-border text-ink/70 transition hover:border-coral hover:text-coral"
    >
      {children}
    </button>
  )
}
