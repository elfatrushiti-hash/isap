import { Archive, X } from 'lucide-react'

export default function ArchiveDialog({ meeting, onCancel, onConfirm }) {
  if (!meeting) return null
  return (
    <div className="foundation-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="foundation-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="foundation-modal-close" type="button" onClick={onCancel}><X size={18}/></button>
        <Archive size={30}/>
        <span>Archive meeting</span>
        <h2>{meeting.customer}</h2>
        <p>Das Meeting verschwindet aus dem aktiven Dashboard und bleibt im Archive Center vollstaendig verfuegbar.</p>
        <div className="foundation-modal-actions">
          <button type="button" className="secondary" onClick={onCancel}>Abbrechen</button>
          <button type="button" onClick={onConfirm}>Jetzt archivieren</button>
        </div>
      </div>
    </div>
  )
}
