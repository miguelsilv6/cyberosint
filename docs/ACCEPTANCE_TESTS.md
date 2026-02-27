# ACCEPTANCE TESTS (Smoke)

## A) Pré-requisitos
- Docker + Docker Compose
- Portas: web 5173, api 3000, postgres 5432, neo4j 7474/7687, minio 9000/9001, redis 6379, ollama 11434

## B) Arranque
1. `cp .env.example .env`
2. `docker compose up --build -d`
3. `docker compose ps`
4. verificar `curl -s http://localhost:3000/health`

## C) Smoke tests via curl
1. `curl -s http://localhost:3000/health`
2. `curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@local","password":"admin123"}'`
3. `curl -s -X POST http://localhost:3000/cases -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"name":"Case Demo","description":"OSINT demo"}'`
4. `curl -s -X POST http://localhost:3000/cases/<CASE_ID>/ingest/url -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"url":"https://example.com"}'`
5. `curl -s http://localhost:3000/cases/<CASE_ID>/artifacts -H "Authorization: Bearer <TOKEN>"`
6. `curl -s -X POST http://localhost:3000/artifacts/<ARTIFACT_ID>/normalize -H "Authorization: Bearer <TOKEN>"`
7. `curl -s -X POST http://localhost:3000/artifacts/<ARTIFACT_ID>/enrich/entities-llm -H "Authorization: Bearer <TOKEN>"`
8. `curl -s "http://localhost:3000/cases/<CASE_ID>/suggestions?status=SUGGESTED" -H "Authorization: Bearer <TOKEN>"`
9. `curl -s -X POST http://localhost:3000/suggestions/<SUGGESTION_ID>/validate -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"action":"APPROVE","reason":"Verified by analyst"}'`
10. `curl -s http://localhost:3000/cases/<CASE_ID>/graph/summary -H "Authorization: Bearer <TOKEN>"`
11. `curl -s -X POST http://localhost:3000/cases/<CASE_ID>/reports/generate -H "Authorization: Bearer <TOKEN>"`
12. `curl -L -o report.docx http://localhost:3000/reports/<REPORT_ID>/download -H "Authorization: Bearer <TOKEN>"`

## D) Smoke tests via UI
- Login OK
- Criar case OK
- Ingest URL OK
- Ver artifact detail OK (hashes + proveniência)
- Normalizar OK (aparece normalized hash)
- Enrich entities OK (aparecem sugestões)
- Aprovar sugestão OK
- Graph tab mostra entidades/edges
- Reports: gerar e descarregar DOCX

## E) Critérios de aceitação
- Endpoints do scope atual (fase 1+2) 200/201
- Artefactos no bucket MinIO `evidence`
- Audit events append-only com `chained_hash` preenchido
- Próximas fases cobrem enrich/validation/graph/report
