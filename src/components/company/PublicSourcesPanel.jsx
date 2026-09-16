import { useMemo, useState } from 'react'
import {
  BadgeCheck, BriefcaseBusiness, ChevronDown, ExternalLink, FileSearch, Globe2, Plus,
  RefreshCw, Search, ShieldAlert, ShieldCheck, Sparkles, Target, Trash2, UserRoundCheck,
  Users, X
} from 'lucide-react'
import { SOURCE_TRUST, sourceTypeOptions } from '../../data/sourceGovernance.js'
import { getSourceSummary } from '../../services/publicSourceService.js'
import { researchOfficialWebsite } from '../../services/publicResearchService.js'
import { buildCustomerResearchBrief } from '../../services/customerResearchSynthesisService.js'

const EMPTY_FORM = { title: '', url: '', sourceType: 'corporate-website', publishedAt: '', content: '', notes: '' }
const trustClass = {
  [SOURCE_TRUST.TRUSTED]: 'trusted', [SOURCE_TRUST.ALLOWED]: 'allowed',
  [SOURCE_TRUST.RESTRICTED]: 'restricted', [SOURCE_TRUST.BLOCKED]: 'blocked'
}

function FitBar({ score }) {
  return <div className="research-fit-bar"><i style={{ width: `${Math.max(2, score)}%` }}/></div>
}

function EmptyInline({ children }) { return <span className="research-empty-inline">{children}</span> }

