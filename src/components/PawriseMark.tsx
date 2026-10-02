export default function PawriseMark({
  size = 28,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="32"
          cy="13"
          rx="6.5"
          ry="11"
          transform={`rotate(${i * 45} 32 32)`}
        />
      ))}
    </svg>
  )
}
