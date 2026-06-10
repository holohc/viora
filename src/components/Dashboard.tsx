import { useEffect, useState } from 'react'
import { LogOut, User, Mail, Calendar, Shield, Loader2, Edit3, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile(data)
        setNameValue(data.full_name ?? '')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const handleSaveName = async () => {
    if (!user || !nameValue.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: nameValue.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, full_name: nameValue.trim() } : prev)
    }
    setSaving(false)
    setEditingName(false)
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-fade-in flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-neutral-400 text-sm">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-neutral-800/50 backdrop-blur-sm bg-neutral-950/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-neutral-50">Viora</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="animate-fade-in-up">
          {/* Profile card */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shrink-0 shadow-lg shadow-primary-600/20">
                {getInitials(profile?.full_name ?? null, user?.email ?? '')}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name */}
                <div className="flex items-center gap-3 mb-1">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                        autoFocus
                        disabled={saving}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={saving}
                        className="p-1.5 text-success-500 hover:bg-success-50/10 rounded-lg transition-colors"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-semibold text-neutral-50 truncate">
                      {profile?.full_name ?? 'No name set'}
                    </h2>
                  )}
                  {!editingName && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user?.email}</span>
                </div>

                {/* Metadata badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-xs text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    Joined {profile ? formatDate(profile.created_at) : '—'}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-xs text-neutral-400">
                    <Shield className="w-3 h-3" />
                    {user?.email_confirmed_at ? 'Email verified' : 'Email unverified'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Account Status', value: 'Active', color: 'text-success-500' },
              { label: 'Security', value: 'Protected', color: 'text-primary-400' },
              { label: 'Storage', value: 'Encrypted', color: 'text-warning-500' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-in bg-neutral-900/40 border border-neutral-800/50 rounded-xl p-5 hover:border-neutral-700 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-lg font-medium ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Account details section */}
          <div className="mt-6 bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-neutral-100 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-400 text-sm">User ID</span>
                <span className="text-neutral-300 text-sm font-mono">{user?.id?.slice(0, 8)}...{user?.id?.slice(-4)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-800/50">
                <span className="text-neutral-400 text-sm">Last sign in</span>
                <span className="text-neutral-300 text-sm">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-400 text-sm">Provider</span>
                <span className="text-neutral-300 text-sm">Email / Password</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
