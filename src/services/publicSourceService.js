import { SOURCE_TRUST, sourcePolicies } from '../data/sourceGovernance.js'
import { analyseWithRules } from './ruleIntelligenceService.js'

function now() {
  return new Date().toISOString()
}

function normalizeUrl(url = '') {
  const value = String(url).trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

export function getSourcePolicy(sourceType = 'web') {
  return sourcePolicies.find((policy) => policy.id === sourceType || policy.types?.includes(sourceType)) || sourcePolicies.find((policy) => policy.id === 'unknown-web')
}

export function createPublicSource(input, knowledge) {
  const policy = getSourcePolicy(input.sourceType)
  const source = {
    id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    companyId: input.companyId,
    title: String(input.title || '').trim() || 'Untitled public source',
    url: normalizeUrl(input.url),
    sourceType: input.sourceType || 'web',
    trust: policy?.trust || SOURCE_TRUST.RESTRICTED,
    publishedAt: input.publishedAt || '',
    retrievedAt: now(),
    content: String(input.content || '').trim(),
    notes: String(input.notes || '').trim(),
    status: 'READY',
    createdAt: now(),
    updatedAt: now(),
    analysis: null
  }
  return analysePublicSource(source, knowledge)
}

export function analysePublicSource(source, knowledge) {
  const analysis = analyseWithRules({ text: `${source.title || ''}\n${source.content || ''}\n${source.notes || ''}` }, knowledge)
  return {
    ...source,
    updatedAt: now(),
    analysis: {
      confidence: analysis?.confidence || 0,
      matches: analysis?.matches || [],
      topics: (analysis?.matches || []).filter((item) => item.type === 'topic').map((item) => item.label),
      painPoints: (analysis?.matches || []).filter((item) => item.type === 'pain-point').map((item) => item.label),
      buyingSignals: (analysis?.matches || []).filter((item) => item.type === 'buying-signal').map((item) => item.label),
      businessImpacts: (analysis?.matches || []).filter((item) => item.type === 'business-impact').map((item) => item.label),
      objections: (analysis?.matches || []).filter((item) => item.type === 'objection').map((item) => item.label),
      analysedAt: now(),
      provider: 'ISAP Rule Intelligence',
      externalTransmission: false
    }
  }
}

export function updatePublicSource(sources, sourceId, changes, knowledge) {
  return sources.map((source) => source.id === sourceId ? analysePublicSource({ ...source, ...changes, updatedAt: now() }, knowledge) : source)
}

export function deletePublicSource(sources, sourceId) {
  return sources.filter((source) => source.id !== sourceId)
}

export function getCompanySources(sources, companyId) {
  return (sources || []).filter((source) => source.companyId === companyId)
}

export function getSourceSummary(sources, companyId) {
  const companySources = getCompanySources(sources, companyId)
  const unique = (values) => [...new Set(values.filter(Boolean))]
  return {
    total: companySources.length,
    trusted: companySources.filter((source) => source.trust === SOURCE_TRUST.TRUSTED).length,
    allowed: companySources.filter((source) => source.trust === SOURCE_TRUST.ALLOWED).length,
    restricted: companySources.filter((source) => source.trust === SOURCE_TRUST.RESTRICTED).length,
    blocked: companySources.filter((source) => source.trust === SOURCE_TRUST.BLOCKED).length,
    topics: unique(companySources.flatMap((source) => source.analysis?.topics || [])),
    painPoints: unique(companySources.flatMap((source) => source.analysis?.painPoints || [])),
    buyingSignals: unique(companySources.flatMap((source) => source.analysis?.buyingSignals || []))
  }
}
