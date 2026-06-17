interface Props {
  percent: number
  color?: string
  trackColor?: string
  size?: number
  stroke?: number
}

export default function CircleRing({
  percent,
  color = '#1A1A1A',
  trackColor = '#EBEBEB',
  size = 160,
  stroke = 10,
}: Props) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(100, Math.max(0, percent)) / 100 * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  )
}
