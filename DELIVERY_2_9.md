# ISAP Delivery 2.9 - Rule-based Sales Guidance

This delivery turns the existing dictionary and knowledge taxonomy into an operational sales-guidance engine.

## Added
- Sales Guidance tab in Administration > Intelligence Core.
- Customer/meeting context input with industry and objective.
- Deterministic detection of pain points, buying signals, business impacts and topics.
- Knowledge-graph traversal from detected signals to relevant Intrum products.
- Next-best-question suggestions from taxonomy `ask` relationships.
- Content recommendations from existing presentations and assets.
- Explainability evidence showing the exact terms and rules that fired.
- Local-only processing indicator.

## Data flow
No customer text is transmitted to an external AI or API. Processing is performed by the browser-based ISAP Rule Intelligence provider using local dictionaries, taxonomy and locally available metadata.
