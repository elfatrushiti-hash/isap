import { statusMeta } from '../../data/statuses.js'

export default function StatusBadge({ status }) {
  const meta = statusMeta[status] || { label: status || 'Unknown', tone: 'neutral' }
  return <span className={`foundation-status foundation-status-${meta.tone}`}>{meta.label}</span>
}
