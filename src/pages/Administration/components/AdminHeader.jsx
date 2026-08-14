import { ShieldCheck } from 'lucide-react'
import { adminSections } from '../../../data/admin.js'

export default function AdminHeader({ activeSection }) {
  const section = adminSections.find((item) => item.id === activeSection) || adminSections[0]
  return (
    <header className="admin-header">
      <div>
        <span className="admin-eyebrow">ISAP Platform Control</span>
        <h1>{section.label}</h1>
        <p>{section.description}</p>
      </div>
      <div className="admin-status-pill"><ShieldCheck size={17} /> Architecture ready</div>
    </header>
  )
}
