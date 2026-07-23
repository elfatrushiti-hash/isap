import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { initialMeetings } from '../data/meetings.js'
import { initialTasks } from '../data/tasks.js'
import { MEETING_STATUS, activeStatuses } from '../data/statuses.js'
import { createMeeting, startIntelligence } from '../services/meetingService.js'
import { advanceIntelligence, completeIntelligence, initializeIntelligence, PIPELINE_TICK_MS, resetIntelligence } from '../services/intelligenceService.js'
import { initialAdminState } from '../data/admin.js'
import { initialProducts } from '../data/products.js'
import { createProduct, updateProduct, archiveProduct, restoreProduct, deleteProduct } from '../services/productService.js'
import { ASSET_STATUS, initialAssets } from '../data/assets.js'
import { uploadAsset, updateAsset, archiveAsset, restoreAsset, deleteAsset } from '../services/assetService.js'
import { ANALYSIS_STATUS, advanceAnalysis, createInitialAnalysis, queueAnalysis, updateAnalysisMetadata } from '../services/analysisService.js'
import { initialPresentations } from '../data/presentations.js'
import { createPresentation, updatePresentation, archivePresentation, restorePresentation, deletePresentation, togglePresentationFavorite } from '../services/presentationService.js'

const IsapStoreContext = createContext(null)

function hydrateMeeting(meeting) {
  return meeting.status === MEETING_STATUS.INTELLIGENCE_RUNNING ? initializeIntelligence(meeting) : meeting
}

