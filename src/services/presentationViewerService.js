const STORAGE_KEY = 'isap-presentation-viewer-state'

function readAllStates() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function createViewerSlides(presentation, linkedAssets = []) {
  const explicitSlides = Array.isArray(presentation?.slides) ? presentation.slides : []
  if (explicitSlides.length) return explicitSlides

  const count = Math.max(Number(presentation?.slideCount) || 0, 1)
  const productNames = presentation?.productNames || []
  const topics = [
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

  return Array.from({ length: count }, (_, index) => {
    const linkedAsset = linkedAssets[index % Math.max(linkedAssets.length, 1)]
    const topic = index === 0 ? presentation?.title || 'Presentation' : topics[index % topics.length]
    return {
      id: `${presentation?.id || 'presentation'}-slide-${index + 1}`,
      number: index + 1,
      title: topic,
      subtitle: index === 0
        ? presentation?.description || 'Presentation overview'
        : productNames.length ? productNames.join(' · ') : presentation?.description || 'Content preview',
      notes: index === 0
        ? 'Open with the meeting objective and align expectations.'
        : `Use this slide to discuss ${topic.toLowerCase()} and connect it to the customer situation.`,
      assetTitle: linkedAsset?.title || linkedAsset?.filename || '',
      tags: presentation?.tags || []
    }
  })
}

export function getViewerState(presentationId) {
  const state = readAllStates()[presentationId]
  return {
    slideIndex: Math.max(0, Number(state?.slideIndex) || 0),
    zoom: Math.min(150, Math.max(50, Number(state?.zoom) || 100)),
    sidebarOpen: state?.sidebarOpen !== false,
    infoOpen: state?.infoOpen !== false
  }
}

export function saveViewerState(presentationId, state) {
  if (!presentationId) return
  const allStates = readAllStates()
  allStates[presentationId] = { ...allStates[presentationId], ...state, updatedAt: new Date().toISOString() }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allStates))
}
