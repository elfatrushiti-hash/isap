import { ensurePresentationSlides } from './slideService.js'

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))
const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : []
const normalize = (value) => String(value || '').trim().toLowerCase()
const unique = (items) => [...new Set(items.map(normalize).filter(Boolean))]
const tokenize = (value) => unique(String(value || '').toLowerCase().split(/[^a-z0-9äöüß]+/i).filter((token) => token.length > 2))

function collectTerms(item) {
  return unique([
    ...tokenize(item?.title),
    ...tokenize(item?.description),
    ...tokenize(item?.subtitle),
    ...tokenize(item?.notes),
    ...tokenize(item?.speakerNotes),
    ...tokenize(item?.analysis?.summary),
    ...asArray(item?.industries),
    ...asArray(item?.topics),
    ...asArray(item?.keywords),
    ...asArray(item?.tags),
    ...asArray(item?.audiences)
  ])
}

function matchRatio(contextValues, itemValues) {
  const wanted = unique(contextValues)
  if (!wanted.length) return { score: 0, matched: [] }
  const available = unique(itemValues)
  const matched = wanted.filter((value) => available.some((candidate) => candidate === value || candidate.includes(value) || value.includes(candidate)))
  return { score: matched.length / wanted.length, matched }
}

function calculateRecency(updatedAt) {
  const timestamp = new Date(updatedAt || 0).getTime()
  if (!Number.isFinite(timestamp) || timestamp <= 0) return 0
  const ageDays = Math.max(0, (Date.now() - timestamp) / 86400000)
  if (ageDays <= 30) return 1
  if (ageDays <= 180) return 0.75
  if (ageDays <= 365) return 0.5
  return 0.2
}

export function normalizeMeetingContext(input = {}) {
  return {
    company: String(input.company || '').trim(),
    industry: String(input.industry || '').trim(),
    products: asArray(input.products),
    topics: unique([...(asArray(input.topics)), ...tokenize(input.objectives)]),
    objectives: String(input.objectives || '').trim(),
    audience: String(input.audience || '').trim()
  }
}

export function calculateRecommendationScore(item, contextInput = {}, options = {}) {
  const context = normalizeMeetingContext(contextInput)
  const productMatch = matchRatio(context.products, asArray(item?.products))
  const industryMatch = matchRatio(context.industry ? [context.industry] : [], asArray(item?.industries))
  const topicMatch = matchRatio(context.topics, collectTerms(item))
  const audienceMatch = matchRatio(context.audience ? [context.audience] : [], asArray(item?.audiences))
  const recency = calculateRecency(item?.updatedAt)
  const quality = clamp(Number(item?.analysis?.confidence ?? item?.confidence ?? 0.72), 0, 1)
  const favoriteBoost = item?.favorite ? 1 : 0

  const weighted = (
    productMatch.score * 32 +
    industryMatch.score * 22 +
    topicMatch.score * 24 +
    audienceMatch.score * 8 +
    recency * 7 +
    quality * 5 +
    favoriteBoost * 2
  )

  const score = Math.round(clamp(weighted))
  const reasons = []
  if (productMatch.matched.length) reasons.push(`Product match: ${productMatch.matched.join(', ')}`)
  if (industryMatch.matched.length) reasons.push(`Industry match: ${industryMatch.matched.join(', ')}`)
  if (topicMatch.matched.length) reasons.push(`Topic match: ${topicMatch.matched.slice(0, 4).join(', ')}`)
  if (audienceMatch.matched.length) reasons.push(`Audience match: ${audienceMatch.matched.join(', ')}`)
  if (item?.favorite) reasons.push('Favorite presentation')
  if (!reasons.length) reasons.push(options.fallbackReason || 'General content relevance')

  return { score, reasons }
}

export function recommendPresentations(presentations = [], context = {}) {
  return presentations
    .filter((item) => item.status !== 'ARCHIVED')
    .map((item) => ({ ...item, recommendation: calculateRecommendationScore(item, context) }))
    .filter((item) => item.recommendation.score > 0)
    .sort((a, b) => b.recommendation.score - a.recommendation.score || new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function recommendSlides(presentations = [], assets = [], context = {}) {
  return presentations
    .filter((presentation) => presentation.status !== 'ARCHIVED')
    .flatMap((presentation) => {
      const linkedAssets = assets.filter((asset) => presentation.assets?.includes(asset.id))
      return ensurePresentationSlides(presentation, linkedAssets).map((slide) => {
        const recommendation = calculateRecommendationScore(slide, context, { fallbackReason: `Related to ${presentation.title}` })
        return { ...slide, presentationTitle: presentation.title, recommendation }
      })
    })
    .filter((item) => item.recommendation.score > 0)
    .sort((a, b) => b.recommendation.score - a.recommendation.score || a.number - b.number)
}

export function recommendAssets(assets = [], context = {}) {
  return assets
    .filter((item) => !['ARCHIVED', 'FAILED'].includes(item.status))
    .map((item) => ({ ...item, recommendation: calculateRecommendationScore({
      ...item,
      topics: item.analysis?.topics,
      keywords: item.analysis?.keywords,
      industries: item.analysis?.industries?.length ? item.analysis.industries : item.industries,
      products: item.analysis?.products?.length ? item.analysis.products : item.products
    }, context) }))
    .filter((item) => item.recommendation.score > 0)
    .sort((a, b) => b.recommendation.score - a.recommendation.score || new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getTopRecommendations({ presentations = [], assets = [], context = {}, limits = {} } = {}) {
  return {
    presentations: recommendPresentations(presentations, context).slice(0, limits.presentations || 5),
    slides: recommendSlides(presentations, assets, context).slice(0, limits.slides || 8),
    assets: recommendAssets(assets, context).slice(0, limits.assets || 6)
  }
}

export function createRecommendationRun(context, results) {
  const scores = [
    ...results.presentations.map((item) => item.recommendation.score),
    ...results.slides.map((item) => item.recommendation.score),
    ...results.assets.map((item) => item.recommendation.score)
  ]
  return {
    id: `recommendation-${Date.now()}`,
    context: normalizeMeetingContext(context),
    resultCounts: {
      presentations: results.presentations.length,
      slides: results.slides.length,
      assets: results.assets.length
    },
    topPresentationId: results.presentations[0]?.id || null,
    topPresentationTitle: results.presentations[0]?.title || null,
    averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    createdAt: new Date().toISOString()
  }
}
