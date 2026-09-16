import { Bell, CalendarDays, DollarSign, Sparkles, Target, TrendingUp } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import { enterpriseKpis, meetings } from '../../data/enterpriseData.js'
import './EnterpriseDashboard.css'

export default function EnterpriseDashboard({ selectedMeeting, onSelectMeeting, onNavigate }) {
  return (
    <IsapShell activeView="dashboard" onNavigate={onNavigate}>
      <main className="ep-page">
        <header className="ep-header">
          <div><span className="ep-kicker">Executive Dashboard</span><h1>Dein Sales Cockpit.</h1><p>Pipeline, heutige Missionen, AI Alerts und naechste Aktionen in einer Ansicht.</p></div>
          <div className="ep-card ep-metric"><span className="ep-pill">Forecast</span><strong>CHF {(enterpriseKpis.forecast/1000000).toFixed(1)}M</strong></div>
        </header>
        <section className="ep-grid ep-three">
          <div className="ep-card ep-metric"><DollarSign size={22}/><span>Pipeline</span><strong>CHF {(enterpriseKpis.pipeline/1000000).toFixed(1)}M</strong></div>
          <div className="ep-card ep-metric"><TrendingUp size={22}/><span>Win Rate</span><strong>{enterpriseKpis.winRate}%</strong></div>
          <div className="ep-card ep-metric"><Bell size={22}/><span>AI Alerts</span><strong>{enterpriseKpis.aiAlerts}</strong></div>
        </section>
        <section className="ep-layout" style={{marginTop:24}}>
          <div className="ep-hero">
            <span className="ep-pill">Today's Mission</span>
            <h2>{selectedMeeting.customer}</h2>
            <p>{selectedMeeting.mission}</p>
            <div className="ep-tags">{selectedMeeting.aiSignals.map(s=><span key={s}>{s}</span>)}</div>
            <button className="ep-button" style={{marginTop:24}} onClick={()=>onNavigate('advisor')}>AI Advisor oeffnen</button>
          </div>
          <aside className="ep-panel">
            <div className="ep-title"><CalendarDays size={18}/><strong>Heute</strong></div>
            <div className="ep-list">{meetings.map(m=><button className="ep-item" key={m.id} onClick={()=>onSelectMeeting(m.id)} style={{width:'100%',textAlign:'left',cursor:'pointer'}}><span>{m.time} · {m.type}</span><strong>{m.customer}</strong><p>{m.businessGoal}</p></button>)}</div>
          </aside>
        </section>
      </main>
    </IsapShell>
  )
}
