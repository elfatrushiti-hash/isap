# Delivery 3.1 - Secure Ingestion Foundation

Adds the security control plane required before ISAP is allowed to fetch public internet content automatically.

## Included
- Administration > Ingestion Security
- inbound source/file policy model
- HTTPS, MIME, size, executable and macro-document controls
- quarantine-first decision model
- abstract malware scanner provider selection (not connected)
- archive inspection policy
- local pre-flight laboratory
- local security audit foundation
- collector remains explicitly disabled

## Security boundary
This release does not claim to perform a real antivirus/malware scan. Real scanning must run server-side in the future Security Gateway using an Intrum-approved scanner. No automatic internet download is activated in 3.1.
