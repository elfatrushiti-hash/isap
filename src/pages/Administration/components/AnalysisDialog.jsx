import { useEffect, useState } from 'react'
import { BrainCircuit, CheckCircle2, Clock3, FileSearch, RefreshCw, X } from 'lucide-react'
import { ANALYSIS_STATUS } from '../../../services/analysisService.js'

const labels = {
  [ANALYSIS_STATUS.NOT_STARTED]: 'Not analysed',
  [ANALYSIS_STATUS.QUEUED]: 'Queued',
  [ANALYSIS_STATUS.EXTRACTING]: 'Extracting metadata',
  [ANALYSIS_STATUS.ANALYSING]: 'Analysing content',
  [ANALYSIS_STATUS.SUMMARISING]: 'Generating summary',
  [ANALYSIS_STATUS.READY]: 'Ready',
  [ANALYSIS_STATUS.FAILED]: 'Failed'
}

function TagList({ values, empty = 'None detected' }) {
  return values?.length ? <div className="admin-analysis-tags">{values.map((value) => <span key={value}>{value}</span>)}</div> : <small className="admin-analysis-empty">{empty}</small>
}

export default function AnalysisDialog({ open, asset, products, onClose, onReanalyse, onSave }) {
  const [form, setForm] = useState({ summary: '', keywords: '', topics: '', industries: '', language: 'en' })

  useEffect(() => {
    if (!asset) return
    setForm({
      summary: asset.analysis?.summary || '',
      keywords: (asset.analysis?.keywords || []).join(', '),
      topics: (asset.analysis?.topics || []).join(', '),
      industries: (asset.analysis?.industries || []).join(', '),
      language: asset.analysis?.language || 'en'
    })
  }, [asset])

  if (!open || !asset) return null
  const analysis = asset.analysis || {}
  const isRunning = [ANALYSIS_STATUS.QUEUED, ANALYSIS_STATUS.EXTRACTING, ANALYSIS_STATUS.ANALYSING, ANALYSIS_STATUS.SUMMARISING].includes(analysis.status)
  const detectedProducts = products.filter((product) => analysis.products?.includes(product.id))
  const split = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)

  const submit = (event) => {
    event.preventDefault()
    onSave(asset.id, {
      summary: form.summary.trim(),
      keywords: split(form.keywords),
      topics: split(form.topics),
      industries: split(form.industries),
      language: form.language,
      confidence: 100
    })
  }

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-dialog admin-analysis-dialog" role="dialog" aria-modal="true" aria-labelledby="analysis-dialog-title">
        <header>
          <div><span className="admin-eyebrow">Document Intelligence</span><h2 id="analysis-dialog-title">{asset.title}</h2><small>{asset.filename}</small></div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>

        <div className="admin-analysis-status-card">
          <span className={`admin-analysis-icon analysis-${String(analysis.status || 'not_started').toLowerCase()}`}>{analysis.status === ANALYSIS_STATUS.READY ? <CheckCircle2 size={22} /> : isRunning ? <Clock3 size={22} /> : <BrainCircuit size={22} />}</span>
          <div><strong>{labels[analysis.status] || labels[ANALYSIS_STATUS.NOT_STARTED]}</strong><small>{analysis.provider || 'ISAP heuristic engine'} · {analysis.model || 'document-intelligence-v1'}</small></div>
          <span className="admin-analysis-confidence">{analysis.confidence || 0}% confidence</span>
          <div className="admin-analysis-progress"><span style={{ width: `${analysis.progress || 0}%` }} /></div>
        </div>

        <form onSubmit={submit}>
          <div className="admin-analysis-grid">
            <section className="admin-analysis-main">
              <label className="admin-field"><span>Executive summary</span><textarea rows="6" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} placeholder="Analysis summary will appear here." /></label>
              <label className="admin-field"><span>Keywords</span><input value={form.keywords} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} placeholder="credit risk, fraud, banking" /></label>
              <label className="admin-field"><span>Topics</span><input value={form.topics} onChange={(event) => setForm((current) => ({ ...current, topics: event.target.value }))} /></label>
              <label className="admin-field"><span>Industries</span><input value={form.industries} onChange={(event) => setForm((current) => ({ ...current, industries: event.target.value }))} /></label>
              <label className="admin-field"><span>Language</span><select value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}><option value="en">English</option><option value="de">German</option><option value="fr">French</option><option value="it">Italian</option></select></label>
            </section>

            <aside className="admin-analysis-sidebar">
              <div><FileSearch size={18} /><strong>Extracted metadata</strong></div>
              <dl>
                <dt>Pages / slides</dt><dd>{analysis.slideCount || analysis.pageCount || '—'}</dd>
                <dt>Language</dt><dd>{String(analysis.language || '—').toUpperCase()}</dd>
                <dt>Version</dt><dd>v{asset.version}</dd>
                <dt>Execution</dt><dd>{analysis.executionTime ? `${analysis.executionTime} ms` : '—'}</dd>
                <dt>Completed</dt><dd>{analysis.completedAt ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(analysis.completedAt)) : '—'}</dd>
              </dl>
              <strong>Detected products</strong>
              <TagList values={detectedProducts.map((product) => product.name)} />
              <strong>Detected topics</strong>
              <TagList values={analysis.topics} />
            </aside>
          </div>
          <footer>
            <button type="button" className="admin-secondary-button" onClick={() => onReanalyse(asset.id)} disabled={isRunning}><RefreshCw size={16} /> Analyse again</button>
            <button type="submit" className="admin-primary-button">Save corrections</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
