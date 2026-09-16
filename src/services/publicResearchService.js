export async function researchOfficialWebsite(url, context = {}) {
  const value = String(url || '').trim()
  if (!value) throw new Error('Enter an official HTTPS website first.')
  const products = (context.products || []).slice(0, 8).map((product) => ({
    name: product.name,
    keywords: (product.keywords || []).slice(0, 10),
    painPoints: (product.painPoints || []).slice(0, 8)
  }))
  const response = await fetch('/api/public-research', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url: value, products })
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error || `Research request failed (${response.status}).`)
  return data
}
