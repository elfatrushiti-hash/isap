export const defaultIngestionSecurity = {
  enabled: true,
  collectorEnabled: false,
  scannerProvider: 'UNCONFIGURED',
  maxFileSizeMb: 25,
  quarantineRequired: true,
  blockExecutables: true,
  blockMacroDocuments: true,
  inspectArchives: true,
  allowedMimeTypes: ['application/pdf','text/html','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  sourcePolicy: {
    allowHttpsOnly: true,
    blockUnknownSources: true,
    allowedSourceTypes: ['Corporate website','Annual report','Investor Relations','Official press release','Established news','Public register']
  }
}

export const initialIngestionAudit = [
  { id:'audit-foundation', at:new Date().toISOString(), action:'SECURITY_FOUNDATION_INITIALIZED', result:'PASS', detail:'Secure ingestion policy initialized. Internet collector remains disabled.' }
]
