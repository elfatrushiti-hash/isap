export const MEETING_STATUS = Object.freeze({
  NEW: 'NEW',
  INTELLIGENCE_RUNNING: 'INTELLIGENCE_RUNNING',
  READY: 'READY',
  IN_MEETING: 'IN_MEETING',
  CAPTURE: 'CAPTURE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
})

export const statusMeta = {
  NEW: { label: 'New', tone: 'neutral', progress: 10 },
  INTELLIGENCE_RUNNING: { label: 'Intelligence running', tone: 'warning', progress: 45 },
  READY: { label: 'Ready', tone: 'success', progress: 100 },
  IN_MEETING: { label: 'In meeting', tone: 'live', progress: 100 },
  CAPTURE: { label: 'Capture', tone: 'warning', progress: 100 },
  COMPLETED: { label: 'Completed', tone: 'success', progress: 100 },
  ARCHIVED: { label: 'Archived', tone: 'neutral', progress: 100 }
}

export const activeStatuses = [
  MEETING_STATUS.NEW,
  MEETING_STATUS.INTELLIGENCE_RUNNING,
  MEETING_STATUS.READY,
  MEETING_STATUS.IN_MEETING,
  MEETING_STATUS.CAPTURE
]
