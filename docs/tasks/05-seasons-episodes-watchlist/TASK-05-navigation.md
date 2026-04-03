# TASK-05 (T095) — Navegacao: App Router + Header Links

- Status: todo
- Prioridade: P0
- Depende de: T092, T093, T094 (todas as paginas criadas)
- Agent/Skill: `a8z-master`
- Plano: `docs/plans/07-seasons-episodes-watchlist.md`

## O que fazer

1. Editar `components/layout/header.tsx` — habilitar links para Seasons, Episodes, Watchlist
2. Adicionar indicador visual de pagina ativa (highlight no link atual)

## Por que fazer

Sem navegacao funcional, o usuario nao consegue acessar as novas paginas pelo header. Atualmente os links estao desabilitados com `cursor-not-allowed`.

## Arquivos a modificar

- **Editar:** `components/layout/header.tsx`

## Como fazer

### 1. Habilitar links no header

**Abrir `components/layout/header.tsx` e localizar os links desabilitados.**

Devem estar algo como:
```typescript
<span className="text-nf-gray-300 cursor-not-allowed">Seasons</span>
<span className="text-nf-gray-300 cursor-not-allowed">Episodes</span>
<span className="text-nf-gray-300 cursor-not-allowed">Watchlist</span>
```

**Trocar por links ativos com `next/link`:**

```typescript
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Dentro do componente:
const pathname = usePathname();

const navLinks = [
  { href: '/', label: 'TV Shows' },
  { href: '/seasons', label: 'Seasons' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/watchlist', label: 'Watchlist' },
];

// No JSX:
{navLinks.map(link => (
  <Link key={link.href} href={link.href}
    className={`text-sm transition-colors ${
      pathname === link.href
        ? 'text-white font-bold'
        : 'text-nf-gray-200 hover:text-white'
    }`}>
    {link.label}
  </Link>
))}
```

### 2. Verificar que App Router resolve as rotas

As paginas ja estao em:
- `app/page.tsx` → `/` (TV Shows)
- `app/seasons/page.tsx` → `/seasons`
- `app/episodes/page.tsx` → `/episodes`
- `app/watchlist/page.tsx` → `/watchlist`

**Nao precisa editar `app/layout.tsx`** — o App Router ja resolve automaticamente.

### 3. Ajustar botao "Add" do header

O header tem um botao "Add Show" que dispara `window.dispatchEvent('open-create-show')`. Em outras paginas esse evento nao faz nada.

**Opcao simples:** Esconder o botao quando nao esta na pagina de TV Shows:
```typescript
{pathname === '/' && (
  <Button variant="netflix" size="sm" onClick={...}>+ Add Show</Button>
)}
```

**Opcao melhor:** Mudar o texto/comportamento baseado na pagina (ex: "Add Season" em /seasons). Mas isso adiciona complexidade — decidir conforme tempo disponivel.

## Como testar

1. Clicar "TV Shows" no header → vai para `/` → link fica bold/branco
2. Clicar "Seasons" → vai para `/seasons` → link fica bold/branco
3. Clicar "Episodes" → vai para `/episodes` → link fica bold/branco
4. Clicar "Watchlist" → vai para `/watchlist` → link fica bold/branco
5. Verificar que navegacao e client-side (sem full page reload)
6. Verificar que header mantem visual consistente em todas as paginas

## Criterio de pronto

- [ ] Links do header funcionam para todas as 4 paginas
- [ ] Indicador visual de pagina ativa (text-white font-bold)
- [ ] Navegacao client-side (sem reload)
- [ ] Links inativos com hover state (text-nf-gray-200 → text-white)
- [ ] Header visual consistente em todas as paginas
