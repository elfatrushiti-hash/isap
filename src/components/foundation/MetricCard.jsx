export default function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="foundation-card foundation-metric-card">
      {Icon ? <Icon size={20} /> : null}
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  )
}
