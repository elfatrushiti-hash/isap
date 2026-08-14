import IsapShell from '../../components/isap/IsapShell.jsx'
import { useIsapStore } from '../../context/IsapStore.jsx'
import AdminSidebar from './components/AdminSidebar.jsx'
import AdminHeader from './components/AdminHeader.jsx'
import Dashboard from './views/Dashboard.jsx'
import Products from './views/Products.jsx'
import Assets from './views/Assets.jsx'
import Presentations from './views/Presentations.jsx'
import Categories from './views/Categories.jsx'
import AISettings from './views/AISettings.jsx'
import Integrations from './views/Integrations.jsx'
import './Administration.css'

export default function Administration({ onNavigate }) {
  const { adminState, setAdminSection, products, assets, presentations } = useIsapStore()

  const renderSection = () => {
    if (adminState.activeSection === 'products') return <Products />
    if (adminState.activeSection === 'assets') return <Assets />
    if (adminState.activeSection === 'presentations') return <Presentations />
    if (adminState.activeSection === 'categories') return <Categories />
    if (adminState.activeSection === 'ai-settings') return <AISettings />
    if (adminState.activeSection === 'integrations') return <Integrations integrations={adminState.integrations} />
    return <Dashboard adminState={adminState} productCount={products.length} assetCount={assets.length} presentationCount={presentations.length} />
  }

  return (
    <IsapShell activeView="administration" onNavigate={onNavigate}>
      <main className="admin-page">
        <AdminSidebar activeSection={adminState.activeSection} onSelect={setAdminSection} />
        <section className="admin-workspace">
          <AdminHeader activeSection={adminState.activeSection} />
          {renderSection()}
        </section>
      </main>
    </IsapShell>
  )
}
