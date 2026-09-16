import { ensurePresentationSlides } from './slideService.js'

const STORAGE_KEY = 'isap-presentation-viewer-state'

function readAllStates() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function createViewerSlides(presentation, linkedAssets = []) {
  return ensurePresentationSlides(presentation, linkedAssets)
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
