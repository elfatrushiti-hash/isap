import { ClipboardCheck, FileOutput, Mail, Send, Sparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import './CapturePro.css'

export default function CapturePro({ selectedMeeting, onNavigate }) {
  const meeting = selectedMeeting || {}

  const captureTemplate = meeting.captureTemplate || {
    summary:
      meeting.mission ||
      'Meeting-Zusammenfassung wird anhand der erfassten Notizen und naechsten Schritte vorbereitet.',
    decisions: [
      'Kundensituation wurde besprochen',
      'Pain Points wurden identifiziert',
      'Naechster Schritt wird abgestimmt'
    ],
    nextActions: [
      'Follow-up Mail erstellen',
      'CRM Update vorbereiten',
      'Naechsten Termin vorschlagen'
    ]
  }

  const customer = meeting.customer || 'Aktueller Kunde'

  return (
    <IsapShell activeView="capture" onNavigate={onNavigate}>
      <main className="cap-pro-page">
        <header className="cap-pro-header">
          <div>
            <span className="cap-pro-kicker">Capture 2.0</span>
            <h1>Meeting abschliessen.</h1>
            <p>
              Executive Summary, Decisions, Next Actions, CRM Update und
              Follow-up Mail fuer {customer}.
            </p>
          </div>

          <div className="cap-pro-score">
            <span>CRM Ready</span>
            <strong>92%</strong>
          </div>
        </header>

        <section className="cap-pro-layout">
          <div className="cap-pro-main">
            <section className="cap-pro-hero">
              <span className="cap-pro-pill">Executive Summary</span>
              <h2>{customer}</h2>

              <textarea
                defaultValue={captureTemplate.summary}
                aria-label="Executive Summary"
              />
            </section>

            <section className="cap-pro-grid">
              <div className="cap-pro-card">
                <div className="cap-pro-title">
                  <ClipboardCheck size={18} />
                  <strong>Decisions</strong>
                </div>

                <div className="cap-pro-list">
                  {captureTemplate.decisions.map((item) => (
                    <label key={item}>
                      <input type="checkbox" defaultChecked />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="cap-pro-card">
                <div className="cap-pro-title">
                  <Send size={18} />
                  <strong>Next Actions</strong>
                </div>

                <div className="cap-pro-list">
                  {captureTemplate.nextActions.map((item) => (
                    <label key={item}>
                      <input type="checkbox" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="cap-pro-panel">
            <div className="cap-pro-title">
              <Sparkles size={18} />
              <strong>AI Outputs</strong>
            </div>

            <button type="button">
              <FileOutput size={17} />
              Salesforce Export
            </button>

            <button type="button">
              <FileOutput size={17} />
              Dynamics Export
            </button>

            <button type="button">
              <Mail size={17} />
              Outlook Draft
            </button>

            <button type="button">
              <Send size={17} />
              Teams Summary
            </button>
          </aside>
        </section>
      </main>
    </IsapShell>
  )
}
