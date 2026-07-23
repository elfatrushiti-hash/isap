import { PIPELINE_STEPS, PIPELINE_STEP_STATUS, buildInitialPipeline } from '../data/pipelineSteps.js'

export const PIPELINE_TICK_MS = 900

function nowIso() {
  return new Date().toISOString()
}

export function initializeIntelligence(meeting) {
  const startedAt = meeting.intelligenceStartedAt || nowIso()
  return {
    ...meeting,
    intelligenceStartedAt: startedAt,
    intelligenceCompletedAt: null,
    intelligenceProgress: Math.max(meeting.intelligenceProgress || 0, 8),
    intelligencePipeline: meeting.intelligencePipeline?.length
      ? meeting.intelligencePipeline
      : buildInitialPipeline(startedAt)
  }
}

export function advanceIntelligence(meeting) {
  const initialized = initializeIntelligence(meeting)
  const currentProgress = initialized.intelligenceProgress || 0
  const nextStep = PIPELINE_STEPS.find((step) => step.progress > currentProgress)

  if (!nextStep) return completeIntelligence(initialized)

  const completedAt = nowIso()
  const previousStep = [...PIPELINE_STEPS].reverse().find((step) => step.progress <= currentProgress)
  const nextPipeline = initialized.intelligencePipeline.map((step) => {
    if (previousStep && step.id === previousStep.id && step.status !== PIPELINE_STEP_STATUS.COMPLETED) {
      const started = step.startedAt ? new Date(step.startedAt).getTime() : Date.now()
      return {
        ...step,
        status: PIPELINE_STEP_STATUS.COMPLETED,
        completedAt,
        durationMs: Math.max(500, Date.now() - started)
      }
    }
    if (step.id === nextStep.id) {
      return { ...step, status: PIPELINE_STEP_STATUS.RUNNING, startedAt: step.startedAt || completedAt }
    }
    return step
  })

  const progress = nextStep.progress
  if (progress >= 100) {
    return completeIntelligence({ ...initialized, intelligencePipeline: nextPipeline, intelligenceProgress: 100 })
  }

  return {
    ...initialized,
    intelligencePipeline: nextPipeline,
    intelligenceProgress: progress,
    readiness: Math.min(96, Math.max(initialized.readiness || 0, Math.round(progress * 0.82))),
    opportunityScore: initialized.opportunityScore || Math.min(88, 55 + Math.round(progress / 4)),
    nextStep: `${nextStep.label} wird analysiert`,
    aiSignals: [`${nextStep.label}: Analyse laeuft`, ...(initialized.aiSignals || []).filter((item) => !item.includes('Pipeline gestartet'))].slice(0, 3)
  }
}

export function completeIntelligence(meeting) {
  const completedAt = nowIso()
  const pipeline = initializeIntelligence(meeting).intelligencePipeline.map((step) => {
    const started = step.startedAt ? new Date(step.startedAt).getTime() : Date.now() - 1000
    return {
      ...step,
      status: PIPELINE_STEP_STATUS.COMPLETED,
      startedAt: step.startedAt || completedAt,
      completedAt: step.completedAt || completedAt,
      durationMs: step.durationMs || Math.max(500, Date.now() - started)
    }
  })

  return {
    ...meeting,
    status: 'READY',
    intelligenceProgress: 100,
    readiness: Math.max(meeting.readiness || 0, 92),
    opportunityScore: meeting.opportunityScore || 82,
    intelligencePipeline: pipeline,
    intelligenceCompletedAt: completedAt,
    nextStep: 'Executive Brief pruefen',
    focus: meeting.focus === 'Intelligence pending' ? 'Company Intelligence · Opportunity Fit · Discovery' : meeting.focus,
    aiSignals: ['Company Intelligence abgeschlossen', 'Executive Brief ist bereit', 'Discovery Fragen wurden priorisiert']
  }
}

export function resetIntelligence(meeting) {
  const startedAt = nowIso()
  return {
    ...meeting,
    status: 'INTELLIGENCE_RUNNING',
    intelligenceProgress: 8,
    readiness: 18,
    intelligenceStartedAt: startedAt,
    intelligenceCompletedAt: null,
    intelligencePipeline: buildInitialPipeline(startedAt),
    nextStep: 'Company Intelligence wird erstellt',
    aiSignals: ['Intelligence Pipeline gestartet']
  }
}

export function getEstimatedSeconds(progress) {
  const remainingSteps = PIPELINE_STEPS.filter((step) => step.progress > progress).length
  return remainingSteps * Math.round(PIPELINE_TICK_MS / 1000 || 1)
}
