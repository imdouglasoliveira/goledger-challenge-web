# 02 - Approved Bootstrap Dependencies

Lista de dependencias aprovadas para o projeto.

## 0. Package manager

- usar `pnpm` como package manager oficial
- nao usar `npm` ou `yarn` para instalar dependencias do workspace

## 1. Dependencias core de runtime

```txt
next
react
react-dom
fastify
@fastify/cors
@fastify/helmet
@fastify/rate-limit
@fastify/swagger
@scalar/fastify-api-reference
@tanstack/react-query
react-hook-form
zod
@hookform/resolvers
lucide-react
clsx
class-variance-authority
tailwind-merge
sonner
canvas-confetti
```

## 2. Dependencias de desenvolvimento

```txt
typescript
@types/node
@types/react
@types/react-dom
tailwindcss
vitest
@testing-library/react
@testing-library/jest-dom
@vitejs/plugin-react
jsdom
```

## 3. Regra de governanca

Qualquer dependencia nova fora desta lista precisa responder:

1. resolve um problema real do desafio?
2. evita retrabalho ou complexidade?
3. nao conflita com `shadcn/ui + Tailwind`?
4. nao cria lock-in desnecessario?
