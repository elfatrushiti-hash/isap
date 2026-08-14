const labels = {
  strengths: 'Strengths',
  weaknesses: 'Weaknesses',
  opportunities: 'Opportunities',
  threats: 'Threats'
}

export default function SwotGrid({ swot }) {
  return (
    <div className="company-swot-grid">
      {Object.entries(labels).map(([key, label]) => (
        <section className={`company-swot company-swot-${key}`} key={key}>
          <h3>{label}</h3>
          <ul>{(swot[key] || []).map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ))}
    </div>
  )
}
