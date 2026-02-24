import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

import { SCPC_LOGO_URL, SCPC_ICON_URL } from "@/lib/constants";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://tcet-shastra.online"),
  title: "SCPC — Shastra Competitive Programming Competition",
  description: "SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details.",
  icons: {
    icon: "/lightlogo.png",
    apple: SCPC_ICON_URL,
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
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `
        }} />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <meta name="msapplication-TileImage" content={SCPC_ICON_URL} />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="SCPC — Shastra Competitive Programming Competition" />
        <meta property="og:description" content="SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details." />
        <meta property="og:image" content={SCPC_LOGO_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SCPC_LOGO_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased bg-white dark:bg-[#0f0f0f] transition-colors duration-300`}
        suppressHydrationWarning
      >
        {/* Pre-loader */}
        <div id="pre-loader" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,

          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '60px 24px 24px',
        }}>
          <style dangerouslySetInnerHTML={{
            __html: `
            #pre-loader {
              --pl-bg: #ffffff;
              --pl-text: #1a1a2e;
              --pl-cursor: #1a1a2e;
              --pl-accent: #8250df;
            }
            .dark #pre-loader {
              --pl-bg: #0f0f0f;
              --pl-text: #e5e5e5;
              --pl-cursor: #e5e5e5;
              --pl-accent: #d2a8ff;
            }
            #pre-loader { background-color: var(--pl-bg); }
            #pre-loader-code { color: var(--pl-text); }
            #pre-loader-cursor { background: var(--pl-cursor); }

            @keyframes pre-cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
            #pre-loader-cursor { display:inline-block; width:3px; height:1.1em; animation:pre-cursor-blink 530ms step-end infinite; vertical-align:text-bottom; margin-left:2px; }
            #pre-loader-container { width:100%; max-width:800px; }
            #pre-loader-code { font-family:monospace; font-size:clamp(14px,2vw,18px); line-height:1.7; white-space:pre-wrap; text-align:left; }
          `}} />
          <div id="pre-loader-container">
            <div id="pre-loader-code"><span style={{color:'var(--pl-accent)', fontWeight:600}}>#include</span> &lt;bits/stdc++.h&gt;<span id="pre-loader-cursor"></span></div>
          </div>
        </div>
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
          })();
        `}} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
