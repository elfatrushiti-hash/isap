import { meetingGoals } from '../../data/meetingGoals.js'

export default function GoalStep({ form, update }) {
  return (
    <section className="wizard-panel">
      <div className="wizard-panel-heading"><span>Step 4</span><h2>Define the meeting goal</h2><p>ISAP will use the selected goal to shape the intelligence and recommendations.</p></div>
      <div className="goal-grid">
        {meetingGoals.map((goal) => (
          <button type="button" key={goal.id} className={`goal-card ${form.goal?.id === goal.id ? 'selected' : ''}`} onClick={() => update('goal', goal)}>
            <strong>{goal.label}</strong><span>{goal.description}</span>
          </button>
        ))}
      </div>
      <label className="notes-field"><span>Meeting notes</span><textarea rows="5" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Context, desired outcome, known challenges or internal notes..."/></label>
    </section>
  )
}
