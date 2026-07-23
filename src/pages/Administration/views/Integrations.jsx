import { PlugZap } from 'lucide-react'
import AdminCard from '../components/AdminCard.jsx'
export default function Integrations({ integrations }) { return <AdminCard icon={PlugZap} label="Integration Hub"><div className="admin-integration-list">{integrations.map((item) => <div key={item.id}><span>{item.name}</span><strong>{item.status}</strong></div>)}</div></AdminCard> }
