import { useMemo } from 'react'
import type { ChecklistCategory } from '@/types'

export function useComplianceScore(categories: ChecklistCategory[]) {
  return useMemo(() => {
    let completed = 0
    let total = 0

    for (const category of categories) {
      for (const item of category.items) {
        total++
        if (item.completed) completed++
      }
    }

    const score = total === 0 ? 100 : Math.round((completed / total) * 100)

    return { score, completed, total }
  }, [categories])
}
