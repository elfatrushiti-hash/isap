const EXECUTABLE_EXTENSIONS = ['exe','dll','msi','bat','cmd','com','scr','ps1','sh','jar','app','dmg']
const MACRO_EXTENSIONS = ['docm','xlsm','pptm']
const ARCHIVE_EXTENSIONS = ['zip','rar','7z','tar','gz']

export function validateIngestionCandidate(candidate = {}, policy = {}) {
  const reasons = []
  const warnings = []
  const url = String(candidate.url || '').trim()
  const extension = String(candidate.extension || '').replace(/^\./,'').toLowerCase()
  const sizeMb = Number(candidate.sizeMb || 0)
  const mimeType = String(candidate.mimeType || '').trim().toLowerCase()

  if (policy.sourcePolicy?.allowHttpsOnly && url && !url.toLowerCase().startsWith('https://')) reasons.push('Only HTTPS sources are allowed.')
  if (policy.blockExecutables && EXECUTABLE_EXTENSIONS.includes(extension)) reasons.push(`Executable file type .${extension} is blocked.`)
  if (policy.blockMacroDocuments && MACRO_EXTENSIONS.includes(extension)) reasons.push(`Macro-enabled document .${extension} is blocked.`)
  if (sizeMb > Number(policy.maxFileSizeMb || 25)) reasons.push(`File exceeds the ${policy.maxFileSizeMb || 25} MB limit.`)
  if (mimeType && policy.allowedMimeTypes?.length && !policy.allowedMimeTypes.includes(mimeType)) reasons.push(`MIME type ${mimeType} is not allowlisted.`)
  if (ARCHIVE_EXTENSIONS.includes(extension)) warnings.push(policy.inspectArchives ? 'Archive requires recursive inspection before release.' : 'Archive inspection is disabled; release must be blocked by the gateway.')

  return {
    decision: reasons.length ? 'BLOCK' : 'QUARANTINE',
    reasons,
    warnings,
    scannerRequired: true,
    scannerAvailable: policy.scannerProvider && policy.scannerProvider !== 'UNCONFIGURED',
    canRelease: false,
    nextStep: reasons.length ? 'Reject candidate and write audit event.' : 'Hold in quarantine and submit to approved malware scanner.'
  }
}

export function createIngestionAudit(action, result, detail) {
  return { id:`ingestion-${Date.now()}-${Math.random().toString(16).slice(2)}`, at:new Date().toISOString(), action, result, detail }
}
