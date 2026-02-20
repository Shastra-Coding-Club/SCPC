import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'SCPC 2026 - Shastra Competitive Programming Competition'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
            }}
          >
            SCPC 2026
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Shastra Competitive Programming Competition
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              marginBottom: 30,
            }}
          >
            March 13, 2026 | TCET Mumbai
          </div>
          <div
            style={{
              display: 'flex',
              gap: 40,
              fontSize: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              💰 ₹60,000 Prize Pool
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              ⏱️ 12-Hour Hackathon
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              👥 500+ Coders
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