export default function PublicSourcesPanel({
  companyId, companyName = 'Company', companyIndustry = '', sources = [], products = [], researchProfile,
  onSaveResearchProfile, onAdd, onDelete, onReanalyse, onAudit
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [researchUrl, setResearchUrl] = useState('')
  const [researching, setResearching] = useState(false)
  const [researchError, setResearchError] = useState('')
  const [lastResearch, setLastResearch] = useState(null)

  const companySources = useMemo(() => sources.filter((source) => source.companyId === companyId), [sources, companyId])
  const summary = useMemo(() => getSourceSummary(sources, companyId), [sources, companyId])
  const brief = useMemo(() => buildCustomerResearchBrief({
    sources: companySources,
    products,
    management: researchProfile?.management || [],
    companyIndustry
  }), [companySources, products, researchProfile, companyIndustry])

  const runResearch = async () => {
    if (!researchUrl.trim() || researching) return
    setResearching(true); setResearchError('')
    try {
      const result = await researchOfficialWebsite(researchUrl, { products })
      const existing = new Set(companySources.map((item) => item.url))
      let imported = 0
      for (const page of result.pages || []) {
        if (existing.has(page.url)) continue
        onAdd?.({
          companyId,
          title: page.title,
          url: page.url,
          sourceType: page.sourceType || 'corporate-website',
          content: [page.description, page.content].filter(Boolean).join('\n\n'),
          notes: `Collected automatically by ISAP Relevance Research · ${page.security?.decision || 'TEXT_ONLY'}`
        })
        existing.add(page.url); imported += 1
      }
      onSaveResearchProfile?.(companyId, {
        host: result.host,
        management: result.management || [],
        researchTerms: result.researchTerms || [],
        lastResearchAt: new Date().toISOString(),
        mode: result.mode
      })
      setLastResearch({ ...result, imported })
      onAudit?.('PUBLIC_RESEARCH', 'PASS', `Relevance-first research completed for ${result.host}: ${imported} source(s), ${(result.management || []).length} management candidate(s).`)
    } catch (error) {
      setResearchError(error?.message || 'Research failed.')
      onAudit?.('PUBLIC_RESEARCH', 'BLOCK', error?.message || 'Public research blocked.')
    } finally { setResearching(false) }
  }

  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return
    onAdd?.({ ...form, companyId })
    setForm(EMPTY_FORM); setShowForm(false)
  }

  return (
    <div className="company-stack public-sources-panel research-dashboard">
      <section className="company-card research-command-card">
        <div className="research-command-copy">
          <span className="research-kicker"><Sparkles size={14}/> Relevance-first customer intelligence</span>
          <h2>{companyName} Research Brief</h2>
          <p>ISAP prioritizes public evidence against your product catalogue, identifies management roles and recommends the most relevant commercial contact. Rule-based, explainable and without external AI.</p>
        </div>
        <div className="public-research-input research-command-input">
          <input value={researchUrl} onChange={(event) => setResearchUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') runResearch() }} placeholder="https://www.company.com"/>
          <button type="button" disabled={researching || !researchUrl.trim()} onClick={runResearch}>{researching ? <RefreshCw className="spin" size={16}/> : <Search size={16}/>} {researching ? 'Researching…' : 'Run research'}</button>
        </div>
        <div className="public-research-policy"><ShieldCheck size={16}/><span>Official domain only · product-aware ranking · management discovery · HTML/text only · no external AI · no binary download</span></div>
        {researchError && <div className="public-research-error"><ShieldAlert size={16}/>{researchError}</div>}
        {lastResearch && !researchError && <div className="public-research-result"><strong>{lastResearch.imported}</strong> new source(s) · <strong>{(lastResearch.management || []).length}</strong> management candidate(s) · evidence is ranked against your products.</div>}
      </section>

      <section className="research-glance-grid">
        <article className="company-card research-best-contact">
          <div className="research-section-label"><UserRoundCheck size={17}/> Best commercial contact</div>
          {brief.topContact ? <>
            <div className="research-contact-main"><div className="research-contact-avatar">{brief.topContact.name.split(' ').map((part) => part[0]).slice(0,2).join('')}</div><div><h3>{brief.topContact.name}</h3><strong>{brief.topContact.role || 'Management'}</strong></div><span className="research-score-badge">{brief.topContact.score}% fit</span></div>
            <p>{brief.topContact.reason}</p>
            <div className="research-product-pills">{brief.topContact.productMatches?.map((item) => <span key={item.name}>{item.name}</span>)}</div>
            {brief.topContact.sourceUrl && <a href={brief.topContact.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={13}/></a>}
          </> : <div className="research-placeholder"><Users size={24}/><strong>No management contact identified yet</strong><span>Run research against an official company site with a management or leadership page.</span></div>}
        </article>

        <article className="company-card research-products-card">
          <div className="research-section-label"><Target size={17}/> Product relevance</div>
          <div className="research-product-ranking">
            {brief.topProducts.length ? brief.topProducts.map((product, index) => <div className="research-product-fit" key={product.productId}>
              <div><span>#{index + 1}</span><strong>{product.name}</strong><em>{product.score}%</em></div>
              <FitBar score={product.score}/><p>{product.reason}</p>
            </div>) : <div className="research-placeholder compact"><Target size={22}/><span>No product relevance detected yet.</span></div>}
          </div>
        </article>

        <article className="company-card research-signals-card">
          <div className="research-section-label"><BadgeCheck size={17}/> Key sales signals</div>
          <div className="research-signal-cloud">{brief.signals.length ? brief.signals.map((item) => <span key={item}>{item}</span>) : <EmptyInline>No relevant rule signal detected yet</EmptyInline>}</div>
          <div className="research-mini-stats"><div><strong>{summary.total}</strong><span>Sources</span></div><div><strong>{summary.trusted}</strong><span>Trusted</span></div><div><strong>{summary.painPoints.length}</strong><span>Pain points</span></div></div>
        </article>
      </section>

      <section className="company-card research-management-card">
        <div className="company-card-heading"><div><span className="company-card-icon"><Users size={18}/></span><div><h2>Management & recommended stakeholders</h2><p>Roles are ranked against the strongest product signals found in public sources.</p></div></div></div>
        {brief.managementRanking.length ? <div className="research-management-grid">{brief.managementRanking.slice(0,8).map((person, index) => <article key={`${person.name}-${person.role}-${index}`}>
          <div className="research-management-top"><div className="research-contact-avatar small">{person.name.split(' ').map((part) => part[0]).slice(0,2).join('')}</div><div><strong>{person.name}</strong><span>{person.role || 'Role not published'}</span></div><em>{person.score}%</em></div>
          <p>{person.reason}</p>
          <div className="research-product-pills">{person.productMatches?.map((item) => <span key={item.name}>{item.name}</span>)}</div>
          {person.sourceUrl && <a href={person.sourceUrl} target="_blank" rel="noreferrer">Evidence <ExternalLink size={12}/></a>}
        </article>)}</div> : <div className="research-placeholder horizontal"><Users size={25}/><div><strong>No management team extracted</strong><span>Some websites do not expose management in structured or machine-readable content. ISAP does not invent names when evidence is missing.</span></div></div>}
      </section>

      <section className="company-card research-evidence-card">
        <div className="company-card-heading"><div><span className="company-card-icon"><FileSearch size={18}/></span><div><h2>Most relevant evidence</h2><p>Sources are ranked by their relationship to your products instead of shown as an unfiltered website dump.</p></div></div><button className="research-add-source" type="button" onClick={() => setShowForm(true)}><Plus size={14}/> Add source</button></div>
        <div className="research-evidence-list">
          {brief.relevantSources.slice(0,6).map((source) => <article key={source.id} className="research-evidence-row">
            <div className="research-evidence-score"><strong>{Math.min(100, source.relevance || source.analysis?.confidence || 0)}</strong><span>relevance</span></div>
            <div className="research-evidence-body"><div className="public-source-head"><div><span className={`source-trust ${trustClass[source.trust] || 'restricted'}`}>{source.trust}</span><span className="source-type">{source.sourceType}</span></div><div className="public-source-actions"><button type="button" title="Analyse again" onClick={() => onReanalyse?.(source.id)}><RefreshCw size={15}/></button><button type="button" title="Delete source" onClick={() => onDelete?.(source.id)}><Trash2 size={15}/></button></div></div><h3>{source.title}</h3><a href={source.url} target="_blank" rel="noreferrer"><Globe2 size={13}/>{source.url}<ExternalLink size={12}/></a>
              {!!source.analysis?.matches?.length && <div className="research-evidence-tags">{source.analysis.matches.slice(0,5).map((match) => <span key={`${source.id}-${match.ruleId}`}>{match.label}</span>)}</div>}
              <details><summary><ChevronDown size={14}/> Show source excerpt</summary><p>{source.content}</p></details>
            </div>
          </article>)}
          {!brief.relevantSources.length && <div className="research-placeholder"><FileSearch size={24}/><strong>No public evidence captured yet</strong><span>Run controlled research or add an approved public source.</span></div>}
        </div>
      </section>

      {showForm && <div className="source-dialog-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}><form className="source-dialog" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}><div className="source-dialog-head"><div><span>Public source</span><h2>Add source evidence</h2></div><button type="button" onClick={() => setShowForm(false)}><X size={18}/></button></div><label>Title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Annual Report 2025" required/></label><label>URL<input value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} placeholder="https://company.com/..." required/></label><div className="source-form-grid"><label>Source type<select value={form.sourceType} onChange={(event) => setForm((current) => ({ ...current, sourceType: event.target.value }))}>{sourceTypeOptions.map((option) => <option value={option.id} key={option.id}>{option.label} · {option.trust}</option>)}</select></label><label>Published<input type="date" value={form.publishedAt} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}/></label></div><label>Relevant public content<textarea value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} placeholder="Paste relevant public evidence here."/></label><label>Internal note<textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Why is this source relevant?"/></label><div className="source-dialog-policy"><ShieldCheck size={17}/><span>Evidence is processed by ISAP Rule Intelligence. No source content is transmitted to external AI.</span></div><div className="source-dialog-actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" type="submit">Add & analyse</button></div></form></div>}
    </div>
  )
}
