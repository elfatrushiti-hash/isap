export default function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className={`uiButton ${variant}`}>
      {children}
    </button>
  )
}