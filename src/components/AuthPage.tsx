import { useState } from 'react'
import { AuthForm } from '../components/AuthForm'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (email: string, password: string) => {
    if (isSignUp) {
      await signUp(email, password)
    } else {
      await signIn(email, password)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-800/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-8 animate-fade-in relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          Viora
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Secure workspace</p>
      </div>

      {/* Auth form */}
      <div className="relative z-10 w-full">
        <AuthForm
          onSubmit={handleSubmit}
          isSignUp={isSignUp}
          onToggle={() => setIsSignUp(!isSignUp)}
        />
      </div>

      {/* Footer */}
      <p className="mt-8 text-neutral-600 text-xs relative z-10">
        Protected by end-to-end encryption
      </p>
    </div>
  )
}
