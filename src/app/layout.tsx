import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SCPC_LOGO_URL, SCPC_FAVICON_URL, SCPC_ICON_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SCPC — Shastra Competitive Programming Competition",
  description: "SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details.",
  icons: {
    icon: SCPC_FAVICON_URL,
    shortcut: SCPC_FAVICON_URL,
    apple: SCPC_ICON_URL,
    other: {
      rel: "apple-touch-icon-precomposed",
      url: SCPC_ICON_URL,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="icon" href={SCPC_FAVICON_URL} sizes="32x32" />
        <link rel="icon" href={SCPC_ICON_URL} sizes="192x192" />
        <link rel="apple-touch-icon" href={SCPC_ICON_URL} />
        <meta name="msapplication-TileImage" content={SCPC_ICON_URL} />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="SCPC — Shastra Competitive Programming Competition" />
        <meta property="og:description" content="SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details." />
        <meta property="og:image" content={SCPC_LOGO_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SCPC_LOGO_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Critical CSS Loader - Removing the gap between load and React hydration */}
        <div id="initial-loader" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: '#ffffff',
          transition: 'opacity 0.3s ease-out',
        }}></div>
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            function onKey(e){
              try{
                if(e.ctrlKey && e.key === 'Enter'){
                  var el = document.getElementById('hero-register') || document.getElementById('site-register') || document.querySelector('a[href="#contact"]');
                  if(el){ el.click(); }
                }
              }catch(err){/* ignore */}
            }
            window.addEventListener('keydown', onKey);
            // expose so React cleanup isn't required for this small script
          })();
        `}} />
        {children}
      </body>
    </html>
  );
}
