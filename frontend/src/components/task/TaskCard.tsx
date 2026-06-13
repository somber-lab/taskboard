import type { Task } from '@/types'

interface Props {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: Props) {
  const overdue =
    task.endDate && !task.completedAt && new Date(task.endDate) < new Date()

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-400 transition-colors"
    >
      <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
      {task.endDate && (
        <p className={`mt-1.5 text-xs ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
          Due {new Date(task.endDate + 'T00:00:00').toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
