# Forensic OSINT Platform (MVP)

MVP **forense-first** para OSINT assistida por IA, com foco em:
- proveniência por artefacto,
- integridade por SHA-256,
- trilha de auditoria append-only com `chained_hash`,
- segregação por `case_id`.

> Estado atual: fundações + fluxo funcional de **FASE 1 e FASE 2** (auth, cases, ingest, artifacts, normalize, audit trail, storage MinIO).

---

## 1) Pré-requisitos

- Docker
- Docker Compose
- Portas livres:
  - `5173` (web)
  - `3000` (api)
  - `5432` (postgres)
  - `7474/7687` (neo4j)
  - `9000/9001` (minio)
  - `6379` (redis)
  - `11434` (ollama)

---

## 2) Configuração do ambiente

1. Copiar variáveis de ambiente:

```bash
cp .env.example .env
```

2. (Opcional) Ajustar credenciais/portas no `.env`.

> A API valida env vars no arranque e falha cedo se faltar configuração obrigatória.

---

## 3) Arranque com Docker

```bash
docker compose up --build -d
docker compose ps
```

Verificar saúde da API:

```bash
curl -s http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

---

## 4) Como abrir a MVP

### UI Web
- URL: `http://localhost:5173`

### API
- Base URL: `http://localhost:3000`
- Health: `GET /health`

### Consolas de infra
- MinIO Console: `http://localhost:9001`
- Neo4j Browser: `http://localhost:7474`

---

## 5) Utilizador seed (dev)

Em `APP_ENV=local`, no arranque da API é criado automaticamente um admin (se não existir):
- Email: `SEED_ADMIN_EMAIL` (default `admin@local`)
- Password: `SEED_ADMIN_PASSWORD` (default `admin123`)
- Role: `SEED_ADMIN_ROLE` (default `admin`)

Login API:

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'
```

---

## 6) Como usar a MVP (fluxo rápido)

### Passo A — autenticar
1. Fazer login (`/auth/login`) e guardar JWT.

### Passo B — criar caso
2. Criar case:

```bash
curl -s -X POST http://localhost:3000/cases \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Case Demo","description":"OSINT demo"}'
```

### Passo C — ingestão
3. Ingest URL:

```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/ingest/url \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

4. (Opcional) Ingest texto manual:

```bash
curl -s -X POST http://localhost:3000/cases/<CASE_ID>/ingest/text \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nota","text":"Conteúdo manual"}'
```

### Passo D — artefactos e integridade
5. Listar artefactos:

```bash
curl -s http://localhost:3000/cases/<CASE_ID>/artifacts \
  -H "Authorization: Bearer <TOKEN>"
```

6. Ver detalhe de artefacto:

```bash
curl -s http://localhost:3000/artifacts/<ARTIFACT_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### Passo E — normalização
7. Normalizar artefacto:

```bash
curl -s -X POST http://localhost:3000/artifacts/<ARTIFACT_ID>/normalize \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 7) Como exportar

### 7.1 Exportar evidência do MinIO (já disponível)

Os objetos são guardados por caso no bucket `evidence`.
Estrutura típica:
- `s3://evidence/<case_id>/raw/<artifact_id>.html|txt`
- `s3://evidence/<case_id>/normalized/<artifact_id>.txt`

Pode exportar/download via MinIO Console (`http://localhost:9001`):
1. Entrar com `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`.
2. Abrir bucket `evidence`.
3. Navegar ao `case_id`.
4. Download dos objetos `raw` e `normalized`.

### 7.2 Exportar relatório DOCX (endpoint previsto)

O fluxo de relatório está definido para fases seguintes (endpoint de geração/download já documentado em smoke tests):
- `POST /cases/:id/reports/generate`
- `GET /reports/:id/download`

Quando ativo, o DOCX ficará no bucket de reports e poderá ser descarregado pela API.

---

## 8) Smoke tests

Guia completo de smoke tests (curl + checklist UI):
- [`docs/ACCEPTANCE_TESTS.md`](docs/ACCEPTANCE_TESTS.md)

---

## 9) Documentação de arquitetura e segurança

- ADRs: [`docs/adr/`](docs/adr)
- Threat model (STRIDE): [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md)
- Variáveis de ambiente: [`.env.example`](.env.example)
