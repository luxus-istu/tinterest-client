import { describe, expect, it } from "vitest"
import { SwipeResponseSchema } from "./api"

describe("SwipeResponseSchema", () => {
  it("accepts non-match swipe responses without match or chat ids", () => {
    expect(SwipeResponseSchema.parse({ result: "LIKED" })).toEqual({
      result: "LIKED",
    })
  })

  it("accepts nullable match and chat ids", () => {
    expect(
      SwipeResponseSchema.parse({
        result: "DISLIKED",
        matchId: null,
        chatId: null,
      }),
    ).toEqual({
      result: "DISLIKED",
      matchId: null,
      chatId: null,
    })
  })
})
