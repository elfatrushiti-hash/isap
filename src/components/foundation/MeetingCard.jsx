import { Archive, ArrowRight, Clock3, MapPin } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'

export default function MeetingCard({ meeting, selected, onSelect, onOpen, onArchive }) {
  return (
    <article className={`foundation-meeting-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="foundation-meeting-topline">
        <StatusBadge status={meeting.status} />
        <span className="foundation-source">{meeting.source}</span>
      </div>
      <h3>{meeting.customer}</h3>
      <p>{meeting.businessGoal}</p>
      <div className="foundation-meeting-meta">
        <span><Clock3 size={14}/>{meeting.time}</span>
        <span><MapPin size={14}/>{meeting.city || 'Online'}</span>
      </div>
      <div className="foundation-progress-row">
        <div><span>Intelligence</span><strong>{meeting.intelligenceProgress}%</strong></div>
        <div className="foundation-progress"><i style={{ width: `${meeting.intelligenceProgress}%` }} /></div>
      </div>
      <div className="foundation-score-row">
        <div><span>AI Score</span><strong>{meeting.opportunityScore || '—'}</strong></div>
        <div><span>Readiness</span><strong>{meeting.readiness || '—'}{meeting.readiness ? '%' : ''}</strong></div>
      </div>
      <div className="foundation-card-actions">
        <button type="button" className="secondary" onClick={(event) => { event.stopPropagation(); onArchive?.() }}><Archive size={15}/> Archive</button>
        <button type="button" onClick={(event) => { event.stopPropagation(); onOpen?.() }}>{meeting.status === 'INTELLIGENCE_RUNNING' ? 'Pipeline' : 'Open'} <ArrowRight size={15}/></button>
      </div>
    </article>
  )
}
