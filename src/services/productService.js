import { PRODUCT_STATUS } from '../data/products.js'

const clone = (value) => JSON.parse(JSON.stringify(value))
const now = () => new Date().toISOString()

function normaliseList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

export async function listProducts(products = []) {
  return clone(products)
}

export async function createProduct(products = [], input) {
  const timestamp = now()
  const product = {
    id: `product-${Date.now()}`,
    name: input.name?.trim() || 'Untitled product',
    shortDescription: input.shortDescription?.trim() || '',
    description: input.description?.trim() || '',
    category: input.category || 'Consulting',
    status: input.status || PRODUCT_STATUS.DRAFT,
    color: input.color || '#5B2A86',
    icon: input.icon || 'Boxes',
    industries: normaliseList(input.industries),
    painPoints: normaliseList(input.painPoints),
    keywords: normaliseList(input.keywords),
    assets: [],
    presentations: [],
    createdAt: timestamp,
    updatedAt: timestamp
  }
  return [product, ...clone(products)]
}

export async function updateProduct(products = [], productId, changes) {
  const prepared = {
    ...changes,
    industries: changes.industries === undefined ? undefined : normaliseList(changes.industries),
    painPoints: changes.painPoints === undefined ? undefined : normaliseList(changes.painPoints),
    keywords: changes.keywords === undefined ? undefined : normaliseList(changes.keywords)
  }
  Object.keys(prepared).forEach((key) => prepared[key] === undefined && delete prepared[key])

  return clone(products).map((product) => product.id === productId
    ? { ...product, ...prepared, updatedAt: now() }
    : product)
}

export async function archiveProduct(products = [], productId) {
  return updateProduct(products, productId, { status: PRODUCT_STATUS.ARCHIVED })
}

export async function restoreProduct(products = [], productId) {
  return updateProduct(products, productId, { status: PRODUCT_STATUS.ACTIVE })
}

export async function deleteProduct(products = [], productId) {
  return clone(products).filter((product) => product.id !== productId)
}
