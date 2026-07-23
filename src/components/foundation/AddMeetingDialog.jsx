import { useState } from 'react'
import { CalendarPlus, X } from 'lucide-react'

const initialForm = {
  company: '', contact: '', date: '2026-07-21', time: '10:00', type: 'Customer Meeting', goal: '', source: 'Manual'
}

export default function AddMeetingDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState(initialForm)
  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    if (!form.company.trim()) return
    onCreate(form)
    setForm(initialForm)
    onClose()
  }

  return (
    <div className="foundation-modal-backdrop" role="presentation" onClick={onClose}>
      <form className="foundation-modal foundation-form" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <button className="foundation-modal-close" type="button" onClick={onClose}><X size={18}/></button>
        <CalendarPlus size={30}/>
        <span>New meeting</span>
        <h2>Kundenmeeting erfassen</h2>
        <label>Unternehmen<input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="z.B. Migros Bank" autoFocus /></label>
        <label>Ansprechpartner<input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="Name und Rolle" /></label>
        <div className="foundation-form-grid">
          <label>Datum<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
          <label>Zeit<input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></label>
        </div>
        <label>Meeting-Typ<input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /></label>
        <label>Ziel<textarea value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} placeholder="Was soll im Meeting erreicht werden?" /></label>
        <div className="foundation-modal-actions">
          <button type="button" className="secondary" onClick={onClose}>Abbrechen</button>
          <button type="submit">Meeting erstellen</button>
        </div>
      </form>
    </div>
  )
}
