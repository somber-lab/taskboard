import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from '@/components/task/TaskCard'
import type { Task } from '@/types'

interface Props {
  task: Task
  onEdit?: (task: Task) => void
}

export function DraggableTaskCard({ task, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} onClick={() => onEdit?.(task)} />
    </div>
  )
}
