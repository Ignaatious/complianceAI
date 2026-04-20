import { useNavigate, useLocation } from 'react-router-dom'
import { useRole } from '@/context/RoleContext'
import { Shield, Code } from 'lucide-react'

export function RoleToggle() {
  const { setRole } = useRole()
  const navigate = useNavigate()
  const location = useLocation()

  const isDeveloper = location.pathname === '/developer'

  const switchRole = (newRole: 'admin' | 'developer') => {
    if ((newRole === 'developer') === isDeveloper) return
    setRole(newRole)
    navigate(newRole === 'developer' ? '/developer' : '/dashboard')
  }

  return (
    <div className="flex gap-0.5 p-0.5 bg-bg-elevated rounded-lg border border-border">
      <button
        onClick={() => switchRole('developer')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          isDeveloper ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Code size={12} /> Developer
      </button>
      <button
        onClick={() => switchRole('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          !isDeveloper ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Shield size={12} /> Admin
      </button>
    </div>
  )
}
