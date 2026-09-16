import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Expand,
  EyeOff,
  Lightbulb,
  List,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react'
import { createViewerSlides } from '../../../services/presentationViewerService.js'
import {
  formatPresentationTime,
  getPresentationModeState,
  savePresentationModeState
} from '../../../services/presentationModeService.js'

export default function PresentationMode({ open, presentation, products = [], assets = [], onClose }) {
  const shellRef = useRef(null)
  const linkedAssets = useMemo(() => assets.filter((asset) => presentation?.assets?.includes(asset.id)), [assets, presentation])
  const linkedProducts = useMemo(() => products.filter((product) => presentation?.products?.includes(product.id)), [products, presentation])
  const enrichedPresentation = useMemo(() => ({
    ...presentation,
    productNames: linkedProducts.map((item) => item.name)
  }), [presentation, linkedProducts])
  const slides = useMemo(() => createViewerSlides(enrichedPresentation, linkedAssets), [enrichedPresentation, linkedAssets])

  const initialState = useMemo(
    () => getPresentationModeState(presentation?.id || 'unknown'),
    [presentation?.id]
  )

  const [slideIndex, setSlideIndex] = useState(initialState.slideIndex)
  const [notesOpen, setNotesOpen] = useState(initialState.notesOpen)
  const [intelligenceOpen, setIntelligenceOpen] = useState(initialState.intelligenceOpen)
  const [slideListOpen, setSlideListOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(initialState.elapsedSeconds)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!open || !presentation?.id) return
    const state = getPresentationModeState(presentation.id)
    setSlideIndex(Math.min(state.slideIndex, Math.max(slides.length - 1, 0)))
    setNotesOpen(state.notesOpen)
    setIntelligenceOpen(state.intelligenceOpen)
    setElapsedSeconds(state.elapsedSeconds)
    setSlideListOpen(false)
    setRunning(false)
  }, [open, presentation?.id, slides.length])

  useEffect(() => {
    if (!open || !presentation?.id) return
    savePresentationModeState(presentation.id, {
      slideIndex,
      notesOpen,
      intelligenceOpen,
      elapsedSeconds
    })
  }, [open, presentation?.id, slideIndex, notesOpen, intelligenceOpen, elapsedSeconds])

  useEffect(() => {
    if (!open || !running) return undefined
    const timer = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000)
    return () => window.clearInterval(timer)
  }, [open, running])

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      const tag = event.target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (event.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else onClose?.()
      }
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        setSlideIndex((current) => Math.min(slides.length - 1, current + 1))
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        setSlideIndex((current) => Math.max(0, current - 1))
      }
      if (event.key.toLowerCase() === 'n') setNotesOpen((value) => !value)
      if (event.key.toLowerCase() === 'i') setIntelligenceOpen((value) => !value)
      if (event.key.toLowerCase() === 'l') setSlideListOpen((value) => !value)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, slides.length])

  useEffect(() => {
    if (!open) return undefined
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [open])

  if (!open || !presentation || !slides.length) return null

  const currentSlide = slides[slideIndex] || slides[0]
  const progress = slides.length <= 1 ? 100 : Math.round(((slideIndex + 1) / slides.length) * 100)
  const recommendation = currentSlide.analysis?.summary || currentSlide.notes || 'Stay focused on the customer context and connect this slide to the business objective.'
  const currentProductNames = linkedProducts
    .filter((product) => currentSlide.products?.includes(product.id))
    .map((product) => product.name)

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await shellRef.current?.requestFullscreen?.()
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
  }

  const closeMode = async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen() } catch { /* noop */ }
    }
    onClose?.()
  }

  return <div className="presentation-mode-overlay" role="dialog" aria-modal="true" aria-label={`Present ${presentation.title}`}>
    <div ref={shellRef} className={`presentation-mode-shell ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <header className="presentation-mode-header">
        <div className="presentation-mode-brand">
          <span>ISAP Presentation Mode</span>
          <strong>{presentation.title}</strong>
          <small>{slideIndex + 1} / {slides.length} · {progress}% complete</small>
        </div>

        <div className="presentation-mode-toolbar">
          <div className="presentation-mode-timer">
            <Clock3 size={16} />
            <strong>{formatPresentationTime(elapsedSeconds)}</strong>
            <button type="button" onClick={() => setRunning((value) => !value)} title={running ? 'Pause timer' : 'Start timer'}>
              {running ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button type="button" onClick={() => { setRunning(false); setElapsedSeconds(0) }} title="Reset timer"><RotateCcw size={14} /></button>
          </div>
          <button type="button" onClick={() => setSlideListOpen((value) => !value)} title="Slide list"><List size={17} /></button>
          <button type="button" onClick={() => setNotesOpen((value) => !value)} title="Speaker notes"><Lightbulb size={17} /></button>
          <button type="button" onClick={() => setIntelligenceOpen((value) => !value)} title="AI guidance"><BrainCircuit size={17} /></button>
          <button type="button" onClick={toggleFullscreen} title="Fullscreen">{isFullscreen ? <Maximize2 size={17} /> : <Expand size={17} />}</button>
          <button type="button" onClick={closeMode} title="Exit presentation"><X size={19} /></button>
        </div>
      </header>

      <div className={`presentation-mode-layout ${slideListOpen ? 'list-open' : ''} ${intelligenceOpen ? 'intelligence-open' : ''}`}>
        {slideListOpen && <aside className="presentation-mode-slide-list">
          <div className="presentation-mode-panel-heading"><strong>Slides</strong><button type="button" onClick={() => setSlideListOpen(false)}><EyeOff size={15} /></button></div>
          <div>
            {slides.map((slide, index) => <button
              key={slide.id}
              type="button"
              className={index === slideIndex ? 'active' : ''}
              onClick={() => { setSlideIndex(index); setSlideListOpen(false) }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><strong>{slide.title}</strong><small>{slide.subtitle || 'Slide'}</small></div>
            </button>)}
          </div>
        </aside>}

        <main className="presentation-mode-stage">
          <article className="presentation-mode-slide">
            <div className="presentation-mode-slide-brand">ISAP · Intrum Sales Advisory Platform</div>
            <div className="presentation-mode-slide-content">
              <span>{String(currentSlide.number).padStart(2, '0')}</span>
              <h2>{currentSlide.title}</h2>
              <p>{currentSlide.subtitle}</p>
              {currentSlide.assetTitle && <small>Source: {currentSlide.assetTitle}</small>}
            </div>
            <div className="presentation-mode-slide-footer">
              {currentSlide.industries?.join(' · ') || presentation.industries?.join(' · ') || 'Sales presentation'}
            </div>
          </article>

          <button
            className="presentation-mode-nav presentation-mode-prev"
            type="button"
            disabled={slideIndex === 0}
            onClick={() => setSlideIndex((current) => Math.max(0, current - 1))}
            aria-label="Previous slide"
          ><ChevronLeft size={30} /></button>
          <button
            className="presentation-mode-nav presentation-mode-next"
            type="button"
            disabled={slideIndex === slides.length - 1}
            onClick={() => setSlideIndex((current) => Math.min(slides.length - 1, current + 1))}
            aria-label="Next slide"
          ><ChevronRight size={30} /></button>

          {notesOpen && <section className="presentation-mode-notes">
            <span>Speaker Notes</span>
            <p>{currentSlide.speakerNotes || currentSlide.notes || 'No speaker notes for this slide.'}</p>
          </section>}
        </main>

        {intelligenceOpen && <aside className="presentation-mode-intelligence">
          <div className="presentation-mode-panel-heading"><div><Sparkles size={17} /><strong>AI Guidance</strong></div><button type="button" onClick={() => setIntelligenceOpen(false)}><X size={15} /></button></div>
          <section>
            <span>Recommended focus</span>
            <p>{recommendation}</p>
          </section>
          <section>
            <span>Topics</span>
            <div className="presentation-mode-tags">{(currentSlide.topics || []).map((item) => <em key={item}>{item}</em>)}{!currentSlide.topics?.length && <small>No topics assigned</small>}</div>
          </section>
          <section>
            <span>Products</span>
            <div className="presentation-mode-tags">{currentProductNames.map((item) => <em key={item}>{item}</em>)}{!currentProductNames.length && <small>No products assigned</small>}</div>
          </section>
          <section>
            <span>Pain points</span>
            <ul>{(currentSlide.analysis?.painPoints || []).map((item) => <li key={item}>{item}</li>)}{!currentSlide.analysis?.painPoints?.length && <li>Use customer statements to validate the relevance of this slide.</li>}</ul>
          </section>
          <section>
            <span>Keyboard</span>
            <p className="presentation-mode-shortcuts">← / → Slides · Space Next · N Notes · I AI · L List · Esc Exit</p>
          </section>
        </aside>}
      </div>

      <div className="presentation-mode-progress"><span style={{ width: `${progress}%` }} /></div>
    </div>
  </div>
}
