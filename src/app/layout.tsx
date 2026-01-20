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

export const metadata: Metadata = {
  title: "SCPC — Shastra Competitive Programming Competition",
  description: "SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details.",
  icons: {
    icon: '/scpc.png',
    apple: '/scpc.png',
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
        <link rel="icon" href="/scpc.png" />
        <link rel="apple-touch-icon" href="/scpc.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta property="og:title" content="SCPC — Shastra Competitive Programming Competition" />
        <meta property="og:description" content="SCPC: Shastra Competitive Programming Competition — timeline, prizes, registration details." />
        <meta property="og:image" content="/scpc.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/scpc.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
