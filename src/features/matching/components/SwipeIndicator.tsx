import { DISLIKE_COLOR, LIKE_COLOR } from '../lib/labels'

interface SwipeIndicatorProps {
  direction: 'like' | 'dislike' | null
  side: 'like' | 'dislike'
}

const indicatorTransition =
  'transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.27), opacity 0.2s ease'

export function SwipeIndicator({ direction, side }: SwipeIndicatorProps) {
  const isActive = direction === side
  const color = side === 'like' ? LIKE_COLOR : DISLIKE_COLOR
  const label = side === 'like' ? 'LIKE' : 'NOPE'
  const position = side === 'like' ? 'left-10' : 'right-10'
  const rotation = side === 'like' ? '-15deg' : '15deg'

  return (
    <div
      className={`pointer-events-none absolute top-10 ${position} z-20`}
      style={{
        transform: `scale(${isActive ? 1 : 0}) rotate(${rotation})`,
        opacity: isActive ? 1 : 0,
        transition: indicatorTransition,
      }}
    >
      <div
        className="rounded-2xl border-4 px-5 py-2.5"
        style={{ borderColor: color }}
      >
        <span className="text-4xl font-black" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  )
}
