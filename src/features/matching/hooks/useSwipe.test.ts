import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useSwipe } from "./useSwipe"

describe("useSwipe", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("submits only one action while the card is animating out", () => {
    vi.useFakeTimers()
    const onLike = vi.fn()
    const onDislike = vi.fn()
    const { result } = renderHook(() => useSwipe(onLike, onDislike))

    act(() => {
      result.current.onLike()
      result.current.onLike()
      vi.advanceTimersByTime(400)
    })

    expect(onLike).toHaveBeenCalledTimes(1)
    expect(onDislike).not.toHaveBeenCalled()
  })

  it("cancels a pending swipe action when the card unmounts", () => {
    vi.useFakeTimers()
    const onLike = vi.fn()
    const { result, unmount } = renderHook(() => useSwipe(onLike, vi.fn()))

    act(() => {
      result.current.onLike()
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(onLike).not.toHaveBeenCalled()
  })
})
