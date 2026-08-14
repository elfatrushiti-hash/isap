import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Check, ChevronRight, Presentation, Sparkles, WandSparkles, X } from 'lucide-react'
import { buildPresentationPayload, createPresentationPlan, moveBuilderSlide, toggleBuilderSlide } from '../../../services/presentationBuilderService.js'

const split = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean)

export default function PresentationBuilder({ open, products = [], presentations = [], assets = [], onClose, onCreate }) {
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [audience, setAudience] = useState('Executive')
  const [objectives, setObjectives] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [plan, setPlan] = useState([])
  const [generated, setGenerated] = useState(false)

  const context = useMemo(() => ({
    company,
    industry,
    audience,
    products: selectedProducts,
    objectives,
    topics: split(objectives)
  }), [audience, company, industry, objectives, selectedProducts])

  if (!open) return null

  const generatePlan = () => {
    const nextPlan = createPresentationPlan({ presentations, assets, context, limit: 12 })
    setPlan(nextPlan)
    setGenerated(true)
    if (!title.trim()) setTitle(`${company || 'Customer'} ${audience || 'Executive'} Deck`)
    if (!description.trim()) setDescription(`AI-assisted presentation focused on ${objectives || 'the current meeting objectives'}.`)
  }

  const create = async () => {
    const payload = buildPresentationPayload({ title, description, context, slides: plan })
    if (!payload.title || !payload.slides.length) return
    await onCreate(payload)
    setCompany('')
    setIndustry('')
    setAudience('Executive')
    setObjectives('')
    setSelectedProducts([])
    setTitle('')
    setDescription('')
    setPlan([])
    setGenerated(false)
    onClose()
  }

  const selectedCount = plan.filter((slide) => slide.selected).length

  return <div className="admin-modal-backdrop admin-builder-backdrop" role="presentation">
    <section className="admin-builder-modal" role="dialog" aria-modal="true" aria-label="AI Presentation Builder">
      <header className="admin-builder-header">
        <div><span>Presentation Studio</span><h2><WandSparkles size={22} />AI Presentation Builder</h2><p>Describe the meeting context. ISAP ranks existing slides and creates an editable draft deck.</p></div>
        <button type="button" className="admin-icon-button" onClick={onClose}><X size={20} /></button>
      </header>

      <div className="admin-builder-layout">
        <aside className="admin-builder-context">
          <div className="admin-builder-section-title"><Sparkles size={17} /><strong>Meeting context</strong></div>
          <label>Company<input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Swisscom" /></label>
          <label>Industry<input value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="e.g. Telecom" /></label>
          <label>Audience<select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Executive</option><option>Finance</option><option>Operations</option><option>Technical</option><option>Procurement</option></select></label>
          <fieldset><legend>Products</legend><div className="admin-builder-product-list">{products.filter((item) => item.status !== 'ARCHIVED').map((product) => <label key={product.id} className="admin-builder-check"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => setSelectedProducts((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} /><span>{product.name}</span></label>)}</div></fieldset>
          <label>Objectives & topics<textarea value={objectives} onChange={(event) => setObjectives(event.target.value)} placeholder="Fraud prevention, credit information, customer onboarding..." /></label>
          <button type="button" className="admin-primary-button admin-builder-generate" onClick={generatePlan}><Sparkles size={17} />Generate slide plan</button>
        </aside>

        <main className="admin-builder-results">
          <div className="admin-builder-results-head"><div><span>Recommended structure</span><strong>{generated ? `${selectedCount} selected slides` : 'No plan generated yet'}</strong></div>{generated && <span className="admin-builder-score">Rule-based AI ranking</span>}</div>
          {!generated ? <div className="admin-builder-empty"><Presentation size={42} /><strong>Create your first AI-assisted deck</strong><p>ISAP will use the current presentation library, slide intelligence and recommendation scores to build the draft.</p></div> : !plan.length ? <div className="admin-builder-empty"><Presentation size={42} /><strong>No matching slides found</strong><p>Add metadata to slides or broaden the meeting context and try again.</p></div> : <div className="admin-builder-slide-list">{plan.map((slide, index) => <article key={slide.id} className={`admin-builder-slide ${slide.selected ? 'selected' : ''}`}>
            <button type="button" className="admin-builder-select" onClick={() => setPlan((current) => toggleBuilderSlide(current, slide.id))}>{slide.selected ? <Check size={16} /> : <span />}</button>
            <div className="admin-builder-slide-number">{index + 1}</div>
            <div className="admin-builder-slide-body"><span>{slide.presentationTitle || 'Presentation'} · {slide.recommendation?.score || 0}% match</span><strong>{slide.title || `Slide ${slide.number}`}</strong><p>{slide.analysis?.summary || slide.subtitle || slide.speakerNotes || 'No slide summary available.'}</p><div className="admin-table-tags">{(slide.products || []).slice(0, 3).map((item) => <span key={item}>{products.find((product) => product.id === item)?.name || item}</span>)}</div></div>
            <div className="admin-builder-order"><button type="button" disabled={index === 0} onClick={() => setPlan((current) => moveBuilderSlide(current, slide.id, 'up'))}><ArrowUp size={15} /></button><button type="button" disabled={index === plan.length - 1} onClick={() => setPlan((current) => moveBuilderSlide(current, slide.id, 'down'))}><ArrowDown size={15} /></button></div>
          </article>)}</div>}
        </main>

        <aside className="admin-builder-output">
          <div className="admin-builder-section-title"><ChevronRight size={17} /><strong>Draft output</strong></div>
          <label>Presentation title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Presentation title" /></label>
          <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Purpose of this deck" /></label>
          <div className="admin-builder-summary"><span>Slides</span><strong>{selectedCount}</strong></div>
          <div className="admin-builder-summary"><span>Audience</span><strong>{audience || '-'}</strong></div>
          <div className="admin-builder-summary"><span>Company</span><strong>{company || '-'}</strong></div>
          <button type="button" className="admin-primary-button" disabled={!title.trim() || selectedCount === 0} onClick={create}><WandSparkles size={17} />Create draft presentation</button>
          <p className="admin-builder-hint">The created deck remains editable. Slides keep references to their original presentation for traceability.</p>
        </aside>
      </div>
    </section>
  </div>
}
