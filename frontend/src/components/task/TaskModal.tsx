import { useEffect, useState } from 'react'
import { getBoardColumns, getBoards } from '@/api/boards'
import { createTask, deleteTask, updateTask } from '@/api/tasks'
import type { Board, Column, Task } from '@/types'

interface Props {
  task?: Task           // if provided → edit mode
  defaultBoardId?: number
  onClose: () => void
  onSaved: () => void
}

export function TaskModal({ task: editTask, defaultBoardId, onClose, onSaved }: Props) {
  const isEdit = !!editTask

  const [allBoards, setAllBoards]     = useState<Board[]>([])
  const [cols, setCols]               = useState<Column[]>([])
  const [boardId, setBoardId]         = useState(editTask?.boardId ?? defaultBoardId ?? 0)
  const [columnId, setColumnId]       = useState(editTask?.columnId ?? 0)
  const [title, setTitle]             = useState(editTask?.title ?? '')
  const [description, setDescription] = useState(editTask?.description ?? '')
  const [startDate, setStartDate]     = useState(editTask?.startDate ?? '')
  const [endDate, setEndDate]         = useState(editTask?.endDate ?? '')
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [errors, setErrors]           = useState<Record<string, string>>({})

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
      if (!columnId) setColumnId(c[0]?.id ?? 0)
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
      if (isEdit) {
        await updateTask(editTask!.id, {
          title: title.trim(),
          description: description.trim(),
          startDate: startDate || null,
          endDate: endDate || null,
        })
      } else {
        await createTask({
          boardId, columnId,
          title: title.trim(),
          description: description.trim(),
          startDate: startDate || null,
          endDate: endDate || null,
        })
      }
      onSaved()
      onClose()
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editTask) return
    setDeleting(true)
    try {
      await deleteTask(editTask.id)
      onSaved()
      onClose()
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to delete' })
      setDeleting(false)
      setConfirmDelete(false)
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
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Board</label>
              <select
                value={boardId}
                onChange={e => { setBoardId(Number(e.target.value)); setColumnId(0) }}
                disabled={isEdit}
                className={`${field} disabled:bg-gray-50 disabled:text-gray-400`}
              >
                {allBoards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Column</label>
              <select
                value={columnId}
                onChange={e => setColumnId(Number(e.target.value))}
                disabled={isEdit}
                className={`${field} disabled:bg-gray-50 disabled:text-gray-400`}
              >
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
              <input type="date" value={startDate ?? ''} onChange={e => setStartDate(e.target.value)} className={field} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End date</label>
              <input type="date" value={endDate ?? ''} onChange={e => setEndDate(e.target.value)} className={field} />
            </div>
          </div>

          {errors.submit && <p className="text-xs text-red-600">{errors.submit}</p>}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {isEdit && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete task
              </button>
            )}
            {isEdit && confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
            {!isEdit && <span />}
            <div className="flex gap-3">
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
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
