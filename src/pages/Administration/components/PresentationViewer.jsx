import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Maximize2, Minus, PanelLeftClose, PanelLeftOpen, Plus, Star, X } from 'lucide-react'
import { createViewerSlides, getViewerState, saveViewerState } from '../../../services/presentationViewerService.js'

const statusLabels = { DRAFT: 'Draft', ACTIVE: 'Active', ARCHIVED: 'Archived' }

export default function PresentationViewer({ open, presentation, products = [], assets = [], onClose, onToggleFavorite }) {
  const linkedAssets = useMemo(() => assets.filter((asset) => presentation?.assets?.includes(asset.id)), [assets, presentation])
  const linkedProducts = useMemo(() => products.filter((product) => presentation?.products?.includes(product.id)), [products, presentation])
  const enrichedPresentation = useMemo(() => ({ ...presentation, productNames: linkedProducts.map((item) => item.name) }), [presentation, linkedProducts])
  const slides = useMemo(() => createViewerSlides(enrichedPresentation, linkedAssets), [enrichedPresentation, linkedAssets])
  const initialState = useMemo(() => presentation?.id ? getViewerState(presentation.id) : getViewerState('unknown'), [presentation?.id])
  const [slideIndex, setSlideIndex] = useState(initialState.slideIndex)
  const [zoom, setZoom] = useState(initialState.zoom)
  const [sidebarOpen, setSidebarOpen] = useState(initialState.sidebarOpen)
  const [infoOpen, setInfoOpen] = useState(initialState.infoOpen)

  useEffect(() => {
    if (!open || !presentation?.id) return
    const state = getViewerState(presentation.id)
    setSlideIndex(Math.min(state.slideIndex, Math.max(slides.length - 1, 0)))
    setZoom(state.zoom)
    setSidebarOpen(state.sidebarOpen)
    setInfoOpen(state.infoOpen)
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

  if (!open || !presentation) return null
  const currentSlide = slides[slideIndex] || slides[0]

  const changeZoom = (delta) => setZoom((current) => Math.min(150, Math.max(50, current + delta)))

  return <div className="presentation-viewer-overlay" role="dialog" aria-modal="true" aria-label={`View ${presentation.title}`}>
    <div className="presentation-viewer-shell">
      <header className="presentation-viewer-header">
        <div>
          <span className="admin-eyebrow">Presentation viewer</span>
          <strong>{presentation.title}</strong>
          <small>Slide {slideIndex + 1} of {slides.length} · v{presentation.version}</small>
        </div>
        <div className="presentation-viewer-header-actions">
          <button type="button" onClick={() => onToggleFavorite?.(presentation.id)} title="Toggle favorite"><Star size={18} fill={presentation.favorite ? 'currentColor' : 'none'} /></button>
          <button type="button" onClick={() => setInfoOpen((value) => !value)} title="Toggle information"><FileText size={18} /></button>
          <button type="button" onClick={onClose} title="Close viewer"><X size={20} /></button>
        </div>
      </header>

      <div className={`presentation-viewer-layout ${sidebarOpen ? '' : 'sidebar-collapsed'} ${infoOpen ? '' : 'info-collapsed'}`}>
        <aside className="presentation-viewer-slides">
          <div className="presentation-viewer-aside-title"><strong>Slides</strong><button type="button" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17} /></button></div>
          <div className="presentation-viewer-thumbnail-list">
            {slides.map((slide, index) => <button key={slide.id} type="button" className={index === slideIndex ? 'active' : ''} onClick={() => setSlideIndex(index)}>
              <span>{index + 1}</span>
              <div className="presentation-viewer-mini-slide"><strong>{slide.title}</strong><small>{slide.subtitle}</small></div>
            </button>)}
          </div>
        </aside>

        <main className="presentation-viewer-stage">
          {!sidebarOpen && <button type="button" className="presentation-viewer-open-sidebar" onClick={() => setSidebarOpen(true)}><PanelLeftOpen size={18} /></button>}
          <div className="presentation-viewer-canvas-wrap">
            <article className="presentation-viewer-canvas" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="presentation-viewer-slide-brand">ISAP · Intrum Sales Advisory Platform</div>
              <div className="presentation-viewer-slide-content">
                <span>0{currentSlide.number}</span>
                <h2>{currentSlide.title}</h2>
                <p>{currentSlide.subtitle}</p>
                {!!currentSlide.assetTitle && <small>Linked source: {currentSlide.assetTitle}</small>}
              </div>
              <div className="presentation-viewer-slide-footer">{presentation.industries?.join(' · ') || 'Sales presentation'}</div>
            </article>
          </div>
          <div className="presentation-viewer-controls">
            <button type="button" disabled={slideIndex === 0} onClick={() => setSlideIndex((current) => Math.max(0, current - 1))}><ChevronLeft size={18} />Previous</button>
            <div className="presentation-viewer-zoom"><button type="button" onClick={() => changeZoom(-25)}><Minus size={16} /></button><span>{zoom}%</span><button type="button" onClick={() => changeZoom(25)}><Plus size={16} /></button><button type="button" onClick={() => setZoom(100)} title="Reset zoom"><Maximize2 size={16} /></button></div>
            <button type="button" disabled={slideIndex === slides.length - 1} onClick={() => setSlideIndex((current) => Math.min(slides.length - 1, current + 1))}>Next<ChevronRight size={18} /></button>
          </div>
          <section className="presentation-viewer-notes"><span>Speaker notes</span><p>{currentSlide.notes}</p></section>
        </main>

        <aside className="presentation-viewer-info">
          <div className="presentation-viewer-aside-title"><strong>Information</strong><button type="button" onClick={() => setInfoOpen(false)}><X size={17} /></button></div>
          <dl>
            <dt>Status</dt><dd>{statusLabels[presentation.status] || presentation.status}</dd>
            <dt>Version</dt><dd>{presentation.version}</dd>
            <dt>Slides</dt><dd>{slides.length}</dd>
            <dt>Updated</dt><dd>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(presentation.updatedAt))}</dd>
          </dl>
          <div><span>Products</span><div className="admin-table-tags">{linkedProducts.map((item) => <span key={item.id}>{item.name}</span>)}{!linkedProducts.length && <small>Unassigned</small>}</div></div>
          <div><span>Industries</span><div className="admin-table-tags">{presentation.industries?.map((item) => <span key={item}>{item}</span>)}{!presentation.industries?.length && <small>Not specified</small>}</div></div>
          <div><span>Audience</span><div className="admin-table-tags">{presentation.audiences?.map((item) => <span key={item}>{item}</span>)}{!presentation.audiences?.length && <small>Not specified</small>}</div></div>
          <div><span>Linked assets</span><div className="presentation-viewer-asset-list">{linkedAssets.map((item) => <div key={item.id}><FileText size={15} /><span>{item.title || item.filename}</span><small>{item.extension?.toUpperCase()}</small></div>)}{!linkedAssets.length && <small>No linked assets</small>}</div></div>
        </aside>
      </div>
    </div>
  </div>
}
