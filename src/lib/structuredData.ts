// Comprehensive Structured Data for SEO
// JSON-LD Schema.org markup for SCPC

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tcet-shastra.online/#organization",
  "name": "SCPC - Shastra Competitive Programming Competition",
  "alternateName": ["SCPC", "Shastra Competitive Programming Competition", "SCPC 2026", "TCET SCPC"],
  "url": "https://tcet-shastra.online",
  "logo": {
    "@type": "ImageObject",
    "url": "https://res.cloudinary.com/divj3y2cp/image/upload/f_auto,q_auto/v1/scpc-team/scpc",
    "width": 512,
    "height": 512
  },
  "description": "SCPC (Shastra Competitive Programming Competition) is a premier 12-hour coding hackathon organized at TCET Mumbai, featuring algorithmic challenges with a ₹60,000 prize pool.",
  "foundingDate": "2026",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Event Inquiries",
    "url": "https://tcet-shastra.online/#contact"
  },
  "sameAs": [
    "https://www.instagram.com/tcet_shastra",
    "https://www.linkedin.com/company/tcet-shastra",
    "https://unstop.com/o/gc8MVwn"
  ],
  "parentOrganization": {
    "@type": "EducationalOrganization",
    "name": "Thakur College of Engineering and Technology",
    "alternateName": "TCET Mumbai",
    "url": "https://www.tcetmumbai.in"
  }
}

export const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://tcet-shastra.online/#event",
  "name": "SCPC 2026 - Shastra Competitive Programming Competition",
  "alternateName": ["SCPC", "SCPC 2026", "Shastra CP Competition", "TCET SHASTRA SCPC"],
  "description": "Join SCPC 2026, a thrilling 12-hour competitive programming hackathon at TCET Mumbai. Compete with 500+ coders nationwide for a prize pool of ₹60,000. Features online qualifier on HackerRank, offline main hackathon, and ICPC-style finale.",
  "startDate": "2026-03-13T08:30:00+05:30",
  "endDate": "2026-03-13T20:30:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "url": "https://tcet-shastra.online",
  "image": [
    "https://res.cloudinary.com/divj3y2cp/image/upload/f_auto,q_auto/v1/scpc-team/scpc",
    "https://res.cloudinary.com/divj3y2cp/image/upload/w_1600,f_auto,q_90/v1/scpc-team/behind-event"
  ],
  "location": {
    "@type": "Place",
    "name": "Thakur College of Engineering and Technology",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "A-Block, Thakur Educational Campus, Shyamnarayan Thakur Marg",
      "addressLocality": "Kandivali East",
      "addressRegion": "Mumbai, Maharashtra",
      "postalCode": "400101",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.2092",
      "longitude": "72.8651"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "TCET Shastra",
    "url": "https://tcet-shastra.online"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "1st Prize",
      "price": "25000",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "description": "First Prize Winner - ₹25,000 + Trophy"
    },
    {
      "@type": "Offer",
      "name": "2nd Prize",
      "price": "15000",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "description": "Second Prize Winner - ₹15,000 + Trophy"
    },
    {
      "@type": "Offer",
      "name": "3rd Prize",
      "price": "5000",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "description": "Third Prize Winner - ₹5,000 + Trophy"
    },
    {
      "@type": "Offer",
      "name": "Registration",
      "price": "0",
      "priceCurrency": "INR",
      "url": "https://unstop.com/o/gc8MVwn?lb=EPXO7qEG",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-01-01T00:00:00+05:30"
    }
  ],
  "performer": {
    "@type": "Organization",
    "name": "Participating Teams"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "College Students, Programming Enthusiasts",
    "geographicArea": {
      "@type": "Place",
      "name": "India"
    }
  },
  "keywords": "SCPC, competitive programming, coding hackathon, algorithmic competition, TCET, Shastra, Mumbai hackathon, programming competition, CP contest, coding event",
  "maximumAttendeeCapacity": 500,
  "typicalAgeRange": "18-25"
}

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://tcet-shastra.online"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "About SCPC",
      "item": "https://tcet-shastra.online/#about"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Timeline",
      "item": "https://tcet-shastra.online/#timeline"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Team",
      "item": "https://tcet-shastra.online/#team"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "FAQ",
      "item": "https://tcet-shastra.online/#faq"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Contact",
      "item": "https://tcet-shastra.online/#contact"
    }
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://tcet-shastra.online/#website",
  "url": "https://tcet-shastra.online",
  "name": "SCPC - Shastra Competitive Programming Competition",
  "alternateName": ["SCPC", "SCPC 2026"],
  "description": "Official website for SCPC - Shastra Competitive Programming Competition at TCET Mumbai",
  "publisher": {
    "@id": "https://tcet-shastra.online/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://tcet-shastra.online?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-US"
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://tcet-shastra.online/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SCPC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shastra Competitive Programming Contest is a 12-hour competitive programming hackathon organized by TCET Shastra of Thakur College of Engineering & Technology. It brings together coders from various colleges to solve algorithmic challenges."
      }
    },
    {
      "@type": "Question",
      "name": "When and where is the event?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The event is scheduled for March 13, 2026 at TCET Campus, Kandivali (E), Mumbai. It starts at 8:30 AM and runs for 12 hours."
      }
    },
    {
      "@type": "Question",
      "name": "How do I register?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can register through our official registration portal. Click the 'Register Now' button on our website. Registration is open until slots are filled!"
      }
    },
    {
      "@type": "Question",
      "name": "What's the team size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Teams can have 1-3 members. All team members must register together."
      }
    },
    {
      "@type": "Question",
      "name": "What are the prizes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Total prize pool is ₹60,000+! 1st Prize: ₹25,000, 2nd Prize: ₹15,000, 3rd Prize: ₹5,000 along with internship opportunities. Plus special category awards and goodies for all participants."
      }
    },
    {
      "@type": "Question",
      "name": "What languages are allowed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can use C, C++, Java, Python, or JavaScript. The platform supports all major competitive programming languages."
      }
    },
    {
      "@type": "Question",
      "name": "What are the rounds in SCPC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SCPC has three rounds: 1) Qualifier - Online round on HackerRank filtering based on AC count & penalty time, 2) The Hackathon - 12-hour sprint solving real-world algorithmic challenges, 3) Finale - ICPC-style 4-hour coding round."
      }
    }
  ]
}

export const educationalEventSchema = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  "name": "SCPC 2026 - Competitive Programming Workshop",
  "description": "Learn advanced algorithms and data structures through competitive programming at SCPC 2026",
  "startDate": "2026-03-13T08:30:00+05:30",
  "endDate": "2026-03-13T20:30:00+05:30",
  "location": {
    "@type": "Place",
    "name": "TCET Mumbai"
  },
  "teaches": [
    "Algorithms",
    "Data Structures",
    "Competitive Programming",
    "Problem Solving",
    "Optimization Techniques"
  ],
  "educationalLevel": "University/College",
  "assesses": "Competitive Programming Skills"
}

export const competitionSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "SCPC 2026 - Competitive Programming Competition",
  "sport": "Competitive Programming",
  "startDate": "2026-03-13T08:30:00+05:30",
  "endDate": "2026-03-13T20:30:00+05:30",
  "location": {
    "@type": "Place",
    "name": "Thakur College of Engineering and Technology, Mumbai"
  },
  "competitor": {
    "@type": "SportsTeam",
    "name": "Participating Programming Teams"
  }
}

// Aggregate all schemas for injection
export const allStructuredData = [
  organizationSchema,
  eventSchema,
  breadcrumbSchema,
  websiteSchema,
  faqSchema,
  educationalEventSchema,
  competitionSchema
]
