export default function Badge({ children, variant = 'default' }) {
  return <span className={`uiBadge ${variant}`}>{children}</span>
}