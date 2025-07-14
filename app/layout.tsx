import '~styles/globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hello Socks',
  description: 'Premium sock shopping experience',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Hello Socks',
    description: 'The first agent ready sock shopping experience',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hello Socks Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hello Socks',
    description: 'The first agent ready sock shopping experience',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://elements.stytch.com/telemetry.js"></script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
