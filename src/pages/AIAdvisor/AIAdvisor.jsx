import { Bot, Brain, CheckCircle2, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './AIAdvisor.css'

export default function AIAdvisor({ selectedMeeting, onNavigate }) {
  return (
    <IsapShell activeView="advisor" onNavigate={onNavigate}>
      <main className="ep-page">
        <header className="ep-header">
          <div><span className="ep-kicker">AI Advisor</span><h1>Copilot fuer {selectedMeeting.customer}.</h1><p>Empfehlungen, Einwaende, Buying Signals und Next Best Actions fuer den aktuellen Deal.</p></div>
          <div className="ep-card ep-metric"><span className="ep-pill">Opportunity Score</span><strong>{selectedMeeting.opportunityScore}</strong></div>
        </header>
        <section className="ep-layout">
          <div className="ep-grid">
            <section className="ep-hero"><span className="ep-pill">Next Best Action</span><h2>{selectedMeeting.nextStep}</h2><p>{selectedMeeting.strategy?.close || 'Naechsten Schritt konkret und messbar vereinbaren.'}</p></section>
            <section className="ep-grid ep-two">
              <div className="ep-card"><div className="ep-title"><CheckCircle2 size={18}/><strong>Buying Signals</strong></div><div className="ep-list">{selectedMeeting.buyingSignals.map(x=><div className="ep-item" key={x}><strong>{x}</strong></div>)}</div></div>
              <div className="ep-card"><div className="ep-title"><ShieldAlert size={18}/><strong>Risikoanalyse</strong></div><div className="ep-list">{selectedMeeting.risks.map(x=><div className="ep-item" key={x}><strong>{x}</strong></div>)}</div></div>
            </section>
          </div>
          <aside className="ep-panel"><div className="ep-title"><Bot size={18}/><strong>Advisor Chat Preview</strong></div><div className="ep-list"><div className="ep-item"><span>Empfehlung</span><p>Beginne mit Prozessverstaendnis. Fuehre den Kunden durch Pain Point, Auswirkung und naechsten Schritt.</p></div><div className="ep-item"><span>Next Question</span><p>{selectedMeeting.nextBestQuestion}</p></div></div></aside>
        </section>
      </main>
    </IsapShell>
  )
}
