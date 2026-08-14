import { CalendarDays, PenLine } from 'lucide-react'

export default function MeetingSourceStep({ form, update }) {
  const sources = [
    { id: 'outlook', icon: CalendarDays, title: 'Outlook', text: "Import today's meeting", note: 'Connector prepared' },
    { id: 'manual', icon: PenLine, title: 'Manual', text: 'Create meeting manually', note: 'Available now' }
  ]

  return (
    <section className="wizard-panel">
      <div className="wizard-panel-heading"><span>Step 1</span><h2>Where does the meeting come from?</h2><p>Select a source and confirm the meeting time.</p></div>
      <div className="source-grid">
        {sources.map(({ id, icon: Icon, title, text, note }) => (
          <button key={id} type="button" className={`source-card ${form.source === id ? 'selected' : ''}`} onClick={() => update('source', id)}>
            <span className="source-icon"><Icon size={24}/></span><strong>{title}</strong><span>{text}</span><small>{note}</small>
          </button>
        ))}
      </div>
      <div className="form-grid two-column">
        <label><span>Meeting date *</span><input type="date" value={form.meetingDate} onChange={(event) => update('meetingDate', event.target.value)}/></label>
        <label><span>Meeting time *</span><input type="time" value={form.meetingTime} onChange={(event) => update('meetingTime', event.target.value)}/></label>
      </div>
      {form.source === 'outlook' && <div className="wizard-info">Outlook import is prepared for Microsoft Graph. In this delivery, date and time are confirmed manually.</div>}
    </section>
  )
}
