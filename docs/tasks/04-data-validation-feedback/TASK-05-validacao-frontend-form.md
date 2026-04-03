# TASK-05 — Validacao Robusta no Form

- Status: todo
- Prioridade: P1
- Plano: `docs/plans/05-data-validation-feedback.md`
- Depende de: T044

## Por que fazer

O form atual tem validacao minima — apenas "required" nos campos. Nao valida tamanho minimo de descricao, range de idade correto (0-18), ou caracteres especiais. Validacoes fracas permitem dados sujos que ja corrigimos na T041.

## O que fazer

Adicionar regras de validacao robustas no React Hook Form, alinhadas com os schemas do backend.

## Arquivo a modificar

- `components/tvshows/tvshow-form.tsx`

## Como fazer

### 1. Regras de validacao

```tsx
// Titulo
{...register('title', {
  required: 'Titulo e obrigatorio',
  minLength: { value: 2, message: 'Titulo deve ter no minimo 2 caracteres' },
  maxLength: { value: 200, message: 'Titulo deve ter no maximo 200 caracteres' },
})}

// Descricao
{...register('description', {
  required: 'Descricao e obrigatoria',
  minLength: { value: 10, message: 'Descricao deve ter no minimo 10 caracteres' },
  maxLength: { value: 2000, message: 'Descricao deve ter no maximo 2000 caracteres' },
})}

// Idade
{...register('recommendedAge', {
  required: 'Idade e obrigatoria',
  valueAsNumber: true,
  min: { value: 0, message: 'Idade minima e 0 (livre)' },
  max: { value: 18, message: 'Idade maxima e 18' },
})}
```

### 2. Trocar Input por Textarea na descricao

A descricao precisa de mais espaco. Trocar o `<Input>` por um `<textarea>` com estilo consistente:

```tsx
<textarea
  id="description"
  {...register('description', { /* regras acima */ })}
  placeholder="Descreva o show em pelo menos 10 caracteres"
  rows={3}
  className="w-full rounded-md border border-nf-gray-400 bg-nf-surface px-3 py-2 text-sm text-white placeholder:text-nf-gray-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
/>
```

### 3. Labels em portugues

Trocar labels de ingles para portugues:
- "Title" → "Titulo"
- "Description" → "Descricao"
- "Recommended Age" → "Classificacao Indicativa"

### 4. Placeholder com exemplos

- Titulo: `"Ex: Breaking Bad, Stranger Things"`
- Descricao: `"Descreva o show em pelo menos 10 caracteres"`
- Idade: `"0 = Livre, 10, 12, 14, 16 ou 18"`

## Como testar

1. Abrir modal de criacao
2. Submeter form vazio → mensagens de erro em cada campo
3. Digitar titulo "A" → erro "minimo 2 caracteres"
4. Digitar descricao "abc" → erro "minimo 10 caracteres"
5. Digitar idade 25 → erro "maxima e 18"
6. Preencher tudo corretamente → submete sem erro

## Criterio de pronto

- [ ] Titulo: required, min 2, max 200
- [ ] Descricao: required, min 10, max 2000
- [ ] Idade: required, min 0, max 18
- [ ] Descricao usa textarea (nao input)
- [ ] Labels em portugues
- [ ] Mensagens de erro claras e em portugues
