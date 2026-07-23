import { Building2, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { companies } from '../../data/companies.js'

export default function CompanyStep({ form, update, updateNewCompany }) {
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const matches = useMemo(() => companies.filter((company) => company.name.toLowerCase().includes(query.toLowerCase())), [query])

  const chooseCompany = (company) => {
    update('company', company)
    setCreating(false)
  }

  return (
    <section className="wizard-panel">
      <div className="wizard-panel-heading"><span>Step 2</span><h2>Select the customer</h2><p>Choose an existing company or create a new company profile.</p></div>
      <label className="search-field"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company"/></label>
      <div className="company-grid">
        {matches.map((company) => (
          <button type="button" key={company.id} className={`company-option ${form.company?.id === company.id && !creating ? 'selected' : ''}`} onClick={() => chooseCompany(company)}>
            <span><Building2 size={18}/></span><div><strong>{company.name}</strong><small>{company.industry || 'Company'}{company.city ? ` · ${company.city}` : ''}</small></div>
          </button>
        ))}
        <button type="button" className={`company-option create ${creating ? 'selected' : ''}`} onClick={() => { setCreating(true); update('company', null) }}>
          <span><Plus size={18}/></span><div><strong>New Company</strong><small>Create a company manually</small></div>
        </button>
      </div>
      {creating && (
        <div className="new-company-box">
          <div className="form-grid">
            <label><span>Company name *</span><input value={form.newCompany.name} onChange={(event) => updateNewCompany('name', event.target.value)} placeholder="Company name"/></label>
            <label><span>Industry</span><input value={form.newCompany.industry} onChange={(event) => updateNewCompany('industry', event.target.value)} placeholder="Industry"/></label>
            <label><span>City</span><input value={form.newCompany.city} onChange={(event) => updateNewCompany('city', event.target.value)} placeholder="City"/></label>
          </div>
        </div>
      )}
    </section>
  )
}
