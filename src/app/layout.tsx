import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Revelation Pest Control | Professional Pest Management Services',
  description: '24/7 Professional Pest Control, Bed Bug Treatment, Termite Protection & Rodent Control Services in Kathmandu Valley.',
  openGraph: {
    title: 'Revelation Pest Control - Have a Pest Control Your Way',
    description: 'Trusted, eco-friendly pest control services for residential & commercial properties.',
    url: 'https://revelationpestcontrol.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
