# TASK-03 - Bootstrap do Fastify

## Objetivo

Criar a aplicacao `apps/api` com TypeScript e plugins base.

## Por que fazer

- backend vem antes da UI nesta estrategia
- credenciais da API externa precisam ficar no servidor
- healthcheck e estrutura base facilitam smoke tests cedo

## Como fazer

1. Inicializar Fastify.
2. Configurar TypeScript e scripts basicos.
3. Criar `GET /health`.
4. Criar `GET /ready`.
5. Garantir que o servidor sobe localmente antes de seguir.

## Checklist

- Fastify sobe localmente
- `GET /health` responde `200`
- `GET /ready` responde `200`
- estrutura basica de rotas, plugins e lib existe

## Entregaveis

- `apps/api` funcional
- healthcheck funcional
