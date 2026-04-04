'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu, Plus, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'TV Shows', href: '/' },
  { label: 'Temporadas', href: '/seasons' },
  { label: 'Watchlist', href: '/watchlist' },
] as const;

const ADD_ACTIONS = {
  '/': { eventName: 'open-create-show', label: 'Novo Show' },
  '/seasons': { eventName: 'open-create-season', label: 'Nova Temporada' },
  '/watchlist': { eventName: 'open-create-watchlist', label: 'Nova Lista' },
} as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const addAction = useMemo(() => {
    if (pathname === '/seasons') return ADD_ACTIONS['/seasons'];
    if (pathname === '/watchlist') return ADD_ACTIONS['/watchlist'];
    return ADD_ACTIONS['/'];
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 h-16 w-full px-4 transition-all duration-300 md:px-12',
        scrolled
          ? 'border-b border-white/10 bg-nf-black/85 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent backdrop-blur-[2px]'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between gap-4">
        <div className="flex items-center gap-5 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wide text-nf-red md:text-2xl">
            <Tv className="h-6 w-6 md:h-7 md:w-7" />
            <span>GOLEDGER</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-nf-red/20 text-white ring-1 ring-nf-red/40'
                      : 'text-nf-gray-100 hover:bg-white/5 hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="touch-target-exempt flex h-10 w-10 items-center justify-center rounded-lg text-nf-gray-100 transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir navegacao"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Button variant="netflix" onClick={() => window.dispatchEvent(new CustomEvent(addAction.eventName))} className="hidden items-center gap-2 md:flex">
            <Plus className="h-4 w-4" />
            <span>{addAction.label}</span>
          </Button>
        </div>
      </div>

      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} side="left">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
          <Tv className="h-6 w-6 text-nf-red" />
          <span className="text-xl font-bold tracking-wide text-nf-red">GOLEDGER</span>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Menu mobile">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center rounded-lg px-4 py-3 text-base font-semibold transition-colors',
                  isActive
                    ? 'bg-nf-red/20 text-white ring-1 ring-nf-red/40'
                    : 'text-nf-gray-100 hover:bg-white/5 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent(addAction.eventName));
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg bg-nf-red/15 px-4 py-3 text-base font-semibold text-nf-red transition-colors hover:bg-nf-red/25"
          >
            <Plus className="h-5 w-5" />
            {addAction.label}
          </button>
        </div>
      </Drawer>
    </header>
  );
}
