export default function Page({ title, subtitle, children }) {
  return (
    <main className="page">
      <header className="pageHeader">
        <span className="eyebrow">Intrum Sales Advisory Platform</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>
      {children}
    </main>
  )
}