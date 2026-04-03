# 02 - Approved Bootstrap Dependencies

Lista fechada de dependencias aprovadas para o bootstrap do projeto.

## 0. Package manager e tooling

- usar `pnpm` como package manager oficial
- nao usar `npm` ou `yarn` para instalar dependencias do workspace
- `Portless` pode ser usado como ferramenta global de desenvolvimento local
- `Portless` nao entra como dependencia do projeto

## 1. Dependencias core de runtime

Instalar no bootstrap inicial:

```txt
next
react
react-dom
fastify
@fastify/cors
@fastify/helmet
@fastify/rate-limit
@fastify/swagger
@fastify/swagger-ui
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
vaul
cmdk
@tanstack/react-table
react-day-picker
embla-carousel-react
recharts
motion
```

## 2. Dependencias opcionais aprovadas

Nao entram obrigatoriamente no bootstrap inicial. Podem ser adicionadas quando a necessidade aparecer:

```txt
@kibo-ui/*
uploadthing
@react-email/components
react-email
```

Uso esperado:

- `Kibo UI`: componentes avancados no ecossistema shadcn
- `uploadthing`: apenas se o produto realmente precisar de upload
- `react-email`: apenas se surgir fluxo de email proprio

## 3. Dependencias de desenvolvimento aprovadas

```txt
typescript
@types/node
@types/react
@types/react-dom
tailwindcss
postcss
autoprefixer
eslint
eslint-config-next
storybook
@storybook/nextjs
@storybook/addon-essentials
@storybook/addon-interactions
@storybook/test
vitest
playwright
```

## 4. Bibliotecas aprovadas para copy-paste ou referencia

Essas entram mais como fonte de componentes/blocos do que como dependencia de runtime obrigatoria:

- `shadcn/ui`
- `Shadcnblocks`
- `Magic UI`
- `React Bits`

## 5. Fora do bootstrap inicial

Nao aprovar no inicio do projeto:

```txt
@mui/*
antd
@chakra-ui/*
@heroui/*
@mantine/*
react-aria
@base-ui-components/react
```

Motivo:

- reabrem decisoes de design system
- criam overlap com `shadcn/ui`
- aumentam bundle, setup e superficie de manutencao

## 6. Ordem sugerida de instalacao

1. runtime core
2. dev dependencies
3. `shadcn/ui`
4. Storybook
5. opcionais aprovadas conforme necessidade real

## 7. Regra de governanca

Qualquer dependencia nova fora desta lista precisa responder:

1. resolve um problema real do desafio?
2. evita retrabalho ou complexidade?
3. nao conflita com `shadcn/ui + Tailwind`?
4. nao cria lock-in desnecessario?
