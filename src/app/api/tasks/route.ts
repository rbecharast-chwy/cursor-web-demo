import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma }  from '@/lib/prisma'

function getSession(): string | null {
  const cookieStore = cookies()
  return cookieStore.get('session')?.value ?? null
}

// GET /api/tasks?status=TODO&search=keyword
export async function GET(request: NextRequest) {
  const userId = getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title:       { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const userId = getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, status, priority } = await request.json()

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      title:       title.trim(),
      description: description?.trim() || null,
      status:      status   ?? 'TODO',
      priority:    priority ?? 'MEDIUM',
      userId,
    },
  })

  return NextResponse.json(task, { status: 201 })
}
