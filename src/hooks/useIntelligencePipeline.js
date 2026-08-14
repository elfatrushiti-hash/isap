import { useMemo } from 'react'
import { useIsapStore } from '../context/IsapStore.jsx'
import { getEstimatedSeconds } from '../services/intelligenceService.js'

export default function useIntelligencePipeline(meetingId) {
  const { meetings, restartIntelligence, completeIntelligenceNow } = useIsapStore()
  const meeting = meetings.find((item) => item.id === meetingId) || null

  return useMemo(() => ({
    meeting,
    progress: meeting?.intelligenceProgress || 0,
    steps: meeting?.intelligencePipeline || [],
    currentStep: meeting?.intelligencePipeline?.find((step) => step.status === 'running') || null,
    estimatedSeconds: getEstimatedSeconds(meeting?.intelligenceProgress || 0),
    restart: () => restartIntelligence(meetingId),
    finish: () => completeIntelligenceNow(meetingId)
  }), [meeting, meetingId, restartIntelligence, completeIntelligenceNow])
}
