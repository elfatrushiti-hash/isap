import { BadgeCheck } from 'lucide-react'

export default function IntrumFitCard({ items }) {
  return (
    <section className="company-card">
      <div className="company-card-heading"><div><span className="company-card-icon"><BadgeCheck size={18}/></span><h2>Intrum Fit</h2></div></div>
      <div className="company-fit-list">
        {items.map((item) => (
          <article key={item.solution} className="company-fit-item">
            <div className="company-fit-top"><strong>{item.solution}</strong><span>{item.score}%</span></div>
            <div className="company-fit-bar"><i style={{ width: `${item.score}%` }}/></div>
            <p>{item.reason}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
