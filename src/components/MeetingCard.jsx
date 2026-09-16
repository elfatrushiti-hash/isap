export default function MeetingCard({ meeting, active, onClick }) {
  return (
    <button
      type="button"
      className={`meetingCard ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="meetingTime">{meeting.time}</div>

      <div>
        <strong>{meeting.customer}</strong>
        <span>{meeting.type}</span>
      </div>

      <small>
        {meeting.industry} · {meeting.city}
      </small>
    </button>
  )
}