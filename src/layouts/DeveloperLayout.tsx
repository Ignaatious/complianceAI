import { Outlet } from 'react-router-dom'
import { RoleToggle } from '@/components/RoleToggle'

export function DeveloperLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-surface">
        <div className="flex items-center gap-3">
          <span className="text-accent-bright">&#x2B21;</span>
          <span className="font-mono font-bold text-xs tracking-widest text-text-primary">COMPLI</span>
          <span className="text-[10px] text-text-muted px-2 py-0.5 rounded bg-bg-elevated border border-border">Developer View</span>
        </div>
        <RoleToggle />
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
