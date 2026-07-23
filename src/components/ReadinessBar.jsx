export default function ReadinessBar({ value = 0 }) {
  return (
    <div className="readiness">
      <div className="readinessHeader">
        <span>Meeting Readiness</span>
        <strong>{value}%</strong>
      </div>

      <div className="readinessTrack">
        <div
          className="readinessFill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}