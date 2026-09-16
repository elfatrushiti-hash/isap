import { ArrowLeft, BookOpen, Brain, FileText, Layers3, MessageCircleQuestion, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { meetings } from '../../data/meetings.js'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './KnowledgeHub.css'

const allCapabilities = [...new Set(meetings.flatMap((meeting) => meeting.capabilities))]
const allReferences = [...new Set(meetings.flatMap((meeting) => meeting.references))]

export default function KnowledgeHub({ selectedMeeting, onBack, onNavigate }) {
  const [query, setQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(selectedMeeting.capabilities[0])

  const filteredAssets = useMemo(() => {
    const normalized = query.toLowerCase()
    return selectedMeeting.knowledgeAssets.filter((asset) => {
      return (
        asset.title.toLowerCase().includes(normalized) ||
        asset.type.toLowerCase().includes(normalized) ||
        asset.summary.toLowerCase().includes(normalized)
      )
    })
  }, [query, selectedMeeting])

  return (
    <IsapShell activeView="knowledge" onNavigate={onNavigate}>
      <main className="know-page">
        <header className="know-header">
          <button className="know-back" type="button" onClick={onBack}><ArrowLeft size={18} />Zurueck</button>
          <div>
            <span className="know-kicker">Knowledge Hub</span>
            <h1>Wissen fuer {selectedMeeting.customer}.</h1>
            <p>Capabilities, Referenzen, Einwandbehandlung und Gespraechsargumente fuer den aktuellen Beratungskontext.</p>
          </div>
          <div className="know-context"><Sparkles size={18} /><span>Aktueller Fokus</span><strong>{selectedMeeting.focus}</strong></div>
        </header>

        <section className="know-layout">
          <aside className="know-panel know-topics">
            <div className="know-title"><Layers3 size={18} /><strong>Capability Library</strong></div>
            {allCapabilities.map((capability) => (
              <button key={capability} type="button" className={selectedTopic === capability ? 'active' : ''} onClick={() => setSelectedTopic(capability)}>
                <span>{capability}</span>
              </button>
            ))}
          </aside>

          <section className="know-main">
            <div className="know-hero">
              <span className="know-pill">Selected Topic</span>
              <h2>{selectedTopic}</h2>
              <p>Nutze dieses Thema als beratende Hypothese. Nicht als Produkt-Pitch, sondern als strukturierte Antwort auf den erkannten Pain Point.</p>
              <div className="know-search">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Wissen, Assets oder Referenzen suchen..." />
              </div>
            </div>

            <div className="know-grid-two">
              <div className="know-card">
                <div className="know-title"><FileText size={18} /><strong>Relevant Assets</strong></div>
                <div className="know-assets">
                  {filteredAssets.map((asset) => (
                    <article key={asset.title}>
                      <span>{asset.type} · Relevanz {asset.relevance}</span>
                      <strong>{asset.title}</strong>
                      <p>{asset.summary}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="know-card">
                <div className="know-title"><MessageCircleQuestion size={18} /><strong>Objection Handling</strong></div>
                <div className="know-objections">
                  {selectedMeeting.objectionHandling.map((item) => (
                    <article key={item.objection}>
                      <span>Einwand</span>
                      <strong>{item.objection}</strong>
                      <p>{item.response}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="know-card">
              <div className="know-title"><BookOpen size={18} /><strong>References</strong></div>
              <div className="know-reference-grid">
                {allReferences.map((reference) => (
                  <div key={reference}>
                    <span>Reference</span>
                    <strong>{reference}</strong>
                    <p>Als Kontextanker verwenden, wenn Branche, Prozess oder Zielbild vergleichbar ist.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="know-panel know-assistant">
            <div className="know-title"><Brain size={18} /><strong>Advisor Knowledge</strong></div>
            <div className="know-advice">
              <span>Positionierung</span>
              <p>{selectedMeeting.strategy.angle}</p>
            </div>
            <div className="know-advice">
              <span>Beste Frage</span>
              <p>{selectedMeeting.nextBestQuestion}</p>
            </div>
            <div className="know-advice highlighted">
              <Sparkles size={18} />
              <div>
                <span>Empfehlung</span>
                <p>Starte mit dem Business Problem, verbinde danach Pain Point und Capability, und frage erst danach nach dem naechsten Schritt.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </IsapShell>
  )
}
