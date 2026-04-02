import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma }  from '@/lib/prisma'

function getSession(): string | null {
  const cookieStore = cookies()
  return cookieStore.get('session')?.value ?? null
}

// GET /api/tasks/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const task = await prisma.task.findFirst({ where: { id: params.id, userId } })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(task)
}

// PUT /api/tasks/:id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.task.findFirst({ where: { id: params.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, description, status, priority } = await request.json()

  const updated = await prisma.task.update({
    where: { id: params.id },
    data:  {
      ...(title       !== undefined ? { title:       title.trim()              } : {}),
      ...(description !== undefined ? { description: description?.trim() || null } : {}),
      ...(status      !== undefined ? { status }                                  : {}),
      ...(priority    !== undefined ? { priority }                                : {}),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/tasks/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.task.findFirst({ where: { id: params.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.task.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
