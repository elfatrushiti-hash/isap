import { useMemo, useState } from 'react'
import { Archive, Edit3, Eye, Grid2X2, List, Plus, Presentation as PresentationIcon, RotateCcw, Search, Star, Trash2 } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { PRESENTATION_STATUS, PRESENTATION_VIEW } from '../../../data/presentations.js'
import PresentationDialog from '../components/PresentationDialog.jsx'
import PresentationViewer from '../components/PresentationViewer.jsx'

const statusLabels = { DRAFT: 'Draft', ACTIVE: 'Active', ARCHIVED: 'Archived' }

export default function Presentations() {
  const { presentations, products, assets, addPresentation, editPresentation, archivePresentationById, restorePresentationById, deletePresentationById, togglePresentationFavoriteById } = useIsapStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [product, setProduct] = useState('ALL')
  const [view, setView] = useState(PRESENTATION_VIEW.GRID)
  const [editing, setEditing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewing, setViewing] = useState(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...presentations]
      .filter((item) => status === 'ALL' || item.status === status)
      .filter((item) => product === 'ALL' || item.products?.includes(product))
      .filter((item) => !needle || [item.title, item.description, ...(item.industries || []), ...(item.audiences || []), ...(item.tags || [])].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [presentations, product, query, status])

  const openCreate = () => { setEditing(null); setDialogOpen(true) }
  const openEdit = (item) => { setEditing(item); setDialogOpen(true) }
  const submit = async (values) => {
    if (editing) await editPresentation(editing.id, values)
    else await addPresentation(values)
    setDialogOpen(false)
    setEditing(null)
  }

  const actions = (item) => <div className="admin-row-actions">
    <button type="button" onClick={() => setViewing(item)} title="Open viewer"><Eye size={16} /></button>
    <button type="button" onClick={() => togglePresentationFavoriteById(item.id)} title="Favorite"><Star size={16} fill={item.favorite ? 'currentColor' : 'none'} /></button>
    <button type="button" onClick={() => openEdit(item)} title="Edit"><Edit3 size={16} /></button>
    {item.status === PRESENTATION_STATUS.ARCHIVED ? <button type="button" onClick={() => restorePresentationById(item.id)} title="Restore"><RotateCcw size={16} /></button> : <button type="button" onClick={() => archivePresentationById(item.id)} title="Archive"><Archive size={16} /></button>}
    <button type="button" className="danger" onClick={() => window.confirm(`Delete ${item.title} permanently?`) && deletePresentationById(item.id)} title="Delete"><Trash2 size={16} /></button>
  </div>

  return <div className="admin-view-stack">
    <div className="admin-toolbar"><div><span>Presentation library</span><small>{presentations.length} presentations · {presentations.filter((item) => item.status === PRESENTATION_STATUS.ACTIVE).length} active</small></div><button type="button" className="admin-primary-button" onClick={openCreate}><Plus size={17} />New presentation</button></div>
    <section className="admin-panel admin-product-panel">
      <div className="admin-filter-bar admin-presentation-filter-bar">
        <label className="admin-search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search presentations..." /></label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">All statuses</option>{Object.values(PRESENTATION_STATUS).map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select>
        <select value={product} onChange={(e) => setProduct(e.target.value)}><option value="ALL">All products</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <div className="admin-view-toggle"><button type="button" className={view === PRESENTATION_VIEW.GRID ? 'active' : ''} onClick={() => setView(PRESENTATION_VIEW.GRID)}><Grid2X2 size={16} /></button><button type="button" className={view === PRESENTATION_VIEW.LIST ? 'active' : ''} onClick={() => setView(PRESENTATION_VIEW.LIST)}><List size={16} /></button></div>
      </div>
      {!filtered.length ? <div className="admin-empty-state"><PresentationIcon size={32} /><strong>No presentations found</strong><p>Create a presentation or adjust the filters.</p></div> : view === PRESENTATION_VIEW.GRID ? <div className="admin-presentation-grid">{filtered.map((item) => {
        const linkedProducts = products.filter((productItem) => item.products?.includes(productItem.id))
        return <article key={item.id} className="admin-presentation-card"><button type="button" className="admin-presentation-cover admin-presentation-open" onClick={() => setViewing(item)} aria-label={`Open ${item.title}`}><PresentationIcon size={34} /><span>v{item.version}</span>{item.favorite && <Star size={18} fill="currentColor" />}</button><div className="admin-presentation-body"><div className="admin-presentation-title-row"><div><strong>{item.title}</strong><small>{item.description || 'No description'}</small></div><span className={`admin-status-badge status-${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span></div><div className="admin-presentation-meta"><span>{item.slideCount || 0} slides</span><span>{item.assets?.length || 0} assets</span><span>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.updatedAt))}</span></div><div className="admin-table-tags">{linkedProducts.slice(0, 3).map((productItem) => <span key={productItem.id}>{productItem.name}</span>)}{!linkedProducts.length && <small>Unassigned</small>}</div><footer>{actions(item)}</footer></div></article>
      })}</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Presentation</th><th>Status</th><th>Products</th><th>Slides</th><th>Updated</th><th className="admin-actions-column">Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><div className="admin-product-cell"><span className="admin-asset-icon"><PresentationIcon size={18} /></span><div><strong>{item.title}</strong><small>{item.description || `Version ${item.version}`}</small></div></div></td><td><span className={`admin-status-badge status-${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span></td><td><div className="admin-table-tags">{products.filter((productItem) => item.products?.includes(productItem.id)).slice(0, 2).map((productItem) => <span key={productItem.id}>{productItem.name}</span>)}</div></td><td>{item.slideCount || 0}</td><td>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.updatedAt))}</td><td>{actions(item)}</td></tr>)}</tbody></table></div>}
    </section>
    <PresentationDialog open={dialogOpen} presentation={editing} products={products} assets={assets} onClose={() => { setDialogOpen(false); setEditing(null) }} onSubmit={submit} />
    <PresentationViewer open={Boolean(viewing)} presentation={viewing} products={products} assets={assets} onClose={() => setViewing(null)} onToggleFavorite={togglePresentationFavoriteById} />
  </div>
}
