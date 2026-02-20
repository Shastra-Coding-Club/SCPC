/**
 * Analytics and Performance Monitoring Utilities
 * Tracks user behavior and performance metrics for SEO insights
 */

// Google Analytics setup helper
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    const gtag = (window as unknown as { gtag?: Function }).gtag
    if (gtag) {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    }
  }
}

// Track custom events
export const event = (
  action: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined') {
    const gtag = (window as unknown as { gtag?: Function }).gtag
    if (gtag) {
      gtag('event', action, params)
    }
  }
}

// SEO-specific events
export const trackSEOEvent = {
  registration: () => {
    event('registration_intent', {
      event_category: 'engagement',
      event_label: 'Register Now Button',
    })
  },

  searchAppearance: (keyword: string) => {
    event('search_appearance', {
      event_category: 'seo',
      event_label: keyword,
    })
  },

  externalLinkClick: (url: string) => {
    event('external_link_click', {
      event_category: 'outbound',
      event_label: url,
    })
  },

  socialShare: (platform: string) => {
    event('social_share', {
      event_category: 'engagement',
      event_label: platform,
    })
  },

  faqInteraction: (question: string) => {
    event('faq_interaction', {
      event_category: 'engagement',
      event_label: question,
    })
  },

  timeSpent: (seconds: number) => {
    event('time_on_page', {
      event_category: 'engagement',
      value: seconds,
    })
  },

  scrollDepth: (percentage: number) => {
    event('scroll_depth', {
      event_category: 'engagement',
      value: percentage,
    })
  },
}

// Core Web Vitals tracking for SEO
export const trackWebVitals = (metric: {
  id: string
  name: string
  value: number
  label: 'web-vital' | 'custom'
}) => {
  // Send to analytics
  event(metric.name, {
    event_category: metric.label === 'web-vital' ? 'Web Vitals' : 'Performance',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  })

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric)
  }
}

// Track user journey for conversion optimization
export const trackUserJourney = () => {
  if (typeof window === 'undefined') return

  const journey: string[] = []

  // Track section views
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.id || 'unknown'
          journey.push(sectionName)

          event('section_view', {
            event_category: 'navigation',
            event_label: sectionName,
          })
        }
      })
    },
    { threshold: 0.5 }
  )

  // Observe all main sections
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section)
  })

  return journey
}

// Calculate and track engagement score
export const calculateEngagementScore = () => {
  if (typeof window === 'undefined') return 0

  const timeSpent = performance.now() / 1000 // seconds
  const scrollDepth = (window.scrollY / document.body.scrollHeight) * 100
  const interactions = sessionStorage.getItem('interaction_count') || '0'

  const score = (
    (Math.min(timeSpent, 300) / 300) * 0.4 + // Max 5 minutes
    (scrollDepth / 100) * 0.3 +
    (Math.min(parseInt(interactions), 20) / 20) * 0.3
  ) * 100

  return Math.round(score)
}

// SEO performance metrics
export const getSEOMetrics = () => {
  if (typeof window === 'undefined') return null

  return {
    // Performance metrics
    timeToInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,

    // Page info
    url: window.location.href,
    referrer: document.referrer,
    viewport: `${window.innerWidth}x${window.innerHeight}`,

    // User engagement
    timestamp: new Date().toISOString(),
  }
}

// Session recording helper (privacy-conscious)
export const initSessionRecording = () => {
  if (typeof window === 'undefined') return

  // Track scroll depth milestones
  const milestones = [25, 50, 75, 100]
  const reached = new Set<number>()

  window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100

    milestones.forEach((milestone) => {
      if (scrollPercentage >= milestone && !reached.has(milestone)) {
        reached.add(milestone)
        trackSEOEvent.scrollDepth(milestone)
      }
    })
  })

  // Track time on page
  let startTime = Date.now()

  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    trackSEOEvent.timeSpent(timeSpent)
  })

  // Track rage clicks (usability issue indicator)
  let clickCount = 0
  let lastClickTime = 0

  document.addEventListener('click', (e) => {
    const now = Date.now()

    if (now - lastClickTime < 1000) {
      clickCount++
      if (clickCount >= 3) {
        event('rage_click', {
          event_category: 'usability',
          event_label: (e.target as HTMLElement).tagName,
        })
        clickCount = 0
      }
    } else {
      clickCount = 1
    }

    lastClickTime = now
  })
}

// Helper to add UTM parameters for tracking
export const addUTMParams = (url: string, source: string, medium: string, campaign: string) => {
  const urlObj = new URL(url)
  urlObj.searchParams.set('utm_source', source)
  urlObj.searchParams.set('utm_medium', medium)
  urlObj.searchParams.set('utm_campaign', campaign)
  return urlObj.toString()
}

// Check if user came from search engine
export const isFromSearchEngine = () => {
  if (typeof document === 'undefined') return false

  const referrer = document.referrer.toLowerCase()
  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex']

  return searchEngines.some(engine => referrer.includes(engine))
}

// Track search engine referrals
export const trackSearchReferral = () => {
  if (!isFromSearchEngine()) return

  const referrer = document.referrer
  let searchEngine = 'unknown'

  if (referrer.includes('google')) searchEngine = 'google'
  else if (referrer.includes('bing')) searchEngine = 'bing'
  else if (referrer.includes('yahoo')) searchEngine = 'yahoo'
  else if (referrer.includes('duckduckgo')) searchEngine = 'duckduckgo'

  event('search_engine_referral', {
    event_category: 'acquisition',
    event_label: searchEngine,
  })
}

export default {
  pageview,
  event,
  trackSEOEvent,
  trackWebVitals,
  trackUserJourney,
  getSEOMetrics,
  initSessionRecording,
  trackSearchReferral,
}
