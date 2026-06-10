import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isSignUp: boolean
  onToggle: () => void
}

export function AuthForm({ onSubmit, isSignUp, onToggle }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await onSubmit(email, password)
      if (isSignUp) {
        setSuccess(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      if (message.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.')
      } else if (message.includes('Invalid login')) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/20">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-50 tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            {isSignUp
              ? 'Sign up to get started with Viora'
              : 'Sign in to continue to Viora'}
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-success-50 border border-success-500/20 rounded-xl animate-fade-in">
            <p className="text-success-600 text-sm font-medium">
              Account created! Check your email to confirm, then sign in.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-500/20 rounded-xl animate-fade-in">
            <p className="text-error-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 text-sm"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 text-sm"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Create account' : 'Sign in'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
          <p className="text-sm text-neutral-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={onToggle}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
