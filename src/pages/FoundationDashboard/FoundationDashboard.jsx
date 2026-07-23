import { useMemo, useState } from 'react'
import { Archive, Bell, CalendarPlus, CheckSquare, RefreshCw, Sparkles, Target, TrendingUp } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import AddMeetingDialog from '../../components/foundation/AddMeetingDialog.jsx'
import ArchiveDialog from '../../components/foundation/ArchiveDialog.jsx'
import EmptyState from '../../components/foundation/EmptyState.jsx'
import MeetingCard from '../../components/foundation/MeetingCard.jsx'
import MetricCard from '../../components/foundation/MetricCard.jsx'
import IntelligenceStatusCard from '../../components/intelligence/IntelligenceStatusCard.jsx'
import { useIsapStore } from '../../context/IsapStore.jsx'
import './FoundationDashboard.css'

export default function FoundationDashboard({ onNavigate }) {
  const { activeMeetings, archivedMeetings, tasks, selectedMeetingId, setSelectedMeetingId, archiveMeeting, addMeeting } = useIsapStore()
  const [showAdd, setShowAdd] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState(null)

  const pipeline = useMemo(() => activeMeetings.reduce((sum, meeting) => sum + (meeting.forecast || 0), 0), [activeMeetings])
  const readyCount = activeMeetings.filter((meeting) => meeting.status === 'READY').length
  const openTasks = tasks.filter((task) => !task.completed).length
  const runningMeetings = activeMeetings.filter((meeting) => meeting.status === 'INTELLIGENCE_RUNNING')

  return (
    <IsapShell activeView="dashboard" onNavigate={onNavigate}>
      <main className="foundation-page">
        <header className="foundation-dashboard-header">
          <div>
            <span className="foundation-kicker">Morning Intelligence</span>
            <h1>Guten Morgen, Thomas.</h1>
            <p>Priorisiere deine Meetings, pruefe die Intelligence und starte vorbereitet in den Tag.</p>
          </div>
          <div className="foundation-header-actions">
            <button type="button" className="secondary"><RefreshCw size={17}/> Outlook sync</button>
            <button type="button" onClick={() => onNavigate('intake')}><CalendarPlus size={17}/> Meeting vorbereiten</button>
          </div>
        </header>

        <section className="foundation-metrics">
          <MetricCard icon={Target} label="Active meetings" value={activeMeetings.length} hint={`${readyCount} ready`} />
          <MetricCard icon={TrendingUp} label="Pipeline" value={`CHF ${(pipeline / 1000000).toFixed(1)}M`} hint="active meetings" />
          <MetricCard icon={CheckSquare} label="Open tasks" value={openTasks} hint="today and tomorrow" />
          <MetricCard icon={Archive} label="Archive" value={archivedMeetings.length} hint="completed records" />
        </section>

        {runningMeetings.length > 0 && (
          <section className="foundation-intelligence-strip">
            {runningMeetings.map((meeting) => (
              <IntelligenceStatusCard key={meeting.id} meeting={meeting} onOpen={() => { setSelectedMeetingId(meeting.id); onNavigate('intelligence') }}/>
            ))}
          </section>
        )}

        <section className="foundation-dashboard-layout">
          <div>
            <div className="foundation-section-heading">
              <div><span>Today's meetings</span><h2>Priority Queue</h2></div>
              <div className="foundation-filter-pills"><button className="active">Active</button><button onClick={() => onNavigate('archive')}>Archived</button></div>
            </div>
            {activeMeetings.length ? (
              <div className="foundation-meeting-grid">
                {[...activeMeetings].sort((a, b) => b.opportunityScore - a.opportunityScore).map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    selected={selectedMeetingId === meeting.id}
                    onSelect={() => setSelectedMeetingId(meeting.id)}
                    onOpen={() => onNavigate(meeting.status === 'INTELLIGENCE_RUNNING' ? 'intelligence' : 'company')}
                    onArchive={() => setArchiveTarget(meeting)}
                  />
                ))}
              </div>
            ) : <EmptyState onAction={() => onNavigate('intake')} />}
          </div>

          <aside className="foundation-side-column">
            <section className="foundation-card foundation-mission-card">
              <Sparkles size={20}/><span>AI Recommendation</span>
              <h3>UBS zuerst vorbereiten.</h3>
              <p>Hoher Opportunity Score, Executive Meeting und noch unvollstaendige Intelligence.</p>
              <button type="button" onClick={() => { setSelectedMeetingId('m3'); onNavigate('company') }}>Company Intelligence</button>
            </section>
            <section className="foundation-card foundation-task-card">
              <div className="foundation-section-heading compact"><div><span>Today</span><h2>Tasks</h2></div><Bell size={18}/></div>
              <div className="foundation-task-list">
                {tasks.slice(0, 4).map((task) => <label key={task.id} className={task.completed ? 'done' : ''}><input type="checkbox" checked={task.completed} readOnly/><span>{task.title}</span><small>{task.due}</small></label>)}
              </div>
            </section>
          </aside>
        </section>
      </main>
      <AddMeetingDialog open={showAdd} onClose={() => setShowAdd(false)} onCreate={addMeeting}/>
      <ArchiveDialog meeting={archiveTarget} onCancel={() => setArchiveTarget(null)} onConfirm={() => { archiveMeeting(archiveTarget.id); setArchiveTarget(null) }}/>
    </IsapShell>
  )
}
