import { useEffect, useState, type ReactNode } from "react"

// Screen opening of public/assets/iphone17_frame.svg, normalized to the glass box.
const SCREEN_CLIP =
  "M 0.81742 0 H 0.18258 C 0.11909 0 0.09607 0.00304 0.07286 0.00876 C 0.04965 0.01447 0.03144 0.02285 0.01902 0.03353 C 0.00661 0.04422 0 0.05481 0 0.08403 V 0.91597 C 0 0.94519 0.00661 0.95578 0.01902 0.96646 C 0.03144 0.97715 0.04965 0.98553 0.07286 0.99124 C 0.09607 0.99696 0.11909 1 0.18258 1 H 0.81742 C 0.88091 1 0.90393 0.99696 0.92714 0.99124 C 0.95035 0.98553 0.96856 0.97715 0.98098 0.96646 C 0.99339 0.95578 1 0.94519 1 0.91597 V 0.08403 C 1 0.05481 0.99339 0.04422 0.98098 0.03353 C 0.96856 0.02285 0.95035 0.01447 0.92714 0.00876 C 0.90393 0.00304 0.88091 0 0.81742 0 Z"

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(new Date())), 10_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="phone-statusbar">
      <span>{time}</span>
      <span className="phone-statusbar-icons">
        <svg viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="7" width="3" height="5" rx="0.6" fill="currentColor" />
          <rect x="5" y="4.5" width="3" height="7.5" rx="0.6" fill="currentColor" />
          <rect x="10" y="2" width="3" height="10" rx="0.6" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="0.6" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 16 12" aria-hidden="true">
          <path d="M8 9.3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" fill="currentColor" />
          <path d="M3.1 7.1a6.9 6.9 0 0 1 9.8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0.7 4.4a10.4 10.4 0 0 1 14.6 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.7" y="0.7" width="22" height="11.6" rx="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <rect x="2.2" y="2.2" width="16.2" height="8.6" rx="1.4" fill="currentColor" />
          <path d="M24.2 4.3v4.4c.9-.4 1.5-1.3 1.5-2.2s-.6-1.8-1.5-2.2Z" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-device">
        <svg className="phone-clip" aria-hidden="true">
          <defs>
            <clipPath id="pawrise-screen-clip" clipPathUnits="objectBoundingBox">
              <path d={SCREEN_CLIP} />
            </clipPath>
          </defs>
        </svg>
        <div id="pawrise-shell" className="phone-screen">
          <StatusBar />
          {children}
          <div className="phone-home" aria-hidden="true" />
        </div>
        <img
          src="/assets/iphone17_frame.svg"
          alt=""
          className="phone-frame"
          draggable={false}
        />
      </div>
    </div>
  )
}
