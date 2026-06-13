import type { Task } from '@/types'
import { apiFetch } from './client'

export interface TaskWithNames extends Task {
  boardName: string
  columnName: string
}

export interface CreateTaskInput {
  boardId: number
  columnId: number
  title: string
  description: string
  startDate?: string | null
  endDate?: string | null
}

export const getTasks = (params?: {
  boardId?: number
  sort?: string
  order?: 'asc' | 'desc'
}) => {
  const qs = new URLSearchParams()
  if (params?.boardId) qs.set('boardId', String(params.boardId))
  if (params?.sort)    qs.set('sort', params.sort)
  if (params?.order)   qs.set('order', params.order)
  const q = qs.toString()
  return apiFetch<TaskWithNames[]>(`/tasks${q ? `?${q}` : ''}`)
}

export const getTask = (id: number) => apiFetch<Task>(`/tasks/${id}`)

export const createTask = (data: CreateTaskInput) =>
  apiFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const moveTask = (taskId: number, columnId: number) =>
  apiFetch<Task>(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ columnId }),
  })

export interface UpdateTaskInput {
  title?: string
  description?: string
  startDate?: string | null
  endDate?: string | null
}

export const updateTask = (taskId: number, data: UpdateTaskInput) =>
  apiFetch<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteTask = (taskId: number) =>
  apiFetch<void>(`/tasks/${taskId}`, { method: 'DELETE' })
