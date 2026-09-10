import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectsProvider } from '@/context/ProjectsContext'
import { Dashboard } from '@/pages/Dashboard'
import { Landing } from '@/pages/Landing'
import { NewProject } from '@/pages/NewProject'
import { NotFound } from '@/pages/NotFound'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Projects } from '@/pages/Projects'
import { Settings } from '@/pages/Settings'
import { Templates } from '@/pages/Templates'

/**
 * Two shells: the marketing landing page stands alone, everything behind
 * it renders inside the application chrome (navbar + sidebar).
 */
export default function App() {
  return (
    <ProjectsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/new" element={<NewProject />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectsProvider>
  )
}
