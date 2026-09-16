import { Archive, BarChart3, Bot, Building2, CalendarPlus, CheckCircle, Database, Radio, Search, Settings, Sparkles, SlidersHorizontal } from 'lucide-react'
import './isap-shell.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'intake', label: 'Prepare', icon: CalendarPlus },
  { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
  { id: 'advisor', label: 'Advisor', icon: Bot },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'crm', label: 'CRM', icon: Database },
  { id: 'coach', label: 'Coach', icon: Radio },
  { id: 'capture', label: 'Capture', icon: CheckCircle },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'administration', label: 'Admin', icon: SlidersHorizontal },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function IsapShell({ children, activeView = 'dashboard', onNavigate }) {
  return (
    <div className="isap-foundation-shell">
      <aside className="isap-foundation-rail">
        <button className="isap-foundation-logo" type="button" onClick={() => onNavigate?.('dashboard')}>ISAP</button>
        <nav className="isap-foundation-nav" aria-label="ISAP Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} type="button" className={item.id === activeView ? 'active' : ''} onClick={() => onNavigate?.(item.id)}>
                <Icon size={18}/><span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <button className="isap-foundation-command" type="button"><Search size={15}/><span>CTRL K</span></button>
      </aside>
      <div className="isap-foundation-content">{children}</div>
    </div>
  )
}
