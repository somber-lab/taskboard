import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addColumn, getBoard, getBoardColumns } from '@/api/boards'
import type { Board, Column } from '@/types'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)

  const [board, setBoard] = useState<Board | null>(null)
  const [cols, setCols] = useState<Column[]>([])
  const [newColName, setNewColName] = useState('')
  const [addingCol, setAddingCol] = useState(false)
  const [showColForm, setShowColForm] = useState(false)
  const [colError, setColError] = useState('')

  useEffect(() => {
    getBoard(boardId).then(setBoard)
    getBoardColumns(boardId).then(setCols)
  }, [boardId])

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

  if (!board) {
    return <div className="text-sm text-gray-400">Loading…</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/boards" className="text-sm text-gray-400 hover:text-gray-600">← Boards</Link>
        <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
        {board.isDefault && <span className="text-xs text-gray-400">Default</span>}
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {cols.map(col => (
          <div
            key={col.id}
            className="flex w-64 shrink-0 flex-col rounded-lg border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">{col.name}</span>
              {col.isDone && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Done
                </span>
              )}
            </div>
            <div className="min-h-24 flex-1 p-3">
              <p className="text-xs text-gray-300">No tasks yet</p>
            </div>
          </div>
        ))}

        <div className="w-64 shrink-0">
          {showColForm ? (
            <form
              onSubmit={handleAddColumn}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
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
    </div>
  )
}
