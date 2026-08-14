import { PRESENTATION_STATUS } from '../data/presentations.js'

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return String(value).split(',').map((item) => item.trim()).filter(Boolean)
}

export function createPresentation(presentations, input) {
  const now = new Date().toISOString()
  const presentation = {
    id: `presentation-${Date.now()}`,
    title: input.title.trim(),
    description: input.description?.trim() || '',
    version: input.version?.trim() || '1.0',
    status: input.status || PRESENTATION_STATUS.DRAFT,
    products: normalizeList(input.products),
    assets: normalizeList(input.assets),
    industries: normalizeList(input.industries),
    audiences: normalizeList(input.audiences),
    tags: normalizeList(input.tags),
    slideCount: Number(input.slideCount) || 0,
    favorite: Boolean(input.favorite),
    thumbnail: input.thumbnail || '',
    slides: Array.isArray(input.slides) ? input.slides : [],
    generated: Boolean(input.generated),
    generatedAt: input.generatedAt || null,
    generatedContext: input.generatedContext || null,
    createdAt: now,
    updatedAt: now
  }
  return [presentation, ...presentations]
}

export function updatePresentation(presentations, presentationId, changes) {
  return presentations.map((presentation) => presentation.id === presentationId ? {
    ...presentation,
    ...changes,
    title: changes.title?.trim() || presentation.title,
    description: changes.description?.trim() ?? presentation.description,
    version: changes.version?.trim() || presentation.version,
    products: normalizeList(changes.products ?? presentation.products),
    assets: normalizeList(changes.assets ?? presentation.assets),
    industries: normalizeList(changes.industries ?? presentation.industries),
    audiences: normalizeList(changes.audiences ?? presentation.audiences),
    tags: normalizeList(changes.tags ?? presentation.tags),
    slideCount: Number(changes.slideCount ?? presentation.slideCount) || 0,
    slides: Array.isArray(changes.slides) ? changes.slides : presentation.slides,
    generated: changes.generated ?? presentation.generated,
    generatedAt: changes.generatedAt ?? presentation.generatedAt,
    generatedContext: changes.generatedContext ?? presentation.generatedContext,
    updatedAt: new Date().toISOString()
  } : presentation)
}

export function archivePresentation(presentations, presentationId) {
  return updatePresentation(presentations, presentationId, { status: PRESENTATION_STATUS.ARCHIVED })
}

export function restorePresentation(presentations, presentationId) {
  return updatePresentation(presentations, presentationId, { status: PRESENTATION_STATUS.DRAFT })
}

export function deletePresentation(presentations, presentationId) {
  return presentations.filter((presentation) => presentation.id !== presentationId)
}

export function togglePresentationFavorite(presentations, presentationId) {
  return presentations.map((presentation) => presentation.id === presentationId ? {
    ...presentation,
    favorite: !presentation.favorite,
    updatedAt: new Date().toISOString()
  } : presentation)
}
