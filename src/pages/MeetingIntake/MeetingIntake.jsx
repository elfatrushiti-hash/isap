import { ArrowLeft, Sparkles } from 'lucide-react'
import IsapShell from '../../components/isap/IsapShell.jsx'
import MeetingWizard from '../../components/intake/MeetingWizard.jsx'
import { useIsapStore } from '../../context/IsapStore.jsx'
import './MeetingIntake.css'

export default function MeetingIntake({ onNavigate }) {
  const { createAndStartMeeting } = useIsapStore()

  const finish = async (form) => {
    await createAndStartMeeting(form)
    onNavigate('dashboard')
  }

  return (
    <IsapShell activeView="intake" onNavigate={onNavigate}>
      <main className="intake-page">
        <header className="intake-header">
          <button type="button" className="intake-back" onClick={() => onNavigate('dashboard')}><ArrowLeft size={17}/> Back to Dashboard</button>
          <div><span className="intake-kicker"><Sparkles size={15}/> Meeting Intelligence</span><h1>Meeting Preparation</h1><p>Create a structured meeting record and start the intelligence workflow.</p></div>
        </header>
        <MeetingWizard onCancel={() => onNavigate('dashboard')} onFinish={finish}/>
      </main>
    </IsapShell>
  )
}
