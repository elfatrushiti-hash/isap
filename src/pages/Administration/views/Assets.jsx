import { useMemo, useState } from 'react'
import { Archive, BrainCircuit, Edit3, File, FileImage, FileSpreadsheet, FileText, Film, Presentation, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { ASSET_STATUS, ASSET_TYPE } from '../../../data/assets.js'
import { ANALYSIS_STATUS } from '../../../services/analysisService.js'
import UploadZone from '../components/UploadZone.jsx'
import AssetDialog from '../components/AssetDialog.jsx'
import AnalysisDialog from '../components/AnalysisDialog.jsx'

const typeLabels = {
  [ASSET_TYPE.PRESENTATION]: 'PowerPoint', [ASSET_TYPE.PDF]: 'PDF', [ASSET_TYPE.DOCUMENT]: 'Word',
  [ASSET_TYPE.SPREADSHEET]: 'Excel', [ASSET_TYPE.IMAGE]: 'Image', [ASSET_TYPE.VIDEO]: 'Video', [ASSET_TYPE.OTHER]: 'Other'
}
const typeIcons = {
  [ASSET_TYPE.PRESENTATION]: Presentation, [ASSET_TYPE.PDF]: FileText, [ASSET_TYPE.DOCUMENT]: FileText,
  [ASSET_TYPE.SPREADSHEET]: FileSpreadsheet, [ASSET_TYPE.IMAGE]: FileImage, [ASSET_TYPE.VIDEO]: Film, [ASSET_TYPE.OTHER]: File
}
const statusLabels = {
  [ASSET_STATUS.UPLOADING]: 'Uploading', [ASSET_STATUS.QUEUED]: 'Queued', [ASSET_STATUS.PROCESSING]: 'Processing',
  [ASSET_STATUS.READY]: 'Ready', [ASSET_STATUS.ARCHIVED]: 'Archived', [ASSET_STATUS.FAILED]: 'Failed'
}
const analysisLabels = {
  [ANALYSIS_STATUS.NOT_STARTED]: 'Not analysed', [ANALYSIS_STATUS.QUEUED]: 'Queued', [ANALYSIS_STATUS.EXTRACTING]: 'Extracting',
  [ANALYSIS_STATUS.ANALYSING]: 'Analysing', [ANALYSIS_STATUS.SUMMARISING]: 'Summarising', [ANALYSIS_STATUS.READY]: 'Ready', [ANALYSIS_STATUS.FAILED]: 'Failed'
}

function formatSize(bytes = 0) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`
}

export default function Assets() {
  const {
    assets, products, uploadAssets, editAsset, archiveAssetById, restoreAssetById, deleteAssetById,
    analyseAssetById, editAssetAnalysis
  } = useIsapStore()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [product, setProduct] = useState('ALL')
  const [editingAsset, setEditingAsset] = useState(null)
  const [analysisAssetId, setAnalysisAssetId] = useState(null)

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...assets]
      .filter((asset) => type === 'ALL' || asset.type === type)
      .filter((asset) => status === 'ALL' || asset.status === status)
      .filter((asset) => product === 'ALL' || asset.products?.includes(product))
      .filter((asset) => !needle || [asset.title, asset.filename, asset.description, ...(asset.tags || []), ...(asset.analysis?.keywords || []), ...(asset.analysis?.topics || [])].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [assets, product, query, status, type])

  const saveAsset = async (changes) => { await editAsset(editingAsset.id, changes); setEditingAsset(null) }
  const saveAnalysis = (assetId, changes) => { editAssetAnalysis(assetId, changes); setAnalysisAssetId(null) }
  const analysisAsset = assets.find((asset) => asset.id === analysisAssetId) || null
  const readyCount = assets.filter((asset) => asset.status === ASSET_STATUS.READY).length
  const processingCount = assets.filter((asset) => [ASSET_STATUS.UPLOADING, ASSET_STATUS.QUEUED, ASSET_STATUS.PROCESSING].includes(asset.status)).length
  const analysedCount = assets.filter((asset) => asset.analysis?.status === ANALYSIS_STATUS.READY).length

  return (
    <div className="admin-view-stack">
      <div className="admin-toolbar"><div><span>Asset library</span><small>{assets.length} assets · {readyCount} ready · {analysedCount} analysed · {processingCount} processing</small></div></div>
      <UploadZone onUpload={uploadAssets} />
      <section className="admin-panel admin-product-panel">
        <div className="admin-filter-bar admin-asset-filter-bar">
          <label className="admin-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets and intelligence..." /></label>
          <select value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">All file types</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <select value={product} onChange={(event) => setProduct(event.target.value)}><option value="ALL">All products</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        </div>
        {filteredAssets.length ? <div className="admin-table-wrap"><table className="admin-table admin-asset-table"><thead><tr><th>Asset</th><th>Type</th><th>Status</th><th>Intelligence</th><th>Products</th><th>Uploaded</th><th className="admin-actions-column">Actions</th></tr></thead><tbody>{filteredAssets.map((asset) => {
          const Icon = typeIcons[asset.type] || File
          const assignedProducts = products.filter((item) => asset.products?.includes(item.id))
          const analysisStatus = asset.analysis?.status || ANALYSIS_STATUS.NOT_STARTED
          const analysisRunning = [ANALYSIS_STATUS.QUEUED, ANALYSIS_STATUS.EXTRACTING, ANALYSIS_STATUS.ANALYSING, ANALYSIS_STATUS.SUMMARISING].includes(analysisStatus)
          return <tr key={asset.id}>
            <td><div className="admin-product-cell"><span className={`admin-asset-icon asset-type-${asset.type.toLowerCase()}`}><Icon size={18} /></span><div><strong>{asset.title}</strong><small>{asset.filename} · {formatSize(asset.size)} · v{asset.version}</small></div></div></td>
            <td>{typeLabels[asset.type] || 'Other'}</td>
            <td><div className="admin-asset-status"><span className={`admin-status-badge asset-status-${asset.status.toLowerCase()}`}>{statusLabels[asset.status]}</span>{asset.progress < 100 && asset.status !== ASSET_STATUS.ARCHIVED && <span className="admin-progress-track"><span style={{ width: `${asset.progress || 0}%` }} /></span>}</div></td>
            <td><button type="button" className={`admin-analysis-badge analysis-${analysisStatus.toLowerCase()}`} onClick={() => setAnalysisAssetId(asset.id)}><BrainCircuit size={14} /><span>{analysisLabels[analysisStatus]}</span>{analysisRunning ? <small>{asset.analysis?.progress || 0}%</small> : analysisStatus === ANALYSIS_STATUS.READY ? <small>{asset.analysis?.confidence || 0}%</small> : null}</button></td>
            <td>{assignedProducts.length ? <div className="admin-table-tags">{assignedProducts.slice(0, 2).map((item) => <span key={item.id}>{item.name}</span>)}{assignedProducts.length > 2 && <small>+{assignedProducts.length - 2}</small>}</div> : <span className="admin-content-count">Unassigned</span>}</td>
            <td>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(asset.createdAt))}</td>
            <td><div className="admin-row-actions"><button type="button" onClick={() => setAnalysisAssetId(asset.id)} title="Document intelligence"><BrainCircuit size={16} /></button><button type="button" onClick={() => setEditingAsset(asset)} title="Edit"><Edit3 size={16} /></button>{asset.status === ASSET_STATUS.ARCHIVED ? <button type="button" onClick={() => restoreAssetById(asset.id)} title="Restore"><RotateCcw size={16} /></button> : <button type="button" onClick={() => archiveAssetById(asset.id)} title="Archive"><Archive size={16} /></button>}<button type="button" className="danger" onClick={() => window.confirm(`Delete ${asset.title} permanently?`) && deleteAssetById(asset.id)} title="Delete"><Trash2 size={16} /></button></div></td>
          </tr>
        })}</tbody></table></div> : <div className="admin-empty-state"><strong>No assets found</strong><p>Upload a file or adjust the current filters.</p></div>}
      </section>
      <AssetDialog open={Boolean(editingAsset)} asset={editingAsset} products={products} onClose={() => setEditingAsset(null)} onSubmit={saveAsset} />
      <AnalysisDialog open={Boolean(analysisAsset)} asset={analysisAsset} products={products} onClose={() => setAnalysisAssetId(null)} onReanalyse={analyseAssetById} onSave={saveAnalysis} />
    </div>
  )
}
