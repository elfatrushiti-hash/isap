import { ArrowLeft, Building2, CheckCircle2, RefreshCw, Sparkles, WandSparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import IntelligencePipeline from '../../components/intelligence/IntelligencePipeline.jsx'
import PipelineTimeline from '../../components/intelligence/PipelineTimeline.jsx'
import ProgressTracker from '../../components/intelligence/ProgressTracker.jsx'
import useIntelligencePipeline from '../../hooks/useIntelligencePipeline.js'
import './IntelligenceWorkspace.css'

export default function IntelligenceWorkspace({ selectedMeeting, onNavigate }) {
  const { meeting, progress, steps, currentStep, estimatedSeconds, restart, finish } = useIntelligencePipeline(selectedMeeting?.id)

  if (!meeting) return null
  const ready = meeting.status === 'READY' || progress >= 100

  return (
    <IsapShell activeView="intelligence" onNavigate={onNavigate}>
      <main className="intelligence-page">
        <header className="intelligence-header">
          <div>
            <button className="intelligence-back" type="button" onClick={() => onNavigate('dashboard')}><ArrowLeft size={16}/> Dashboard</button>
            <span className="intelligence-kicker">Package 2A.2 · Live Intelligence</span>
            <h1>{meeting.customer}</h1>
            <p>{ready ? 'Die Company Intelligence ist abgeschlossen und bereit zur Pruefung.' : 'ISAP analysiert das Unternehmen und erstellt das Executive Briefing.'}</p>
          </div>
          <div className="intelligence-header-actions">
            <button type="button" className="secondary" onClick={restart}><RefreshCw size={16}/> Restart</button>
            {!ready && <button type="button" className="secondary" onClick={finish}><WandSparkles size={16}/> Complete demo</button>}
            <button type="button" disabled={!ready} onClick={() => onNavigate('company')}><Building2 size={16}/> Open Company</button>
          </div>
        </header>

        <ProgressTracker progress={progress} estimatedSeconds={estimatedSeconds} currentStep={currentStep}/>

        {ready && (
          <section className="intelligence-ready-banner">
            <div><CheckCircle2 size={24}/><div><span>READY</span><h2>Executive Brief is available</h2><p>Company profile, strategic signals and opportunity fit were prepared.</p></div></div>
            <button type="button" onClick={() => onNavigate('company')}><Sparkles size={16}/> Review intelligence</button>
          </section>
        )}

        <div className="intelligence-layout">
          <IntelligencePipeline steps={steps}/>
          <PipelineTimeline steps={steps}/>
        </div>
      </main>
    </IsapShell>
  )
}
