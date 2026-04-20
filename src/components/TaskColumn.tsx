'use client'

import { Task, TaskStatus, Column } from '@/types'
import TaskCard                     from './TaskCard'
import { Plus }                     from 'lucide-react'
import clsx                         from 'clsx'

interface TaskColumnProps {
  column:            Column
  tasks:             Task[]
  isDropTarget:      boolean
  draggingTaskId:    string | null
  onAdd:             (status: TaskStatus) => void
  onEdit:            (task: Task) => void
  onDelete:          (id: string) => void
  onDragStart:       (task: Task) => void
  onDragEnd:         () => void
  onDragEnter:       () => void
  onDragLeave:       () => void
  onDrop:            (taskId: string, status: TaskStatus) => void
}

export default function TaskColumn({
  column,
  tasks,
  isDropTarget,
  draggingTaskId,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDrop,
}: TaskColumnProps) {
  return (
    <div
      data-testid={`column-${column.id.toLowerCase().replace('_', '-')}`}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault()
        const taskId = event.dataTransfer.getData('text/plain')
        if (taskId) onDrop(taskId, column.id)
      }}
      className={clsx(
        'flex flex-col w-72 flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-200 transition-colors',
        isDropTarget && 'border-blue-400 bg-blue-50/70'
      )}
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
            isDragging={draggingTaskId === task.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
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
