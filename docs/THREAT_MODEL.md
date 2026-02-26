# Threat Model (STRIDE)

## Assets críticos
- Artefactos raw/normalized + hashes
- Audit trail append-only
- JWT e credenciais
- Metadados de caso

## Trust boundaries
- Browser ↔ API
- API ↔ Postgres
- API ↔ MinIO
- API ↔ Neo4j/Ollama/Redis

## STRIDE por componente (MVP)
- API: spoofing JWT, tampering payload, repudiation -> mitigação JWT/RBAC, audit append-only, correlation id.
- Postgres: tampering/deletion -> contas mínimas, backups, append-only lógico para audit.
- MinIO: disclosure/tampering -> buckets privados, hashes SHA256.
- Neo4j: cross-case leakage -> `case_id` obrigatório.
- Ollama: prompt abuse -> logs completos de prompt/input/output e output marcado SUGGESTED.

## Plano NEXT
- mTLS interno
- KMS para secrets e object lock
- assinatura digital de relatórios
- WORM para trilha de auditoria
