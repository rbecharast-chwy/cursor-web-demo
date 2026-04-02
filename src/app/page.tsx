import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Root page: redirect to /board (middleware handles auth redirect to /login)
export default function Home() {
  const cookieStore = cookies()
  const session = cookieStore.get('session')
  redirect(session ? '/board' : '/login')
}
