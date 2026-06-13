import { useEffect, useState } from 'react'
import { getBoardColumns, getBoards } from '@/api/boards'
import { createTask } from '@/api/tasks'
import type { Board, Column } from '@/types'

interface Props {
  defaultBoardId?: number
  onClose: () => void
  onCreated: () => void
}

export function TaskModal({ defaultBoardId, onClose, onCreated }: Props) {
  const [allBoards, setAllBoards]   = useState<Board[]>([])
  const [cols, setCols]             = useState<Column[]>([])
  const [boardId, setBoardId]       = useState(defaultBoardId ?? 0)
  const [columnId, setColumnId]     = useState(0)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate]   = useState('')
  const [endDate, setEndDate]       = useState('')
  const [saving, setSaving]         = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})

  useEffect(() => {
    getBoards().then(all => {
      setAllBoards(all)
      if (!boardId && all.length > 0) {
        const def = all.find(b => b.isDefault) ?? all[0]
        setBoardId(def.id)
      }
    })
  }, [])

  useEffect(() => {
    if (!boardId) return
    getBoardColumns(boardId).then(c => {
      setCols(c)
      setColumnId(c[0]?.id ?? 0)
    })
  }, [boardId])

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim())       e.title       = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!columnId)           e.column      = 'Column is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await createTask({
        boardId,
        columnId,
        title: title.trim(),
        description: description.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
      })
      onCreated()
      onClose()
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const field = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Board</label>
              <select
                value={boardId}
                onChange={e => { setBoardId(Number(e.target.value)); setColumnId(0) }}
                className={field}
              >
                {allBoards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Column</label>
              <select value={columnId} onChange={e => setColumnId(Number(e.target.value))} className={field}>
                {cols.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
              </select>
              {errors.column && <p className="mt-1 text-xs text-red-600">{errors.column}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
            <input
              autoFocus
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })) }}
              placeholder="What needs to be done?"
              className={field}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })) }}
              placeholder="Add more details…"
              rows={3}
              className={`${field} resize-none`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={field} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={field} />
            </div>
          </div>

          {errors.submit && <p className="text-xs text-red-600">{errors.submit}</p>}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
