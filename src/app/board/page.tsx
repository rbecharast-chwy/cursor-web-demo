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
    <div className="min-h-screen max-w-full overflow-x-hidden bg-gray-50 flex flex-col">
      <Header userName={user.name} />
      <main className="flex-1 overflow-hidden min-w-0">
        <KanbanBoard initialTasks={serializedTasks} />
      </main>
    </div>
  )
}
