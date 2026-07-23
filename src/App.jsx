import { useState } from 'react'
import ErrorBoundary from './components/foundation/ErrorBoundary.jsx'
import { IsapStoreProvider, useIsapStore } from './context/IsapStore.jsx'
import FoundationDashboard from './pages/FoundationDashboard/FoundationDashboard.jsx'
import ArchiveCenter from './pages/ArchiveCenter/ArchiveCenter.jsx'
import SettingsWorkspace from './pages/SettingsWorkspace/SettingsWorkspace.jsx'
import MeetingIntake from './pages/MeetingIntake/MeetingIntake.jsx'
import AIAdvisor from './pages/AIAdvisor/AIAdvisor.jsx'
import CompanyIntelligence from './pages/CompanyIntelligence/CompanyIntelligence.jsx'
import CRMWorkspace from './pages/CRMWorkspace/CRMWorkspace.jsx'
import AIMeetingCoach from './pages/AIMeetingCoach/AIMeetingCoach.jsx'
import CapturePro from './pages/CapturePro/CapturePro.jsx'
import Administration from './pages/Administration/Administration.jsx'

function IsapApplication() {
  const [activeView, setActiveView] = useState('dashboard')
  const { selectedMeeting, selectedMeetingId, setSelectedMeetingId } = useIsapStore()

  const sharedProps = {
    selectedMeeting,
    selectedMeetingId,
    onSelectMeeting: setSelectedMeetingId,
    onNavigate: setActiveView
  }

  const renderView = () => {
    if (activeView === 'intake') return <MeetingIntake {...sharedProps} />
    if (activeView === 'archive') return <ArchiveCenter {...sharedProps} />
    if (activeView === 'settings') return <SettingsWorkspace {...sharedProps} />
    if (activeView === 'advisor') return selectedMeeting ? <AIAdvisor {...sharedProps} /> : <FoundationDashboard {...sharedProps} />
    if (activeView === 'company') return selectedMeeting ? <CompanyIntelligence {...sharedProps} /> : <FoundationDashboard {...sharedProps} />
    if (activeView === 'crm') return selectedMeeting ? <CRMWorkspace {...sharedProps} /> : <FoundationDashboard {...sharedProps} />
    if (activeView === 'coach') return selectedMeeting ? <AIMeetingCoach {...sharedProps} /> : <FoundationDashboard {...sharedProps} />
    if (activeView === 'capture') return selectedMeeting ? <CapturePro {...sharedProps} /> : <FoundationDashboard {...sharedProps} />
    if (activeView === 'administration') return <Administration {...sharedProps} />
    return <FoundationDashboard {...sharedProps} />
  }

  return <ErrorBoundary onReset={() => setActiveView('dashboard')}>{renderView()}</ErrorBoundary>
}

export default function App() {
  return <IsapStoreProvider><IsapApplication /></IsapStoreProvider>
}
