import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Providers } from '@/app/components/Providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gamepadtest.tech'),
  title: {
    default: 'GamepadTest | Free Online Hardware Tester',
    template: '%s | GamepadTest',
  },
  description: 'GamepadTest lets you instantly test game controllers, GPU, microphones, and MIDI devices online. Free, browser-based diagnostics to ensure optimal hardware.',
  keywords: ['GamepadTest', 'Gamepad Tester', 'Mic Tester', 'GPU Tester', 'MIDI Tester', 'controller test', 'hardware testing'],
  authors: [{ name: 'GamepadTest' }],
  creator: 'GamepadTest',
  publisher: 'GamepadTest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.gamepadtest.tech/',
    siteName: 'GamepadTest',
    title: 'GamepadTest | Free Online Hardware Tester',
    description: 'GamepadTest lets you instantly test game controllers, GPU, microphones, and MIDI devices online. Free, browser-based diagnostics to ensure optimal hardware.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GamepadTest - Professional Controller Testing Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GamepadTest | Free Online Hardware Tester',
    description: 'GamepadTest lets you instantly test game controllers, GPU, microphones, and MIDI devices online. Free, browser-based diagnostics to ensure optimal hardware.',
    site: '@GamepadTest',
    creator: '@GamepadTest',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google7d7a35672b6c6861',
  },
  other: {
    'google-adsense-account': 'ca-pub-2844216118360190',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#64748b" />
        <meta name="msapplication-TileColor" content="#64748b" />
        <meta name="application-name" content="GamepadTest" />
        <meta name="apple-mobile-web-app-title" content="GamepadTest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JQMTTRYZSK');
            `,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JQMTTRYZSK"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GamepadTest",
              "url": "https://www.gamepadtest.tech",
              "applicationCategory": "UtilitiesApplication",
              "isAccessibleForFree": true
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
