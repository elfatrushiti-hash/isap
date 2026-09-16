const ROLE_PRODUCT_MAP = {
  'Credit Information': ['credit', 'risk', 'underwriting', 'finance', 'financial', 'cfo', 'credit management', 'risk management', 'customer onboarding', 'lending'],
  'Collections': ['collections', 'receivables', 'debt', 'finance', 'financial', 'cfo', 'shared services', 'customer operations', 'billing', 'credit management'],
  'Fraud Prevention': ['fraud', 'risk', 'security', 'compliance', 'financial crime', 'aml', 'chief risk', 'chief security', 'trust'],
  'Digital Identity': ['identity', 'digital', 'kyc', 'compliance', 'onboarding', 'customer experience', 'digital transformation', 'cio', 'cto'],
  'Payment Solutions': ['payment', 'payments', 'treasury', 'finance', 'billing', 'cfo', 'commerce'],
  'Consulting': ['strategy', 'transformation', 'operations', 'coo', 'chief operating', 'business development', 'innovation']
}

const ROLE_SENIORITY = [
  ['chief ', 24], ['cfo', 26], ['ceo', 18], ['cro', 26], ['coo', 18], ['cio', 18], ['cto', 18],
  ['head of', 20], ['director', 16], ['vice president', 16], ['vp ', 16], ['managing director', 18],
  ['manager', 10], ['lead', 9]
]

function text(value = '') { return String(value || '').toLowerCase() }
function unique(items = []) { return [...new Set(items.filter(Boolean))] }
function includesTerm(haystack, term) { return haystack.includes(text(term).trim()) }

function sourceText(source) {
  return text([source.title, source.content, source.notes, source.url, ...(source.analysis?.topics || []), ...(source.analysis?.painPoints || []), ...(source.analysis?.buyingSignals || [])].join(' '))
}

export function calculateProductRelevance(sources = [], products = [], companyIndustry = '') {
  const active = (products || []).filter((product) => product.status !== 'ARCHIVED')
  return active.map((product) => {
    const terms = unique([product.name, product.category, ...(product.keywords || []), ...(product.painPoints || [])]).map(text).filter((item) => item.length > 2)
    const industryTerms = (product.industries || []).map(text)
    let raw = 0
    const evidence = []

    for (const source of sources) {
      const body = sourceText(source)
      const hits = terms.filter((term) => includesTerm(body, term))
      if (hits.length) {
        const trustBoost = source.trust === 'TRUSTED' ? 1.25 : source.trust === 'ALLOWED' ? 1.08 : .85
        const sourceScore = Math.min(26, 5 + hits.length * 5) * trustBoost
        raw += sourceScore
        evidence.push({ sourceId: source.id, title: source.title, url: source.url, hits: hits.slice(0, 5), score: Math.round(sourceScore) })
      }
    }

    if (companyIndustry && industryTerms.some((term) => text(companyIndustry).includes(term) || term.includes(text(companyIndustry)))) raw += 12
    const score = Math.min(100, Math.round(raw))
    return {
      productId: product.id,
      name: product.name,
      score,
      reason: evidence.length
        ? `${evidence.length} public source${evidence.length === 1 ? '' : 's'} contain signals matching ${product.name}.`
        : `No strong public evidence for ${product.name} has been captured yet.`,
      evidence: evidence.sort((a, b) => b.score - a.score).slice(0, 4)
    }
  }).sort((a, b) => b.score - a.score)
}

function roleScoreForProduct(role, productName) {
  const roleText = text(role)
  let score = 0
  for (const [term, weight] of ROLE_SENIORITY) if (roleText.includes(term)) score += weight
  const mapped = ROLE_PRODUCT_MAP[productName] || []
  for (const term of mapped) if (roleText.includes(term)) score += 18
  return score
}

export function rankManagementContacts(management = [], productRelevance = []) {
  const topProducts = productRelevance.filter((item) => item.score >= 18).slice(0, 4)
  return (management || []).map((person) => {
    const productMatches = topProducts.map((product) => ({ name: product.name, score: roleScoreForProduct(person.role, product.name) + Math.round(product.score * .35) }))
      .filter((item) => item.score > 10)
      .sort((a, b) => b.score - a.score)
    const seniority = ROLE_SENIORITY.reduce((sum, [term, weight]) => text(person.role).includes(term) ? Math.max(sum, weight) : sum, 0)
    const score = Math.min(100, Math.round((productMatches[0]?.score || 0) + seniority * .55 + (person.sourceUrl ? 5 : 0)))
    return {
      ...person,
      score,
      productMatches: productMatches.slice(0, 3),
      reason: productMatches.length
        ? `${person.role || 'Role'} aligns best with ${productMatches.slice(0, 2).map((item) => item.name).join(' and ')}.`
        : 'Management role identified, but no strong product-specific ownership signal is available yet.'
    }
  }).sort((a, b) => b.score - a.score)
}

export function buildCustomerResearchBrief({ sources = [], products = [], management = [], companyIndustry = '' }) {
  const productRelevance = calculateProductRelevance(sources, products, companyIndustry)
  const managementRanking = rankManagementContacts(management, productRelevance)
  const topProducts = productRelevance.filter((item) => item.score > 0).slice(0, 3)
  const topContact = managementRanking.find((person) => person.score > 0) || managementRanking[0] || null
  const signals = unique(sources.flatMap((source) => [
    ...(source.analysis?.painPoints || []),
    ...(source.analysis?.buyingSignals || []),
    ...(source.analysis?.topics || [])
  ])).slice(0, 8)
  const relevantSources = [...sources].map((source) => ({
    ...source,
    relevance: topProducts.reduce((sum, product) => sum + (product.evidence.some((item) => item.sourceId === source.id) ? Math.max(8, Math.round(product.score / 3)) : 0), 0)
  })).sort((a, b) => b.relevance - a.relevance)

  return { productRelevance, managementRanking, topProducts, topContact, signals, relevantSources }
}