export function IsapStoreProvider({ children }) {
  const [meetings, setMeetings] = useState(() => initialMeetings.map(hydrateMeeting))
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedMeetingId, setSelectedMeetingId] = useState(
    initialMeetings.find((meeting) => meeting.status !== MEETING_STATUS.ARCHIVED)?.id || null
  )
  const [dashboardFilter, setDashboardFilter] = useState('ACTIVE')
  const [adminState, setAdminState] = useState(initialAdminState)
  const [products, setProducts] = useState(() => {
    try {
      const stored = window.localStorage.getItem('isap-products')
      return stored ? JSON.parse(stored) : initialProducts
    } catch {
      return initialProducts
    }
  })
  const [assets, setAssets] = useState(() => {
    try {
      const stored = window.localStorage.getItem('isap-assets')
      return stored ? JSON.parse(stored).map((asset) => ({ ...asset, analysis: createInitialAnalysis(asset.analysis) })) : initialAssets
    } catch {
      return initialAssets
    }
  })
  const [presentations, setPresentations] = useState(() => {
    try {
      const stored = window.localStorage.getItem('isap-presentations')
      return stored ? JSON.parse(stored) : initialPresentations
    } catch {
      return initialPresentations
    }
  })

  useEffect(() => {
    window.localStorage.setItem('isap-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    window.localStorage.setItem('isap-assets', JSON.stringify(assets))
  }, [assets])

  useEffect(() => {
    window.localStorage.setItem('isap-presentations', JSON.stringify(presentations))
  }, [presentations])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAssets((current) => current.map((asset) => {
        if (asset.status === ASSET_STATUS.UPLOADING) return { ...asset, status: ASSET_STATUS.QUEUED, progress: 35, updatedAt: new Date().toISOString() }
        if (asset.status === ASSET_STATUS.QUEUED) return { ...asset, status: ASSET_STATUS.PROCESSING, progress: 68, updatedAt: new Date().toISOString() }
        if (asset.status === ASSET_STATUS.PROCESSING) return { ...asset, status: ASSET_STATUS.READY, progress: 100, updatedAt: new Date().toISOString() }
        return asset
      }))
    }, 1100)
    return () => window.clearInterval(timer)
  }, [])


  useEffect(() => {
    const timer = window.setInterval(() => {
      setAssets((current) => current.map((asset) => {
        if (asset.status !== ASSET_STATUS.READY) return asset
        const analysis = createInitialAnalysis(asset.analysis)
        if (analysis.status === ANALYSIS_STATUS.NOT_STARTED) return queueAnalysis(asset)
        if ([ANALYSIS_STATUS.QUEUED, ANALYSIS_STATUS.EXTRACTING, ANALYSIS_STATUS.ANALYSING, ANALYSIS_STATUS.SUMMARISING].includes(analysis.status)) {
          return advanceAnalysis(asset, products)
        }
        return asset
      }))
    }, 900)
    return () => window.clearInterval(timer)
  }, [products])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMeetings((current) => current.map((meeting) => (
        meeting.status === MEETING_STATUS.INTELLIGENCE_RUNNING ? advanceIntelligence(meeting) : meeting
      )))
    }, PIPELINE_TICK_MS)
    return () => window.clearInterval(timer)
  }, [])

  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId) || null
  const activeMeetings = meetings.filter((meeting) => activeStatuses.includes(meeting.status))
  const completedMeetings = meetings.filter((meeting) => meeting.status === MEETING_STATUS.COMPLETED)
  const archivedMeetings = meetings.filter((meeting) => meeting.status === MEETING_STATUS.ARCHIVED)

  const updateMeetingStatus = useCallback((meetingId, status) => {
    setMeetings((current) => current.map((meeting) => (
      meeting.id === meetingId
        ? { ...meeting, status, archivedAt: status === MEETING_STATUS.ARCHIVED ? new Date().toISOString() : meeting.archivedAt }
        : meeting
    )))
  }, [])

  const archiveMeeting = useCallback((meetingId) => {
    setMeetings((current) => {
      const next = current.map((meeting) => meeting.id === meetingId ? { ...meeting, status: MEETING_STATUS.ARCHIVED, archivedAt: new Date().toISOString() } : meeting)
      const nextMeeting = next.find((meeting) => meeting.id !== meetingId && activeStatuses.includes(meeting.status))
      setSelectedMeetingId(nextMeeting?.id || null)
      return next
    })
  }, [])

  const restoreMeeting = useCallback((meetingId) => {
    updateMeetingStatus(meetingId, MEETING_STATUS.COMPLETED)
    setSelectedMeetingId(meetingId)
  }, [updateMeetingStatus])

  const addMeeting = useCallback((input) => {
    const id = `m-${Date.now()}`
    const meeting = {
      id,
      companyId: input.company.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      customer: input.company,
      industry: input.industry || 'Unknown', city: input.city || '', date: input.date, time: input.time,
      type: input.type || 'Customer Meeting', owner: input.owner || 'Thomas Meier', source: input.source || 'Manual',
      status: MEETING_STATUS.NEW, intelligenceProgress: 0, readiness: 0, opportunityScore: 0, forecast: 0,
      stage: 'New', closeDate: '-', mission: input.goal || 'Meeting-Ziel definieren.', businessGoal: input.goal || 'Discovery',
      focus: 'Intelligence pending', participants: input.contact ? [input.contact] : [],
      nextBestQuestion: 'Was ist fuer Sie das wichtigste Ergebnis dieses Meetings?', nextStep: 'Intelligence starten',
      painPoints: [], opportunities: [], risks: [], aiSignals: ['Intelligence noch nicht gestartet'], buyingSignals: [],
      livePrompts: ['Geschaeftsziel verstehen'], objections: [], captureTemplate: { summary: '', decisions: [], nextActions: [] }
    }
    setMeetings((current) => [meeting, ...current])
    setSelectedMeetingId(id)
    return id
  }, [])

  const createAndStartMeeting = useCallback(async (input) => {
    const draft = await createMeeting(input)
    const runningMeeting = initializeIntelligence(await startIntelligence(draft))
    setMeetings((current) => [runningMeeting, ...current])
    setSelectedMeetingId(runningMeeting.id)
    return runningMeeting.id
  }, [])

  const restartIntelligence = useCallback((meetingId) => {
    setMeetings((current) => current.map((meeting) => meeting.id === meetingId ? resetIntelligence(meeting) : meeting))
  }, [])

  const completeIntelligenceNow = useCallback((meetingId) => {
    setMeetings((current) => current.map((meeting) => meeting.id === meetingId ? completeIntelligence(meeting) : meeting))
  }, [])


  const addProduct = useCallback(async (input) => {
    const next = await createProduct(products, input)
    setProducts(next)
  }, [products])

  const editProduct = useCallback(async (productId, changes) => {
    const next = await updateProduct(products, productId, changes)
    setProducts(next)
  }, [products])

  const archiveProductById = useCallback(async (productId) => {
    const next = await archiveProduct(products, productId)
    setProducts(next)
  }, [products])

  const restoreProductById = useCallback(async (productId) => {
    const next = await restoreProduct(products, productId)
    setProducts(next)
  }, [products])

  const deleteProductById = useCallback(async (productId) => {
    const next = await deleteProduct(products, productId)
    setProducts(next)
  }, [products])

  const uploadAssets = useCallback((files) => {
    setAssets((current) => files.reduce((next, file) => uploadAsset(next, file), current))
  }, [])

  const editAsset = useCallback((assetId, changes) => {
    setAssets((current) => updateAsset(current, assetId, changes))
  }, [])

  const archiveAssetById = useCallback((assetId) => {
    setAssets((current) => archiveAsset(current, assetId))
  }, [])

  const restoreAssetById = useCallback((assetId) => {
    setAssets((current) => restoreAsset(current, assetId))
  }, [])

  const deleteAssetById = useCallback((assetId) => {
    setAssets((current) => deleteAsset(current, assetId))
  }, [])


  const analyseAssetById = useCallback((assetId) => {
    setAssets((current) => current.map((asset) => asset.id === assetId ? queueAnalysis(asset) : asset))
  }, [])

  const editAssetAnalysis = useCallback((assetId, changes) => {
    setAssets((current) => current.map((asset) => asset.id === assetId ? updateAnalysisMetadata(asset, changes) : asset))
  }, [])


  const addPresentation = useCallback(async (input) => {
    setPresentations((current) => createPresentation(current, input))
  }, [])

  const editPresentation = useCallback(async (presentationId, changes) => {
    setPresentations((current) => updatePresentation(current, presentationId, changes))
  }, [])

  const archivePresentationById = useCallback((presentationId) => {
    setPresentations((current) => archivePresentation(current, presentationId))
  }, [])

  const restorePresentationById = useCallback((presentationId) => {
    setPresentations((current) => restorePresentation(current, presentationId))
  }, [])

  const deletePresentationById = useCallback((presentationId) => {
    setPresentations((current) => deletePresentation(current, presentationId))
  }, [])

  const togglePresentationFavoriteById = useCallback((presentationId) => {
    setPresentations((current) => togglePresentationFavorite(current, presentationId))
  }, [])

  const setAdminSection = useCallback((activeSection) => {
    setAdminState((current) => ({ ...current, activeSection }))
  }, [])

  const toggleTask = useCallback((taskId) => {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task))
  }, [])

  const value = useMemo(() => ({
    meetings, tasks, selectedMeeting, selectedMeetingId, activeMeetings, completedMeetings, archivedMeetings,
    dashboardFilter, setDashboardFilter, setSelectedMeetingId, updateMeetingStatus, archiveMeeting, restoreMeeting,
    addMeeting, createAndStartMeeting, restartIntelligence, completeIntelligenceNow, toggleTask, adminState, setAdminSection,
    products, addProduct, editProduct, archiveProductById, restoreProductById, deleteProductById,
    assets, uploadAssets, editAsset, archiveAssetById, restoreAssetById, deleteAssetById, analyseAssetById, editAssetAnalysis,
    presentations, addPresentation, editPresentation, archivePresentationById, restorePresentationById, deletePresentationById, togglePresentationFavoriteById
  }), [meetings, tasks, selectedMeeting, selectedMeetingId, activeMeetings, completedMeetings, archivedMeetings, dashboardFilter, updateMeetingStatus, archiveMeeting, restoreMeeting, addMeeting, createAndStartMeeting, restartIntelligence, completeIntelligenceNow, toggleTask, adminState, setAdminSection, products, addProduct, editProduct, archiveProductById, restoreProductById, deleteProductById, assets, uploadAssets, editAsset, archiveAssetById, restoreAssetById, deleteAssetById, analyseAssetById, editAssetAnalysis, presentations, addPresentation, editPresentation, archivePresentationById, restorePresentationById, deletePresentationById, togglePresentationFavoriteById])

  return <IsapStoreContext.Provider value={value}>{children}</IsapStoreContext.Provider>
}

export function useIsapStore() {
  const context = useContext(IsapStoreContext)
  if (!context) throw new Error('useIsapStore must be used within IsapStoreProvider')
  return context
}
