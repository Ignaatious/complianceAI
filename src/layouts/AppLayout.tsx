import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { RoleToggle } from '@/components/RoleToggle'
import { Menu } from 'lucide-react'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="ml-auto">
            <RoleToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
