import { useMemo, useState } from 'react'
import { BrainCircuit, GitBranch, PackageSearch, Plus, Save, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { useIsapStore } from '../../../context/IsapStore.jsx'
import { analyseWithRules, getRelatedKnowledge, getTaxonomyStats } from '../../../services/ruleIntelligenceService.js'
import { deriveSalesGuidance } from '../../../services/salesGuidanceService.js'

const NODE_TYPES = ['product', 'pain-point', 'buying-signal', 'objection', 'industry', 'topic', 'question', 'content']
const RELATIONS = ['suggests', 'relevant-for', 'ask', 'supports', 'handles-objection', 'related-to']

export default function IntelligenceCore() {
  const { intelligenceKnowledge, updateIntelligenceKnowledge, presentations = [], assets = [] } = useIsapStore()
  const [sample, setSample] = useState('We still perform most credit checks manually and want to improve onboarding.')
  const [guidanceText, setGuidanceText] = useState('We still perform most credit checks manually. The onboarding team wants to reduce effort and improve customer experience.')
  const [guidanceIndustry, setGuidanceIndustry] = useState('Banking')
  const [guidanceObjective, setGuidanceObjective] = useState('Understand the current credit-check process and identify efficiency opportunities.')
  const [tab, setTab] = useState('dictionary')
  const [selectedNodeId, setSelectedNodeId] = useState(null)

  const dictionaries = intelligenceKnowledge?.dictionaries || []
  const taxonomy = intelligenceKnowledge?.taxonomy || { nodes: [], links: [] }
  const nodes = taxonomy.nodes || []
  const links = taxonomy.links || []
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || nodes[0] || null

  const result = useMemo(() => analyseWithRules({ text: sample }, intelligenceKnowledge), [sample, intelligenceKnowledge])
  const stats = useMemo(() => getTaxonomyStats(intelligenceKnowledge), [intelligenceKnowledge])
  const related = useMemo(() => selectedNode ? getRelatedKnowledge(selectedNode.id, intelligenceKnowledge) : [], [selectedNode, intelligenceKnowledge])
  const guidance = useMemo(() => deriveSalesGuidance({ text: guidanceText, industry: guidanceIndustry, objective: guidanceObjective, knowledge: intelligenceKnowledge, presentations, assets }), [guidanceText, guidanceIndustry, guidanceObjective, intelligenceKnowledge, presentations, assets])

  const saveKnowledge = (changes) => updateIntelligenceKnowledge({ ...intelligenceKnowledge, ...changes })
  const saveTaxonomy = (nextNodes, nextLinks = links) => saveKnowledge({ taxonomy: { nodes: nextNodes, links: nextLinks } })

  const patchRule = (id, changes) => saveKnowledge({ dictionaries: dictionaries.map((rule) => rule.id === id ? { ...rule, ...changes } : rule) })
  const addRule = () => saveKnowledge({ dictionaries: [...dictionaries, { id:`rule-${Date.now()}`, label:'New rule', type:'topic', terms:[], products:[], weight:5 }] })
  const removeRule = (id) => saveKnowledge({ dictionaries: dictionaries.filter((rule) => rule.id !== id) })

  const addNode = () => {
    const node = { id:`tax-${Date.now()}`, type:'topic', label:'New knowledge item', description:'' }
    saveTaxonomy([...nodes, node])
    setSelectedNodeId(node.id)
  }
  const patchNode = (id, changes) => saveTaxonomy(nodes.map((node) => node.id === id ? { ...node, ...changes } : node))
  const removeNode = (id) => {
    saveTaxonomy(nodes.filter((node) => node.id !== id), links.filter((link) => link.from !== id && link.to !== id))
    setSelectedNodeId(null)
  }
  const addLink = () => {
    if (!selectedNode || nodes.length < 2) return
    const target = nodes.find((node) => node.id !== selectedNode.id)
    saveTaxonomy(nodes, [...links, { id:`link-${Date.now()}`, from:selectedNode.id, to:target.id, relation:'related-to' }])
  }
  const patchLink = (id, changes) => saveTaxonomy(nodes, links.map((link) => link.id === id ? { ...link, ...changes } : link))
  const removeLink = (id) => saveTaxonomy(nodes, links.filter((link) => link.id !== id))

  return (
    <div className="admin-view-stack intelligence-core">
      <div className="admin-panel intelligence-core-hero">
        <div><span className="admin-panel-kicker">ISAP Intelligence Core</span><h2>Deterministic intelligence first.</h2><p>Dictionary, taxonomy and scoring run locally in the browser. External AI remains hard-disabled.</p></div>
        <div className="intelligence-mode-card"><ShieldCheck size={22}/><strong>RULE MODE</strong><span>No external AI transmission</span></div>
      </div>

      <div className="intelligence-tabs">
        <button type="button" className={tab === 'dictionary' ? 'active' : ''} onClick={() => setTab('dictionary')}>Dictionary & rules</button>
        <button type="button" className={tab === 'taxonomy' ? 'active' : ''} onClick={() => setTab('taxonomy')}>Knowledge taxonomy</button>
        <button type="button" className={tab === 'guidance' ? 'active' : ''} onClick={() => setTab('guidance')}>Sales guidance</button>
      </div>

      {tab === 'dictionary' && <>
        <div className="admin-panel">
          <div className="admin-toolbar"><div><span>Knowledge dictionary</span><small>{dictionaries.length} explainable rules</small></div><button className="admin-primary-button" type="button" onClick={addRule}><Plus size={16}/>Add rule</button></div>
          <div className="intelligence-rule-list">{dictionaries.map((rule) => <div className="intelligence-rule" key={rule.id}>
            <input value={rule.label || ''} onChange={(e) => patchRule(rule.id,{label:e.target.value})}/>
            <select value={rule.type || 'topic'} onChange={(e) => patchRule(rule.id,{type:e.target.value})}><option value="topic">Topic</option><option value="pain-point">Pain point</option><option value="buying-signal">Buying signal</option><option value="business-impact">Business impact</option><option value="objection">Objection</option></select>
            <input value={(rule.terms || []).join(', ')} onChange={(e) => patchRule(rule.id,{terms:e.target.value.split(',').map((v)=>v.trim()).filter(Boolean)})} placeholder="Terms, comma separated"/>
            <input type="number" min="1" max="10" value={rule.weight ?? 5} onChange={(e)=>patchRule(rule.id,{weight:Number(e.target.value)})}/>
            <button className="admin-icon-button" type="button" onClick={()=>removeRule(rule.id)} title="Delete rule"><Trash2 size={15}/></button>
          </div>)}</div>
        </div>
        <div className="admin-panel intelligence-test"><div><span className="admin-panel-kicker">Rule laboratory</span><h2>Explainability test</h2><textarea value={sample} onChange={(e)=>setSample(e.target.value)}/></div><div><div className="intelligence-score"><BrainCircuit size={20}/><strong>{result?.confidence ?? 0}%</strong><span>confidence</span></div>{(result?.matches || []).map((match)=><div className="intelligence-match" key={match.ruleId}><strong>{match.label}</strong><span>{match.type} · {match.score}%</span><p>{match.explanation}</p></div>)}{!result?.matches?.length && <p>No rule matched this text.</p>}</div></div>
      </>}

      {tab === 'taxonomy' && <>
        <div className="taxonomy-metrics"><div><strong>{stats.nodes}</strong><span>Knowledge items</span></div><div><strong>{stats.links}</strong><span>Relationships</span></div><div><strong>{stats.types}</strong><span>Knowledge types</span></div><div><strong>{stats.orphaned}</strong><span>Unlinked items</span></div></div>
        <div className="admin-panel taxonomy-workbench">
          <div className="taxonomy-list"><div className="admin-toolbar"><div><span>Knowledge map</span><small>Products, signals and sales knowledge</small></div><button className="admin-primary-button" type="button" onClick={addNode}><Plus size={15}/>Add</button></div><div className="taxonomy-node-list">{nodes.map((node)=><button type="button" key={node.id} className={selectedNode?.id === node.id ? 'active' : ''} onClick={()=>setSelectedNodeId(node.id)}><span>{node.type}</span><strong>{node.label}</strong></button>)}</div></div>
          <div className="taxonomy-editor">{selectedNode ? <><div className="taxonomy-editor-head"><div><span className="admin-panel-kicker">Knowledge item</span><h2>{selectedNode.label}</h2></div><button className="admin-icon-button" type="button" onClick={()=>removeNode(selectedNode.id)} title="Delete knowledge item"><Trash2 size={16}/></button></div><label>Label<input value={selectedNode.label || ''} onChange={(e)=>patchNode(selectedNode.id,{label:e.target.value})}/></label><label>Type<select value={selectedNode.type || 'topic'} onChange={(e)=>patchNode(selectedNode.id,{type:e.target.value})}>{NODE_TYPES.map((type)=><option key={type} value={type}>{type}</option>)}</select></label><label>Description<textarea value={selectedNode.description || ''} onChange={(e)=>patchNode(selectedNode.id,{description:e.target.value})}/></label><div className="taxonomy-relations-head"><div><GitBranch size={16}/><strong>Relationships</strong></div><button type="button" onClick={addLink} disabled={nodes.length < 2}><Plus size={14}/>Link</button></div><div className="taxonomy-relations">{related.map((item)=><div key={item.id}><select value={item.relation} onChange={(e)=>patchLink(item.id,{relation:e.target.value})}>{RELATIONS.map((relation)=><option key={relation} value={relation}>{relation}</option>)}</select><span>{item.node.label}</span><button type="button" onClick={()=>removeLink(item.id)}><Trash2 size={13}/></button></div>)}{!related.length && <p>No relationships yet. Connect this item to build the ISAP knowledge graph.</p>}</div></> : <p>Add a knowledge item to start the taxonomy.</p>}</div>
        </div>
      </>}

      {tab === 'guidance' && <div className="guidance-workbench">
        <div className="admin-panel guidance-input">
          <div><span className="admin-panel-kicker">Rule-based sales intelligence</span><h2>Turn customer context into sales guidance.</h2><p>This workflow runs entirely on the local ISAP rule engine and knowledge taxonomy.</p></div>
          <label>Customer / meeting context<textarea value={guidanceText} onChange={(e)=>setGuidanceText(e.target.value)} /></label>
          <div className="guidance-input-grid"><label>Industry<input value={guidanceIndustry} onChange={(e)=>setGuidanceIndustry(e.target.value)} /></label><label>Meeting objective<input value={guidanceObjective} onChange={(e)=>setGuidanceObjective(e.target.value)} /></label></div>
          <div className="guidance-privacy"><ShieldCheck size={16}/><div><strong>Local processing</strong><span>No text is sent to an external AI or API.</span></div></div>
        </div>

        <div className="admin-panel guidance-output">
          <div className="guidance-head"><div><span className="admin-panel-kicker">Guidance result</span><h2>{guidance.confidence}% confidence</h2></div><div className="guidance-mode"><BrainCircuit size={17}/><span>RULE</span></div></div>
          <div className="guidance-summary-grid">
            <section><span>Pain points</span>{guidance.painPoints.length ? guidance.painPoints.map((item)=><strong key={item.label}>{item.label}</strong>) : <small>None detected</small>}</section>
            <section><span>Buying signals</span>{guidance.buyingSignals.length ? guidance.buyingSignals.map((item)=><strong key={item.label}>{item.label}</strong>) : <small>None detected</small>}</section>
            <section><span>Business impact</span>{guidance.businessImpacts.length ? guidance.businessImpacts.map((item)=><strong key={item.label}>{item.label}</strong>) : <small>None detected</small>}</section>
            <section><span>Topics</span>{guidance.topics.length ? guidance.topics.map((item)=><strong key={item.label}>{item.label}</strong>) : <small>None detected</small>}</section>
          </div>

          <div className="guidance-section"><div className="guidance-section-title"><PackageSearch size={17}/><strong>Relevant products</strong></div>{guidance.products.length ? <div className="guidance-cards">{guidance.products.map((item)=><div key={item.label}><span>{item.source}</span><strong>{item.label}</strong><p>{item.reason}</p></div>)}</div> : <p className="guidance-empty">No product recommendation yet. Add or refine rules and taxonomy links.</p>}</div>

          <div className="guidance-section"><div className="guidance-section-title"><Sparkles size={17}/><strong>Next best questions</strong></div>{guidance.questions.length ? <ol className="guidance-question-list">{guidance.questions.map((item)=><li key={item.text}><strong>{item.text}</strong><span>{item.reason}</span></li>)}</ol> : <p className="guidance-empty">No linked discovery question found.</p>}</div>

          <div className="guidance-section"><div className="guidance-section-title"><Save size={17}/><strong>Recommended content</strong></div>{guidance.content.length ? <div className="guidance-content-list">{guidance.content.map((item)=><div key={`${item.type}-${item.id || item.title}`}><span>{item.type}</span><strong>{item.title}</strong><em>{item.score}%</em><small>{item.reasons?.join(' · ') || item.reason || 'Knowledge taxonomy match'}</small></div>)}</div> : <p className="guidance-empty">No matching presentation or asset yet.</p>}</div>

          <details className="guidance-evidence"><summary>Why did ISAP recommend this?</summary><div>{guidance.evidence.map((item)=><p key={`${item.type}-${item.label}`}><strong>{item.label}</strong><span>{item.explanation}</span></p>)}{!guidance.evidence.length && <p>No evidence available.</p>}</div></details>
        </div>
      </div>}

      <div className="admin-panel intelligence-provider"><div><Save size={18}/><div><strong>External AI provider</strong><p>Interface reserved for a later compliance-approved provider. It is not configured and cannot transmit data in this release.</p></div><span>LOCKED</span></div></div>
    </div>
  )
}
