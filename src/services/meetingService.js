import { MEETING_STATUS } from '../data/statuses.js'

const wait = (milliseconds = 160) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export function buildMeetingDraft(input) {
  const company = input.company?.name?.trim() || input.newCompany?.name?.trim() || 'New Company'
  const companyId = input.company?.id || company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const contactName = [input.contact?.firstName, input.contact?.lastName].filter(Boolean).join(' ')

  return {
    id: `m-${Date.now()}`,
    companyId,
    customer: company,
    industry: input.company?.industry || input.newCompany?.industry || 'Unknown',
    city: input.company?.city || input.newCompany?.city || '',
    date: input.meetingDate,
    time: input.meetingTime,
    type: input.goal?.label || 'Customer Meeting',
    owner: 'Thomas Meier',
    source: input.source === 'outlook' ? 'Outlook' : 'Manual',
    status: MEETING_STATUS.NEW,
    intelligenceProgress: 0,
    readiness: 12,
    opportunityScore: 0,
    forecast: 0,
    stage: 'New',
    closeDate: '-',
    mission: input.notes?.trim() || input.goal?.description || 'Meeting-Ziel definieren.',
    businessGoal: input.goal?.label || 'Discovery',
    focus: 'Intelligence pending',
    participants: contactName ? [contactName] : [],
    contact: {
      firstName: input.contact?.firstName || '',
      lastName: input.contact?.lastName || '',
      role: input.contact?.role || '',
      email: input.contact?.email || '',
      phone: input.contact?.phone || ''
    },
    nextBestQuestion: 'Was ist fuer Sie das wichtigste Ergebnis dieses Meetings?',
    nextStep: 'Intelligence starten',
    painPoints: [],
    opportunities: [],
    risks: [],
    aiSignals: ['Intelligence noch nicht gestartet'],
    buyingSignals: [],
    livePrompts: ['Geschaeftsziel verstehen'],
    objections: [],
    intake: {
      source: input.source,
      createdAt: new Date().toISOString(),
      notes: input.notes || ''
    },
    captureTemplate: {
      summary: '',
      decisions: [],
      nextActions: []
    }
  }
}

export async function createMeeting(input) {
  await wait()
  return buildMeetingDraft(input)
}

export async function startIntelligence(meeting) {
  await wait()
  return {
    ...meeting,
    status: MEETING_STATUS.INTELLIGENCE_RUNNING,
    intelligenceProgress: Math.max(meeting.intelligenceProgress || 0, 8),
    readiness: Math.max(meeting.readiness || 0, 18),
    nextStep: 'Company Intelligence wird erstellt',
    aiSignals: ['Intelligence Pipeline gestartet'],
    intelligenceStartedAt: new Date().toISOString()
  }
}

export function updateMeeting(meeting, updates) {
  return { ...meeting, ...updates, updatedAt: new Date().toISOString() }
}

export function completeMeeting(meeting) {
  return updateMeeting(meeting, { status: MEETING_STATUS.COMPLETED })
}

export function archiveMeeting(meeting) {
  return updateMeeting(meeting, { status: MEETING_STATUS.ARCHIVED, archivedAt: new Date().toISOString() })
}

export function deleteMeeting(meetingId, meetings) {
  return meetings.filter((meeting) => meeting.id !== meetingId)
}
