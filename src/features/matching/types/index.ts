import type { InterestDto, UserCardDto, RecommendationResponse, SwipeRequest, SwipeResponse, RecommendationFiltersDto } from "./api"

export type { InterestDto, UserCardDto, RecommendationResponse, SwipeRequest, SwipeResponse, RecommendationFiltersDto }

export interface MatchingProfile {
  id: number
  firstName: string
  lastName: string
  age: number | null
  city: string
  avatarUrl: string
  about: string
  jobTitle: string
  department: string
  workFormat: string
  goal: string
  personalityType: string
  communicationFormat: string[]
  interests: { name: string }[]
  photos: string[]
}

export interface MatchingFilter {
  id: string
  label: string
}

export function mapUserCardToProfile(dto: UserCardDto): MatchingProfile {
  const birth = new Date(dto.dateOfBirth)
  const ageDiff = Date.now() - birth.getTime()
  const age = Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000))

  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    age,
    city: dto.city,
    avatarUrl: dto.avatarUrl,
    about: dto.about ?? "",
    jobTitle: dto.jobTitle,
    department: dto.department,
    workFormat: "",
    goal: dto.goal,
    personalityType: dto.personalityType,
    communicationFormat: [],
    interests: dto.interests.map((i) => ({ name: i.name })),
    photos: [dto.avatarUrl],
  }
}
