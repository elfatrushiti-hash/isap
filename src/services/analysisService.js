export const ANALYSIS_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  QUEUED: 'QUEUED',
  EXTRACTING: 'EXTRACTING',
  ANALYSING: 'ANALYSING',
  SUMMARISING: 'SUMMARISING',
  READY: 'READY',
  FAILED: 'FAILED'
}

const TOPIC_DICTIONARY = {
  'Credit Information': ['credit information', 'credit score', 'credit scoring', 'bonitaet', 'bonität', 'risk assessment', 'credit risk'],
  Collections: ['collection', 'collections', 'debt collection', 'receivables', 'inkasso', 'forderung'],
  'Fraud Prevention': ['fraud', 'fraud prevention', 'identity fraud', 'payment fraud', 'betrug'],
  'Digital Identity': ['digital identity', 'identity verification', 'kyc', 'identification', 'identitaet', 'identität'],
  Payments: ['payment', 'payments', 'checkout', 'invoice', 'pay later', 'bnpl'],
  Compliance: ['compliance', 'aml', 'regulation', 'regulatory', 'sanctions'],
  Analytics: ['analytics', 'data', 'insight', 'prediction', 'scoring', 'model']
}

const INDUSTRY_DICTIONARY = {
  Banking: ['bank', 'banking', 'financial services', 'fintech'],
  Insurance: ['insurance', 'insurer', 'policyholder'],
  Telecom: ['telecom', 'telecommunications', 'mobile', 'broadband'],
  Retail: ['retail', 'e-commerce', 'ecommerce', 'merchant', 'shop'],
  Healthcare: ['healthcare', 'hospital', 'patient', 'medical'],
  Utilities: ['utilities', 'energy', 'electricity', 'water'],
  'Public Sector': ['public sector', 'government', 'municipality', 'authority'],
  Automotive: ['automotive', 'mobility', 'vehicle', 'leasing']
}

const LANGUAGE_SIGNALS = {
  de: [' und ', ' der ', ' die ', ' das ', ' mit ', ' fuer ', ' für ', ' risiko', 'kunde'],
  fr: [' et ', ' le ', ' la ', ' les ', ' avec ', ' client', 'risque'],
  it: [' e ', ' il ', ' la ', ' con ', ' cliente', 'rischio'],
  en: [' and ', ' the ', ' with ', ' customer', 'risk', 'business']
}

