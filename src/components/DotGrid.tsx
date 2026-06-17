interface Props {
  filled: number
  total: number
  cols?: number
}

// Monochrome progress as filled vs empty dots.
export default function DotGrid({ filled, total, cols = 10 }: Props) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{ width: 6, height: 6, background: i < filled ? '#1A1A1A' : '#DDDDDD' }}
        />
      ))}
    </div>
  )
}
