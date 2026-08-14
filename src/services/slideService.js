const DEFAULT_TOPICS = [
  'Executive overview',
  'Customer context',
  'Business challenges',
  'Recommended solution',
  'Value proposition',
  'Use case',
  'Implementation approach',
  'Expected impact',
  'Next steps'
]

const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : []
const unique = (items) => [...new Set(items.map((item) => String(item).trim()).filter(Boolean))]

export function createSlideModel(presentation, index, linkedAssets = []) {
  const linkedAsset = linkedAssets[index % Math.max(linkedAssets.length, 1)]
  const topic = index === 0 ? presentation?.title || 'Presentation' : DEFAULT_TOPICS[index % DEFAULT_TOPICS.length]
  const productIds = asArray(presentation?.products)
  const industries = asArray(presentation?.industries)
  const tags = asArray(presentation?.tags)

  return {
    id: `${presentation?.id || 'presentation'}-slide-${index + 1}`,
    presentationId: presentation?.id || '',
    number: index + 1,
    title: topic,
    subtitle: index === 0
      ? presentation?.description || 'Presentation overview'
      : presentation?.description || 'Content preview',
    notes: index === 0
      ? 'Open with the meeting objective and align expectations.'
      : `Use this slide to discuss ${topic.toLowerCase()} and connect it to the customer situation.`,
    speakerNotes: '',
    assetId: linkedAsset?.id || '',
    assetTitle: linkedAsset?.title || linkedAsset?.filename || '',
    products: productIds,
    industries,
    topics: unique([topic, ...tags.slice(0, 2)]),
    keywords: unique([...tags, ...topic.toLowerCase().split(/\s+/).filter((word) => word.length > 4)]),
    tags,
    status: 'ACTIVE',
    analysis: {
      summary: index === 0 ? presentation?.description || 'Opening slide.' : `Slide focused on ${topic.toLowerCase()}.`,
      painPoints: [],
      objections: [],
      references: [],
      confidence: 0.72,
      embedding: null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export function ensurePresentationSlides(presentation, linkedAssets = []) {
  const existing = asArray(presentation?.slides)
  if (existing.length) {
    return existing.map((slide, index) => ({
      ...createSlideModel(presentation, index, linkedAssets),
      ...slide,
      id: slide.id || `${presentation.id}-slide-${index + 1}`,
      presentationId: presentation.id,
      number: Number(slide.number) || index + 1,
      products: asArray(slide.products),
      industries: asArray(slide.industries),
      topics: asArray(slide.topics),
      keywords: asArray(slide.keywords),
      tags: asArray(slide.tags),
      analysis: { ...createSlideModel(presentation, index, linkedAssets).analysis, ...(slide.analysis || {}) }
    }))
  }

  const count = Math.max(Number(presentation?.slideCount) || 0, 1)
  return Array.from({ length: count }, (_, index) => createSlideModel(presentation, index, linkedAssets))
}

export function updateSlideInPresentations(presentations, presentationId, slideId, changes, linkedAssets = []) {
  return presentations.map((presentation) => {
    if (presentation.id !== presentationId) return presentation
    const slides = ensurePresentationSlides(presentation, linkedAssets).map((slide) => (
      slide.id === slideId
        ? {
            ...slide,
            ...changes,
            products: changes.products === undefined ? slide.products : unique(changes.products),
            industries: changes.industries === undefined ? slide.industries : unique(changes.industries),
            topics: changes.topics === undefined ? slide.topics : unique(changes.topics),
            keywords: changes.keywords === undefined ? slide.keywords : unique(changes.keywords),
            tags: changes.tags === undefined ? slide.tags : unique(changes.tags),
            analysis: changes.analysis ? { ...slide.analysis, ...changes.analysis } : slide.analysis,
            updatedAt: new Date().toISOString()
          }
        : slide
    ))
    return { ...presentation, slides, slideCount: slides.length, updatedAt: new Date().toISOString() }
  })
}

export function searchSlides(slides, { query = '', product = 'ALL', industry = 'ALL', topic = 'ALL' } = {}) {
  const needle = query.trim().toLowerCase()
  return asArray(slides).filter((slide) => {
    if (product !== 'ALL' && !asArray(slide.products).includes(product)) return false
    if (industry !== 'ALL' && !asArray(slide.industries).includes(industry)) return false
    if (topic !== 'ALL' && !asArray(slide.topics).includes(topic)) return false
    if (!needle) return true
    const haystack = [
      slide.title,
      slide.subtitle,
      slide.notes,
      slide.speakerNotes,
      ...asArray(slide.topics),
      ...asArray(slide.keywords),
      ...asArray(slide.tags),
      slide.analysis?.summary
    ].join(' ').toLowerCase()
    return haystack.includes(needle)
  })
}
