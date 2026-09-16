import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function AssetDialog({ open, asset, products, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', tags: '', products: [] })

  useEffect(() => {
    if (!asset) return
    setForm({
      title: asset.title || '',
      description: asset.description || '',
      tags: (asset.tags || []).join(', '),
      products: asset.products || []
    })
  }, [asset])

  if (!open || !asset) return null

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const toggleProduct = (productId) => setField('products', form.products.includes(productId) ? form.products.filter((id) => id !== productId) : [...form.products, productId])

  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      products: form.products
    })
  }

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="asset-dialog-title">
        <header>
          <div><span className="admin-eyebrow">Asset details</span><h2 id="asset-dialog-title">Edit {asset.filename}</h2></div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <form onSubmit={submit}>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-wide"><span>Display title</span><input required value={form.title} onChange={(event) => setField('title', event.target.value)} /></label>
            <label className="admin-field admin-field-wide"><span>Description</span><textarea rows="4" value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Describe when and how this asset should be used." /></label>
            <label className="admin-field admin-field-wide"><span>Tags</span><input value={form.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="executive, credit information, banking" /><small>Separate tags with commas.</small></label>
            <fieldset className="admin-field admin-field-wide admin-product-selector">
              <legend>Assigned products</legend>
              <div>{products.filter((product) => product.status !== 'ARCHIVED').map((product) => <label key={product.id}><input type="checkbox" checked={form.products.includes(product.id)} onChange={() => toggleProduct(product.id)} /><span>{product.name}</span></label>)}</div>
            </fieldset>
          </div>
          <footer><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button">Save changes</button></footer>
        </form>
      </section>
    </div>
  )
}
