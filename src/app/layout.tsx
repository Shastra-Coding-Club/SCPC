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

import { SCPC_LOGO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SCPC — Shastra Competitive Programming Competition",
  description: "SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details.",
  icons: {
    icon: SCPC_LOGO_URL,
    apple: SCPC_LOGO_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={SCPC_LOGO_URL} type="image/png" sizes="32x32" />
        <link rel="icon" href={SCPC_LOGO_URL} type="image/png" sizes="any" />
        <link rel="shortcut icon" href={SCPC_LOGO_URL} />
        <link rel="apple-touch-icon" href={SCPC_LOGO_URL} />
        <meta name="msapplication-TileImage" content={SCPC_LOGO_URL} />
        <meta name="theme-color" content="#0f172a" />
        <meta property="og:title" content="SCPC — Shastra Competitive Programming Competition" />
        <meta property="og:description" content="SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details." />
        <meta property="og:image" content={SCPC_LOGO_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SCPC_LOGO_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
