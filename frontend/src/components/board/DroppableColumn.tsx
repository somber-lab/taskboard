import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { Column } from '@/types'

interface Props {
  column: Column
  taskCount: number
  children: React.ReactNode
}

export function DroppableColumn({ column, taskCount, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex w-64 shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 rounded-t-lg">
        <span className="text-sm font-semibold text-gray-700">{column.name}</span>
        <span className="text-xs text-gray-400">{taskCount}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2 p-3 min-h-32 rounded-b-lg transition-colors duration-150',
          isOver && 'bg-blue-50 border-2 border-dashed border-blue-300',
        )}
      >
        {children}
      </div>
    </div>
  )
}
