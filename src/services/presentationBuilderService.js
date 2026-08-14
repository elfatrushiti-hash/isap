import { recommendSlides } from './recommendationService.js'

const unique = (items = []) => [...new Set(items.filter(Boolean))]

export function createPresentationPlan({ presentations = [], assets = [], context = {}, limit = 10 } = {}) {
  const candidates = recommendSlides(presentations, assets, context).slice(0, Math.max(1, limit))
  return candidates.map((slide, index) => ({
    ...slide,
    builderOrder: index + 1,
    selected: index < Math.min(6, candidates.length)
  }))
}

export function moveBuilderSlide(slides = [], slideId, direction) {
  const currentIndex = slides.findIndex((slide) => slide.id === slideId)
  if (currentIndex < 0) return slides
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= slides.length) return slides
  const next = [...slides]
  const [item] = next.splice(currentIndex, 1)
  next.splice(targetIndex, 0, item)
  return next.map((slide, index) => ({ ...slide, builderOrder: index + 1 }))
}

export function toggleBuilderSlide(slides = [], slideId) {
  return slides.map((slide) => slide.id === slideId ? { ...slide, selected: !slide.selected } : slide)
}

export function buildPresentationPayload({ title, description, context = {}, slides = [] } = {}) {
  const selectedSlides = slides.filter((slide) => slide.selected)
  const now = new Date().toISOString()

  return {
    title: String(title || `${context.company || 'Customer'} AI Presentation`).trim(),
    description: String(description || `AI-assisted presentation for ${context.company || 'customer meeting'}.`).trim(),
    version: '1.0',
    status: 'DRAFT',
    products: unique(context.products),
    assets: unique(selectedSlides.flatMap((slide) => slide.sourceAssetId ? [slide.sourceAssetId] : [])),
    industries: unique(context.industry ? [context.industry] : []),
    audiences: unique(context.audience ? [context.audience] : []),
    tags: unique(['AI Generated', ...context.topics || []]),
    slideCount: selectedSlides.length,
    favorite: false,
    slides: selectedSlides.map((slide, index) => ({
      ...slide,
      id: `generated-slide-${Date.now()}-${index + 1}`,
      number: index + 1,
      sourceSlideId: slide.id,
      sourcePresentationId: slide.presentationId,
      sourcePresentationTitle: slide.presentationTitle,
      generatedAt: now
    })),
    generated: true,
    generatedAt: now,
    generatedContext: context
  }
}
