import { useEffect, useRef, useState } from "react"
import { useApp } from "../app-context"
import MapCanvas, { type MapApi } from "../components/MapCanvas"
import DogMarker from "../components/DogMarker"
import StatusCard from "../components/StatusCard"
import MapControls from "../components/MapControls"
import SafeZonesSheet from "../components/SafeZonesSheet"
import AlertBanner from "../components/AlertBanner"
import Icon from "../components/Icon"
import { useStoredState } from "../state/storage"
import { dogPosition, initialSafeZones, positionOutsideZone, trail, zoneExitTrail, type SafeZone } from "../data/mock"

export default function GpsScreen() {
  const { anomaly, askPawriseAboutAlert, currentDog: dog } = useApp()

  const apiRef = useRef<MapApi | null>(null)
  const [lastUpdate, setLastUpdate] = useStoredState(`gps-time:${dog.id}`, Date.now() - 30_000)
  const [now, setNow] = useState(Date.now())
  const [stale, setStale] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [history, setHistory] = useStoredState<{ x: number; y: number }[]>(`gps-history:${dog.id}`, trail)
  const [showHistory, setShowHistory] = useState(true)
  const [pos] = useStoredState(`gps-position:${dog.id}`, dogPosition)

  const [zones, setZonesState] = useStoredState<SafeZone[]>(`zones:${dog.id}`, initialSafeZones)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState<string | null>("home")
  const [alertDismissed, setAlertDismissed] = useState(false)

  const contains = (zone: SafeZone, point: { x: number; y: number }) =>
    Math.hypot(point.x - zone.x, point.y - zone.y) <= zone.radius
  const leftZone = anomaly ? (zones.find((zone) => contains(zone, pos)) ?? zones[0] ?? null) : null
  const displayPos = leftZone ? positionOutsideZone(leftZone) : pos
  const trailPoints = leftZone ? zoneExitTrail(pos, displayPos) : history
  const mapFocus = leftZone
    ? {
        x: leftZone.x + (displayPos.x - leftZone.x) * 0.38,
        y: Math.min(leftZone.y, displayPos.y) - 120,
      }
    : displayPos
  const leftZoneId = leftZone?.id ?? null

  useEffect(() => {
    if (leftZoneId) setSelectedZone(leftZoneId)
  }, [leftZoneId])

  const secondsAgo = Math.max(0, Math.floor((now - lastUpdate) / 1000))

  // Live-updating recency; mark stale after 3 minutes.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (secondsAgo > 180) setStale(true)
  }, [secondsAgo])

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (refreshTimer.current) clearTimeout(refreshTimer.current) }, [])
  const refresh = () => {
    if (refreshing || !dog.connected) return
    setRefreshing(true)
    refreshTimer.current = setTimeout(() => {
      setStale(false)
      setLastUpdate(Date.now())
      if (!anomaly) setHistory(points => [...points.slice(-19), pos])
      setRefreshing(false)
    }, 1100)
  }

  const showAlert = !!leftZone && !alertDismissed

  return (
    <div className="relative h-full w-full">
      <MapCanvas
        focus={mapFocus}
        recenterScale={leftZone ? 0.9 : 1.6}
        onApi={(api) => (apiRef.current = api)}
      >
        {/* breadcrumb trail */}
        <svg className="pointer-events-none absolute inset-0" width={1000} height={1000}>
          <polyline
            points={(showHistory ? trailPoints : []).map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={leftZone ? "var(--color-alert)" : "var(--color-primary)"}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 12"
          />
        </svg>

        {/* safe zone overlays */}
        {zones
          .filter((z) => z.id === leftZone?.id || !selectedZone || z.id === selectedZone)
          .map((z) => {
            const breached = leftZone?.id === z.id
            return (
              <div
                key={z.id}
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: z.x,
                  top: z.y,
                  width: z.radius * 2,
                  height: z.radius * 2,
                  transform: "translate(-50%, -50%)",
                  border: breached ? "2.5px solid var(--color-alert)" : "2px solid var(--color-primary)",
                  background: breached ? "var(--color-alert-soft)" : "var(--color-good-soft)",
                  boxShadow: breached ? "0 0 0 8px var(--color-alert-soft)" : undefined,
                }}
              >
                <span
                  className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold"
                  style={{ color: breached ? "var(--color-alert)" : "var(--color-primary)" }}
                >
                  {z.emoji} {z.label}{breached ? " · sortie" : ""}
                </span>
              </div>
            )
          })}

        <DogMarker x={displayPos.x} y={displayPos.y} photo={dog.photo} stale={stale || !dog.connected} alert={!!leftZone} />
      </MapCanvas>

      {/* top overlay */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 space-y-3 px-4"
        style={{ paddingTop: "calc(var(--pw-safe-top) + 14px)" }}
      >
        <div className="pointer-events-auto">
          <StatusCard secondsAgo={secondsAgo} stale={stale || !dog.connected} zoneName={leftZone?.label} />
        </div>
        {showAlert && leftZone && (
          <div className="pointer-events-auto">
            <AlertBanner
              message={`${dog.name} a quitté la zone de sécurité ${leftZone.label}.`}
              onOpen={() => askPawriseAboutAlert(leftZone.label)}
              onDismiss={() => setAlertDismissed(true)}
            />
          </div>
        )}
      </div>

      {/* right controls */}
      <div className="absolute bottom-28 right-4 z-20">
        <MapControls
          onZoomIn={() => apiRef.current?.zoomIn()}
          onZoomOut={() => apiRef.current?.zoomOut()}
          onRecenter={() => apiRef.current?.recenter()}
          onRefresh={refresh}
          refreshing={refreshing}
        />
      </div>

      <div className="absolute bottom-20 left-4 z-20">
        <button className="rounded-2xl bg-card px-3 py-2 text-xs" onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Masquer le trajet" : "Voir le trajet"}</button>
      </div>
      {/* safe-zones entry */}
      <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-full border border-hairline bg-card/85 px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl active:scale-95"
        >
          <Icon name="shield" size={18} strokeWidth={2.2} className={leftZone ? "text-alert" : "text-primary"} />
          Zones de sécurité
          {leftZone && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ background: "var(--color-alert-soft)", color: "var(--color-alert)" }}
            >
              Sortie
            </span>
          )}
          <span className="rounded-full bg-elevated px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {zones.length}
          </span>
        </button>
      </div>

      <SafeZonesSheet
        position={displayPos}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        zones={zones}
        setZones={setZonesState}
        selectedId={selectedZone}
        onSelect={setSelectedZone}
        leftZoneId={leftZone?.id}
      />
    </div>
  )
}
