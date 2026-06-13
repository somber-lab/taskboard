import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskCard } from '@/components/task/TaskCard'
import type { Task } from '@/types'

const base: Task = {
  id: 1, boardId: 1, columnId: 1,
  title: 'Fix the bug', description: 'Something is broken',
  startDate: null, endDate: null, completedAt: null,
  createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
}

describe('TaskCard (US-05)', () => {
  it('renders the task title', () => {
    render(<TaskCard task={base} />)
    expect(screen.getByText('Fix the bug')).toBeInTheDocument()
  })

  it('does not show due date when endDate is null', () => {
    render(<TaskCard task={base} />)
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument()
  })

  it('shows due date when endDate is set', () => {
    render(<TaskCard task={{ ...base, endDate: '2026-12-31' }} />)
    expect(screen.getByText(/Due/)).toBeInTheDocument()
  })

  it('marks overdue in red when endDate is past and task not completed', () => {
    const { container } = render(
      <TaskCard task={{ ...base, endDate: '2020-01-01', completedAt: null }} />,
    )
    const el = container.querySelector('.text-red-500')
    expect(el).toBeInTheDocument()
  })

  it('does NOT mark overdue when task is completed', () => {
    const { container } = render(
      <TaskCard task={{ ...base, endDate: '2020-01-01', completedAt: '2020-01-01T12:00:00Z' }} />,
    )
    expect(container.querySelector('.text-red-500')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<TaskCard task={base} onClick={onClick} />)
    await userEvent.click(screen.getByText('Fix the bug'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
