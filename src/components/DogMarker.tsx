type Props = { x: number; y: number; photo: string; stale?: boolean }

export default function DogMarker({ x, y, photo, stale }: Props) {
  const ring = stale ? "var(--color-watch)" : "var(--color-primary)"
  return (
    <div className="absolute" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
      {/* accuracy halo */}
      <span
        className="absolute left-1/2 top-1/2 -z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: ring, animation: "pw-pulse 2.4s ease-out infinite", opacity: 0.5 }}
      />
      <span
        className="absolute left-1/2 top-1/2 -z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: ring, opacity: 0.14 }}
      />
      {/* pin */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
        style={{ background: ring, boxShadow: "0 6px 20px rgba(0,0,0,0.45)" }}
      >
        <img
          src={photo}
          alt="Position de Nala"
          className="h-9 w-9 rounded-full border-2 object-cover"
          style={{ borderColor: "var(--color-background)", backgroundColor: "var(--pw-color-avatar-backdrop)" }}
        />
      </div>
      {/* tip */}
      <div
        className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45"
        style={{ background: ring }}
      />
    </div>
  )
}
