import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://medset.in'),
  title: 'MEDSET — AI Clinical Documentation & Hospital Management Platform',
  description:
    'MEDSET is an AI-powered hospital management system for Indian hospitals — ambient clinical scribe, ICU management, billing, pharmacy, lab, radiology, and analytics in one enterprise platform.',
  keywords: [
    'MEDSET',
    'hospital management system',
    'AI clinical documentation',
    'EMR',
    'EHR',
    'ICU management',
    'healthcare platform India',
    'SOAP notes',
    'medical AI',
  ],
  authors: [{ name: 'MEDSET' }],
  openGraph: {
    title: 'MEDSET — AI Clinical Documentation & Hospital Management Platform',
    description:
      'AI-powered hospital management for Indian hospitals. Ambient clinical scribe, ICU, billing, pharmacy, lab, radiology & analytics.',
    type: 'website',
    siteName: 'MEDSET',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEDSET — AI Clinical Documentation & Hospital Management Platform',
    description:
      'AI-powered hospital management for Indian hospitals. Ambient clinical scribe, ICU, billing, pharmacy, lab, radiology & analytics.',
  },
};

export const viewport: { themeColor: { media: string; color: string }[]; width: string; initialScale: number } = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1c' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
