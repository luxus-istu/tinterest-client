export interface Interest {
  id: number
  name: string
}

export interface BasicProfilePayload {
  first_name: string
  last_name: string
  birth_date: string
}

export interface InterestsPayload {
  interest_ids: number[]
}

export interface WorkPayload {
  city: string
  job_title: string
  department: string
  work_format: string
}

export interface CommunicationPayload {
  goal: string
  communication_format: string[]
}

export interface CompleteProfilePayload {
  about: string
  personality_type: string
}
