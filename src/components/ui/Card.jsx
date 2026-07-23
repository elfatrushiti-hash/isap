export default function Card({ children, variant = 'default', className = '' }) {
  return <section className={`uiCard ${variant} ${className}`}>{children}</section>
}