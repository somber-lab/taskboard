import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskModal } from '@/components/task/TaskModal'
import type { Task } from '@/types'

// Mock API modules — tests don't hit the network
vi.mock('@/api/boards', () => ({
  getBoards: vi.fn().mockResolvedValue([
    { id: 1, name: 'My Board', isDefault: true, createdAt: '' },
  ]),
  getBoardColumns: vi.fn().mockResolvedValue([
    { id: 1, boardId: 1, name: 'Pending', position: 0, isDone: false, createdAt: '' },
  ]),
}))

vi.mock('@/api/tasks', () => ({
  createTask: vi.fn().mockResolvedValue({ id: 99 }),
  updateTask: vi.fn().mockResolvedValue({ id: 1 }),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}))

const onClose = vi.fn()
const onSaved = vi.fn()

const existingTask: Task = {
  id: 1, boardId: 1, columnId: 1,
  title: 'Existing task', description: 'Some description',
  startDate: null, endDate: null, completedAt: null,
  createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
}

describe('TaskModal — create mode (US-02)', () => {
  it('shows "New Task" heading', async () => {
    render(<TaskModal onClose={onClose} onSaved={onSaved} />)
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('shows validation error when title is empty on submit', async () => {
    render(<TaskModal onClose={onClose} onSaved={onSaved} />)
    // Fill description but leave title empty
    await userEvent.type(screen.getByPlaceholderText('Add more details…'), 'desc')
    await userEvent.click(screen.getByText('Create task'))
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
  })

  it('shows validation error when description is empty on submit', async () => {
    render(<TaskModal onClose={onClose} onSaved={onSaved} />)
    await userEvent.type(screen.getByPlaceholderText('What needs to be done?'), 'My title')
    await userEvent.click(screen.getByText('Create task'))
    expect(await screen.findByText('Description is required')).toBeInTheDocument()
  })

  it('calls onSaved and onClose after successful create', async () => {
    const saved = vi.fn()
    const close = vi.fn()
    render(<TaskModal onClose={close} onSaved={saved} />)
    await userEvent.type(screen.getByPlaceholderText('What needs to be done?'), 'New task')
    await userEvent.type(screen.getByPlaceholderText('Add more details…'), 'Details here')
    await userEvent.click(screen.getByText('Create task'))
    await waitFor(() => expect(saved).toHaveBeenCalledOnce())
    expect(close).toHaveBeenCalledOnce()
  })

  it('closes when clicking the backdrop', async () => {
    const close = vi.fn()
    const { container } = render(<TaskModal onClose={close} onSaved={onSaved} />)
    const backdrop = container.firstChild as HTMLElement
    await userEvent.click(backdrop)
    expect(close).toHaveBeenCalledOnce()
  })
})

describe('TaskModal — edit mode (US-03 / US-04)', () => {
  it('shows "Edit Task" heading', () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
  })

  it('pre-fills title and description from existing task', () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Some description')).toBeInTheDocument()
  })

  it('board and column selectors are disabled in edit mode', () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    const selects = screen.getAllByRole('combobox')
    selects.forEach(s => expect(s).toBeDisabled())
  })

  it('shows "Delete task" button', () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    expect(screen.getByText('Delete task')).toBeInTheDocument()
  })

  it('shows confirmation step before deleting (US-04)', async () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    await userEvent.click(screen.getByText('Delete task'))
    expect(screen.getByText('Sure?')).toBeInTheDocument()
    expect(screen.getByText('Yes, delete')).toBeInTheDocument()
  })

  it('cancelling delete confirm hides the confirm UI', async () => {
    render(<TaskModal task={existingTask} onClose={onClose} onSaved={onSaved} />)
    await userEvent.click(screen.getByText('Delete task'))
    // Two "Cancel" buttons exist: the confirm-cancel (text-xs) and the form-cancel
    const cancelButtons = screen.getAllByText('Cancel')
    await userEvent.click(cancelButtons[0]) // first = confirm cancel
    expect(screen.queryByText('Sure?')).not.toBeInTheDocument()
  })
})
