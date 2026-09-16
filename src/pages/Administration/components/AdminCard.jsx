export default function AdminCard({ icon: Icon, label, value, helper, children }) {
  return (
    <article className="admin-card">
      <div className="admin-card-top">
        <span className="admin-card-icon">{Icon ? <Icon size={20} /> : null}</span>
        <span className="admin-card-label">{label}</span>
      </div>
      {value !== undefined ? <strong className="admin-card-value">{value}</strong> : null}
      {helper ? <p>{helper}</p> : null}
      {children}
    </article>
  )
}
