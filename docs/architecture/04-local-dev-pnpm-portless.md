# 04 - Local Dev com pnpm e Portless

## Objetivo

Padronizar o ambiente local para reduzir erro operacional e conflito de portas.

## Regras

- usar `pnpm` como package manager oficial do projeto
- nao usar `npm` ou `yarn` para instalar dependencias do workspace
- `Portless` entra como ferramenta global de desenvolvimento local
- `Portless` nao deve ser adicionado ao `package.json`
- `Portless` nao deve entrar no lockfile do projeto
- `Portless` nao faz parte do runtime de producao

## Como tratar o Portless

O `Portless` serve para trocar `localhost:porta` por URLs locais estaveis como:

- `http://web.localhost:1355`
- `http://api.web.localhost:1355`

Beneficios esperados:

- menos conflito de porta
- URLs locais mais estaveis
- melhor DX para rodar frontend e backend juntos

## Instalacao e uso

Seguir a recomendacao do projeto de origem:

- instalar `Portless` globalmente
- nao adicionar como dependencia do workspace
- nao usar `npx` ou `pnpm dlx` para o fluxo principal

Exemplo operacional:

```bash
npm install -g portless
portless proxy start --https
```

Regras:

- o workspace continua usando `pnpm`
- a instalacao global do `Portless` e excecao de tooling local
- o projeto precisa continuar funcionando sem `Portless`, via portas diretas, para debug e review

## Guardrails

- tratar `Portless` como tooling de ambiente
- nao depender dele para o projeto funcionar em CI ou em review
- se o ambiente local nao tiver `Portless`, o projeto ainda deve rodar por porta direta
- manter caminhos de bypass claros para debug sem proxy

## Politica operacional

- scripts do projeto devem assumir `pnpm`
- scripts podem oferecer modo com `Portless` e modo raw
- qualquer integracao com `Portless` deve ser documentada e opcional para runtime
- quando houver script com `Portless`, manter equivalente raw para bypass

## Riscos conhecidos

- camada extra de proxy local
- possivel complexidade adicional com DNS local e certificados
- chance de mascarar problema real de porta ou host binding

## Decisao

- adotar `Portless` como ferramenta de DX local
- nao tratar `Portless` como dependencia do projeto
- manter `pnpm` como package manager oficial
