export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  ARCHIVED: 'ARCHIVED'
}

export const productCategories = [
  'Credit Information',
  'Collections',
  'Fraud Prevention',
  'Digital Identity',
  'Payment Solutions',
  'Consulting'
]

export const initialProducts = [
  {
    id: 'product-credit-information',
    name: 'Credit Information',
    shortDescription: 'Data-driven credit decisions across the customer lifecycle.',
    description: 'Credit information, monitoring and decisioning services for acquisition, portfolio management and risk prevention.',
    category: 'Credit Information',
    status: PRODUCT_STATUS.ACTIVE,
    color: '#5B2A86',
    icon: 'ChartNoAxesCombined',
    industries: ['Financial Services', 'Telecommunications', 'Retail'],
    painPoints: ['Limited risk transparency', 'Manual credit decisions'],
    keywords: ['credit check', 'risk', 'monitoring'],
    assets: [],
    presentations: [],
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-18T10:30:00.000Z'
  },
  {
    id: 'product-fraud-prevention',
    name: 'Fraud Prevention',
    shortDescription: 'Identify suspicious applications and transactions earlier.',
    description: 'Signals and workflows that help sales, risk and fraud teams prevent avoidable losses without slowing down good customers.',
    category: 'Fraud Prevention',
    status: PRODUCT_STATUS.ACTIVE,
    color: '#B03A5B',
    icon: 'ShieldCheck',
    industries: ['Financial Services', 'E-commerce', 'Telecommunications'],
    painPoints: ['Identity fraud', 'Application fraud'],
    keywords: ['fraud', 'identity', 'prevention'],
    assets: [],
    presentations: [],
    createdAt: '2026-07-02T08:00:00.000Z',
    updatedAt: '2026-07-17T14:15:00.000Z'
  },
  {
    id: 'product-collections',
    name: 'Collections',
    shortDescription: 'Customer-oriented debt collection and receivables management.',
    description: 'Modular collection services that combine operational delivery, digital customer journeys and portfolio intelligence.',
    category: 'Collections',
    status: PRODUCT_STATUS.ACTIVE,
    color: '#2F6E62',
    icon: 'WalletCards',
    industries: ['Financial Services', 'Utilities', 'Healthcare'],
    painPoints: ['Rising arrears', 'High servicing cost'],
    keywords: ['collections', 'receivables', 'debt'],
    assets: [],
    presentations: [],
    createdAt: '2026-07-03T08:00:00.000Z',
    updatedAt: '2026-07-15T09:45:00.000Z'
  },
  {
    id: 'product-digital-identity',
    name: 'Digital Identity',
    shortDescription: 'Reliable identity verification for digital customer journeys.',
    description: 'Identity services designed to reduce friction, support compliance and improve trust in digital onboarding.',
    category: 'Digital Identity',
    status: PRODUCT_STATUS.DRAFT,
    color: '#315B8C',
    icon: 'ScanFace',
    industries: ['Financial Services', 'E-commerce'],
    painPoints: ['Onboarding friction', 'Identity uncertainty'],
    keywords: ['identity', 'verification', 'onboarding'],
    assets: [],
    presentations: [],
    createdAt: '2026-07-08T08:00:00.000Z',
    updatedAt: '2026-07-14T11:10:00.000Z'
  }
]
