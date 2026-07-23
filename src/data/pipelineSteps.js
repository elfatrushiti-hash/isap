export const PIPELINE_STEPS = [
  { id: 'meeting', label: 'Meeting erkannt', description: 'Termin, Ziel und Teilnehmer wurden validiert.', progress: 8 },
  { id: 'company', label: 'Unternehmen identifiziert', description: 'Firmenprofil und Branchenzuordnung werden abgeglichen.', progress: 20 },
  { id: 'profile', label: 'Unternehmensprofil', description: 'Kerndaten, Standorte und Marktposition werden aufbereitet.', progress: 34 },
  { id: 'management', label: 'Management', description: 'Entscheider und relevante Stakeholder werden analysiert.', progress: 48 },
  { id: 'financials', label: 'Finanzdaten', description: 'Finanzielle Signale und Unternehmensentwicklung werden bewertet.', progress: 61 },
  { id: 'news', label: 'News', description: 'Aktuelle Entwicklungen und Trigger Events werden gesammelt.', progress: 73 },
  { id: 'strategy', label: 'Strategische Initiativen', description: 'Prioritäten, Transformationen und Risiken werden abgeleitet.', progress: 84 },
  { id: 'fit', label: 'Intrum Fit', description: 'Passende Intrum Fähigkeiten und Chancen werden gematcht.', progress: 93 },
  { id: 'brief', label: 'Executive Brief', description: 'Briefing, Fragen und Next Best Actions werden erstellt.', progress: 100 }
]

export const PIPELINE_STEP_STATUS = Object.freeze({
  WAITING: 'waiting',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
})

export function buildInitialPipeline(startedAt = new Date().toISOString()) {
  return PIPELINE_STEPS.map((step, index) => ({
    ...step,
    status: index === 0 ? PIPELINE_STEP_STATUS.RUNNING : PIPELINE_STEP_STATUS.WAITING,
    startedAt: index === 0 ? startedAt : null,
    completedAt: null,
    durationMs: null
  }))
}
