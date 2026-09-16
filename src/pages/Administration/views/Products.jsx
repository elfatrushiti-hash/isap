import { useMemo, useState } from 'react'
import { Archive, Boxes, Edit3, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { PRODUCT_STATUS, productCategories } from '../../../data/products.js'
import ProductDialog from '../components/ProductDialog.jsx'

const statusLabels = {
  [PRODUCT_STATUS.ACTIVE]: 'Active',
  [PRODUCT_STATUS.DRAFT]: 'Draft',
  [PRODUCT_STATUS.ARCHIVED]: 'Archived'
}

export default function Products() {
  const { products, addProduct, editProduct, archiveProductById, restoreProductById, deleteProductById } = useIsapStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState('updated')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()
    return [...products]
      .filter((product) => status === 'ALL' || product.status === status)
      .filter((product) => category === 'ALL' || product.category === category)
      .filter((product) => {
        if (!normalisedQuery) return true
        const haystack = [product.name, product.shortDescription, product.description, ...(product.keywords || [])].join(' ').toLowerCase()
        return haystack.includes(normalisedQuery)
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name)
        if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
  }, [products, query, status, category, sort])

  const openCreate = () => { setEditingProduct(null); setDialogOpen(true) }
  const openEdit = (product) => { setEditingProduct(product); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setEditingProduct(null) }
  const submit = async (form) => {
    if (editingProduct) await editProduct(editingProduct.id, form)
    else await addProduct(form)
    closeDialog()
  }

  return (
    <div className="admin-view-stack">
      <div className="admin-toolbar">
        <div><span>Product catalogue</span><small>{products.length} products · {products.filter((item) => item.status === PRODUCT_STATUS.ACTIVE).length} active</small></div>
        <button type="button" className="admin-primary-button" onClick={openCreate}><Plus size={16} /> New product</button>
      </div>

      <section className="admin-panel admin-product-panel">
        <div className="admin-filter-bar">
          <label className="admin-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value={PRODUCT_STATUS.ACTIVE}>Active</option><option value={PRODUCT_STATUS.DRAFT}>Draft</option><option value={PRODUCT_STATUS.ARCHIVED}>Archived</option></select>
          <select value={category} onChange={(event) => setCategory(event.target.value)}><option value="ALL">All categories</option>{productCategories.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="updated">Recently updated</option><option value="created">Newest</option><option value="name">A–Z</option></select>
        </div>

        {filteredProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Content</th><th>Updated</th><th className="admin-actions-column">Actions</th></tr></thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><div className="admin-product-cell"><span className="admin-product-swatch" style={{ background: product.color }}><Boxes size={17} /></span><div><strong>{product.name}</strong><small>{product.shortDescription || 'No short description'}</small></div></div></td>
                    <td>{product.category}</td>
                    <td><span className={`admin-status-badge status-${product.status.toLowerCase()}`}>{statusLabels[product.status]}</span></td>
                    <td><span className="admin-content-count">{product.assets?.length || 0} assets</span><span className="admin-content-count">{product.presentations?.length || 0} presentations</span></td>
                    <td>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(product.updatedAt))}</td>
                    <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(product)} title="Edit"><Edit3 size={16} /></button>{product.status === PRODUCT_STATUS.ARCHIVED ? <button type="button" onClick={() => restoreProductById(product.id)} title="Restore"><RotateCcw size={16} /></button> : <button type="button" onClick={() => archiveProductById(product.id)} title="Archive"><Archive size={16} /></button>}<button type="button" className="danger" onClick={() => window.confirm(`Delete ${product.name} permanently?`) && deleteProductById(product.id)} title="Delete"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="admin-empty-state"><strong>No products found</strong><p>Adjust the search or filters, or create a new product.</p></div>}
      </section>

      <ProductDialog open={dialogOpen} product={editingProduct} onClose={closeDialog} onSubmit={submit} />
    </div>
  )
}
