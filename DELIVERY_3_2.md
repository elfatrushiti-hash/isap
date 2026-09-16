# Delivery 3.2 - Controlled Public Web Research

## Scope
ISAP can now perform real public-web retrieval after deployment through a Vercel serverless endpoint.

## Added
- `api/public-research.js`: controlled server-side public website collector.
- `src/services/publicResearchService.js`: frontend gateway client.
- Controlled Internet Research UI in Company Intelligence > Public Sources.
- Ingestion audit events for successful and blocked research attempts.

## Security controls
- HTTPS only.
- DNS/public-network validation and private-address blocking.
- Credential-bearing URLs blocked.
- Same-domain crawl only.
- Redirects revalidated.
- Maximum 6 pages per run.
- Maximum 2 MB per page.
- Only HTML, XHTML and plain text accepted.
- Executables, archives, PDFs and other binary downloads are not accepted by this collector.
- Script/style/SVG/noscript content is removed and never executed.
- Source content is not sent to an external AI provider.

## Important boundary
This is the first real Internet connection, but it is intentionally an official-site collector rather than an unrestricted search-engine crawler. Broad web/news discovery should be added through an approved search provider in a later delivery.

The malware-scanner provider remains required for future binary/document ingestion. It is not bypassed: Delivery 3.2 simply does not ingest binary files.
