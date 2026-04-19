'use client'

import { useRouter }             from 'next/navigation'
import { Layers, LogOut }        from 'lucide-react'

interface HeaderProps {
  userName: string
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" aria-hidden="true">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">TaskFlow</span>
        <span className="hidden sm:inline text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 ml-1">
          Cloud Agent Demo
        </span>
      </div>

      {/* User + logout */}
      <nav aria-label="User menu" className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          Hello, <span className="font-medium text-gray-900">{userName}</span>
        </span>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  )
}
