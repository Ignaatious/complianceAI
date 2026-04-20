import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DeveloperLayout } from '@/layouts/DeveloperLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Systems } from '@/pages/Systems'
import { SystemDetail } from '@/pages/SystemDetail'
import { Alerts } from '@/pages/Alerts'
import { Developer } from '@/pages/Developer'
import { Settings } from '@/pages/Settings'
import { Docs } from '@/pages/Docs'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/systems', element: <Systems /> },
      { path: '/systems/:id', element: <SystemDetail /> },
      { path: '/alerts', element: <Alerts /> },
      { path: '/docs', element: <Docs /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  {
    element: <DeveloperLayout />,
    children: [
      { path: '/developer', element: <Developer /> },
    ],
  },
])
