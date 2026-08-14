import { BrainCircuit } from 'lucide-react'
import AdminCard from '../components/AdminCard.jsx'
export default function AISettings() { return <AdminCard icon={BrainCircuit} label="AI Settings"><div className="admin-setting-list"><span><strong>Document analysis</strong><small>Prepared</small></span><span><strong>Presentation recommendations</strong><small>Prepared</small></span><span><strong>Content generation</strong><small>Prepared</small></span></div></AdminCard> }
