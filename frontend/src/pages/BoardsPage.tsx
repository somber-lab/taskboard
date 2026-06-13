import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createBoard, getBoards } from '@/api/boards'
import type { Board } from '@/types'

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getBoards().then(setBoards)
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError('')
    try {
      const board = await createBoard(name.trim())
      setBoards(prev => [...prev, board])
      setName('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Boards</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            + New Board
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Board name</label>
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="e.g. Work, Personal, Side project…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setName(''); setError('') }}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {boards.map(board => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-400 transition-colors"
          >
            <span className="font-medium text-gray-900">{board.name}</span>
            {board.isDefault && (
              <span className="text-xs text-gray-400">Default</span>
            )}
          </Link>
        ))}
        {boards.length === 0 && !showForm && (
          <p className="text-sm text-gray-400">No boards yet. Create one to get started.</p>
        )}
      </div>
    </div>
  )
}
