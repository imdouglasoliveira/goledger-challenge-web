# TASK-08 - Hardening e seguranca

## Objetivo

Aplicar defaults seguros antes de expandir features.

## Por que fazer

- a API externa usa credenciais sensiveis
- sem rate limit e headers basicos, o BFF nasce vulneravel
- seguranca tardia costuma gerar retrabalho e vazamento de risco

## Como fazer

1. Configurar Helmet, CORS e rate limit.
2. Definir body limit e timeout.
3. Redigir logs de segredos.
4. Rodar auditoria de dependencias.
5. Revisar se Swagger/Scalar ficam expostos apenas como decidido para cada ambiente.

## Checklist

- `helmet` ativo
- `cors` restritivo
- `rate-limit` ativo
- timeout configurado
- logs sem segredos
- `npm audit` executado
- risco residual documentado

## Entregaveis

- baseline segura aplicada
- checklist de seguranca validado
