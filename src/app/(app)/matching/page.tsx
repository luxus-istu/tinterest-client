import { Suspense } from 'react'
import MatchingPageView from '@/src/features/matching/components/MatchingPageView'

export default function MatchingPage() {
  return (
    <Suspense>
      <MatchingPageView />
    </Suspense>
  )
}
