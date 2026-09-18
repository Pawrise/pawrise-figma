import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react"

export const WORLD = 1000 // abstract map-space is 0..1000 on both axes

export type MapApi = {
  zoomIn: () => void
  zoomOut: () => void
  recenter: () => void
}

type Props = {
  focus: { x: number; y: number } // point to recenter on (the dog)
  onApi?: (api: MapApi) => void
  children?: ReactNode // rendered in map-space, positioned via left/top in world px
}

const MIN = 0.8
const MAX = 3.2

export default function MapCanvas({ focus, onApi, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState({ x: 0, y: 0, scale: 1.4 })
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null)

  const centerOn = useCallback(
    (scale: number, fx: number, fy: number) => {
      const el = wrapRef.current
      if (!el) return { x: 0, y: 0, scale }
      const { width, height } = el.getBoundingClientRect()
      return { scale, x: width / 2 - fx * scale, y: height / 2 - fy * scale }
    },
    [],
  )

  const recenter = useCallback(() => {
    setView(centerOn(1.6, focus.x, focus.y))
  }, [centerOn, focus.x, focus.y])

  // Center on the dog once we know the container size.
  useLayoutEffect(() => {
    recenter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const zoomBy = useCallback((factor: number) => {
    const el = wrapRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    setView((v) => {
      const scale = Math.min(MAX, Math.max(MIN, v.scale * factor))
      // keep the viewport center fixed while zooming
      const cx = (width / 2 - v.x) / v.scale
      const cy = (height / 2 - v.y) / v.scale
      return { scale, x: width / 2 - cx * scale, y: height / 2 - cy * scale }
    })
  }, [])

  useEffect(() => {
    onApi?.({
      zoomIn: () => zoomBy(1.25),
      zoomOut: () => zoomBy(0.8),
      recenter,
    })
  }, [onApi, zoomBy, recenter])

  const onPointerDown = (e: ReactPointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, ox: view.x, oy: view.y }
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return
    setView((v) => ({
      ...v,
      x: drag.current!.ox + (e.clientX - drag.current!.px),
      y: drag.current!.oy + (e.clientY - drag.current!.py),
    }))
  }
  const onPointerUp = () => {
    drag.current = null
  }
  const onWheel = (e: ReactWheelEvent) => {
    zoomBy(e.deltaY < 0 ? 1.12 : 0.9)
  }

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 touch-none overflow-hidden bg-background"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      style={{ cursor: drag.current ? "grabbing" : "grab" }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: WORLD,
          height: WORLD,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transition: drag.current ? "none" : "transform 320ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <MapArt />
        {children}
      </div>
    </div>
  )
}

// A stylized, offline map using the shared theme colors.
function MapArt() {
  return (
    <svg width={WORLD} height={WORLD} viewBox={`0 0 ${WORLD} ${WORLD}`} className="absolute inset-0">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="var(--pw-color-map-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={WORLD} height={WORLD} fill="var(--pw-color-map-ground)" />
      <rect width={WORLD} height={WORLD} fill="url(#grid)" />

      {/* water */}
      <path d="M0 720 C 180 690 260 800 460 780 C 680 760 760 900 1000 860 L1000 1000 L0 1000 Z" fill="var(--pw-color-map-water)" opacity="0.9" />
      {/* park */}
      <circle cx="300" cy="250" r="150" fill="var(--pw-color-map-park)" opacity="0.85" />
      <circle cx="300" cy="250" r="150" fill="none" stroke="var(--color-good)" strokeWidth="2" />

      {/* blocks */}
      {[
        [520, 120, 150, 110],
        [720, 160, 130, 160],
        [560, 320, 120, 120],
        [740, 380, 150, 130],
        [120, 480, 150, 130],
        [330, 500, 160, 140],
        [560, 520, 150, 130],
        [120, 120, 120, 120],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="10"
          fill="var(--pw-color-map-block)"
          stroke="var(--pw-color-map-line)"
        />
      ))}

      {/* streets */}
      <g stroke="var(--pw-color-map-road)" strokeWidth="14" strokeLinecap="round">
        <path d="M0 460 H1000" />
        <path d="M0 650 H1000" />
        <path d="M500 0 V1000" />
        <path d="M710 0 V1000" />
        <path d="M280 0 V460" />
      </g>
      <g stroke="var(--pw-color-map-line)" strokeWidth="2" strokeLinecap="round">
        <path d="M0 460 H1000" />
        <path d="M500 0 V1000" />
      </g>
    </svg>
  )
}
