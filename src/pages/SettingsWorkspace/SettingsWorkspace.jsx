import { Database, Mail, ShieldCheck } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './SettingsWorkspace.css'

export default function SettingsWorkspace({ onNavigate }) {
  return (
    <IsapShell activeView="settings" onNavigate={onNavigate}>
      <main className="settings-page">
        <span>Foundation configuration</span><h1>Settings.</h1><p>Die Connectoren sind fuer die naechsten Pakete vorbereitet.</p>
        <div className="settings-grid">
          <article><Mail size={22}/><h2>Microsoft Outlook</h2><p>Kalender-Synchronisation ueber Microsoft Graph.</p><button type="button">Coming in Package 4</button></article>
          <article><Database size={22}/><h2>CRM</h2><p>Salesforce und Dynamics Synchronisation.</p><button type="button">Connector prepared</button></article>
          <article><ShieldCheck size={22}/><h2>Governance</h2><p>Rollen, Datenfreigaben und Auditierbarkeit.</p><button type="button">Policy placeholder</button></article>
        </div>
      </main>
    </IsapShell>
  )
}
