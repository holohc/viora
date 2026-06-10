import { useAuth } from './hooks/useAuth'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './components/Dashboard'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="animate-fade-in flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-neutral-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthPage />
}

export default App
