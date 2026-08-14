function formatTime(value) {
  if (!value) return '--:--'
  return new Intl.DateTimeFormat('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(value))
}

export default function PipelineTimeline({ steps }) {
  const events = steps.filter((step) => step.startedAt)
  return (
    <section className="intelligence-panel intelligence-timeline">
      <div className="intelligence-panel-heading"><span>Live log</span><h2>Pipeline timeline</h2></div>
      <div className="intelligence-timeline-list">
        {events.map((step) => (
          <div key={step.id}>
            <time>{formatTime(step.completedAt || step.startedAt)}</time>
            <i className={step.status}/>
            <p><strong>{step.label}</strong><span>{step.status === 'completed' ? 'Completed' : 'Running'}</span></p>
          </div>
        ))}
      </div>
    </section>
  )
}
