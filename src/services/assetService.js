import { ASSET_STATUS, ASSET_TYPE } from '../data/assets.js'
import { createInitialAnalysis } from './analysisService.js'

export const SUPPORTED_ASSET_TYPES = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'video/mp4'
]

export const SUPPORTED_ASSET_EXTENSIONS = ['pptx', 'pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg', 'mp4']
export const MAX_ASSET_SIZE = 250 * 1024 * 1024

function extensionFromName(filename = '') {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getAssetType(fileOrAsset) {
  const mimeType = fileOrAsset?.type || fileOrAsset?.mimeType || ''
  const extension = extensionFromName(fileOrAsset?.name || fileOrAsset?.filename)
  if (mimeType.includes('presentation') || extension === 'pptx') return ASSET_TYPE.PRESENTATION
  if (mimeType === 'application/pdf' || extension === 'pdf') return ASSET_TYPE.PDF
  if (mimeType.includes('wordprocessingml') || extension === 'docx') return ASSET_TYPE.DOCUMENT
  if (mimeType.includes('spreadsheetml') || extension === 'xlsx') return ASSET_TYPE.SPREADSHEET
  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg'].includes(extension)) return ASSET_TYPE.IMAGE
  if (mimeType.startsWith('video/') || extension === 'mp4') return ASSET_TYPE.VIDEO
  return ASSET_TYPE.OTHER
}

export function validateAsset(file) {
  if (!file) return { valid: false, error: 'No file selected.' }
  const extension = extensionFromName(file.name)
  const supported = SUPPORTED_ASSET_TYPES.includes(file.type) || SUPPORTED_ASSET_EXTENSIONS.includes(extension)
  if (!supported) return { valid: false, error: `${file.name}: unsupported file type.` }
  if (file.size > MAX_ASSET_SIZE) return { valid: false, error: `${file.name}: file exceeds the 250 MB limit.` }
  return { valid: true, error: null }
}

export function createAssetDraft(file) {
  const validation = validateAsset(file)
  if (!validation.valid) throw new Error(validation.error)
  const now = new Date().toISOString()
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return {
    id: `asset-${uniqueId}`,
    title: file.name.replace(/\.[^.]+$/, ''),
    description: '',
    filename: file.name,
    mimeType: file.type || 'application/octet-stream',
    extension: extensionFromName(file.name),
    type: getAssetType(file),
    size: file.size,
    status: ASSET_STATUS.UPLOADING,
    progress: 5,
    version: '1.0',
    products: [],
    presentations: [],
    industries: [],
    audiences: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
    versions: [{ version: '1.0', filename: file.name, size: file.size, uploadedAt: now }],
    analysis: createInitialAnalysis()
  }
}

export function getAssets(assets = []) {
  return assets
}

export function uploadAsset(assets, file) {
  return [createAssetDraft(file), ...assets]
}

export function updateAsset(assets, assetId, changes) {
  const updatedAt = new Date().toISOString()
  return assets.map((asset) => asset.id === assetId ? { ...asset, ...changes, updatedAt } : asset)
}

export function archiveAsset(assets, assetId) {
  const now = new Date().toISOString()
  return assets.map((asset) => asset.id === assetId ? { ...asset, status: ASSET_STATUS.ARCHIVED, archivedAt: now, updatedAt: now } : asset)
}

export function restoreAsset(assets, assetId) {
  const now = new Date().toISOString()
  return assets.map((asset) => asset.id === assetId ? { ...asset, status: ASSET_STATUS.READY, archivedAt: null, updatedAt: now } : asset)
}

export function deleteAsset(assets, assetId) {
  return assets.filter((asset) => asset.id !== assetId)
}
