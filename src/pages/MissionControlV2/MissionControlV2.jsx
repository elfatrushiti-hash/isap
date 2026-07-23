import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock, Sparkles, Users } from 'lucide-react'
import { meetings } from '../../data/meetings.js'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './MissionControlV2.css'

export default function MissionControlV2({ selectedMeetingId, onSelectMeeting, onPrepare, onStartMeeting, onNavigate }) {
  const [localSelectedId, setLocalSelectedId] = useState(meetings[0].id)
  const activeId = selectedMeetingId || localSelectedId
  const selectedMeeting = meetings.find((meeting) => meeting.id === activeId) || meetings[0]
  const tags = useMemo(() => [...selectedMeeting.capabilities, ...selectedMeeting.references].slice(0, 6), [selectedMeeting])

  function handleSelect(meeting) {
    setLocalSelectedId(meeting.id)
    onSelectMeeting?.(meeting.id)
  }

  return (
    <IsapShell activeView="mission" onNavigate={onNavigate}>
      <main className="mc2-page">
        <header className="mc2-header">
          <div><span className="mc2-kicker">Intrum Sales Advisory Platform</span><h1>Guten Morgen Thomas.</h1><p>Heute stehen {meetings.length} wichtige Kundengespraeche an.</p></div>
          <div className="mc2-profile"><div className="mc2-avatar">TM</div><div><strong>Advisor Mode</strong><span>Intrum Schweiz</span></div></div>
        </header>
        <section className="mc2-layout">
          <aside className="mc2-panel"><div className="mc2-panel-title"><CalendarDays size={18} /><span>Heute</span></div><div className="mc2-meeting-list">{meetings.map((meeting) => <button key={meeting.id} type="button" className={`mc2-meeting-card ${selectedMeeting.id === meeting.id ? 'active' : ''}`} onClick={() => handleSelect(meeting)}><span className="mc2-time">{meeting.time}</span><strong>{meeting.customer}</strong><small>{meeting.type}</small></button>)}</div></aside>
          <div className="mc2-center">
            <section className="mc2-hero"><span className="mc2-pill">Today's Mission</span><h2>{selectedMeeting.customer}</h2><p>{selectedMeeting.mission}</p><div className="mc2-readiness"><div className="mc2-readiness-head"><span>Meeting Readiness</span><strong>{selectedMeeting.readiness}%</strong></div><div className="mc2-track"><span style={{ width: `${selectedMeeting.readiness}%` }} /></div></div><div className="mc2-meta-grid"><div><Clock size={18} /><span>Uhrzeit</span><strong>{selectedMeeting.time}</strong></div><div><Sparkles size={18} /><span>Meetingtyp</span><strong>{selectedMeeting.type}</strong></div><div><Users size={18} /><span>Teilnehmer</span><strong>{selectedMeeting.participants.length}</strong></div></div><div className="mc2-actions"><button className="mc2-primary" type="button" onClick={() => onPrepare?.(selectedMeeting.id)}>Meeting vorbereiten <ArrowRight size={18} /></button><button className="mc2-secondary" type="button" onClick={() => onStartMeeting?.(selectedMeeting.id)}>Meeting starten</button></div></section>
            <section className="mc2-focus-strip"><div><span className="mc2-kicker">Context</span><h3>Was heute relevant ist</h3></div><div className="mc2-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
          </div>
          <aside className="mc2-panel mc2-lens"><div className="mc2-panel-title"><Sparkles size={18} /><span>Advisor Lens</span></div><div className="mc2-lens-block"><span>Business Goal</span><strong>{selectedMeeting.businessGoal}</strong></div><div className="mc2-lens-block"><span>Today's Focus</span><strong>{selectedMeeting.focus}</strong></div><div className="mc2-lens-block"><span>Next Best Question</span><p>{selectedMeeting.nextBestQuestion}</p></div><div className="mc2-lens-block"><span>Next Step</span><strong>{selectedMeeting.nextStep}</strong></div><div className="mc2-lens-block"><span>Meeting Confidence</span><strong>{selectedMeeting.confidence}</strong></div></aside>
        </section>
      </main>
    </IsapShell>
  )
}
