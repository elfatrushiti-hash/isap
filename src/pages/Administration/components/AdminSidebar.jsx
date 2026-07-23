import { Boxes, BrainCircuit, FolderKanban, Gauge, Layers3, PlugZap, Presentation } from 'lucide-react'
import { adminSections } from '../../../data/admin.js'

const icons = {
  overview: Gauge,
  products: Boxes,
  assets: FolderKanban,
  presentations: Presentation,
  categories: Layers3,
  'ai-settings': BrainCircuit,
  integrations: PlugZap
}

export default function AdminSidebar({ activeSection, onSelect }) {
  return (
    <aside className="admin-sidebar" aria-label="Administration navigation">
      <div className="admin-sidebar-heading">
        <span>Platform</span>
        <strong>Administration</strong>
      </div>
      <nav>
        {adminSections.map((section) => {
          const Icon = icons[section.id]
          return (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => onSelect(section.id)}
            >
              <Icon size={18} />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
