import { Activity } from 'lucide-react'

export default function CompanyHealthCard({ health }) {
  return (
    <section className="company-card">
      <div className="company-card-heading"><div><span className="company-card-icon"><Activity size={18}/></span><h2>Company Health</h2></div></div>
      <div className="company-health-list">
        {health.map((item) => (
          <div className="company-health-row" key={item.label}>
            <div><span className={`company-health-dot ${item.status}`}/><span>{item.label}</span></div>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
