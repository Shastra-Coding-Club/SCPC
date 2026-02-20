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
import { allStructuredData } from "@/lib/structuredData";

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "SCPC — Shastra Competitive Programming Competition | TCET Mumbai 2026",
    template: "%s | SCPC 2026"
  },
  description: "SCPC (Shastra Competitive Programming Competition) - Premier 12-hour coding hackathon at TCET Mumbai on March 13, 2026. ₹60,000 prize pool, 500+ coders, national-level competition. Online qualifier, offline hackathon, ICPC-style finale. Register now!",

  // Keywords for search engines
  keywords: [
    "SCPC",
    "Shastra Competitive Programming Competition",
    "SCPC 2026",
    "competitive programming",
    "coding hackathon",
    "TCET Mumbai",
    "TCET Shastra",
    "algorithmic competition",
    "programming contest",
    "coding competition Mumbai",
    "hackathon Mumbai",
    "ICPC style competition",
    "HackerRank qualifier",
    "college coding event",
    "CP competition India",
    "Thakur College hackathon",
    "Mumbai coding competition",
    "programming hackathon 2026",
    "algorithm contest",
    "data structures competition",
    "coding event India",
    "student hackathon Mumbai"
  ],

  // Authors and creators
  authors: [{ name: "TCET Shastra Team" }],
  creator: "TCET Shastra",
  publisher: "Thakur College of Engineering and Technology",

  // Robots meta tags
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

  // Icons and favicons
  icons: {
    icon: [
      { url: "/lightlogo.png" },
      { url: SCPC_ICON_URL, sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: SCPC_ICON_URL, sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: SCPC_ICON_URL }
    ]
  },

  // App manifest
  manifest: "/manifest.json",

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tcet-shastra.online",
    siteName: "SCPC - Shastra Competitive Programming Competition",
    title: "SCPC 2026 — Shastra Competitive Programming Competition at TCET Mumbai",
    description: "Join SCPC 2026: 12-hour competitive programming hackathon at TCET Mumbai. ₹60,000 prizes, 500+ coders, national competition. March 13, 2026. Register now!",
    images: [
      {
        url: SCPC_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "SCPC - Shastra Competitive Programming Competition Logo",
        type: "image/png"
      },
      {
        url: "https://res.cloudinary.com/divj3y2cp/image/upload/w_1600,f_auto,q_90/v1/scpc-team/behind-event",
        width: 1600,
        height: 900,
        alt: "SCPC Event Behind the Scenes",
        type: "image/jpeg"
      }
    ]
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "SCPC 2026 — Competitive Programming Hackathon at TCET Mumbai",
    description: "12-hour coding hackathon | ₹60,000 prizes | 500+ coders | March 13, 2026 | Register now for SCPC at TCET Mumbai!",
    images: [SCPC_LOGO_URL],
    creator: "@tcet_shastra",
    site: "@tcet_shastra"
  },

  // Verification tags (add these when you have them)
  verification: {
    google: "google-site-verification-code-here", // Replace with actual code after Google Search Console setup
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code"
  },

  // Additional metadata
  category: "Education",
  alternates: {
    canonical: "https://tcet-shastra.online"
  },

  // App-specific metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SCPC 2026"
  },

  // Format detection
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false
  },

  // Other meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "SCPC 2026",
    "msapplication-TileColor": "#1a1a2e",
    "msapplication-config": "/browserconfig.xml"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Script - Must run before render */}
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

        {/* JSON-LD Structured Data for SEO */}
        {allStructuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Additional meta tags */}
        <meta name="msapplication-TileImage" content={SCPC_ICON_URL} />
        <meta name="msapplication-TileColor" content="#1a1a2e" />
        <meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Mumbai" />
        <meta name="geo.position" content="19.2092;72.8651" />
        <meta name="ICBM" content="19.2092, 72.8651" />

        {/* Additional Open Graph tags */}
        <meta property="og:site_name" content="SCPC - Shastra Competitive Programming Competition" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scpc.tcetmumbai.in" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SCPC Logo - Shastra Competitive Programming Competition" />

        {/* Additional Twitter Card tags */}
        <meta name="twitter:site" content="@tcet_shastra" />
        <meta name="twitter:creator" content="@tcet_shastra" />
        <meta name="twitter:domain" content="scpc.tcetmumbai.in" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://scpc.tcetmumbai.in" />

        {/* Alternative links for different formats */}
        <link rel="alternate" type="application/rss+xml" title="SCPC Updates" href="https://scpc.tcetmumbai.in/rss.xml" />

        {/* Dublin Core metadata for academic indexing */}
        <meta name="DC.title" content="SCPC - Shastra Competitive Programming Competition" />
        <meta name="DC.creator" content="TCET Shastra" />
        <meta name="DC.subject" content="Competitive Programming, Coding Hackathon, Algorithm Competition" />
        <meta name="DC.description" content="12-hour competitive programming hackathon at TCET Mumbai with ₹60,000 prize pool" />
        <meta name="DC.publisher" content="Thakur College of Engineering and Technology" />
        <meta name="DC.type" content="Event" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en" />
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
