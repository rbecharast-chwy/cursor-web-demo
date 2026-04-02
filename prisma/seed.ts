import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hash('demo1234'),
    },
  })

  console.log(`✅ Created user: ${user.email}`)

  // Create demo tasks
  const tasks = await prisma.task.createMany({
    data: [
      // BACKLOG — future agent tasks
      {
        title: 'Add drag and drop between columns',
        description:
          'Implement drag-and-drop using @dnd-kit so cards can be moved between columns visually.',
        status: 'BACKLOG',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Add dark mode toggle',
        description:
          'Add a dark/light mode switch in the header that persists across sessions using localStorage.',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Fix mobile layout bug',
        description:
          'On small screens the kanban columns overflow horizontally without a proper scrollable container.',
        status: 'BACKLOG',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Show task counter per column',
        description:
          'Display the number of tasks next to each column header (e.g. "TODO (3)").',
        status: 'BACKLOG',
        priority: 'LOW',
        userId: user.id,
      },
      {
        title: 'Improve accessibility (a11y)',
        description:
          'Add proper ARIA labels, keyboard navigation, and focus management to all interactive elements.',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Add delete confirmation dialog',
        description:
          'Show a confirmation modal before permanently deleting a task to prevent accidental data loss.',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Add filter by priority',
        description:
          'Extend the filter bar to allow filtering tasks by LOW / MEDIUM / HIGH priority.',
        status: 'BACKLOG',
        priority: 'LOW',
        userId: user.id,
      },

      // TODO
      {
        title: 'Write API integration tests',
        description: 'Cover /api/tasks endpoints with jest + supertest integration tests.',
        status: 'TODO',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Add task due dates',
        description: 'Add a date picker to tasks and display overdue tasks with a red badge.',
        status: 'TODO',
        priority: 'LOW',
        userId: user.id,
      },
      {
        title: 'Set up CI pipeline',
        description:
          'Add a GitHub Actions workflow that runs lint, unit tests, and Playwright e2e on every PR.',
        status: 'TODO',
        priority: 'HIGH',
        userId: user.id,
      },

      // IN_PROGRESS
      {
        title: 'Kanban board UI',
        description: 'Build the main board with columns for each status and task cards.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Search and filter functionality',
        description: 'Allow users to search tasks by keyword and filter by status.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        userId: user.id,
      },

      // DONE
      {
        title: 'Project setup',
        description: 'Initialise Next.js, Tailwind, Prisma, and Playwright boilerplate.',
        status: 'DONE',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Auth — login page',
        description: 'Create login page with email/password form and session cookie.',
        status: 'DONE',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Database schema design',
        description: 'Define User and Task models in Prisma schema.',
        status: 'DONE',
        priority: 'MEDIUM',
        userId: user.id,
      },
    ],
  })

  console.log(`✅ Created ${tasks.count} tasks`)
  console.log('\n🚀 Seed complete!')
  console.log('   Login: demo@example.com / demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
