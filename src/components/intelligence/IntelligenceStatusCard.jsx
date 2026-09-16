import { CheckCircle2, LoaderCircle, Sparkles } from 'lucide-react'

export default function IntelligenceStatusCard({ meeting, onOpen }) {
  const ready = meeting.status === 'READY' || meeting.intelligenceProgress >= 100
  return (
    <section className={`intelligence-status-card ${ready ? 'ready' : ''}`}>
      <div className="intelligence-status-icon">{ready ? <CheckCircle2 size={20}/> : <LoaderCircle size={20}/>}</div>
      <div className="intelligence-status-copy">
        <span>{meeting.customer}</span>
        <h3>{ready ? 'Intelligence ready' : 'Intelligence running'}</h3>
        <div className="intelligence-mini-progress"><i style={{ width: `${meeting.intelligenceProgress || 0}%` }}/></div>
        <small>{meeting.intelligenceProgress || 0}% complete</small>
      </div>
      <button type="button" onClick={onOpen}><Sparkles size={15}/>{ready ? 'Open brief' : 'View pipeline'}</button>
    </section>
  )
}
