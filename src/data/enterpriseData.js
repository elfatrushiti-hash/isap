import { initialMeetings } from './meetings.js'

export const meetings = initialMeetings
export const enterpriseKpis = {
  pipeline: initialMeetings.filter((meeting) => meeting.status !== 'ARCHIVED').reduce((sum, meeting) => sum + meeting.forecast, 0),
  forecast: 1230000,
  winRate: 42,
  meetingsToday: initialMeetings.filter((meeting) => meeting.date === '2026-07-21' && meeting.status !== 'ARCHIVED').length,
  openTasks: 3,
  aiAlerts: 7
}

export const globalSearchItems = initialMeetings.map((meeting) => meeting.customer)
