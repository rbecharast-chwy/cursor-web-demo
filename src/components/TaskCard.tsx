'use client'

import { Task, PRIORITY_CONFIG } from '@/types'
import { Pencil, Trash2 }        from 'lucide-react'
import clsx                      from 'clsx'

interface TaskCardProps {
  task:     Task
  onEdit:   (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority]

  return (
    <article
      data-testid={`task-card-${task.id}`}
      aria-label={task.title}
      className={clsx(
        'bg-white rounded-xl p-4 shadow-sm border border-gray-100',
        'hover:shadow-md hover:border-gray-200 transition-all duration-150',
        'group focus-within:shadow-md focus-within:border-gray-200'
      )}
    >
      {/* Priority badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          data-testid={`task-priority-${task.id}`}
          className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', priority.className)}
        >
          {priority.label}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            data-testid={`edit-task-${task.id}`}
            aria-label={`Edit task: ${task.title}`}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            data-testid={`delete-task-${task.id}`}
            aria-label={`Delete task: ${task.title}`}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Title */}
      <button
        type="button"
        data-testid={`task-title-${task.id}`}
        className="text-sm font-semibold text-gray-800 leading-snug mb-1 cursor-pointer hover:text-blue-600 text-left w-full bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        onClick={() => onEdit(task)}
      >
        {task.title}
      </button>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}
    </article>
  )
}
