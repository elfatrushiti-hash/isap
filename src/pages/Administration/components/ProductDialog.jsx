import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { PRODUCT_STATUS, productCategories } from '../../../data/products.js'

const emptyForm = {
  name: '',
  shortDescription: '',
  description: '',
  category: productCategories[0],
  status: PRODUCT_STATUS.DRAFT,
  color: '#5B2A86',
  industries: '',
  painPoints: '',
  keywords: ''
}

function toForm(product) {
  if (!product) return emptyForm
  return {
    ...emptyForm,
    ...product,
    industries: product.industries?.join(', ') || '',
    painPoints: product.painPoints?.join(', ') || '',
    keywords: product.keywords?.join(', ') || ''
  }
}

export default function ProductDialog({ open, product, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(toForm(product))
      setError('')
    }
  }, [open, product])

  if (!open) return null

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }
    await onSubmit(form)
  }

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <span className="admin-panel-kicker">Product catalogue</span>
            <h2 id="product-dialog-title">{product ? 'Edit product' : 'Create product'}</h2>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </header>

        <form onSubmit={submit}>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-wide"><span>Name *</span><input value={form.name} onChange={change('name')} autoFocus /></label>
            <label className="admin-field"><span>Category</span><select value={form.category} onChange={change('category')}>{productCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="admin-field"><span>Status</span><select value={form.status} onChange={change('status')}><option value={PRODUCT_STATUS.ACTIVE}>Active</option><option value={PRODUCT_STATUS.DRAFT}>Draft</option><option value={PRODUCT_STATUS.ARCHIVED}>Archived</option></select></label>
            <label className="admin-field admin-field-wide"><span>Short description</span><input value={form.shortDescription} onChange={change('shortDescription')} /></label>
            <label className="admin-field admin-field-wide"><span>Description</span><textarea rows="4" value={form.description} onChange={change('description')} /></label>
            <label className="admin-field"><span>Brand colour</span><div className="admin-color-field"><input type="color" value={form.color} onChange={change('color')} /><input value={form.color} onChange={change('color')} /></div></label>
            <label className="admin-field"><span>Industries</span><input value={form.industries} onChange={change('industries')} placeholder="Banking, Retail" /></label>
            <label className="admin-field"><span>Pain points</span><input value={form.painPoints} onChange={change('painPoints')} placeholder="Manual decisions, Fraud" /></label>
            <label className="admin-field"><span>Keywords</span><input value={form.keywords} onChange={change('keywords')} placeholder="risk, onboarding" /></label>
          </div>
          {error ? <p className="admin-form-error">{error}</p> : null}
          <footer>
            <button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-primary-button">{product ? 'Save changes' : 'Create product'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
