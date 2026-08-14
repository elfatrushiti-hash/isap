export default function ContactStep({ contact, updateContact }) {
  return (
    <section className="wizard-panel">
      <div className="wizard-panel-heading"><span>Step 3</span><h2>Add the main contact</h2><p>This person will be used for the meeting brief and stakeholder context.</p></div>
      <div className="form-grid two-column">
        <label><span>First name *</span><input value={contact.firstName} onChange={(event) => updateContact('firstName', event.target.value)} placeholder="First name"/></label>
        <label><span>Last name *</span><input value={contact.lastName} onChange={(event) => updateContact('lastName', event.target.value)} placeholder="Last name"/></label>
        <label><span>Role</span><input value={contact.role} onChange={(event) => updateContact('role', event.target.value)} placeholder="Role / title"/></label>
        <label><span>Email</span><input type="email" value={contact.email} onChange={(event) => updateContact('email', event.target.value)} placeholder="name@company.com"/></label>
        <label><span>Phone</span><input type="tel" value={contact.phone} onChange={(event) => updateContact('phone', event.target.value)} placeholder="+41 ..."/></label>
      </div>
    </section>
  )
}
