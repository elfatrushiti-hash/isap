import { Archive, CalendarDays, RotateCcw, Search } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import EmptyState from '../../components/foundation/EmptyState.jsx'
import StatusBadge from '../../components/foundation/StatusBadge.jsx'
import { useIsapStore } from '../../context/IsapStore.jsx'
import './ArchiveCenter.css'

export default function ArchiveCenter({ onNavigate }) {
  const { archivedMeetings, restoreMeeting, setSelectedMeetingId } = useIsapStore()

  return (
    <IsapShell activeView="archive" onNavigate={onNavigate}>
      <main className="archive-page">
        <header className="archive-header">
          <div><span>Knowledge memory</span><h1>Archive Center.</h1><p>Abgeschlossene Meetings, Executive Summaries und CRM-relevante Ergebnisse bleiben dauerhaft auffindbar.</p></div>
          <div className="archive-search"><Search size={17}/><input placeholder="Archive durchsuchen" /></div>
        </header>

        {archivedMeetings.length ? (
          <div className="archive-list">
            {archivedMeetings.map((meeting) => (
              <article key={meeting.id}>
                <div className="archive-icon"><Archive size={20}/></div>
                <div className="archive-main">
                  <div className="archive-top"><StatusBadge status={meeting.status}/><span><CalendarDays size={14}/>{meeting.date} · {meeting.time}</span></div>
                  <h2>{meeting.customer}</h2>
                  <p>{meeting.captureTemplate?.summary || meeting.mission}</p>
                  <div className="archive-tags"><span>{meeting.stage}</span><span>AI Score {meeting.opportunityScore}</span><span>CHF {(meeting.forecast / 1000).toFixed(0)}k</span></div>
                </div>
                <div className="archive-actions">
                  <button type="button" onClick={() => { setSelectedMeetingId(meeting.id); onNavigate('capture') }}>Open record</button>
                  <button type="button" className="secondary" onClick={() => restoreMeeting(meeting.id)}><RotateCcw size={15}/> Restore</button>
                </div>
              </article>
            ))}
          </div>
        ) : <EmptyState title="Archive ist leer" description="Archivierte Meetings erscheinen hier." />}
      </main>
    </IsapShell>
  )
}
