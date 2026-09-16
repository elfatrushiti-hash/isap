import { Building2, CalendarDays, Contact, Flag, NotebookPen } from 'lucide-react'

export default function ReviewStep({ form }) {
  const company = form.company?.name || form.newCompany.name
  const contact = [form.contact.firstName, form.contact.lastName].filter(Boolean).join(' ')
  const rows = [
    { icon: Building2, label: 'Company', value: company },
    { icon: Contact, label: 'Contact', value: `${contact}${form.contact.role ? ` · ${form.contact.role}` : ''}` },
    { icon: Flag, label: 'Goal', value: form.goal?.label },
    { icon: CalendarDays, label: 'Source & time', value: `${form.source === 'outlook' ? 'Outlook' : 'Manual'} · ${form.meetingDate} · ${form.meetingTime}` },
    { icon: NotebookPen, label: 'Notes', value: form.notes || 'No additional notes' }
  ]

  return (
    <section className="wizard-panel">
      <div className="wizard-panel-heading"><span>Step 5</span><h2>Review and start intelligence</h2><p>Confirm the meeting setup. ISAP will create the meeting and start the intelligence workflow.</p></div>
      <div className="review-list">
        {rows.map(({ icon: Icon, label, value }) => <div key={label}><span className="review-icon"><Icon size={19}/></span><div><small>{label}</small><strong>{value}</strong></div></div>)}
      </div>
      <div className="review-callout"><strong>What happens next?</strong><span>The new meeting appears on the dashboard with status “Intelligence running”. The detailed pipeline follows in delivery 2A.2.</span></div>
    </section>
  )
}
