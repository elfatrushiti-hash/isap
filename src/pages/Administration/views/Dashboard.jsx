import { Boxes, FileSearch, FolderKanban, Presentation, Tags } from 'lucide-react'
import AdminCard from '../components/AdminCard.jsx'

export default function Dashboard({
  adminState = {},
  productCount,
  assetCount,
  presentationCount
}) {
  const products = productCount ?? adminState.products ?? 0
  const assets = assetCount ?? adminState.assets ?? 0
  const presentations = presentationCount ?? adminState.presentations ?? 0
  const categories = adminState.categories ?? 0

  return (
    <div className="admin-view-stack">
      <section className="admin-metric-grid">
        <AdminCard icon={Boxes} label="Products" value={products} helper="Managed catalogue entries" />
        <AdminCard icon={FolderKanban} label="Assets" value={assets} helper="Managed sales assets" />
        <AdminCard icon={Presentation} label="Presentations" value={presentations} helper="Library foundation active" />
        <AdminCard icon={Tags} label="Categories" value={categories} helper="Topics, industries and audiences" />
      </section>

      <section className="admin-panel-grid">
        <article className="admin-panel">
          <span className="admin-panel-kicker">Architecture</span>
          <h2>Administration foundation is active.</h2>
          <p>The platform now has a dedicated control area for products, assets, presentations, metadata, AI settings and integrations.</p>
          <div className="admin-checklist">
            <span>Product catalogue boundary</span>
            <span>Asset metadata boundary</span>
            <span>Presentation library boundary</span>
            <span>AI processing boundary</span>
          </div>
        </article>
        <article className="admin-panel admin-panel-accent">
          <FileSearch size={28} />
          <span className="admin-panel-kicker">Delivery 1.4</span>
          <h2>Document Intelligence active</h2>
          <p>Uploaded assets are automatically enriched with summaries, topics, industries, products and searchable keywords.</p>
        </article>
      </section>
    </div>
  )
}
