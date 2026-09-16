import { Activity, CalendarCheck, ListTodo, Users } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './CRMWorkspace.css'

const EMPTY_CRM = {
  contacts: [],
  tasks: [],
  history: [],
  activities: []
}

function CrmList({ items = [], emptyLabel }) {
  if (!items.length) {
    return <div className="ep-item"><span>{emptyLabel}</span></div>
  }

  return items.map((item, index) => (
    <div className="ep-item" key={`${String(item)}-${index}`}>
      <strong>{item}</strong>
    </div>
  ))
}

export default function CRMWorkspace({ selectedMeeting, onNavigate }) {
  if (!selectedMeeting) {
    return (
      <IsapShell activeView="crm" onNavigate={onNavigate}>
        <main className="ep-page">
          <header className="ep-header">
            <div>
              <span className="ep-kicker">CRM Workspace</span>
              <h1>No meeting selected.</h1>
              <p>Select a meeting to view its CRM workspace.</p>
            </div>
          </header>
        </main>
      </IsapShell>
    )
  }

  const crm = {
    ...EMPTY_CRM,
    ...(selectedMeeting.crm || {})
  }
  const forecast = Number(selectedMeeting.forecast) || 0

  return (
    <IsapShell activeView="crm" onNavigate={onNavigate}>
      <main className="ep-page">
        <header className="ep-header">
          <div>
            <span className="ep-kicker">CRM Workspace</span>
            <h1>{selectedMeeting.customer || 'Customer'} Pipeline.</h1>
            <p>Opportunity, Kontakte, Historie, Tasks und naechste Aktivitaeten.</p>
          </div>
          <div className="ep-card ep-metric">
            <span>Forecast</span>
            <strong>CHF {(forecast / 1000).toFixed(0)}k</strong>
          </div>
        </header>

        <section className="ep-grid ep-three">
          <div className="ep-card"><span className="ep-pill">Stage</span><h2>{selectedMeeting.stage || '-'}</h2></div>
          <div className="ep-card"><span className="ep-pill">Close Date</span><h2>{selectedMeeting.closeDate || '-'}</h2></div>
          <div className="ep-card"><span className="ep-pill">Owner</span><h2>{selectedMeeting.owner || '-'}</h2></div>
        </section>

        <section className="ep-grid ep-two" style={{ marginTop: 24 }}>
          <div className="ep-card">
            <div className="ep-title"><Users size={18} /><strong>Contacts</strong></div>
            <div className="ep-list"><CrmList items={crm.contacts} emptyLabel="No contacts available" /></div>
          </div>
          <div className="ep-card">
            <div className="ep-title"><ListTodo size={18} /><strong>Tasks</strong></div>
            <div className="ep-list"><CrmList items={crm.tasks} emptyLabel="No tasks available" /></div>
          </div>
          <div className="ep-card">
            <div className="ep-title"><Activity size={18} /><strong>Activity Timeline</strong></div>
            <div className="ep-list"><CrmList items={crm.history} emptyLabel="No history available" /></div>
          </div>
          <div className="ep-card">
            <div className="ep-title"><CalendarCheck size={18} /><strong>Recent Activities</strong></div>
            <div className="ep-list"><CrmList items={crm.activities} emptyLabel="No activities available" /></div>
          </div>
        </section>
      </main>
    </IsapShell>
  )
}
