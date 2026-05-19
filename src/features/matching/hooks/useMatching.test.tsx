import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import matchingApi from "../api/matching.api"
import { useRecommendations } from "./useMatching"

vi.mock("../api/matching.api", () => ({
  default: {
    getRecommendations: vi.fn(),
    getFilteredRecommendations: vi.fn(),
    swipe: vi.fn(),
    getInterests: vi.fn(),
  },
}))

const user = {
  id: 1,
  firstName: "Ada",
  lastName: "Lovelace",
  middleName: null,
  dateOfBirth: null,
  gender: "FEMALE" as const,
  city: null,
  about: null,
  jobTitle: null,
  department: null,
  goal: null,
  personalityType: null,
  timeSlots: null,
  avatarUrl: null,
  interests: [],
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe("useRecommendations", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(matchingApi.getRecommendations).mockResolvedValue({
      users: [user],
      hasMore: true,
      cycle: 1,
    })
    vi.mocked(matchingApi.getFilteredRecommendations).mockResolvedValue({
      users: [user],
      hasMore: true,
      empty: false,
    })
  })

  it("resets filtered recommendations to page 0 when filters change", async () => {
    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.profiles).toHaveLength(1))

    act(() => {
      result.current.setFilters({ interestIds: [1] })
    })

    await waitFor(() =>
      expect(matchingApi.getFilteredRecommendations).toHaveBeenLastCalledWith(
        { interestIds: [1] },
        0,
      ),
    )

    act(() => {
      result.current.loadMore()
    })

    await waitFor(() =>
      expect(matchingApi.getFilteredRecommendations).toHaveBeenLastCalledWith(
        { interestIds: [1] },
        1,
      ),
    )

    act(() => {
      result.current.setFilters({ interestIds: [2] })
    })

    await waitFor(() =>
      expect(matchingApi.getFilteredRecommendations).toHaveBeenLastCalledWith(
        { interestIds: [2] },
        0,
      ),
    )
  })
})
