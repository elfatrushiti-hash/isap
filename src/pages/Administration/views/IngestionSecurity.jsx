import { useMemo, useState } from 'react'
import { AlertTriangle, Ban, CheckCircle2, FileSearch, LockKeyhole, ScanSearch, ShieldCheck } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { validateIngestionCandidate } from '../../../services/ingestionSecurityService.js'

export default function IngestionSecurity() {
  const { ingestionSecurity, updateIngestionSecurity, ingestionAudit } = useIsapStore()
  const [candidate, setCandidate] = useState({ url:'https://example.com/annual-report.pdf', extension:'pdf', mimeType:'application/pdf', sizeMb:4 })
  const result = useMemo(() => validateIngestionCandidate(candidate, ingestionSecurity), [candidate, ingestionSecurity])
  const patch = (changes) => updateIngestionSecurity({ ...ingestionSecurity, ...changes })

  return <div className="admin-view-stack ingestion-security">
    <div className="admin-panel ingestion-hero"><div><span className="admin-panel-kicker">Secure Ingestion Foundation · 3.1</span><h2>Nothing reaches intelligence before security clearance.</h2><p>Policy, quarantine and scanner contracts are prepared before automatic internet collection is enabled.</p></div><div className="ingestion-lock"><LockKeyhole size={22}/><strong>COLLECTOR LOCKED</strong><span>Scanner not connected</span></div></div>
    <div className="ingestion-flow">
      {[['Source policy',ShieldCheck],['File validation',FileSearch],['Quarantine',LockKeyhole],['Malware scan',ScanSearch],['Content release',CheckCircle2]].map(([label,Icon],i)=><div key={label}><Icon size={18}/><strong>{label}</strong><span>{i===3?'Provider interface':'Policy ready'}</span></div>)}
    </div>
    <div className="admin-panel"><div className="admin-toolbar"><div><span>Security policy</span><small>Corporate defaults for every future inbound download</small></div></div><div className="ingestion-policy-grid">
      <label>Maximum file size (MB)<input type="number" min="1" value={ingestionSecurity.maxFileSizeMb} onChange={e=>patch({maxFileSizeMb:Number(e.target.value)})}/></label>
      <label>Scanner provider<select value={ingestionSecurity.scannerProvider} onChange={e=>patch({scannerProvider:e.target.value})}><option value="UNCONFIGURED">Not configured</option><option value="MICROSOFT_DEFENDER">Microsoft Defender (reserved)</option><option value="ICAP">ICAP scanner (reserved)</option><option value="CUSTOM">Corporate scanner (reserved)</option></select></label>
      {[["quarantineRequired","Quarantine required"],["blockExecutables","Block executables"],["blockMacroDocuments","Block macro documents"],["inspectArchives","Inspect archives"]].map(([key,label])=><label className="ingestion-check" key={key}><input type="checkbox" checked={!!ingestionSecurity[key]} onChange={e=>patch({[key]:e.target.checked})}/><span>{label}</span></label>)}
    </div><div className="ingestion-warning"><AlertTriangle size={17}/><div><strong>Enforcement boundary</strong><span>This frontend models and enforces policy decisions locally. A real malware scan requires the future server-side Security Gateway and an approved scanner. The internet collector therefore remains disabled.</span></div></div></div>
    <div className="admin-panel ingestion-lab"><div><span className="admin-panel-kicker">Pre-flight laboratory</span><h2>Test an inbound candidate</h2><div className="ingestion-fields"><input value={candidate.url} onChange={e=>setCandidate({...candidate,url:e.target.value})} placeholder="https://..."/><input value={candidate.extension} onChange={e=>setCandidate({...candidate,extension:e.target.value})} placeholder="pdf"/><input value={candidate.mimeType} onChange={e=>setCandidate({...candidate,mimeType:e.target.value})} placeholder="MIME type"/><input type="number" value={candidate.sizeMb} onChange={e=>setCandidate({...candidate,sizeMb:Number(e.target.value)})}/></div></div><div className={`ingestion-decision ${result.decision.toLowerCase()}`}>{result.decision==='BLOCK'?<Ban size={22}/>:<LockKeyhole size={22}/>}<strong>{result.decision}</strong><span>{result.nextStep}</span>{result.reasons.map(x=><p key={x}>{x}</p>)}{result.warnings.map(x=><p key={x}>{x}</p>)}</div></div>
    <div className="admin-panel"><div className="admin-toolbar"><div><span>Security audit</span><small>Local audit foundation</small></div></div><div className="ingestion-audit">{ingestionAudit.slice(0,8).map(item=><div key={item.id}><strong>{item.action}</strong><span>{item.result}</span><small>{new Date(item.at).toLocaleString()}</small><p>{item.detail}</p></div>)}</div></div>
  </div>
}
