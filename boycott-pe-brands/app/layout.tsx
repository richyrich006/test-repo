import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: {
    default: 'Boycott PE Brands — Stop Funding Private Equity',
    template: '%s — Boycott PE Brands',
  },
  description:
    'A consumer activism directory of brands owned by private equity firms, with independent alternatives. Vote with your wallet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
