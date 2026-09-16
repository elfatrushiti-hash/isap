# ISAP 3.2.1 - Relevance-first Customer Intelligence

This patch addresses the main limitation of 3.2: public research is no longer presented as an unfiltered website text dump.

## New research synthesis
ISAP now ranks public evidence against the configured product catalogue and presents the result as a sales-oriented research brief.

## Product relevance
Every active product is matched against captured public sources using product name, keywords, pain points and industry alignment. The UI shows the strongest product opportunities and the public evidence behind them.

## Management discovery
The controlled official-site collector prioritizes leadership, management, team and board pages. It extracts management candidates from structured JSON-LD and conservative visible-text patterns. ISAP does not invent names when no reliable evidence is available.

## Best contact recommendation
Management roles are scored against the strongest product signals. The highest matching stakeholder is shown as the recommended commercial contact with an explainable reason and evidence link.

## Executive layout
The Public Sources tab now emphasizes, at a glance:
- best commercial contact
- top product relevance
- key sales signals
- management team
- ranked source evidence

Raw source content remains available but is collapsed by default.

## Security
No external AI is used. The backend remains HTTPS-only, same-domain, public-network validated and HTML/text-only. Binary downloads remain blocked.
