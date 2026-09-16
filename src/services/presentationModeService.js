const STORAGE_KEY = 'isap-presentation-mode-state'

function readStates() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function getPresentationModeState(presentationId) {
  const state = readStates()[presentationId] || {}
  return {
    slideIndex: Math.max(0, Number(state.slideIndex) || 0),
    notesOpen: state.notesOpen !== false,
    intelligenceOpen: state.intelligenceOpen !== false,
    elapsedSeconds: Math.max(0, Number(state.elapsedSeconds) || 0)
  }
}

export function savePresentationModeState(presentationId, state) {
  if (!presentationId) return
  const states = readStates()
  states[presentationId] = {
    ...states[presentationId],
    ...state,
    updatedAt: new Date().toISOString()
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

export function formatPresentationTime(totalSeconds = 0) {
  const safe = Math.max(0, Number(totalSeconds) || 0)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (value) => String(value).padStart(2, '0')
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}
