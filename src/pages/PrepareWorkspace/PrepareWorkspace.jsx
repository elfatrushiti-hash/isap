import { ArrowLeft, Brain, Building2, CalendarClock, CheckCircle2, FileText, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './PrepareWorkspace.css'

function PanelTitle({ icon: Icon, title, kicker }) {
  return <div className="prep-title">{Icon && <Icon size={18} />}<div>{kicker && <span>{kicker}</span>}<strong>{title}</strong></div></div>
}

export default function PrepareWorkspace({ selectedMeeting, onBack, onStartMeeting, onNavigate }) {
  const meeting = selectedMeeting
  return (
    <IsapShell activeView="prepare" onNavigate={onNavigate}>
      <main className="prep-page">
        <header className="prep-header">
          <button className="prep-back" type="button" onClick={onBack}><ArrowLeft size={18} />Zurueck</button>
          <div><span className="prep-kicker">Prepare Workspace</span><h1>{meeting.customer} vorbereiten.</h1><p>{meeting.mission}</p></div>
          <div className="prep-score"><span>Preparation Score</span><strong>{meeting.readiness}%</strong><button type="button" onClick={onStartMeeting}>Meeting starten</button></div>
        </header>
        <section className="prep-layout">
          <aside className="prep-panel prep-nav"><PanelTitle icon={CalendarClock} title="Meeting Agenda" kicker="Arbeitsplan" />{['Teilnehmer','Unternehmen','Historie','Chancen','Risiken','Dokumente','CRM','E-Mails'].map((item) => <div className="prep-nav-item" key={item}><span /><strong>{item}</strong></div>)}</aside>
          <div className="prep-main">
            <section className="prep-hero-card"><span className="prep-pill">Business Situation</span><h2>{meeting.businessGoal}</h2><div className="prep-bullets">{meeting.businessSituation.map((item) => <p key={item}>{item}</p>)}</div></section>
            <section className="prep-grid-two"><div className="prep-card"><PanelTitle icon={Building2} title="Company Snapshot" kicker={meeting.industry} /><p>{meeting.companySnapshot.description}</p><div className="prep-facts"><div><span>Standort</span><strong>{meeting.city}</strong></div><div><span>Mitarbeitende</span><strong>{meeting.companySnapshot.employees}</strong></div><div><span>Website</span><strong>{meeting.companySnapshot.website}</strong></div></div></div><div className="prep-card"><PanelTitle icon={Lightbulb} title="Potential" kicker="Opportunities" /><div className="prep-tags">{meeting.opportunities.map((item) => <span key={item}>{item}</span>)}</div></div></section>
            <section className="prep-grid-two"><div className="prep-card"><PanelTitle icon={ShieldAlert} title="Pain Points" kicker="Hypothesen" /><div className="prep-list">{meeting.painPoints.map((item) => <div key={item}><CheckCircle2 size={16} /><span>{item}</span></div>)}</div></div><div className="prep-card"><PanelTitle icon={FileText} title="Discovery Fragen" kicker="Gespraechsstuetze" /><div className="prep-questions">{meeting.discoveryQuestions.map((q) => <p key={q}>{q}</p>)}</div></div></section>
            <section className="prep-card"><PanelTitle icon={CalendarClock} title="Meeting Plan" kicker="Ablauf" /><div className="prep-plan">{meeting.agendaPlan.map((step) => <div className="prep-plan-item" key={`${step.time}-${step.title}`}><span>{step.time}</span><div><strong>{step.title}</strong><p>{step.detail}</p></div></div>)}</div></section>
          </div>
          <aside className="prep-panel prep-assistant"><PanelTitle icon={Brain} title="Advisor Assistant" kicker="Today's Advice" /><div className="prep-advice"><span>Gespraechsstrategie</span><p>{meeting.strategy.opening}</p></div><div className="prep-advice"><span>Positionierung</span><p>{meeting.strategy.angle}</p></div><div className="prep-advice"><span>Risiken</span><ul>{meeting.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></div><div className="prep-advice highlighted"><Sparkles size={18} /><div><span>Empfohlener Abschluss</span><p>{meeting.strategy.close}</p></div></div></aside>
        </section>
      </main>
    </IsapShell>
  )
}
