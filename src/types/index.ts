export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  userId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
}

export interface Column {
  id: TaskStatus
  label: string
  color: string
  headerClass: string
}

export const COLUMNS: Column[] = [
  { id: 'BACKLOG',     label: 'Backlog',      color: 'gray',  headerClass: 'bg-gray-100 text-gray-700'   },
  { id: 'TODO',        label: 'To Do',         color: 'blue',  headerClass: 'bg-blue-50 text-blue-700'    },
  { id: 'IN_PROGRESS', label: 'In Progress',   color: 'amber', headerClass: 'bg-amber-50 text-amber-700'  },
  { id: 'DONE',        label: 'Done',          color: 'green', headerClass: 'bg-green-50 text-green-700'  },
]

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  LOW:    { label: 'Low',    className: 'bg-slate-100 text-slate-600'  },
  MEDIUM: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700' },
  HIGH:   { label: 'High',   className: 'bg-red-100 text-red-700'      },
}
