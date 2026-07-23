import { AlertTriangle, Brain, Radio, Signal, Sparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './AIMeetingCoach.css'

export default function AIMeetingCoach({ selectedMeeting, onNavigate }) {
  return (
    <IsapShell activeView="coach" onNavigate={onNavigate}>
      <main className="ep-page">
        <header className="ep-header"><div><span className="ep-kicker">AI Meeting Coach</span><h1>Live Coaching.</h1><p>Buying Signals, Pain Points, Einwaende und empfohlene Antworten waehrend des Gespraechs.</p></div><div className="ep-card ep-metric"><span>Live Confidence</span><strong>{selectedMeeting.readiness}%</strong></div></header>
        <section className="ep-layout">
          <div className="ep-hero"><span className="ep-pill">Executive Alert</span><h2>Nicht pitchen. Erst diagnostizieren.</h2><p>Der Kunde muss den Business Pain selbst priorisieren. Fuehre durch Fragen, nicht durch Funktionen.</p><div className="ep-tags">{selectedMeeting.livePrompts.map(x=><span key={x}>{x}</span>)}</div></div>
          <aside className="ep-panel"><div className="ep-title"><Radio size={18}/><strong>Live Signals</strong></div><div className="ep-list">{selectedMeeting.buyingSignals.map(x=><div className="ep-item" key={x}><span>Buying Signal</span><strong>{x}</strong></div>)}</div></aside>
        </section>
        <section className="ep-grid ep-two" style={{marginTop:24}}>
          <div className="ep-card"><div className="ep-title"><AlertTriangle size={18}/><strong>Detected Objections</strong></div><div className="ep-list">{selectedMeeting.objections.map(o=><div className="ep-item" key={o.title}><span>{o.title}</span><p>{o.answer}</p></div>)}</div></div>
          <div className="ep-card"><div className="ep-title"><Brain size={18}/><strong>Recommended Response</strong></div><p>Verbinde den Einwand mit dem gemeinsamen Zielbild und frage nach konkreten Auswirkungen im heutigen Prozess.</p></div>
        </section>
      </main>
    </IsapShell>
  )
}
