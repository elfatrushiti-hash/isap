import { useMemo, useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, CalendarClock, CircleDollarSign, Lightbulb, Newspaper, Route, Users } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import CompanyHeader from '../../components/company/CompanyHeader.jsx'
import CompanyTabs from '../../components/company/CompanyTabs.jsx'
import ExecutiveBriefCard from '../../components/company/ExecutiveBriefCard.jsx'
import CompanyHealthCard from '../../components/company/CompanyHealthCard.jsx'
import IntrumFitCard from '../../components/company/IntrumFitCard.jsx'
import SwotGrid from '../../components/company/SwotGrid.jsx'
import { buildCompanyWorkspace, getCompanyHealth } from '../../services/companyService.js'
import './CompanyIntelligence.css'

function ListCard({ title, icon: Icon, items }) {
  return (
    <section className="company-card">
      <div className="company-card-heading"><div><span className="company-card-icon"><Icon size={18}/></span><h2>{title}</h2></div></div>
      <ul className="company-clean-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  )
}

export default function CompanyIntelligence({ selectedMeeting, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview')
  const workspace = useMemo(() => buildCompanyWorkspace(selectedMeeting), [selectedMeeting])
  const health = useMemo(() => getCompanyHealth(workspace), [workspace])

  if (!workspace) {
    return (
      <IsapShell activeView="company" onNavigate={onNavigate}>
        <main className="company-workspace"><div className="company-empty"><h1>No company selected</h1><p>Select a meeting on the dashboard first.</p><button type="button" onClick={() => onNavigate?.('dashboard')}>Back to Dashboard</button></div></main>
      </IsapShell>
    )
  }

  const renderTab = () => {
    if (activeTab === 'management') return <div className="company-grid three">{workspace.management.map((person) => <section className="company-card company-person-card" key={`${person.name}-${person.role}`}><span className="company-person-icon"><Users size={20}/></span><h3>{person.name}</h3><strong>{person.role}</strong><p>{person.relevance}</p></section>)}</div>
    if (activeTab === 'financials') return <div className="company-grid three">{workspace.financials.map((item) => <section className="company-card company-metric-card" key={item.label}><CircleDollarSign size={20}/><span>{item.label}</span><strong>{item.value}</strong><p>{item.note}</p></section>)}</div>
    if (activeTab === 'strategy') return <div className="company-stack"><ListCard title="Strategic Initiatives" icon={Route} items={workspace.strategicInitiatives}/><SwotGrid swot={workspace.swot}/></div>
    if (activeTab === 'news') return <div className="company-news-list">{workspace.news.map((item) => <article className="company-card company-news-card" key={`${item.date}-${item.title}`}><div className="company-news-date"><CalendarClock size={17}/>{item.date}</div><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p></div></article>)}</div>
    if (activeTab === 'opportunities') return <div className="company-grid two"><IntrumFitCard items={workspace.intrumFit}/><ListCard title="Meeting Opportunities" icon={BriefcaseBusiness} items={workspace.opportunities}/><ListCard title="Known Pain Points" icon={Lightbulb} items={workspace.painPoints.length ? workspace.painPoints : ['Validate pain points in discovery']}/><ListCard title="Risks" icon={Newspaper} items={workspace.risks.length ? workspace.risks : ['No material risk recorded yet']}/></div>
    if (activeTab === 'insights') return <div className="company-grid two"><ListCard title="Prioritized Discovery Questions" icon={Lightbulb} items={workspace.discoveryQuestions}/><IntrumFitCard items={workspace.intrumFit}/></div>
    return <div className="company-grid two company-overview-grid"><div className="company-stack"><ExecutiveBriefCard workspace={workspace}/><ListCard title="Strategic Initiatives" icon={Route} items={workspace.strategicInitiatives}/></div><div className="company-stack"><CompanyHealthCard health={health}/><IntrumFitCard items={workspace.intrumFit}/></div><section className="company-card company-wide-card"><div className="company-card-heading"><div><span className="company-card-icon"><CalendarClock size={18}/></span><h2>Company Timeline</h2></div></div><div className="company-timeline">{workspace.timeline.map((item) => <article key={`${item.year}-${item.title}`}><span>{item.year}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div></section></div>
  }

  return (
    <IsapShell activeView="company" onNavigate={onNavigate}>
      <main className="company-workspace">
        <button className="company-back" type="button" onClick={() => onNavigate?.('dashboard')}><ArrowLeft size={16}/> Dashboard</button>
        <CompanyHeader workspace={workspace}/>
        <CompanyTabs activeTab={activeTab} onChange={setActiveTab}/>
        <div className="company-tab-content">{renderTab()}</div>
      </main>
    </IsapShell>
  )
}
