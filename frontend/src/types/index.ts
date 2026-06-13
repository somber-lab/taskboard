export interface Board {
  id: number
  name: string
  isDefault: boolean
  createdAt: string
}

export interface Column {
  id: number
  boardId: number
  name: string
  position: number
  isDone: boolean
  createdAt: string
}

export interface Task {
  id: number
  boardId: number
  columnId: number
  title: string
  description: string
  startDate: string | null
  endDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardMetrics {
  byStatus: { columnName: string; count: number }[]
  completedLast7Days: number
  completedLast30Days: number
  unplanned: number
  overdue: number
}
