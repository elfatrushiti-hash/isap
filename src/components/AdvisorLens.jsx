export default function AdvisorLens({ meeting }) {
  return (
    <aside className="advisorLens">
      <div>
        <span className="eyebrow">Advisor Lens</span>
        <h3>{meeting.customer}</h3>
      </div>

      <div className="lensBlock">
        <span>Business Goal</span>
        <strong>{meeting.businessGoal}</strong>
      </div>

      <div className="lensBlock">
        <span>Today&apos;s Focus</span>
        <strong>{meeting.focus}</strong>
      </div>

      <div className="lensBlock">
        <span>Next Best Question</span>
        <p>{meeting.nextBestQuestion}</p>
      </div>

      <div className="lensBlock">
        <span>Next Step</span>
        <strong>{meeting.nextStep}</strong>
      </div>

      <div className="lensBlock">
        <span>Meeting Confidence</span>
        <strong>{meeting.confidence}</strong>
      </div>
    </aside>
  )
}