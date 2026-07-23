import { companies } from '../data/companies.js'
import { companyIntelligenceProfiles, defaultCompanyIntelligence } from '../data/companyIntelligence.js'

function normalize(value = '') {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function findCompanyForMeeting(meeting) {
  if (!meeting) return null
  const byId = companies.find((company) => company.id === meeting.companyId)
  if (byId) return byId
  const customerKey = normalize(meeting.customer)
  return companies.find((company) => normalize(company.name) === customerKey) || {
    id: meeting.companyId || customerKey || 'unknown-company',
    name: meeting.customer || 'Unknown Company',
    industry: meeting.industry || 'Unknown',
    city: meeting.city || '',
    website: 'Not loaded',
    employees: 'Not loaded',
    revenue: 'Not loaded',
    description: 'Company profile generated from the current meeting.',
    initiatives: [],
    solutions: [],
    intelligenceScore: meeting.intelligenceProgress || 0
  }
}

export function buildCompanyWorkspace(meeting) {
  const company = findCompanyForMeeting(meeting)
  if (!company) return null
  const profile = companyIntelligenceProfiles[company.id] || defaultCompanyIntelligence
  const completeness = Math.max(
    company.intelligenceScore || 0,
    meeting?.intelligenceProgress || 0,
    meeting?.status === 'READY' ? 88 : 0
  )

  return {
    ...company,
    ...profile,
    companyId: company.id,
    completeness,
    opportunityScore: meeting?.opportunityScore || 0,
    readiness: meeting?.readiness || 0,
    meetingStatus: meeting?.status || 'NEW',
    meetingGoal: meeting?.businessGoal || meeting?.mission || 'Discovery',
    participants: meeting?.participants || [],
    painPoints: meeting?.painPoints || [],
    opportunities: meeting?.opportunities?.length ? meeting.opportunities : company.solutions || [],
    risks: meeting?.risks || [],
    nextBestQuestion: meeting?.nextBestQuestion || profile.discoveryQuestions?.[0],
    nextStep: meeting?.nextStep || 'Discovery Meeting vorbereiten'
  }
}

export async function loadCompanyWorkspace(meeting) {
  await new Promise((resolve) => window.setTimeout(resolve, 120))
  return buildCompanyWorkspace(meeting)
}

export function getCompanyHealth(workspace) {
  if (!workspace) return []
  return [
    { label: 'Information Completeness', value: workspace.completeness, status: workspace.completeness >= 85 ? 'good' : workspace.completeness >= 60 ? 'medium' : 'low' },
    { label: 'Decision Makers', value: Math.min(100, 45 + (workspace.management?.length || 0) * 15), status: (workspace.management?.length || 0) >= 3 ? 'good' : 'medium' },
    { label: 'Financial Information', value: workspace.financials?.some((item) => item.value !== 'Not loaded') ? 90 : 35, status: workspace.financials?.some((item) => item.value !== 'Not loaded') ? 'good' : 'low' },
    { label: 'Strategy', value: Math.min(100, 40 + (workspace.strategicInitiatives?.length || 0) * 12), status: (workspace.strategicInitiatives?.length || 0) >= 3 ? 'good' : 'medium' }
  ]
}
