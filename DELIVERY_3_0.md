# Delivery 3.0 - Customer Intelligence Source Foundation

## Added
- Public Sources tab in Company Intelligence
- Source governance and trust classification
- Manual public-source capture with URL, publication date and relevant excerpt
- Provenance metadata for every source
- Local rule-based analysis of source content
- Extracted topics, pain points and buying signals
- Re-analysis and deletion controls
- Browser persistence via `isap-company-sources`

## Security posture
- No external AI provider
- No API keys
- No automatic web scraping or outbound upload
- Pasted source content is analysed locally in the browser
- Source URLs can be opened manually in a new browser tab

## Why no automatic fetch yet?
Automatic internet collection should not be implemented as browser-side scraping. The next collector layer should use a controlled backend with source allow-lists, rate limiting, provenance and compliance controls.
