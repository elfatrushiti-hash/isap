import IsapShell from '../../components/isap/IsapShell'
import './CaptureWorkspace.css'
import {ArrowLeft,CheckCircle2,ClipboardList,Send} from 'lucide-react'

export default function CaptureWorkspace({selectedMeeting,onBack,onNavigate}){
return(
<IsapShell activeView="capture" onNavigate={onNavigate}>
<main className="cap-page">
<header className="cap-header">
<button className="cap-back" onClick={onBack}><ArrowLeft size={18}/>Zurück</button>
<div><span className="cap-kicker">Capture Workspace</span><h1>Meeting abschliessen</h1><p>{selectedMeeting.customer}</p></div>
</header>

<section className="cap-grid">
<div className="cap-card">
<h2><ClipboardList size={20}/> Executive Summary</h2>
<textarea defaultValue={selectedMeeting.captureTemplate.summary}/>
</div>

<div className="cap-card">
<h2><CheckCircle2 size={20}/> Decisions</h2>
{selectedMeeting.captureTemplate.decisions.map(d=><label key={d}><input type="checkbox" defaultChecked/> {d}</label>)}
</div>

<div className="cap-card">
<h2><Send size={20}/> Next Actions</h2>
{selectedMeeting.captureTemplate.nextActions.map(a=><label key={a}><input type="checkbox"/> {a}</label>)}
<button className="export">CRM Export vorbereiten</button>
</div>
</section>
</main>
</IsapShell>
)}