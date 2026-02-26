# Forensic OSINT Platform (MVP)

Fases implementadas: **FASE 1 + FASE 2**.

## Quickstart
1. `cp .env.example .env`
2. `docker compose up --build -d`
3. `docker compose ps`
4. `curl -s http://localhost:3000/health`

## Stack
- API NestJS + Prisma/Postgres
- Web React + Vite
- MinIO, Neo4j, Redis, Ollama
- Auditoria append-only com chained_hash

## Seed local
Quando `APP_ENV=local`, a API cria utilizador admin via `SEED_*` no arranque.

## Smoke tests
Ver [`docs/ACCEPTANCE_TESTS.md`](docs/ACCEPTANCE_TESTS.md) para comandos curl/UI checklist completos.

## Environment
Todas as variáveis necessárias estão em [`.env.example`](.env.example).
