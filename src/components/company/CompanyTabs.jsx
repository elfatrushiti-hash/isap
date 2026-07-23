const tabs = [
  ['overview', 'Overview'],
  ['management', 'Management'],
  ['financials', 'Financials'],
  ['strategy', 'Strategy'],
  ['news', 'News'],
  ['opportunities', 'Opportunities'],
  ['insights', 'AI Insights']
]

export default function CompanyTabs({ activeTab, onChange }) {
  return (
    <div className="company-tabs" role="tablist">
      {tabs.map(([id, label]) => (
        <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={() => onChange(id)}>{label}</button>
      ))}
    </div>
  )
}
