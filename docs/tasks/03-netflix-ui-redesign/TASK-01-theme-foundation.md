# TASK-01 (T031) - Theme Foundation: Paleta Netflix, Animacoes e Scrollbar

- Status: done
- Prioridade: P10
- Depende de: T030 (UI basica de tvShows concluida)
- Agent/Skill: `ux-design-expert` (*tokenize)
- Referencia: leovargasdev (palette), JosinJojy (skeleton colors), ivisconfessor (bg #141414)

## O que fazer

1. Reescrever `app/globals.css` com paleta Netflix completa
2. Registrar design tokens via diretiva `@theme` do Tailwind v4
3. Definir @keyframes para animacoes (fade-in, slide-up, scale-in, shimmer)
4. Estilizar scrollbar customizada (thin, dark)
5. Criar classe utilitaria `.hide-scrollbar`
6. Remover `prefers-color-scheme` — app e permanentemente escuro

## Por que fazer

- Fundacao visual que todas as tasks seguintes dependem
- Sem tokens registrados, classes como `bg-nf-black` nao funcionam
- Animacoes sao usadas no modal (T033), thumbnail hover (T034) e hero (T036)
- Scrollbar afeta o carousel (T035)

## Como fazer

### Design Tokens (@theme)

Registrar no bloco `@theme` do Tailwind v4:

```
--color-nf-black: #141414       (fundo principal)
--color-nf-surface: #181818     (superficie elevada)
--color-nf-card: #232323        (fundo de cards/modals)
--color-nf-red: #E50914         (accent primario Netflix)
--color-nf-red-hover: #F6121D   (hover do accent)
--color-nf-gray-100: #E5E5E5    (texto primario)
--color-nf-gray-200: #B3B3B3    (texto secundario)
--color-nf-gray-300: #808080    (texto terciario/muted)
--color-nf-gray-400: #404040    (bordas, scrollbar track)
--color-nf-gray-500: #2A2A2A    (fundo de inputs)
```

### CSS Variables (backward compat)

```css
:root {
  --background: #141414;
  --foreground: #E5E5E5;
}
```

### Keyframes

- `fade-in`: opacity 0→1, 300ms
- `slide-up`: translateY(10px)→0 + opacity 0→1, 300ms
- `scale-in`: scale(0.95)→1 + opacity 0→1, 200ms
- `shimmer`: translateX(-100%)→100%, 1.5s infinite (para loading)

### Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #141414; }
::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #606060; }
```

### Hide Scrollbar utility

```css
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
```

### Body base

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}
```

## Arquivo afetado

- **Rewrite:** `app/globals.css`

## Fallback

Se `@theme` nao funcionar na versao atual do Tailwind v4 (4.2.2):
- Usar arbitrary values: `bg-[#141414]`, `text-[#E5E5E5]`
- Definir cores apenas como CSS custom properties em `:root`
- Testar com `pnpm dev` imediatamente apos a mudanca

## Criterio de pronto

- `app/globals.css` reescrito com todos os tokens
- `pnpm dev` inicia sem erro
- Classes `bg-nf-black`, `text-nf-red`, `bg-nf-surface` funcionam (verificar no browser DevTools)
- Animacoes `animate-[fade-in_300ms]` ou equivalente funcionam
- Scrollbar customizada aparece em paginas com scroll
- Nenhuma referencia a `prefers-color-scheme` restante
- Body usa fundo #141414 e texto #E5E5E5
