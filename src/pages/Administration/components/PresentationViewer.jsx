import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Maximize2, Minus, PanelLeftClose, PanelLeftOpen, Plus, Save, Search, Star, X } from 'lucide-react'
import { createViewerSlides, getViewerState, saveViewerState } from '../../../services/presentationViewerService.js'
import { searchSlides } from '../../../services/slideService.js'

const statusLabels = { DRAFT: 'Draft', ACTIVE: 'Active', ARCHIVED: 'Archived' }
const splitValues = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)
const joinValues = (value) => Array.isArray(value) ? value.join(', ') : ''

export default function PresentationViewer({ open, presentation, products = [], assets = [], onClose, onToggleFavorite, onUpdateSlide }) {
  const linkedAssets = useMemo(() => assets.filter((asset) => presentation?.assets?.includes(asset.id)), [assets, presentation])
  const linkedProducts = useMemo(() => products.filter((product) => presentation?.products?.includes(product.id)), [products, presentation])
  const enrichedPresentation = useMemo(() => ({ ...presentation, productNames: linkedProducts.map((item) => item.name) }), [presentation, linkedProducts])
  const slides = useMemo(() => createViewerSlides(enrichedPresentation, linkedAssets), [enrichedPresentation, linkedAssets])
  const initialState = useMemo(() => presentation?.id ? getViewerState(presentation.id) : getViewerState('unknown'), [presentation?.id])
  const [slideIndex, setSlideIndex] = useState(initialState.slideIndex)
  const [zoom, setZoom] = useState(initialState.zoom)
  const [sidebarOpen, setSidebarOpen] = useState(initialState.sidebarOpen)
  const [infoOpen, setInfoOpen] = useState(initialState.infoOpen)
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('ALL')
  const [industryFilter, setIndustryFilter] = useState('ALL')
  const [topicFilter, setTopicFilter] = useState('ALL')
  const [draft, setDraft] = useState(null)

  const industries = useMemo(() => [...new Set(slides.flatMap((slide) => slide.industries || []))].sort(), [slides])
  const topics = useMemo(() => [...new Set(slides.flatMap((slide) => slide.topics || []))].sort(), [slides])
  const filteredSlides = useMemo(() => searchSlides(slides, { query, product: productFilter, industry: industryFilter, topic: topicFilter }), [slides, query, productFilter, industryFilter, topicFilter])

  useEffect(() => {
    if (!open || !presentation?.id) return
    const state = getViewerState(presentation.id)
    setSlideIndex(Math.min(state.slideIndex, Math.max(slides.length - 1, 0)))
    setZoom(state.zoom)
    setSidebarOpen(state.sidebarOpen)
    setInfoOpen(state.infoOpen)
    setQuery('')
    setProductFilter('ALL')
    setIndustryFilter('ALL')
    setTopicFilter('ALL')
  }, [open, presentation?.id, slides.length])

  useEffect(() => {
    if (!open || !presentation?.id) return
    saveViewerState(presentation.id, { slideIndex, zoom, sidebarOpen, infoOpen })
  }, [open, presentation?.id, slideIndex, zoom, sidebarOpen, infoOpen])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setSlideIndex((current) => Math.min(slides.length - 1, current + 1))
      if (event.key === 'ArrowLeft') setSlideIndex((current) => Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, slides.length])

  const currentSlide = slides[slideIndex] || slides[0]

  useEffect(() => {
    if (!currentSlide) return
    setDraft({
      title: currentSlide.title || '',
      subtitle: currentSlide.subtitle || '',
      notes: currentSlide.notes || '',
      speakerNotes: currentSlide.speakerNotes || '',
      products: currentSlide.products || [],
      industries: joinValues(currentSlide.industries),
      topics: joinValues(currentSlide.topics),
      keywords: joinValues(currentSlide.keywords),
      tags: joinValues(currentSlide.tags),
      summary: currentSlide.analysis?.summary || '',
      painPoints: joinValues(currentSlide.analysis?.painPoints),
      objections: joinValues(currentSlide.analysis?.objections),
      references: joinValues(currentSlide.analysis?.references)
    })
  }, [currentSlide?.id, currentSlide?.updatedAt])

  if (!open || !presentation || !currentSlide || !draft) return null

  const changeZoom = (delta) => setZoom((current) => Math.min(150, Math.max(50, current + delta)))
  const selectSlide = (slide) => {
    const index = slides.findIndex((item) => item.id === slide.id)
    if (index >= 0) setSlideIndex(index)
  }
  const saveSlide = () => onUpdateSlide?.(presentation.id, currentSlide.id, {
    title: draft.title.trim() || currentSlide.title,
    subtitle: draft.subtitle.trim(),
    notes: draft.notes.trim(),
    speakerNotes: draft.speakerNotes.trim(),
    products: draft.products,
    industries: splitValues(draft.industries),
    topics: splitValues(draft.topics),
    keywords: splitValues(draft.keywords),
    tags: splitValues(draft.tags),
    analysis: {
      summary: draft.summary.trim(),
      painPoints: splitValues(draft.painPoints),
      objections: splitValues(draft.objections),
      references: splitValues(draft.references)
    }
  })

  return <div className="presentation-viewer-overlay" role="dialog" aria-modal="true" aria-label={`View ${presentation.title}`}>
    <div className="presentation-viewer-shell">
      <header className="presentation-viewer-header">
        <div><span className="admin-eyebrow">Slide intelligence</span><strong>{presentation.title}</strong><small>Slide {slideIndex + 1} of {slides.length} · v{presentation.version}</small></div>
        <div className="presentation-viewer-header-actions">
          <button type="button" onClick={() => onToggleFavorite?.(presentation.id)} title="Toggle favorite"><Star size={18} fill={presentation.favorite ? 'currentColor' : 'none'} /></button>
          <button type="button" onClick={() => setInfoOpen((value) => !value)} title="Toggle intelligence"><FileText size={18} /></button>
          <button type="button" onClick={onClose} title="Close viewer"><X size={20} /></button>
        </div>
      </header>

      <div className={`presentation-viewer-layout ${sidebarOpen ? '' : 'sidebar-collapsed'} ${infoOpen ? '' : 'info-collapsed'}`}>
        <aside className="presentation-viewer-slides">
          <div className="presentation-viewer-aside-title"><strong>Slide explorer</strong><button type="button" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17} /></button></div>
          <div className="slide-intelligence-filters">
            <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search slides..." /></label>
            <select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}><option value="ALL">All products</option>{linkedProducts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}><option value="ALL">All industries</option>{industries.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)}><option value="ALL">All topics</option>{topics.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <small>{filteredSlides.length} of {slides.length} slides</small>
          </div>
          <div className="presentation-viewer-thumbnail-list">
            {filteredSlides.map((slide) => <button key={slide.id} type="button" className={slide.id === currentSlide.id ? 'active' : ''} onClick={() => selectSlide(slide)}>
              <span>{slide.number}</span><div className="presentation-viewer-mini-slide"><strong>{slide.title}</strong><small>{slide.subtitle}</small></div>
              <div className="slide-intelligence-mini-tags">{(slide.topics || []).slice(0, 2).map((item) => <em key={item}>{item}</em>)}</div>
            </button>)}
            {!filteredSlides.length && <div className="slide-intelligence-empty">No slides match the current filters.</div>}
          </div>
        </aside>

        <main className="presentation-viewer-stage">
          {!sidebarOpen && <button type="button" className="presentation-viewer-open-sidebar" onClick={() => setSidebarOpen(true)}><PanelLeftOpen size={18} /></button>}
          <div className="presentation-viewer-canvas-wrap"><article className="presentation-viewer-canvas" style={{ transform: `scale(${zoom / 100})` }}><div className="presentation-viewer-slide-brand">ISAP · Intrum Sales Advisory Platform</div><div className="presentation-viewer-slide-content"><span>{String(currentSlide.number).padStart(2, '0')}</span><h2>{currentSlide.title}</h2><p>{currentSlide.subtitle}</p>{currentSlide.assetTitle && <small>Linked source: {currentSlide.assetTitle}</small>}</div><div className="presentation-viewer-slide-footer">{currentSlide.industries?.join(' · ') || presentation.industries?.join(' · ') || 'Sales presentation'}</div></article></div>
          <div className="presentation-viewer-controls"><button type="button" disabled={slideIndex === 0} onClick={() => setSlideIndex((current) => Math.max(0, current - 1))}><ChevronLeft size={18} />Previous</button><div className="presentation-viewer-zoom"><button type="button" onClick={() => changeZoom(-25)}><Minus size={16} /></button><span>{zoom}%</span><button type="button" onClick={() => changeZoom(25)}><Plus size={16} /></button><button type="button" onClick={() => setZoom(100)} title="Reset zoom"><Maximize2 size={16} /></button></div><button type="button" disabled={slideIndex === slides.length - 1} onClick={() => setSlideIndex((current) => Math.min(slides.length - 1, current + 1))}>Next<ChevronRight size={18} /></button></div>
          <section className="presentation-viewer-notes"><span>Speaker notes</span><p>{currentSlide.speakerNotes || currentSlide.notes || 'No speaker notes available.'}</p></section>
        </main>

        <aside className="presentation-viewer-info slide-intelligence-panel">
          <div className="presentation-viewer-aside-title"><strong>Slide intelligence</strong><button type="button" onClick={() => setInfoOpen(false)}><X size={17} /></button></div>
          <div className="slide-intelligence-form">
            <label>Title<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></label>
            <label>Subtitle<textarea value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} rows="2" /></label>
            <label>Products<div className="slide-intelligence-product-list">{products.map((item) => <button key={item.id} type="button" className={draft.products.includes(item.id) ? 'active' : ''} onClick={() => setDraft((current) => ({ ...current, products: current.products.includes(item.id) ? current.products.filter((id) => id !== item.id) : [...current.products, item.id] }))}>{item.name}</button>)}</div></label>
            <label>Industries<input value={draft.industries} onChange={(event) => setDraft((current) => ({ ...current, industries: event.target.value }))} placeholder="Banking, Telecom" /></label>
            <label>Topics<input value={draft.topics} onChange={(event) => setDraft((current) => ({ ...current, topics: event.target.value }))} /></label>
            <label>Keywords<input value={draft.keywords} onChange={(event) => setDraft((current) => ({ ...current, keywords: event.target.value }))} /></label>
            <label>Tags<input value={draft.tags} onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))} /></label>
            <label>AI summary<textarea value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} rows="3" /></label>
            <label>Pain points<input value={draft.painPoints} onChange={(event) => setDraft((current) => ({ ...current, painPoints: event.target.value }))} /></label>
            <label>Objections<input value={draft.objections} onChange={(event) => setDraft((current) => ({ ...current, objections: event.target.value }))} /></label>
            <label>References<input value={draft.references} onChange={(event) => setDraft((current) => ({ ...current, references: event.target.value }))} /></label>
            <label>Speaker notes<textarea value={draft.speakerNotes} onChange={(event) => setDraft((current) => ({ ...current, speakerNotes: event.target.value }))} rows="3" /></label>
            <button type="button" className="admin-primary-button slide-intelligence-save" onClick={saveSlide}><Save size={16} />Save slide metadata</button>
          </div>
          <dl><dt>Status</dt><dd>{statusLabels[presentation.status] || presentation.status}</dd><dt>Confidence</dt><dd>{Math.round((currentSlide.analysis?.confidence || 0) * 100)}%</dd><dt>Updated</dt><dd>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(currentSlide.updatedAt || presentation.updatedAt))}</dd></dl>
        </aside>
      </div>
    </div>
  </div>
}