function normalise(value = '') {
  return ` ${String(value).toLowerCase().replace(/[_\-.]+/g, ' ')} `
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function matchesDictionary(text, dictionary) {
  return Object.entries(dictionary)
    .filter(([, signals]) => signals.some((signal) => text.includes(normalise(signal).trim())))
    .map(([label]) => label)
}

function detectLanguage(text) {
  const scores = Object.entries(LANGUAGE_SIGNALS).map(([language, signals]) => ({
    language,
    score: signals.reduce((total, signal) => total + (text.includes(signal) ? 1 : 0), 0)
  }))
  scores.sort((a, b) => b.score - a.score)
  return scores[0]?.score ? scores[0].language : 'en'
}

function buildKeywords(text, topics, industries) {
  const stopWords = new Set(['presentation', 'document', 'powerpoint', 'final', 'version', 'intrum', 'sales', 'asset'])
  const words = text
    .replace(/[^a-z0-9äöüéèàçß ]/gi, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !stopWords.has(word))
  return unique([...topics, ...industries, ...words]).slice(0, 12)
}

function inferPageCount(asset) {
  if (asset.type === 'PRESENTATION') return Math.max(6, Math.min(48, Math.round((asset.size || 800000) / 140000)))
  if (asset.type === 'PDF' || asset.type === 'DOCUMENT') return Math.max(1, Math.min(80, Math.round((asset.size || 200000) / 95000)))
  return null
}

export function createInitialAnalysis(existing = {}) {
  return {
    status: existing.status || ANALYSIS_STATUS.NOT_STARTED,
    progress: existing.progress || 0,
    summary: existing.summary || '',
    keywords: existing.keywords || [],
    products: existing.products || [],
    industries: existing.industries || [],
    topics: existing.topics || [],
    language: existing.language || null,
    confidence: existing.confidence || 0,
    pageCount: existing.pageCount || null,
    slideCount: existing.slideCount || null,
    extractedAt: existing.extractedAt || null,
    completedAt: existing.completedAt || null,
    lastError: existing.lastError || null,
    provider: existing.provider || 'ISAP heuristic engine',
    model: existing.model || 'document-intelligence-v1',
    promptVersion: existing.promptVersion || '1.0',
    tokens: existing.tokens || 0,
    cost: existing.cost || 0,
    executionTime: existing.executionTime || 0,
    embeddings: existing.embeddings || null,
    slides: existing.slides || []
  }
}

export function queueAnalysis(asset) {
  return {
    ...asset,
    analysis: {
      ...createInitialAnalysis(asset.analysis),
      status: ANALYSIS_STATUS.QUEUED,
      progress: 5,
      lastError: null
    },
    updatedAt: new Date().toISOString()
  }
}

export function advanceAnalysis(asset, products = []) {
  const current = createInitialAnalysis(asset.analysis)
  const now = new Date().toISOString()

  if (current.status === ANALYSIS_STATUS.QUEUED) {
    return { ...asset, analysis: { ...current, status: ANALYSIS_STATUS.EXTRACTING, progress: 28 }, updatedAt: now }
  }
  if (current.status === ANALYSIS_STATUS.EXTRACTING) {
    return { ...asset, analysis: { ...current, status: ANALYSIS_STATUS.ANALYSING, progress: 58, extractedAt: now }, updatedAt: now }
  }
  if (current.status === ANALYSIS_STATUS.ANALYSING) {
    return { ...asset, analysis: { ...current, status: ANALYSIS_STATUS.SUMMARISING, progress: 82 }, updatedAt: now }
  }
  if (current.status !== ANALYSIS_STATUS.SUMMARISING) return asset

  const started = globalThis.performance?.now?.() || Date.now()
  const source = normalise([
    asset.title,
    asset.filename,
    asset.description,
    ...(asset.tags || []),
    ...(asset.industries || []),
    ...(asset.audiences || [])
  ].join(' '))
  const topics = matchesDictionary(source, TOPIC_DICTIONARY)
  const industries = unique([...(asset.industries || []), ...matchesDictionary(source, INDUSTRY_DICTIONARY)])
  const detectedProducts = products
    .filter((product) => {
      const productSignals = normalise([product.name, product.shortDescription, product.description, ...(product.keywords || []), ...(product.painPoints || [])].join(' '))
      return source.split(' ').filter((word) => word.length > 4).some((word) => productSignals.includes(word)) || source.includes(normalise(product.name).trim())
    })
    .map((product) => product.id)
  const productIds = unique([...(asset.products || []), ...detectedProducts])
  const productNames = products.filter((product) => productIds.includes(product.id)).map((product) => product.name)
  const language = detectLanguage(source)
  const keywords = buildKeywords(source, topics, industries)
  const subject = topics[0] || productNames[0] || 'sales enablement'
  const audience = asset.audiences?.[0] ? ` for ${asset.audiences[0]}` : ''
  const industryText = industries.length ? ` It is most relevant for ${industries.slice(0, 3).join(', ')}.` : ''
  const productText = productNames.length ? ` Related products: ${productNames.slice(0, 3).join(', ')}.` : ''
  const summary = `${asset.title} is a ${String(asset.type || 'document').toLowerCase()} asset focused on ${subject}${audience}.${industryText}${productText}`
  const count = inferPageCount(asset)
  const ended = globalThis.performance?.now?.() || Date.now()

  return {
    ...asset,
    products: productIds,
    industries,
    analysis: {
      ...current,
      status: ANALYSIS_STATUS.READY,
      progress: 100,
      summary,
      keywords,
      products: productIds,
      industries,
      topics,
      language,
      confidence: Math.min(96, 58 + topics.length * 7 + industries.length * 5 + productIds.length * 6),
      pageCount: asset.type === 'PRESENTATION' ? null : count,
      slideCount: asset.type === 'PRESENTATION' ? count : null,
      completedAt: now,
      executionTime: Math.max(1, Math.round(ended - started)),
      tokens: Math.max(18, source.split(/\s+/).filter(Boolean).length),
      cost: 0
    },
    updatedAt: now
  }
}

export function updateAnalysisMetadata(asset, changes) {
  return {
    ...asset,
    analysis: { ...createInitialAnalysis(asset.analysis), ...changes },
    updatedAt: new Date().toISOString()
  }
}
