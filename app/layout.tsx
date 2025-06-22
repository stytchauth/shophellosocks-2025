import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Hello Socks",
    template: "%s - Hello Socks",
  },
  description: "An ecommerce demo application powered by Stytch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://elements.stytch.com/telemetry.js"></script>
    </head>
    <body>
    <Providers>
      {children}
    </Providers>
      </body>
    </html>
  );
}