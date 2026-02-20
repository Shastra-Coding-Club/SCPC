/**
 * Additional SEO Component
 * This component can be imported in pages for page-specific SEO
 */

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}

export function SEOHead({
  title = "SCPC — Shastra Competitive Programming Competition",
  description = "SCPC: Premier 12-hour coding hackathon at TCET Mumbai. ₹60,000 prizes, 500+ coders, March 13, 2026.",
  keywords = ["SCPC", "competitive programming", "hackathon"],
  ogImage = "https://res.cloudinary.com/divj3y2cp/image/upload/f_auto,q_auto/v1/scpc-team/scpc",
  canonical = "https://scpc.tcetmumbai.in"
}: SEOHeadProps) {
  // This is a client component for dynamic meta tags
  // Can be used when metadata needs to be updated dynamically

  return null // In Next.js 13+, use metadata export in layout/page instead
}

// Utility function to generate structured data
export function generateStructuredData(type: string, data: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  }
}

// Utility function for keyword optimization
export function getOptimizedKeywords(pageType: 'home' | 'about' | 'faq' | 'contact'): string[] {
  const baseKeywords = [
    "SCPC",
    "Shastra Competitive Programming Competition",
    "SCPC 2026",
    "TCET Mumbai",
    "coding hackathon",
    "competitive programming"
  ]

  const pageSpecificKeywords: Record<string, string[]> = {
    home: [
      "register SCPC",
      "SCPC registration",
      "coding competition Mumbai",
      "programming hackathon 2026"
    ],
    about: [
      "SCPC details",
      "competitive programming event",
      "algorithmic competition",
      "TCET Shastra"
    ],
    faq: [
      "SCPC questions",
      "hackathon FAQ",
      "SCPC eligibility",
      "SCPC prizes"
    ],
    contact: [
      "SCPC contact",
      "TCET event contact",
      "hackathon organizers"
    ]
  }

  return [...baseKeywords, ...(pageSpecificKeywords[pageType] || [])]
}

// Utility to track page views (for analytics)
export function trackPageView(url: string) {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    const gtag = (window as unknown as { gtag?: Function }).gtag
    if (gtag) {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      })
    }

    // Facebook Pixel (if needed)
    const fbq = (window as unknown as { fbq?: Function }).fbq
    if (fbq) {
      fbq('track', 'PageView')
    }
  }
}

// Utility to track events
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (typeof window !== 'undefined') {
    const gtag = (window as unknown as { gtag?: Function }).gtag
    if (gtag) {
      gtag('event', eventName, eventParams)
    }
  }
}

// Pre-defined tracking events for SCPC
export const TRACKING_EVENTS = {
  REGISTER_CLICK: 'register_button_click',
  FAQ_EXPAND: 'faq_item_expanded',
  SOCIAL_SHARE: 'social_share',
  TIMELINE_VIEW: 'timeline_viewed',
  TEAM_VIEW: 'team_section_viewed',
} as const

export default SEOHead
