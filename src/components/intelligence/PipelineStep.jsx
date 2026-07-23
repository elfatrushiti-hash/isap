import { Check, Circle, Clock3, LoaderCircle, TriangleAlert } from 'lucide-react'

function formatDuration(durationMs) {
  if (!durationMs) return null
  return `${Math.max(1, Math.round(durationMs / 1000))} sec`
}

export default function PipelineStep({ step, index }) {
  const Icon = step.status === 'completed'
    ? Check
    : step.status === 'running'
      ? LoaderCircle
      : step.status === 'failed'
        ? TriangleAlert
        : Circle

  return (
    <article className={`intelligence-step ${step.status}`}>
      <div className="intelligence-step-marker"><Icon size={17}/></div>
      <div className="intelligence-step-copy">
        <div className="intelligence-step-title"><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.label}</h3></div>
        <p>{step.description}</p>
      </div>
      <div className="intelligence-step-state">
        <strong>{step.status === 'running' ? 'Running' : step.status === 'completed' ? 'Completed' : step.status === 'failed' ? 'Failed' : 'Waiting'}</strong>
        {formatDuration(step.durationMs) && <small><Clock3 size={12}/>{formatDuration(step.durationMs)}</small>}
      </div>
    </article>
  )
}
