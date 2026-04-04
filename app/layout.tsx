import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import './globals.css';

const appFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'GoLedger TV Shows',
  description: 'Catalogo de series de TV com gestao via blockchain GoLedger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${appFont.className} min-h-screen bg-nf-black text-nf-gray-100 antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
