'use client'

import { Task, TaskStatus, Column } from '@/types'
import TaskCard                     from './TaskCard'
import { Plus }                     from 'lucide-react'
import clsx                         from 'clsx'

interface TaskColumnProps {
  column:   Column
  tasks:    Task[]
  onAdd:    (status: TaskStatus) => void
  onEdit:   (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskColumn({ column, tasks, onAdd, onEdit, onDelete }: TaskColumnProps) {
  return (
    <div
      data-testid={`column-${column.id.toLowerCase().replace('_', '-')}`}
      className="flex flex-col w-[280px] sm:w-72 flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-200"
    >
      {/* Column header */}
      <div className={clsx('px-4 py-3 rounded-t-2xl flex items-center justify-between', column.headerClass)}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{column.label}</span>
          {/* Task count badge */}
          <span className="text-xs font-bold bg-white bg-opacity-70 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(column.id)}
          data-testid={`add-task-${column.id.toLowerCase().replace('_', '-')}`}
          title={`Add task to ${column.label}`}
          className="p-1 rounded-lg hover:bg-white hover:bg-opacity-50 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto column-scroll min-h-[120px]">
        {tasks.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400 select-none">
            No tasks here
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Add task button at bottom */}
      <div className="p-3 pt-0">
        <button
          onClick={() => onAdd(column.id)}
          className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 hover:border-gray-400 rounded-xl transition flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add task
        </button>
      </div>
    </div>
  )
}
