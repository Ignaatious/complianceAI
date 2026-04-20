import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChecklistCategory } from '@/types'
import { ChevronDown, Check } from 'lucide-react'
import { Badge } from './Badge'

interface ChecklistPanelProps {
  categories: ChecklistCategory[]
  onToggle: (categoryId: string, itemId: string) => void
  showArticleRef?: boolean
}

export function ChecklistPanel({ categories, onToggle, showArticleRef = false }: ChecklistPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map(c => [c.id, true]))
  )

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-2">
      {categories.map(category => {
        const completed = category.items.filter(i => i.completed).length
        const total = category.items.length
        const isOpen = expanded[category.id]

        return (
          <div key={category.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(category.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform ${isOpen ? '' : '-rotate-90'}`}
                />
                <span className="text-sm font-medium text-text-primary">{category.name}</span>
                {showArticleRef && (
                  <span className="text-[10px] text-text-muted font-mono">{category.articleRef}</span>
                )}
              </div>
              <span className={`text-xs font-mono ${completed === total ? 'text-risk-green' : 'text-text-muted'}`}>
                {completed}/{total}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-1">
                    {category.items.map(item => (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-bg-elevated/30 cursor-pointer group transition-colors"
                      >
                        <button
                          onClick={(e) => { e.preventDefault(); onToggle(category.id, item.id) }}
                          className={`
                            mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                            ${item.completed
                              ? 'bg-risk-green/20 border-risk-green text-risk-green'
                              : 'border-border group-hover:border-text-muted'
                            }
                          `}
                        >
                          {item.completed && <Check size={10} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${item.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                              {item.label}
                            </span>
                            {item.mandatory && (
                              <Badge className="!text-[9px] !px-1 !py-0">Required</Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
