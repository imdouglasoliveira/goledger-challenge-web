# Security Hardening Guide

- Stack alvo: Next.js + Fastify
- Data: 2026-03-30

## 1. Objetivo

Definir defaults seguros para o desafio sem inflar a arquitetura.

## 2. Vulnerabilidades a tratar desde o inicio

- exposicao de credenciais da API externa
- input sem validacao
- burst de requests e abuso de endpoints
- excesso de payload
- mensagens de erro com detalhes internos
- headers inseguros
- dependencias vulneraveis

## 3. Baseline obrigatoria

### Frontend

- nunca expor usuario/senha da API no bundle
- evitar interpolacao insegura de HTML
- limitar consumo de erro tecnico exibido ao usuario

### API Fastify

- `@fastify/helmet`
- `@fastify/rate-limit`
- CORS restritivo
- schemas de validacao em todas as rotas
- timeout de request
- body size limit
- logs com redacao de segredos

## 4. DDoS e rate limiting

- limitar por IP e por janela
- aplicar burst control em rotas de busca e mutacao
- diferenciar limites para `GET` e `POST/PUT/DELETE`

## 5. Loader.io e testes de carga

Usar apenas contra ambiente controlado e nunca diretamente contra a API externa da GoLedger.

### Regras

- rodar em staging
- usar carga gradual
- limitar cenarios a endpoints internos
- desabilitar cenarios destrutivos em carga
- registrar throughput, p95 e erros

## 6. Vulnerability workflow

Antes de cada milestone:

1. Rodar `pnpm audit`
2. Revisar dependencias de UI adicionadas
3. Revisar headers, CORS e rate limit
4. Confirmar que nenhum segredo esta em `.env.example`, logs ou frontend
5. Validar erros e payload size

## 7. Checklist rapido

- [ ] sem secrets no cliente
- [ ] validacao de input em todas as rotas
- [ ] rate limit configurado
- [ ] helmet configurado
- [ ] CORS restritivo
- [ ] logs sem segredos
- [ ] payload limit definido
- [ ] load test apenas em staging
- [ ] `pnpm audit` revisado
