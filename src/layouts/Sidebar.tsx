import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Cpu, Bell, FileText, Settings } from 'lucide-react'
import { CountdownTimer } from '@/components/CountdownTimer'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/systems', label: 'Systems', icon: Cpu },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/docs', label: 'Docs', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="w-[200px] min-h-screen bg-bg-surface border-r border-border flex flex-col flex-shrink-0">
      <div className="p-4 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-accent-bright text-lg">&#x2B21;</span>
          <span className="font-mono font-bold text-sm tracking-widest text-text-primary">COMPLI</span>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors
              ${isActive
                ? 'bg-accent/15 text-accent-bright'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
              }
            `}
          >
            <item.icon size={15} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-[9px] uppercase tracking-widest text-text-muted mb-2">EU AI Act Deadline</p>
        <CountdownTimer compact />
      </div>
    </aside>
  )
}
