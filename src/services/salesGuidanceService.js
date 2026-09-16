import { analyseWithRules } from './ruleIntelligenceService.js'

const normalize = (value = '') => String(value).trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const uniqueBy = (items, keyFn) => {
  const seen = new Set()
  return items.filter((item) => {
    const key = keyFn(item)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function findNodeByLabel(nodes, label, type) {
  const wanted = normalize(label)
  return nodes.find((node) => (!type || node.type === type) && normalize(node.label) === wanted) || null
}

function relatedLinks(nodeId, taxonomy) {
  const nodes = taxonomy?.nodes || []
  const links = taxonomy?.links || []
  return links
    .filter((link) => link.from === nodeId || link.to === nodeId)
    .map((link) => {
      const relatedId = link.from === nodeId ? link.to : link.from
      return {
        relation: link.relation,
        direction: link.from === nodeId ? 'outbound' : 'inbound',
        node: nodes.find((node) => node.id === relatedId) || null
      }
    })
    .filter((item) => item.node)
}

function directSuggestions(seedNode, taxonomy) {
  if (!seedNode) return []
  return relatedLinks(seedNode.id, taxonomy)
    .filter((item) => item.direction === 'outbound')
    .map((item) => ({ ...item, source: seedNode }))
}

function collectMatchedNodes(ruleResult, taxonomy) {
  const nodes = taxonomy?.nodes || []
  const candidates = [
    ...ruleResult.matches.map((match) => ({ label: match.label, type: match.type, evidence: match })),
    ...ruleResult.products.map((label) => ({ label, type: 'product', evidence: null }))
  ]

  return uniqueBy(
    candidates
      .map((candidate) => {
        const node = findNodeByLabel(nodes, candidate.label, candidate.type) || findNodeByLabel(nodes, candidate.label)
        return node ? { node, evidence: candidate.evidence } : null
      })
      .filter(Boolean),
    (item) => item.node.id
  )
}

function rankContent(items, productLabels, topics, type) {
  const products = productLabels.map(normalize)
  const topicTerms = topics.map(normalize)

  return items
    .filter((item) => item?.status !== 'ARCHIVED')
    .map((item) => {
      const itemProducts = (item.products || item.analysis?.products || []).map(normalize)
      const itemTopics = [
        ...(item.topics || []),
        ...(item.tags || []),
        ...(item.analysis?.topics || []),
        ...(item.analysis?.keywords || [])
      ].map(normalize)

      const productMatches = products.filter((product) => itemProducts.some((candidate) => candidate === product || candidate.includes(product) || product.includes(candidate)))
      const topicMatches = topicTerms.filter((topic) => itemTopics.some((candidate) => candidate === topic || candidate.includes(topic) || topic.includes(candidate)))
      const score = Math.min(100, productMatches.length * 28 + topicMatches.length * 12 + (item.favorite ? 4 : 0))

      return {
        id: item.id,
        title: item.title || item.name || 'Untitled content',
        type,
        score,
        reasons: [
          productMatches.length ? `Product: ${productMatches.join(', ')}` : null,
          topicMatches.length ? `Topic: ${topicMatches.slice(0, 3).join(', ')}` : null
        ].filter(Boolean)
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function deriveSalesGuidance({ text = '', industry = '', objective = '', knowledge, presentations = [], assets = [] } = {}) {
  const combinedText = [text, industry, objective].filter(Boolean).join(' ')
  const ruleResult = analyseWithRules({ text: combinedText }, knowledge)
  const taxonomy = knowledge?.taxonomy || { nodes: [], links: [] }
  const matchedNodes = collectMatchedNodes(ruleResult, taxonomy)
  const paths = matchedNodes.flatMap(({ node, evidence }) => directSuggestions(node, taxonomy).map((item) => ({
    from: node,
    to: item.node,
    relation: item.relation,
    evidence
  })))

  const products = uniqueBy([
    ...ruleResult.products.map((label) => ({ label, source: 'rule', reason: 'Direct rule match' })),
    ...paths.filter((path) => path.to.type === 'product' && ['suggests', 'relevant-for', 'supports', 'related-to'].includes(path.relation)).map((path) => ({
      label: path.to.label,
      source: 'taxonomy',
      reason: `${path.from.label} ${path.relation} ${path.to.label}`
    }))
  ], (item) => normalize(item.label))

  const questions = uniqueBy(paths
    .filter((path) => path.to.type === 'question' && ['ask', 'supports', 'related-to'].includes(path.relation))
    .map((path) => ({
      text: path.to.label,
      reason: `${path.from.label} ${path.relation} ${path.to.label}`
    })), (item) => normalize(item.text))

  const contentNodes = uniqueBy(paths
    .filter((path) => path.to.type === 'content')
    .map((path) => ({ title: path.to.label, reason: `${path.from.label} ${path.relation} ${path.to.label}` })), (item) => normalize(item.title))

  const painPoints = uniqueBy(ruleResult.matches.filter((match) => match.type === 'pain-point').map((match) => ({ label: match.label, explanation: match.explanation, score: match.score })), (item) => normalize(item.label))
  const buyingSignals = uniqueBy(ruleResult.matches.filter((match) => match.type === 'buying-signal').map((match) => ({ label: match.label, explanation: match.explanation, score: match.score })), (item) => normalize(item.label))
  const businessImpacts = uniqueBy(ruleResult.matches.filter((match) => match.type === 'business-impact').map((match) => ({ label: match.label, explanation: match.explanation, score: match.score })), (item) => normalize(item.label))
  const objections = uniqueBy(ruleResult.matches.filter((match) => match.type === 'objection').map((match) => ({ label: match.label, explanation: match.explanation, score: match.score })), (item) => normalize(item.label))
  const topics = uniqueBy(ruleResult.matches.filter((match) => match.type === 'topic').map((match) => ({ label: match.label, explanation: match.explanation, score: match.score })), (item) => normalize(item.label))

  const contextTopics = [...topics.map((item) => item.label), ...painPoints.map((item) => item.label), ...businessImpacts.map((item) => item.label), objective, industry].filter(Boolean)
  const recommendedContent = [
    ...rankContent(presentations, products.map((item) => item.label), contextTopics, 'presentation'),
    ...rankContent(assets, products.map((item) => item.label), contextTopics, 'asset'),
    ...contentNodes.map((item) => ({ ...item, id: `taxonomy-${normalize(item.title)}`, type: 'knowledge', score: 90 }))
  ].sort((a, b) => b.score - a.score).slice(0, 8)

  const evidence = ruleResult.matches.map((match) => ({
    label: match.label,
    type: match.type,
    terms: match.terms,
    score: match.score,
    explanation: match.explanation
  }))

  const scoreParts = [ruleResult.confidence, products.length ? 85 : 0, questions.length ? 78 : 0, recommendedContent.length ? 72 : 0].filter(Boolean)
  const confidence = scoreParts.length ? Math.round(scoreParts.reduce((sum, score) => sum + score, 0) / scoreParts.length) : 0

  return {
    provider: 'ISAP Rule Intelligence',
    mode: 'RULE',
    externalTransmission: false,
    confidence,
    painPoints,
    buyingSignals,
    businessImpacts,
    objections,
    topics,
    products,
    questions,
    content: recommendedContent,
    evidence,
    paths
  }
}
