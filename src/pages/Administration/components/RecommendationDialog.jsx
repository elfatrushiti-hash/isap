import { useEffect, useMemo, useState } from 'react'
import { BrainCircuit, Building2, FileText, Presentation, Search, Sparkles, X } from 'lucide-react'
import { getTopRecommendations } from '../../../services/recommendationService.js'

const splitValues = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean)

function Score({ value }) {
  return <span className={`recommendation-score ${value >= 75 ? 'high' : value >= 50 ? 'medium' : 'low'}`}>{value}%</span>
}

export default function RecommendationDialog({ open, products = [], presentations = [], assets = [], initialContext = {}, onClose, onOpenPresentation, onSaveRun }) {
  const [context, setContext] = useState({ company: '', industry: '', products: [], topics: '', objectives: '', audience: '' })
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    if (!open) return
    setContext({ company: '', industry: '', products: [], topics: '', objectives: '', audience: '', ...initialContext })
    setHasRun(false)
  }, [open, initialContext])

  const recommendationContext = useMemo(() => ({ ...context, topics: splitValues(context.topics) }), [context])
  const results = useMemo(() => getTopRecommendations({ presentations, assets, context: recommendationContext }), [presentations, assets, recommendationContext])

  if (!open) return null

  const runRecommendations = () => {
    setHasRun(true)
    onSaveRun?.(recommendationContext, results)
  }

  const toggleProduct = (productId) => setContext((current) => ({
    ...current,
    products: current.products.includes(productId) ? current.products.filter((id) => id !== productId) : [...current.products, productId]
  }))

  return <div className="admin-dialog-backdrop recommendation-dialog-backdrop" role="dialog" aria-modal="true" aria-label="AI presentation recommendations">
    <div className="admin-dialog recommendation-dialog">
      <header><div><span className="admin-eyebrow">Delivery 2.4</span><h2>AI Presentation Recommendations</h2><p>Build a meeting context and let ISAP rank presentations, slides and assets.</p></div><button type="button" className="admin-icon-button" onClick={onClose}><X size={19} /></button></header>

      <div className="recommendation-dialog-layout">
        <aside className="recommendation-context-panel">
          <div className="recommendation-section-title"><BrainCircuit size={18} /><div><strong>Meeting context</strong><small>The scoring engine uses these signals.</small></div></div>
          <label><span>Company</span><div className="recommendation-input"><Building2 size={16} /><input value={context.company} onChange={(event) => setContext((current) => ({ ...current, company: event.target.value }))} placeholder="e.g. Swisscom" /></div></label>
          <label><span>Industry</span><input value={context.industry} onChange={(event) => setContext((current) => ({ ...current, industry: event.target.value }))} placeholder="e.g. Telecom" /></label>
          <label><span>Audience</span><input value={context.audience} onChange={(event) => setContext((current) => ({ ...current, audience: event.target.value }))} placeholder="e.g. Executive board" /></label>
          <label><span>Topics</span><input value={context.topics} onChange={(event) => setContext((current) => ({ ...current, topics: event.target.value }))} placeholder="Fraud, Credit Information" /></label>
          <label><span>Objectives</span><textarea rows="3" value={context.objectives} onChange={(event) => setContext((current) => ({ ...current, objectives: event.target.value }))} placeholder="What should the meeting achieve?" /></label>
          <div className="recommendation-product-picker"><span>Products</span><div>{products.filter((item) => item.status !== 'ARCHIVED').map((product) => <button key={product.id} type="button" className={context.products.includes(product.id) ? 'active' : ''} onClick={() => toggleProduct(product.id)}>{product.name}</button>)}</div></div>
          <button type="button" className="admin-primary-button recommendation-run-button" onClick={runRecommendations}><Sparkles size={17} />Generate recommendations</button>
        </aside>

        <section className="recommendation-results-panel">
          {!hasRun ? <div className="recommendation-placeholder"><Search size={34} /><strong>Ready to recommend</strong><p>Add at least one meeting signal, then generate a ranked selection.</p></div> : <>
            <div className="recommendation-results-summary"><div><strong>{results.presentations.length}</strong><span>Presentations</span></div><div><strong>{results.slides.length}</strong><span>Slides</span></div><div><strong>{results.assets.length}</strong><span>Assets</span></div></div>

            <div className="recommendation-group"><div className="recommendation-group-heading"><Presentation size={17} /><strong>Top presentations</strong></div>{results.presentations.length ? results.presentations.map((item) => <article key={item.id} className="recommendation-card"><div><strong>{item.title}</strong><small>{item.description || 'No description'}</small><p>{item.recommendation.reasons.join(' · ')}</p></div><div><Score value={item.recommendation.score} /><button type="button" onClick={() => onOpenPresentation?.(item.id)}>Open</button></div></article>) : <p className="recommendation-empty">No matching presentations yet.</p>}</div>

            <div className="recommendation-group"><div className="recommendation-group-heading"><Sparkles size={17} /><strong>Recommended slides</strong></div>{results.slides.length ? results.slides.map((item) => <article key={item.id} className="recommendation-card compact"><div><strong>{item.presentationTitle} · Slide {item.number}</strong><small>{item.title}</small><p>{item.recommendation.reasons.join(' · ')}</p></div><Score value={item.recommendation.score} /></article>) : <p className="recommendation-empty">No matching slides yet.</p>}</div>

            <div className="recommendation-group"><div className="recommendation-group-heading"><FileText size={17} /><strong>Related assets</strong></div>{results.assets.length ? results.assets.map((item) => <article key={item.id} className="recommendation-card compact"><div><strong>{item.title || item.filename}</strong><small>{item.type} · v{item.version}</small><p>{item.recommendation.reasons.join(' · ')}</p></div><Score value={item.recommendation.score} /></article>) : <p className="recommendation-empty">No matching assets yet.</p>}</div>
          </>}
        </section>
      </div>
    </div>
  </div>
}
