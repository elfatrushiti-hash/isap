
## 2.2.0 - Presentation Viewer

### Added
- Full-screen presentation viewer
- Slide navigation, zoom and speaker notes
- Presentation information and linked asset panel
- Persistent viewer state
- Responsive viewer layout
# Changelog

## Delivery 1.4 - Document Intelligence

### Added
- Automatic document analysis pipeline after asset upload
- Metadata extraction for language, pages or slides, topics, industries and products
- Heuristic keyword and product detection without an external AI dependency
- Editable executive summary and analysis metadata
- Analysis progress states and confidence score
- Manual reanalysis action
- Search across detected topics and keywords
- Provider-ready analysis metadata for a later OpenAI or Azure OpenAI integration

# ISAP Changelog

## Delivery 1.3 - Asset Library

### Added
- Drag-and-drop and file browser uploads for PowerPoint, PDF, Word, Excel, PNG, JPG and MP4.
- Multi-file validation with a 250 MB per-file limit.
- Asset upload pipeline with Uploading, Queued, Processing and Ready states.
- Search and filters for file type, status and assigned product.
- Asset metadata editing for title, description, tags and product assignments.
- Archive, restore and permanent delete actions.
- Asset version and AI-analysis-ready data structures.
- Local browser persistence for asset metadata.

### Changed
- Administration dashboard now shows the live asset count.
- Asset service expanded into a complete local CRUD boundary.

## Delivery 1.2 - Product Management

### Added
- Editable product catalogue in Administration.
- Create and edit product dialog.
- Product search, status filter, category filter and sorting.
- Active, Draft and Archived product states.
- Archive, restore and permanent delete actions.
- Product metadata for industries, pain points and keywords.
- Local browser persistence for product changes.
- Initial product catalogue data.

### Changed
- Administration dashboard now shows the live product count.
- Product service expanded with restore and complete metadata handling.

## Delivery 1.1 - Administration Foundation

### Added
- Administration area and navigation.
- Dashboard, Products, Assets, Presentations, Categories, AI Settings and Integrations sections.
- Product and asset service boundaries.

## Delivery 2.1 - Presentation Library

### Added
- Presentation creation and editing
- Grid and list views
- Product and PowerPoint asset assignments
- Status, search and product filters
- Favorites, archive, restore and permanent deletion
- Presentation metadata including audiences, industries, tags, slide count and version
- Browser persistence through localStorage
