export default function Section({ eyebrow, title, children }) {
  return (
    <section className="uiSection">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}