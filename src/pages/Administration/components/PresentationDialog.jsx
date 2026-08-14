import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { PRESENTATION_STATUS } from '../../../data/presentations.js'

const blank = {
  title: '', description: '', version: '1.0', status: PRESENTATION_STATUS.DRAFT,
  products: [], assets: [], industries: '', audiences: '', tags: '', slideCount: 0
}

export default function PresentationDialog({ open, presentation, products, assets, onClose, onSubmit }) {
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setForm(presentation ? {
      ...presentation,
      products: presentation.products || [],
      assets: presentation.assets || [],
      industries: (presentation.industries || []).join(', '),
      audiences: (presentation.audiences || []).join(', '),
      tags: (presentation.tags || []).join(', ')
    } : blank)
    setError('')
  }, [open, presentation])

  if (!open) return null
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggle = (key, id) => setForm((current) => ({
    ...current,
    [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id]
  }))

  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return setError('Presentation title is required.')
    onSubmit(form)
  }

  const presentationAssets = assets.filter((asset) => asset.type === 'PRESENTATION' || asset.filename?.toLowerCase().endsWith('.pptx'))

  return <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="admin-dialog admin-presentation-dialog" role="dialog" aria-modal="true">
      <header><div><span className="admin-eyebrow">Presentation library</span><h2>{presentation ? 'Edit presentation' : 'Create presentation'}</h2></div><button type="button" className="admin-icon-button" onClick={onClose}><X size={18} /></button></header>
      <form onSubmit={submit}>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-wide"><span>Title</span><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Executive Credit Information Overview" /></label>
          <label className="admin-field admin-field-wide"><span>Description</span><textarea rows="3" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Purpose and intended use of this presentation" /></label>
          <label className="admin-field"><span>Version</span><input value={form.version} onChange={(e) => set('version', e.target.value)} /></label>
          <label className="admin-field"><span>Status</span><select value={form.status} onChange={(e) => set('status', e.target.value)}>{Object.values(PRESENTATION_STATUS).map((status) => <option key={status} value={status}>{status[0] + status.slice(1).toLowerCase()}</option>)}</select></label>
          <label className="admin-field"><span>Slide count</span><input type="number" min="0" value={form.slideCount} onChange={(e) => set('slideCount', e.target.value)} /></label>
          <label className="admin-field"><span>Industries</span><input value={form.industries} onChange={(e) => set('industries', e.target.value)} placeholder="Banking, Telecom" /></label>
          <label className="admin-field"><span>Audiences</span><input value={form.audiences} onChange={(e) => set('audiences', e.target.value)} placeholder="CFO, Risk Director" /></label>
          <label className="admin-field"><span>Tags</span><input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Executive, Switzerland" /></label>
          <fieldset className="admin-product-selector admin-field-wide"><legend>Products</legend><div>{products.map((product) => <label key={product.id}><input type="checkbox" checked={form.products.includes(product.id)} onChange={() => toggle('products', product.id)} />{product.name}</label>)}</div></fieldset>
          <fieldset className="admin-product-selector admin-field-wide"><legend>Source assets</legend><div>{presentationAssets.length ? presentationAssets.map((asset) => <label key={asset.id}><input type="checkbox" checked={form.assets.includes(asset.id)} onChange={() => toggle('assets', asset.id)} />{asset.title}</label>) : <small>No PowerPoint assets available yet.</small>}</div></fieldset>
        </div>
        {error && <p className="admin-form-error">{error}</p>}
        <footer><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button">{presentation ? 'Save changes' : 'Create presentation'}</button></footer>
      </form>
    </section>
  </div>
}
