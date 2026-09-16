import dns from 'node:dns/promises'
import net from 'node:net'

const MAX_BYTES = 2 * 1024 * 1024
const MAX_PAGES = 8
const ALLOWED_TYPES = ['text/html', 'text/plain', 'application/xhtml+xml']
const MANAGEMENT_TERMS = ['management','leadership','executive','executives','team','board','people','who-we-are','about-us']

function privateIp(ip) {
  if (net.isIP(ip) === 4) {
    const p = ip.split('.').map(Number)
    return p[0] === 10 || p[0] === 127 || p[0] === 0 || (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || p[0] >= 224
  }
  if (net.isIP(ip) === 6) {
    const v = ip.toLowerCase()
    return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')
  }
  return true
}

async function validateUrl(value, expectedHost = null) {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('Only HTTPS public sources are allowed.')
  if (url.username || url.password) throw new Error('Credential-bearing URLs are blocked.')
  if (expectedHost && url.hostname !== expectedHost) throw new Error('Cross-domain crawl blocked by source policy.')
  const records = await dns.lookup(url.hostname, { all: true, verbatim: true })
  if (!records.length || records.some((item) => privateIp(item.address))) throw new Error('Private or non-public network destination blocked.')
  return url
}

async function safeFetch(input, expectedHost) {
  let current = await validateUrl(input, expectedHost)
  for (let redirect = 0; redirect < 4; redirect += 1) {
    const response = await fetch(current, {
      redirect: 'manual',
      headers: {
        'user-agent': 'ISAP-PublicResearch/3.2.1 (+relevance-first-company-intelligence)',
        accept: 'text/html,text/plain,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(9000)
    })
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get('location')
      if (!location) throw new Error('Invalid redirect.')
      current = await validateUrl(new URL(location, current).toString(), expectedHost)
      continue
    }
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`)
    const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.includes(type)) throw new Error(`Content type ${type || 'unknown'} is not allowed in the HTML research collector.`)
    const declared = Number(response.headers.get('content-length') || 0)
    if (declared > MAX_BYTES) throw new Error('Source exceeds the 2 MB HTML research limit.')
    const reader = response.body.getReader(); const chunks = []; let total = 0
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      total += value.byteLength
      if (total > MAX_BYTES) { await reader.cancel(); throw new Error('Source exceeded the 2 MB HTML research limit.') }
      chunks.push(value)
    }
    const merged = new Uint8Array(total); let offset = 0
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength }
    return { url: current.toString(), html: new TextDecoder().decode(merged), type, bytes: total }
  }
  throw new Error('Too many redirects.')
}

function decodeEntities(text='') {
  return text.replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
}
function stripHtml(html='') {
  return decodeEntities(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,' ').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,' ').replace(/<!--([\s\S]*?)-->/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())
}
function meta(html, name) {
  const a = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'))
  return decodeEntities((a?.[1] || b?.[1] || '').trim())
}
function titleOf(html) { return decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g,' ').trim()) }
function linksOf(html, base, host) {
  const links = []; const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let match
  while ((match = re.exec(html)) && links.length < 140) {
    try {
      const u = new URL(match[1], base)
      if (u.protocol === 'https:' && u.hostname === host) {
        u.hash=''
        const s=u.toString()
        if (!links.some((item) => item.url === s)) links.push({ url:s, label:stripHtml(match[2]).slice(0,180) })
      }
    } catch {}
  }
  return links
}
function productTerms(products = []) {
  return [...new Set(products.flatMap((product) => [product.name, ...(product.keywords || []), ...(product.painPoints || [])]).map((item) => String(item || '').toLowerCase().trim()).filter((item) => item.length > 2))].slice(0,80)
}
function rankLink(link, terms) {
  const u = new URL(link.url)
  const combined = `${u.pathname} ${link.label}`.toLowerCase()
  const baseTerms=['about','company','news','press','media','investor','sustainability','strategy','annual','report']
  const management = MANAGEMENT_TERMS.reduce((s,t)=>s+(combined.includes(t)?6:0),0)
  const product = terms.reduce((s,t)=>s+(combined.includes(t)?5:0),0)
  const base = baseTerms.reduce((s,t)=>s+(combined.includes(t)?2:0),0)
  return management + product + base - u.pathname.split('/').length * .1
}
function sourceType(url) {
  const p=url.toLowerCase()
  if (/investor|annual|report/.test(p)) return 'investor-relations'
  if (/press|media|newsroom|\/news\//.test(p)) return 'press-release'
  if (/management|leadership|executive|team|board|people/.test(p)) return 'corporate-website'
  return 'corporate-website'
}

function collectJsonLd(html) {
  const entries = []
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = re.exec(html))) {
    try {
      const parsed = JSON.parse(match[1])
      entries.push(...(Array.isArray(parsed) ? parsed : [parsed]))
    } catch {}
  }
  return entries
}
function normalizePerson(person, sourceUrl) {
  if (!person || typeof person !== 'object') return null
  const type = Array.isArray(person['@type']) ? person['@type'] : [person['@type']]
  if (!type.some((item) => String(item || '').toLowerCase() === 'person')) return null
  const name = person.name || [person.givenName, person.familyName].filter(Boolean).join(' ')
  const role = person.jobTitle || person.roleName || person.description || ''
  if (!name || String(name).trim().length < 3) return null
  return { name:String(name).trim(), role:String(role || '').replace(/\s+/g,' ').trim(), sourceUrl, source:'JSON-LD' }
}
function extractPeopleFromJsonLd(html, sourceUrl) {
  const people = []
  const walk = (value) => {
    if (!value) return
    if (Array.isArray(value)) return value.forEach(walk)
    if (typeof value !== 'object') return
    const direct = normalizePerson(value, sourceUrl)
    if (direct) people.push(direct)
    for (const child of Object.values(value)) walk(child)
  }
  collectJsonLd(html).forEach(walk)
  return people
}
function extractPeopleHeuristic(html, sourceUrl) {
  const text = stripHtml(html)
  const people = []
  const roles = '(?:Chief Executive Officer|Chief Financial Officer|Chief Risk Officer|Chief Operating Officer|Chief Technology Officer|Chief Information Officer|Chief Compliance Officer|CEO|CFO|CRO|COO|CTO|CIO|CCO|Managing Director|Executive Director|Vice President|VP|Head of [A-Za-z& /-]{2,45}|Director of [A-Za-z& /-]{2,45})'
  const re = new RegExp(`([A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3})\\s*[-–—,:|]\\s*(${roles})`, 'g')
  let match
  while ((match = re.exec(text)) && people.length < 18) people.push({ name:match[1].trim(), role:match[2].trim(), sourceUrl, source:'visible-text' })
  const reversed = new RegExp(`(${roles})\\s*[-–—,:|]\\s*([A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,3})`, 'g')
  while ((match = reversed.exec(text)) && people.length < 24) people.push({ name:match[2].trim(), role:match[1].trim(), sourceUrl, source:'visible-text' })
  return people
}
function dedupePeople(people = []) {
  const map = new Map()
  for (const person of people) {
    const key = String(person.name || '').toLowerCase().replace(/[^a-z0-9à-ÿ]+/g,' ').trim()
    if (!key || key.length < 3) continue
    const current = map.get(key)
    if (!current || (!current.role && person.role) || (person.source === 'JSON-LD' && current.source !== 'JSON-LD')) map.set(key, person)
  }
  return [...map.values()].slice(0,20)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store')
  if (req.method !== 'POST') return res.status(405).json({ error:'POST required.' })
  try {
    const start = await validateUrl(String(req.body?.url || '').trim())
    const host = start.hostname
    const terms = productTerms(req.body?.products || [])
    const first = await safeFetch(start.toString(), host)
    const candidates = linksOf(first.html, first.url, host)
      .filter((item)=>new URL(item.url).pathname !== new URL(first.url).pathname)
      .sort((a,b)=>rankLink(b,terms)-rankLink(a,terms))
      .slice(0, MAX_PAGES-1)
    const pages = [first]
    for (const item of candidates) { try { pages.push(await safeFetch(item.url, host)) } catch {} }
    const management = dedupePeople(pages.flatMap((page) => [...extractPeopleFromJsonLd(page.html, page.url), ...extractPeopleHeuristic(page.html, page.url)]))
    const results = pages.map((page) => ({
      title: titleOf(page.html) || new URL(page.url).pathname || host,
      url: page.url,
      sourceType: sourceType(page.url),
      description: meta(page.html,'description') || meta(page.html,'og:description'),
      content: stripHtml(page.html).slice(0, 12000),
      retrievedAt: new Date().toISOString(),
      security: { decision:'RELEASED_TEXT_ONLY', https:true, publicNetworkValidated:true, contentType:page.type, bytes:page.bytes, scriptsExecuted:false, binaryDownloaded:false, malwareScannerRequired:false }
    })).filter((item)=>item.content.length > 80)
    return res.status(200).json({
      mode:'RELEVANCE_FIRST_OFFICIAL_SITE_RESEARCH',
      host,
      pages:results,
      management,
      researchTerms:terms,
      policy:{ sameDomainOnly:true, httpsOnly:true, maxPages:MAX_PAGES, maxBytesPerPage:MAX_BYTES, htmlTextOnly:true, externalAi:false, productAwareRanking:true, managementDiscovery:true }
    })
  } catch (error) {
    return res.status(400).json({ error:error?.message || 'Public research failed.' })
  }
}
