export const companies = [
  {
    id: 'migros-bank',
    name: 'Migros Bank',
    industry: 'Banking',
    city: 'Zuerich',
    website: 'migrosbank.ch',
    employees: "ca. 1'900",
    revenue: 'CHF 730 Mio.',
    description: 'Schweizer Universalbank mit Fokus auf Privatkunden, digitale Services und effiziente Beratungsprozesse.',
    initiatives: ['Digital Banking', 'Onboarding Automation', 'Compliance Efficiency'],
    solutions: ['Digital Identity', 'Credit Information', 'Compliance Services'],
    intelligenceScore: 94
  },
  {
    id: 'swisscom',
    name: 'Swisscom',
    industry: 'Telecommunication',
    city: 'Ittigen',
    website: 'swisscom.ch',
    employees: "ca. 19'000",
    revenue: 'CHF 11 Mrd.',
    description: 'Fuehrendes Schweizer Telekommunikationsunternehmen mit hoher Kundenbasis und komplexen Kundenprozessen.',
    initiatives: ['Digital Customer Journey', 'Automation', 'Retention Excellence'],
    solutions: ['ReConnect', 'PreConnect', 'Payment Journey'],
    intelligenceScore: 86
  },
  {
    id: 'ubs',
    name: 'UBS',
    industry: 'Banking',
    city: 'Zuerich',
    website: 'ubs.com',
    employees: "ca. 110'000",
    revenue: 'USD 40+ Mrd.',
    description: 'Globale Schweizer Bank mit hohen Anforderungen an Compliance, Risiko, Identifikation und Auditierbarkeit.',
    initiatives: ['Compliance Transformation', 'Digital Identity', 'Risk Governance'],
    solutions: ['Compliance Services', 'Digital Identity', 'Credit Information'],
    intelligenceScore: 97
  },
  {
    id: 'klarna',
    name: 'Klarna',
    industry: 'Financial Services',
    city: 'Stockholm',
    website: 'klarna.com',
    employees: 'Global',
    revenue: 'Not loaded',
    description: 'Global payments and shopping platform.',
    initiatives: ['Payments Growth', 'Shopping Experience', 'Risk Automation'],
    solutions: ['Collections', 'Credit Information', 'Fraud Prevention'],
    intelligenceScore: 0
  },
  {
    id: 'sbb',
    name: 'SBB',
    industry: 'Transportation',
    city: 'Bern',
    website: 'sbb.ch',
    employees: 'Not loaded',
    revenue: 'Not loaded',
    description: 'Swiss public transport and mobility company.',
    initiatives: ['Digital Customer Journey', 'Payment Experience', 'Automation'],
    solutions: ['Credit Information', 'Payment Services', 'Collections'],
    intelligenceScore: 0
  },
  {
    id: 'postfinance',
    name: 'PostFinance',
    industry: 'Banking',
    city: 'Bern',
    website: 'postfinance.ch',
    employees: 'Not loaded',
    revenue: 'Not loaded',
    description: 'Swiss financial institution focused on payments and retail banking.',
    initiatives: ['Digital Banking', 'Risk Management', 'Customer Experience'],
    solutions: ['Credit Information', 'Fraud Prevention', 'Digital Identity'],
    intelligenceScore: 0
  },
  {
    id: 'air-prishtina',
    name: 'Air Prishtina',
    industry: 'Travel',
    city: 'Prishtina',
    website: 'airprishtina.com',
    employees: 'Not loaded',
    revenue: 'Not loaded',
    description: 'Travel and flight services company.',
    initiatives: ['Digital Booking', 'Payment Experience', 'Customer Service'],
    solutions: ['Credit Information', 'Collections', 'Payment Services'],
    intelligenceScore: 0
  }

]

export const getCompanyById = (id) => companies.find((company) => company.id === id)
