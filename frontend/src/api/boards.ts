import type { Board, Column } from '@/types'
import { apiFetch } from './client'

export const getBoards = () => apiFetch<Board[]>('/boards')

export const getBoard = (id: number) => apiFetch<Board>(`/boards/${id}`)

export const createBoard = (name: string) =>
  apiFetch<Board & { columns: Column[] }>('/boards', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })

export const getBoardColumns = (boardId: number) =>
  apiFetch<Column[]>(`/boards/${boardId}/columns`)

export const addColumn = (boardId: number, name: string) =>
  apiFetch<Column>(`/boards/${boardId}/columns`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
