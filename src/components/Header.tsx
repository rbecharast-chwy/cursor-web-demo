'use client'

import { useRouter }             from 'next/navigation'
import { Layers, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme }              from './ThemeProvider'

interface HeaderProps {
  userName: string
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between shadow-sm transition-colors">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">TaskFlow</span>
        <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 ml-1">
          Cloud Agent Demo
        </span>
      </div>

      {/* User + actions */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
          Hello, <span className="font-medium text-gray-900 dark:text-white">{userName}</span>
        </span>
        <button
          onClick={toggleTheme}
          data-testid="dark-mode-toggle"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}
