import { Button, Separator } from '@heroui/react'
import { Search, X } from 'lucide-react'
import type { MatchingFilter } from '../types'

interface FilterBarProps {
  filters: MatchingFilter[]
  activeFilters: string[]
  showFilters: boolean
  onToggleFilters: () => void
  onToggleFilter: (id: string) => void
}

export default function FilterBar({
  filters,
  activeFilters,
  showFilters,
  onToggleFilters,
  onToggleFilter,
}: FilterBarProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-3xl font-black text-foreground">Встречи</h1>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label="Поиск"
          onPress={onToggleFilters}
        >
          <Search size={22} />
        </Button>
      </div>

      <Separator className="mx-4" />

      {/* Filter selector — only shown after search is toggled */}
      {showFilters && (
        <>
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = activeFilters.includes(filter.id)
                return (
                  <Button
                    key={filter.id}
                    size="sm"
                    variant={isActive ? undefined : 'secondary'}
                    onPress={() => onToggleFilter(filter.id)}
                    className="rounded-full text-xs"
                  >
                    {filter.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <Separator className="mx-4" />
        </>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <>
          <div className="px-4 py-2">
            <div className="flex flex-wrap gap-1.5">
              {activeFilters.map((id) => {
                const label = filters.find((f) => f.id === id)?.label
                return (
                  <Button
                    key={id}
                    size="sm"
                    onPress={() => onToggleFilter(id)}
                    className="rounded-full text-xs"
                  >
                    {label}
                    <X size={12} className="ml-1" />
                  </Button>
                )
              })}
            </div>
          </div>
          <Separator className="mx-4" />
        </>
      )}
    </>
  )
}
