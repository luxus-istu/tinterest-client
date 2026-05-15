import {
  FilteredRecommendationResponseSchema,
  InterestsArraySchema,
  RecommendationResponseSchema,
  SwipeResponseSchema,
} from "../types/api"
import type {
  RecommendationFiltersDto,
  SwipeRequest,
} from "../types/api"
import { apiClient } from "@/src/lib/api/client"

export const matchingApi = {
  getRecommendations: (limit = 10) =>
    apiClient
      .get("/discovery/recommendation", { params: { limit } })
      .then((res) => RecommendationResponseSchema.parse(res.data)),

  getFilteredRecommendations: (
    filters: RecommendationFiltersDto,
    page = 0,
    limit = 10,
  ) =>
    apiClient
      .get("/discovery/recommendation/filter", { params: { filters, page, limit } })
      .then((res) => FilteredRecommendationResponseSchema.parse(res.data)),

  swipe: (data: SwipeRequest) =>
    apiClient.post("/discovery/swipe", data).then((res) => SwipeResponseSchema.parse(res.data)),

  getInterests: () =>
    apiClient.get("/interests").then((res) => InterestsArraySchema.parse(res.data)),
}
