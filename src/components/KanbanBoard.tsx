'use client'

import { useState, useMemo }         from 'react'
import { Task, TaskStatus, TaskPriority, COLUMNS } from '@/types'
import TaskColumn                    from './TaskColumn'
import TaskModal                     from './TaskModal'
import DeleteConfirmDialog           from './DeleteConfirmDialog'
import { Search, X, Filter }         from 'lucide-react'
import clsx                          from 'clsx'

interface KanbanBoardProps {
  initialTasks: Task[]
}

type FilterOption = 'ALL' | TaskStatus
type PriorityFilterOption = 'ALL' | TaskPriority

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'ALL',         label: 'All'         },
  { value: 'BACKLOG',     label: 'Backlog'      },
  { value: 'TODO',        label: 'To Do'        },
  { value: 'IN_PROGRESS', label: 'In Progress'  },
  { value: 'DONE',        label: 'Done'         },
]

const PRIORITY_FILTER_OPTIONS: { value: PriorityFilterOption; label: string }[] = [
  { value: 'ALL',    label: 'All' },
  { value: 'LOW',    label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH',   label: 'High' },
]

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks,         setTasks]         = useState<Task[]>(initialTasks)
  const [search,        setSearch]        = useState('')
  const [filter,        setFilter]        = useState<FilterOption>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterOption>('ALL')
  const [modalOpen,     setModalOpen]     = useState(false)
  const [editingTask,   setEditingTask]   = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO')
  const [deletingTask,  setDeletingTask]  = useState<Task | null>(null)

  // Client-side filter & search
  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesFilter = filter === 'ALL' || t.status === filter
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      return matchesFilter && matchesPriority && matchesSearch
    })
  }, [tasks, search, filter, priorityFilter])

  // Group by status
  const tasksByStatus = useMemo(() => {
    const map = {} as Record<TaskStatus, Task[]>
    for (const col of COLUMNS) map[col.id] = []
    for (const t of visibleTasks) map[t.status]?.push(t)
    return map
  }, [visibleTasks])

  function openCreate(status: TaskStatus) {
    setEditingTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    const task = tasks.find((t) => t.id === id) ?? null
    setDeletingTask(task)
  }

  async function confirmDelete() {
    if (!deletingTask) return
    const res = await fetch(`/api/tasks/${deletingTask.id}`, { method: 'DELETE' })
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
    setDeletingTask(null)
  }

  async function handleSave(data: Partial<Task>) {
    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      if (res.ok) {
        const updated: Task = await res.json()
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      }
    } else {
      const res = await fetch('/api/tasks', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      if (res.ok) {
        const created: Task = await res.json()
        setTasks((prev) => [created, ...prev])
      }
    }
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        data-testid="board-toolbar"
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search tasks…"
            data-testid="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          data-testid="filter-bar"
          className="flex flex-wrap items-center gap-2"
        >
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 ml-1 flex-shrink-0" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                data-testid={`filter-${opt.value.toLowerCase().replace('_', '-')}`}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition',
                  filter === opt.value
                    ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2 mr-1">Priority:</span>
            {PRIORITY_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriorityFilter(opt.value)}
                data-testid={`priority-filter-${opt.value.toLowerCase()}`}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition',
                  priorityFilter === opt.value
                    ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total visible count */}
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:block">
          {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Columns */}
      <div
        data-testid="kanban-board"
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-4 p-6 h-full min-w-max">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={tasksByStatus[col.id]}
              onAdd={openCreate}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Create / Edit modal */}
      <TaskModal
        open={modalOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deletingTask !== null}
        taskTitle={deletingTask?.title ?? ''}
        onCancel={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
