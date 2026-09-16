export const SOURCE_TRUST = {
  TRUSTED: 'TRUSTED',
  ALLOWED: 'ALLOWED',
  RESTRICTED: 'RESTRICTED',
  BLOCKED: 'BLOCKED'
}

export const sourcePolicies = [
  { id: 'corporate-website', label: 'Corporate website', trust: SOURCE_TRUST.TRUSTED, types: ['corporate-website'] },
  { id: 'annual-report', label: 'Annual report', trust: SOURCE_TRUST.TRUSTED, types: ['annual-report'] },
  { id: 'investor-relations', label: 'Investor relations', trust: SOURCE_TRUST.TRUSTED, types: ['investor-relations'] },
  { id: 'press-release', label: 'Official press release', trust: SOURCE_TRUST.TRUSTED, types: ['press-release'] },
  { id: 'established-news', label: 'Established news source', trust: SOURCE_TRUST.ALLOWED, types: ['news'] },
  { id: 'public-register', label: 'Public register', trust: SOURCE_TRUST.ALLOWED, types: ['public-register'] },
  { id: 'unknown-web', label: 'Unknown web source', trust: SOURCE_TRUST.RESTRICTED, types: ['web'] },
  { id: 'personal-social', label: 'Personal social media', trust: SOURCE_TRUST.BLOCKED, types: ['personal-social'] },
  { id: 'data-broker', label: 'Data broker', trust: SOURCE_TRUST.BLOCKED, types: ['data-broker'] }
]

export const sourceTypeOptions = sourcePolicies.map(({ id, label, trust }) => ({ id, label, trust }))
