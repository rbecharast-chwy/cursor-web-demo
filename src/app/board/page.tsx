import { cookies }    from 'next/headers'
import { redirect }   from 'next/navigation'
import { prisma }     from '@/lib/prisma'
import { Task }       from '@/types'
import KanbanBoard    from '@/components/KanbanBoard'
import Header         from '@/components/Header'

// Server component: verify auth, load initial data, render board
export default async function BoardPage() {
  const cookieStore = cookies()
  const session     = cookieStore.get('session')

  if (!session?.value) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.value } })
  if (!user) redirect('/login')

  const tasks = await prisma.task.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize dates to strings for client props
  const serializedTasks: Task[] = tasks.map((t) => ({
    ...t,
    description: t.description ?? null,
    status:      t.status   as Task['status'],
    priority:    t.priority as Task['priority'],
    createdAt:   t.createdAt.toISOString(),
    updatedAt:   t.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header userName={user.name} />
      <main className="flex-1 overflow-hidden">
        <KanbanBoard initialTasks={serializedTasks} />
      </main>
    </div>
  )
}
