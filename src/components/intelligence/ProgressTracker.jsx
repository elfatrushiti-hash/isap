import { Clock3 } from 'lucide-react'

export default function ProgressTracker({ progress, estimatedSeconds, currentStep }) {
  return (
    <section className="intelligence-progress-card">
      <div className="intelligence-progress-heading">
        <div><span>Intelligence progress</span><h2>{progress}%</h2></div>
        <div className="intelligence-eta"><Clock3 size={16}/><span>{progress >= 100 ? 'Completed' : `about ${Math.max(1, estimatedSeconds)} sec remaining`}</span></div>
      </div>
      <div className="intelligence-progress-track" aria-label={`Intelligence progress ${progress}%`}>
        <i style={{ width: `${progress}%` }}/>
      </div>
      <p>{progress >= 100 ? 'Company Intelligence is ready.' : currentStep ? currentStep.description : 'Pipeline is being prepared.'}</p>
    </section>
  )
}
