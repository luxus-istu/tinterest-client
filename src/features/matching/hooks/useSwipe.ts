import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { SWIPE_THRESHOLD } from '../lib/labels'

type SwipeDirection = 'like' | 'dislike'

interface SwipeState {
  translateX: number
  rotate: number
  opacity: number
  scale: number
  direction: SwipeDirection | null
  isDragging: boolean
  isAnimating: boolean
}

export function useSwipe(onLike: () => void, onDislike: () => void) {
  const [state, setState] = useState<SwipeState>({
    translateX: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    direction: null,
    isDragging: false,
    isAnimating: false,
  })

  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const isHorizontalSwipe = useRef(false)
  const isAnimatingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onLikeRef = useRef(onLike)
  const onDislikeRef = useRef(onDislike)

  useEffect(() => {
    onLikeRef.current = onLike
    onDislikeRef.current = onDislike
  }, [onLike, onDislike])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const resetCard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      translateX: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      isAnimating: false,
      direction: null,
    }))
    isAnimatingRef.current = false
  }, [])

  const animateOut = useCallback(
    (dir: SwipeDirection) => {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const sign = dir === 'like' ? 1 : -1
      setState((prev) => ({
        ...prev,
        translateX: sign * (window.innerWidth + 200),
        rotate: sign * 45,
        opacity: 0,
        scale: 0.8,
        direction: dir,
        isAnimating: true,
        isDragging: false,
      }))
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        if (dir === 'like') {
          onLikeRef.current()
        } else {
          onDislikeRef.current()
        }
      }, 400)
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (isAnimatingRef.current) return
      e.currentTarget.setPointerCapture(e.pointerId)
      isHorizontalSwipe.current = false
      startPos.current = { x: e.clientX, y: e.clientY }
      currentPos.current = { x: e.clientX, y: e.clientY }
      setState((prev) => ({ ...prev, isDragging: true }))
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!state.isDragging) return
      currentPos.current = { x: e.clientX, y: e.clientY }
      const dx = currentPos.current.x - startPos.current.x
      const dy = currentPos.current.y - startPos.current.y

      if (!isHorizontalSwipe.current && Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(dy)) {
        isHorizontalSwipe.current = true
      }

      if (!isHorizontalSwipe.current) return

      e.preventDefault()

      const absDx = Math.abs(dx)
      const opacityAmount = Math.max(0.4, 1 - absDx / 400)
      const scaleAmount = Math.max(0.92, 1 - absDx / 2000)

      setState((prev) => ({
        ...prev,
        translateX: dx,
        rotate: dx * 0.05,
        opacity: opacityAmount,
        scale: scaleAmount,
        direction:
          dx > SWIPE_THRESHOLD ? 'like' : dx < -SWIPE_THRESHOLD ? 'dislike' : null,
      }))
    },
    [state.isDragging],
  )

  const handlePointerUp = useCallback(() => {
    if (!state.isDragging) return

    if (!isHorizontalSwipe.current) {
      resetCard()
      return
    }

    const dx = currentPos.current.x - startPos.current.x

    if (dx > SWIPE_THRESHOLD) {
      animateOut('like')
    } else if (dx < -SWIPE_THRESHOLD) {
      animateOut('dislike')
    } else {
      resetCard()
    }
  }, [state.isDragging, animateOut, resetCard])

  const handleLike = useCallback(() => animateOut('like'), [animateOut])
  const handleDislike = useCallback(() => animateOut('dislike'), [animateOut])

  const cardTransition = state.isDragging
    ? 'none'
    : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease'

  return {
    ...state,
    cardTransition,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    onLike: handleLike,
    onDislike: handleDislike,
  }
}
