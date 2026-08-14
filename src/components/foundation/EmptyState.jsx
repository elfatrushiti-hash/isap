import { CalendarPlus } from 'lucide-react'

export default function EmptyState({ title = 'Keine aktiven Meetings', description = 'Erfasse ein Meeting oder synchronisiere Outlook.', onAction }) {
  return (
    <div className="foundation-empty">
      <CalendarPlus size={30}/>
      <h3>{title}</h3>
      <p>{description}</p>
      {onAction ? <button type="button" onClick={onAction}>Meeting hinzufuegen</button> : null}
    </div>
  )
}
