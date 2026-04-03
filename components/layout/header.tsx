'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu, Plus, Tv, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'TV Shows', href: '/' },
  { label: 'Temporadas', href: '/seasons' },
  { label: 'Episodios', href: '/episodes' },
  { label: 'Watchlist', href: '/watchlist' },
] as const;

const ADD_ACTIONS = {
  '/': { eventName: 'open-create-show', label: 'Novo Show' },
  '/seasons': { eventName: 'open-create-season', label: 'Nova Temporada' },
  '/episodes': { eventName: 'open-create-episode', label: 'Novo Episodio' },
  '/watchlist': { eventName: 'open-create-watchlist', label: 'Nova Lista' },
} as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addAction = useMemo(() => {
    if (pathname === '/seasons') return ADD_ACTIONS['/seasons'];
    if (pathname === '/episodes') return ADD_ACTIONS['/episodes'];
    if (pathname === '/watchlist') return ADD_ACTIONS['/watchlist'];
    return ADD_ACTIONS['/'];
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 h-16 w-full px-4 transition-all duration-700 ease-in-out md:px-12 ${
        scrolled
          ? 'bg-nf-black/95 shadow-lg backdrop-blur-sm'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-nf-red md:text-2xl">
            <Tv className="h-6 w-6 md:h-8 md:w-8" />
            <span>GOLEDGER</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-medium transition hover:text-white',
                    isActive ? 'font-bold text-white' : 'text-nf-gray-100/70'
                  )}
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
            className="flex h-10 w-10 items-center justify-center rounded-lg text-nf-gray-100 active:bg-white/10 transition-colors md:hidden touch-target-exempt"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar navegacao' : 'Abrir navegacao'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Button
            variant="netflix"
            onClick={() => window.dispatchEvent(new CustomEvent(addAction.eventName))}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{addAction.label}</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="absolute left-0 right-0 top-full mt-0 border-b border-white/10 bg-nf-black/98 backdrop-blur-md px-4 pb-4 pt-2 shadow-2xl md:hidden animate-[slide-down_200ms_ease-out_forwards]">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors active:bg-white/10',
                    isActive
                      ? 'bg-white/10 text-white border-l-2 border-nf-red'
                      : 'text-nf-gray-100/80 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
