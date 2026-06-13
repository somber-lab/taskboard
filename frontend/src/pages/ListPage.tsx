import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { getTasks } from '@/api/tasks'
import { TaskModal } from '@/components/task/TaskModal'
import type { TaskWithNames } from '@/api/tasks'

const helper = createColumnHelper<TaskWithNames>()

const columns = [
  helper.accessor('title', {
    header: 'Title',
    cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>,
  }),
  helper.accessor('description', {
    header: 'Description',
    cell: info => (
      <span className="max-w-xs truncate text-gray-500">{info.getValue()}</span>
    ),
  }),
  helper.accessor('boardName', {
    header: 'Board',
    cell: info => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  helper.accessor('columnName', {
    header: 'Status',
    cell: info => (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        {info.getValue()}
      </span>
    ),
  }),
  helper.accessor('startDate', {
    header: 'Start',
    cell: info => info.getValue()
      ? new Date(info.getValue()! + 'T00:00:00').toLocaleDateString()
      : <span className="text-gray-300">—</span>,
  }),
  helper.accessor('endDate', {
    header: 'Due',
    cell: info => {
      const val = info.getValue()
      if (!val) return <span className="text-gray-300">—</span>
      const overdue = new Date(val + 'T00:00:00') < new Date() && !info.row.original.completedAt
      return (
        <span className={overdue ? 'text-red-500 font-medium' : 'text-gray-600'}>
          {new Date(val + 'T00:00:00').toLocaleDateString()}
        </span>
      )
    },
  }),
  helper.accessor('createdAt', {
    header: 'Created',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
]

export default function ListPage() {
  const [tasks, setTasks]           = useState<TaskWithNames[]>([])
  const [sorting, setSorting]       = useState<SortingState>([])
  const [showModal, setShowModal]   = useState(false)
  const [editTask, setEditTask]     = useState<TaskWithNames | null>(null)

  const load = () => getTasks().then(setTasks)

  useEffect(() => { load() }, [])

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          No tasks yet. Create one to get started.
        </div>
      ) : (
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-gray-100 bg-gray-50">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc'  && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                        {!header.column.getIsSorted() && <span className="text-gray-300"> ↕</span>}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setEditTask(row.original)}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSaved={load}
        />
      )}

      {editTask && (
        <TaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSaved={() => { setEditTask(null); load() }}
        />
      )}
    </div>
  )
}
