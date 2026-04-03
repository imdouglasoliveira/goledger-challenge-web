# TASK-01 — Auditar e Corrigir Dados via API

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`

## Por que fazer

Os dados atuais no GoLedger contem idades absurdas (1231308), descricoes invalidas ("x", "1231"), e registros de teste com timestamps no titulo. Isso polui a UI e degrada a experiencia do usuario.

## O que fazer

Executar chamadas API para corrigir dados incorretos. Usar Swagger UI (http://localhost:3001/docs) ou curl.

## Passo a passo

### 1. Auditar — listar todos os shows

```bash
curl http://localhost:3001/api/tvshows?limit=50 | jq '.result[] | {title, recommendedAge, description}'
```

### 2. PUTs — corrigir 6 shows

**Breaking Bad** (idade 1231308 → 16, desc lixo → real):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking Bad",
    "description": "Um professor de quimica do ensino medio diagnosticado com cancer terminal decide fabricar metanfetamina para garantir o futuro financeiro de sua familia. Sua descida ao submundo do crime e inevitavel.",
    "recommendedAge": 16
  }'
```

**The Big Bang Theory** (desc "x" → real):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Big Bang Theory",
    "description": "Quatro cientistas brilhantes mas socialmente desajeitados tem suas vidas transformadas quando uma vizinha atraente e extrovertida se muda para o apartamento ao lado.",
    "recommendedAge": 12
  }'
```

**Como vender drogas online rapido** (desc Lorem Ipsum → real):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Como vender drogas online rápido",
    "description": "Um adolescente nerd cria uma loja online de drogas para reconquistar a ex-namorada, mas o negocio cresce alem do esperado e atrai a atencao da policia.",
    "recommendedAge": 16
  }'
```

**Dexter** (desc "Melhor serie" → real):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dexter",
    "description": "Um perito em analise de sangue da policia de Miami leva uma vida dupla como serial killer que so mata outros assassinos, seguindo um codigo rigido ensinado por seu pai adotivo.",
    "recommendedAge": 18
  }'
```

**Bates Motel** (idade 24 → 18):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bates Motel",
    "recommendedAge": 18
  }'
```

**The Sopranos** (idade 21 → 18):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Sopranos",
    "recommendedAge": 18
  }'
```

**Dark** (desc em ingles → pt-BR):
```bash
curl -X PUT http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dark",
    "description": "O desaparecimento de criancas em uma pequena cidade alema revela segredos envolvendo viagem no tempo e conexoes entre quatro familias ao longo de varias geracoes."
  }'
```

### 3. DELETEs — remover 3 registros de teste

```bash
curl -X DELETE http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{"title": "The Big Bang Theory 1774966262343"}'

curl -X DELETE http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{"title": "The Big Bang Theory 1774966238272"}'

curl -X DELETE http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{"title": "Stranger Things test"}'
```

### 4. POST — recriar Stranger Things (sem "test")

```bash
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Stranger Things",
    "description": "Na pequena cidade de Hawkins, um grupo de criancas enfrenta forcas sobrenaturais vindas de uma dimensao paralela conhecida como Mundo Invertido. Nostalgia dos anos 80 e ficcao cientifica se misturam.",
    "recommendedAge": 14
  }'
```

### 5. Validar — listar novamente

```bash
curl http://localhost:3001/api/tvshows?limit=50 | jq '.result[] | {title, recommendedAge, desc: .description[0:60]}'
```

## Criterio de pronto

- [ ] Nenhum show com `recommendedAge > 18`
- [ ] Nenhum show com descricao menor que 10 caracteres
- [ ] Nenhum show com timestamp ou "test" no titulo
- [ ] "Stranger Things" existe sem "test"
- [ ] Total de ~8 shows (apos remocao dos 3 testes)
