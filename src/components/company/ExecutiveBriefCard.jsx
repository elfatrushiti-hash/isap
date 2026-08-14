import { BrainCircuit, Target } from 'lucide-react'

export default function ExecutiveBriefCard({ workspace }) {
  return (
    <section className="company-card company-executive-card">
      <div className="company-card-heading">
        <div><span className="company-card-icon"><BrainCircuit size={18}/></span><h2>Executive Brief</h2></div>
        <span className="company-ready-pill">AI prepared</span>
      </div>
      <p className="company-brief-text">{workspace.executiveBrief}</p>
      <div className="company-next-question">
        <Target size={18}/>
        <div><span>Recommended opening question</span><strong>{workspace.nextBestQuestion}</strong></div>
      </div>
    </section>
  )
}
