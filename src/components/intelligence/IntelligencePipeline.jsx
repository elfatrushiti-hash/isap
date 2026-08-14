import PipelineStep from './PipelineStep.jsx'

export default function IntelligencePipeline({ steps }) {
  return (
    <section className="intelligence-panel intelligence-pipeline-panel">
      <div className="intelligence-panel-heading"><span>Processing stages</span><h2>Company Intelligence Pipeline</h2></div>
      <div className="intelligence-step-list">
        {steps.map((step, index) => <PipelineStep key={step.id} step={step} index={index}/>) }
      </div>
    </section>
  )
}
