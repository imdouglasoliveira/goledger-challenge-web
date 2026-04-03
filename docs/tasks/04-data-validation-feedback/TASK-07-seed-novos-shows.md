# TASK-07 — Inserir 10 Shows Novos via POST

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T044 (validacao de duplicatas ativa)

## Por que fazer

A base atual tem poucos shows (~8 apos limpeza). Para uma experiencia Netflix convincente, o carousel precisa de volume. 10 shows novos de generos variados enriquecem visualmente a UI e testam os gradientes deterministicos.

## O que fazer

Inserir 10 shows via `POST /api/tvshows`. Usar Swagger UI ou curl.

## Passo a passo

Executar os 10 POSTs abaixo. **Respeitar rate limit: 30 req/min.**

```bash
# 1. Game of Thrones
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Game of Thrones",
    "description": "Em um mundo medieval fantastico, familias nobres lutam pelo controle do Trono de Ferro enquanto uma ameaca antiga desperta no Norte. Intrigas politicas, traicoes e dragoes marcam esta epica saga.",
    "recommendedAge": 18
  }'

# 2. Friends
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Friends",
    "description": "Seis amigos inseparaveis navegam os desafios da vida adulta em Nova York, entre relacionamentos, carreiras e muitas risadas no cafe Central Perk.",
    "recommendedAge": 12
  }'

# 3. The Office
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Office",
    "description": "O dia a dia dos funcionarios de uma filial da empresa Dunder Mifflin, liderada pelo excentrico Michael Scott. Um mockumentario que retrata o humor absurdo do ambiente corporativo.",
    "recommendedAge": 12
  }'

# 4. Black Mirror
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Black Mirror",
    "description": "Serie antologica que explora o lado sombrio da tecnologia e seus efeitos na sociedade moderna. Cada episodio apresenta uma historia independente e perturbadora sobre o futuro.",
    "recommendedAge": 16
  }'

# 5. The Crown
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Crown",
    "description": "A historia da Rainha Elizabeth II e os eventos politicos e pessoais que moldaram seu reinado. Um retrato intimo da familia real britanica ao longo das decadas.",
    "recommendedAge": 12
  }'

# 6. Rick and Morty
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rick and Morty",
    "description": "Um cientista genial e alcoolatra arrasta seu neto inseguro em aventuras interdimensionais absurdas. Animacao adulta que mistura humor acido com conceitos de ficcao cientifica.",
    "recommendedAge": 16
  }'

# 7. La Casa de Papel
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "La Casa de Papel",
    "description": "Um grupo de criminosos liderados pelo misterioso Professor executa o maior assalto da historia na Casa da Moeda da Espanha. Planos engenhosos e tensao constante.",
    "recommendedAge": 16
  }'

# 8. The Mandalorian
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Mandalorian",
    "description": "Um cacador de recompensas solitario viaja pelos confins da galaxia apos a queda do Imperio, protegendo uma crianca misteriosa com poderes extraordinarios.",
    "recommendedAge": 12
  }'

# 9. Arcane
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Arcane",
    "description": "Nas cidades gemeas de Piltover e Zaun, duas irmas se encontram em lados opostos de uma guerra que envolve tecnologia, magia e poder. Animacao baseada no universo de League of Legends.",
    "recommendedAge": 14
  }'

# 10. Peaky Blinders
curl -X POST http://localhost:3001/api/tvshows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Peaky Blinders",
    "description": "Na Birmingham do pos-Primeira Guerra Mundial, a familia Shelby lidera uma gangue ambiciosa que busca expandir seu imperio criminoso. Thomas Shelby e um estrategista implacavel.",
    "recommendedAge": 16
  }'
```

## Validar

```bash
curl http://localhost:3001/api/tvshows?limit=50 | jq '.result | length'
# Esperado: ~18 shows
```

## Criterio de pronto

- [ ] 10 shows novos criados com sucesso
- [ ] Nenhum duplicado (T044 deve bloquear)
- [ ] Todos com descricao em portugues
- [ ] Classificacoes indicativas corretas (0-18)
- [ ] Shows aparecem na UI em http://localhost:3000
- [ ] Carousel "Todos os Shows" mostra ~18 cards
