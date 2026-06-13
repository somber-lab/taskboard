import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addColumn, getBoard, getBoardColumns } from '@/api/boards'
import { getTasks } from '@/api/tasks'
import { TaskCard } from '@/components/task/TaskCard'
import { TaskModal } from '@/components/task/TaskModal'
import type { Board, Column, Task } from '@/types'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)

  const [board, setBoard]           = useState<Board | null>(null)
  const [cols, setCols]             = useState<Column[]>([])
  const [taskMap, setTaskMap]       = useState<Map<number, Task[]>>(new Map())
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [addingCol, setAddingCol]   = useState(false)
  const [showColForm, setShowColForm] = useState(false)
  const [colError, setColError]     = useState('')

  const loadTasks = useCallback(async () => {
    const all = await getTasks({ boardId })
    const map = new Map<number, Task[]>()
    for (const t of all) {
      const arr = map.get(t.columnId) ?? []
      arr.push(t)
      map.set(t.columnId, arr)
    }
    setTaskMap(map)
  }, [boardId])

  useEffect(() => {
    getBoard(boardId).then(setBoard)
    getBoardColumns(boardId).then(setCols)
    loadTasks()
  }, [boardId, loadTasks])

  async function handleAddColumn(e: React.FormEvent) {
    e.preventDefault()
    if (!newColName.trim()) return
    setAddingCol(true)
    setColError('')
    try {
      const col = await addColumn(boardId, newColName.trim())
      setCols(prev => [...prev, col])
      setNewColName('')
      setShowColForm(false)
    } catch (err) {
      setColError(err instanceof Error ? err.message : 'Failed to add column')
    } finally {
      setAddingCol(false)
    }
  }

  if (!board) return <div className="text-sm text-gray-400">Loading…</div>

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/boards" className="text-sm text-gray-400 hover:text-gray-600">← Boards</Link>
        <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
        {board.isDefault && <span className="text-xs text-gray-400">Default</span>}
        <div className="ml-auto">
          <button
            onClick={() => setShowTaskModal(true)}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {cols.map(col => (
          <div
            key={col.id}
            className="flex w-64 shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 rounded-t-lg">
              <span className="text-sm font-semibold text-gray-700">{col.name}</span>
              <span className="text-xs text-gray-400">
                {taskMap.get(col.id)?.length ?? 0}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3 min-h-32">
              {(taskMap.get(col.id) ?? []).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}

        <div className="w-64 shrink-0">
          {showColForm ? (
            <form onSubmit={handleAddColumn} className="rounded-lg border border-gray-200 bg-white p-3">
              <input
                autoFocus
                value={newColName}
                onChange={e => { setNewColName(e.target.value); setColError('') }}
                placeholder="Column name"
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              {colError && <p className="mt-1 text-xs text-red-600">{colError}</p>}
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={addingCol || !newColName.trim()}
                  className="flex-1 rounded bg-gray-900 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {addingCol ? 'Adding…' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowColForm(false); setNewColName(''); setColError('') }}
                  className="flex-1 rounded border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowColForm(true)}
              className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Add column
            </button>
          )}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          defaultBoardId={boardId}
          onClose={() => setShowTaskModal(false)}
          onCreated={loadTasks}
        />
      )}
    </div>
  )
}
