import { Building2, Globe2, MapPin, Sparkles } from 'lucide-react'

export default function CompanyHeader({ workspace }) {
  return (
    <header className="company-hero">
      <div className="company-hero-icon"><Building2 size={28}/></div>
      <div className="company-hero-copy">
        <div className="company-eyebrow"><Sparkles size={14}/> Company Intelligence</div>
        <h1>{workspace.name}</h1>
        <p>{workspace.description}</p>
        <div className="company-meta">
          <span><Building2 size={14}/>{workspace.industry}</span>
          {workspace.city && <span><MapPin size={14}/>{workspace.city}</span>}
          <span><Globe2 size={14}/>{workspace.website}</span>
        </div>
      </div>
      <div className="company-score-ring" aria-label={`Intelligence completeness ${workspace.completeness}%`}>
        <strong>{workspace.completeness}%</strong>
        <span>Intelligence</span>
      </div>
    </header>
  )
}
