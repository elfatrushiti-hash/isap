export const adminSections = [
  { id: 'overview', label: 'Dashboard', description: 'Platform health, content readiness and governance.' },
  { id: 'products', label: 'Products', description: 'Manage the product catalogue used by recommendations.' },
  { id: 'assets', label: 'Assets', description: 'Upload and manage sales assets and documents.' },
  { id: 'presentations', label: 'Presentations', description: 'Prepare the presentation library and slide intelligence.' },
  { id: 'categories', label: 'Categories', description: 'Maintain industries, topics, audiences and tags.' },
  { id: 'ai-settings', label: 'AI Settings', description: 'Configure AI processing and recommendation policies.' },
  { id: 'integrations', label: 'Integrations', description: 'Connect CRM, Microsoft 365 and document repositories.' }
]

export const initialAdminState = {
  activeSection: 'overview',
  platformStatus: 'Foundation ready',
  products: 7,
  assets: 0,
  presentations: 0,
  categories: 12,
  pendingAnalysis: 0,
  integrations: [
    { id: 'microsoft-365', name: 'Microsoft 365', status: 'Prepared' },
    { id: 'salesforce', name: 'Salesforce', status: 'Prepared' },
    { id: 'sharepoint', name: 'SharePoint', status: 'Prepared' }
  ]
}
