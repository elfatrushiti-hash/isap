export default function Progress({ value = 0 }) {
  return (
    <div className="uiProgress">
      <div className="uiProgressHeader">
        <span>Meeting Readiness</span>
        <strong>{value}%</strong>
      </div>
      <div className="uiProgressTrack">
        <div className="uiProgressFill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}