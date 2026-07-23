import { ArrowLeft, CheckCircle2, MessageSquareText, Mic, Pause, Play, Sparkles } from 'lucide-react'
import { useState } from 'react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './MeetingWorkspace.css'

export default function MeetingWorkspace({ selectedMeeting, onBack, onNavigate }) {
  const [activePhase, setActivePhase] = useState(selectedMeeting.conversationFlow[0].phase)
  const [notes, setNotes] = useState('')
  const phase = selectedMeeting.conversationFlow.find((item) => item.phase === activePhase) || selectedMeeting.conversationFlow[0]

  return (
    <IsapShell activeView="meeting" onNavigate={onNavigate}>
      <main className="meet-page">
        <header className="meet-header">
          <button className="meet-back" type="button" onClick={onBack}><ArrowLeft size={18} />Zurueck</button>
          <div><span className="meet-kicker">Live Meeting Workspace</span><h1>{selectedMeeting.customer}</h1><p>{selectedMeeting.businessGoal} · {selectedMeeting.type} · {selectedMeeting.time}</p></div>
          <div className="meet-status"><Mic size={18} /><span>Advisor Mode</span><strong>Live Guidance</strong></div>
        </header>
        <section className="meet-layout">
          <aside className="meet-panel"><div className="meet-title"><Sparkles size={18} /><strong>Conversation Navigator</strong></div><div className="meet-phases">{selectedMeeting.conversationFlow.map((item) => <button key={item.phase} type="button" className={item.phase === activePhase ? 'active' : ''} onClick={() => setActivePhase(item.phase)}><span>{item.phase}</span><small>{item.prompt}</small></button>)}</div></aside>
          <section className="meet-main"><div className="meet-hero"><span className="meet-pill">Aktuelle Phase</span><h2>{phase.phase}</h2><p>{phase.prompt}</p><div className="meet-support"><MessageSquareText size={20} /><span>{phase.support}</span></div><div className="meet-controls"><button type="button" className="meet-primary"><Play size={18} />Phase starten</button><button type="button" className="meet-secondary"><Pause size={18} />Pausieren</button></div></div><div className="meet-grid-two"><div className="meet-card"><div className="meet-title"><MessageSquareText size={18} /><strong>Next Best Questions</strong></div><div className="meet-question-list">{selectedMeeting.livePrompts.map((prompt) => <p key={prompt}>{prompt}</p>)}</div></div><div className="meet-card"><div className="meet-title"><CheckCircle2 size={18} /><strong>Live Notes</strong></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Wichtige Aussagen, Pain Points und Zusagen live erfassen..." /></div></div></section>
          <aside className="meet-panel meet-capture"><div className="meet-title"><CheckCircle2 size={18} /><strong>Capture Preview</strong></div><div className="meet-capture-block"><span>Summary</span><p>{selectedMeeting.captureTemplate.summary}</p></div><div className="meet-capture-block"><span>Decisions</span>{selectedMeeting.captureTemplate.decisions.map((item) => <p key={item}>{item}</p>)}</div><div className="meet-capture-block"><span>Next Actions</span>{selectedMeeting.captureTemplate.nextActions.map((item) => <p key={item}>{item}</p>)}</div></aside>
        </section>
      </main>
    </IsapShell>
  )
}
