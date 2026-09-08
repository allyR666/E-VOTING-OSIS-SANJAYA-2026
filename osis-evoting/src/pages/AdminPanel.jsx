import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSettings, useCandidates } from '../lib/useElection'
import VoterManager from '../components/VoterManager'
import CandidateManager from '../components/CandidateManager'
import CallQueuePanel from '../components/CallQueuePanel'
import ElectionControl from '../components/ElectionControl'

const TABS = [
  { key: 'panggil', label: 'Panggil & Antrean' },
  { key: 'pemilih', label: 'Data Pemilih' },
  { key: 'kandidat', label: 'Kandidat' },
  { key: 'kontrol', label: 'Kontrol Pemilihan' }
]

export default function AdminPanel() {
  const [session, setSession] = useState(undefined) // undefined = loading, null = logged out
  const [tab, setTab] = useState('panggil')
  const [voters, setVoters] = useState([])
  const { settings, refresh: refreshSettings } = useSettings()
  const { candidates, refresh: refreshCandidates } = useCandidates()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function refreshVoters() {
    const { data } = await supabase.from('voters').select('*').order('no_antrean')
    setVoters(data || [])
  }

  useEffect(() => {
    if (session) refreshVoters()
  }, [session])

  if (session === undefined) return null
  if (!session) return <LoginScreen onLoggedIn={() => {}} />

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
        <div>
          <p className="text-gold-500 text-sm tracking-wide mb-1">Panel Panitia</p>
          <h1 className="font-display text-2xl text-parchment">{settings?.election_title}</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-parchment/50 text-sm hover:text-parchment"
        >
          Keluar
        </button>
      </header>

      <nav className="flex gap-2 mb-8 no-print overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
              tab === t.key ? 'bg-gold-500 text-ink-950' : 'bg-ink-900 text-parchment/60 border border-ink-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'panggil' && (
        <CallQueuePanel voters={voters} settings={settings} refresh={() => { refreshVoters(); refreshSettings() }} />
      )}
      {tab === 'pemilih' && (
        <VoterManager voters={voters} refresh={refreshVoters} settings={settings} />
      )}
      {tab === 'kandidat' && (
        <CandidateManager candidates={candidates} refresh={refreshCandidates} />
      )}
      {tab === 'kontrol' && (
        <ElectionControl settings={settings} refresh={refreshSettings} />
      )}
    </div>
  )
}

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError('Email atau kata sandi salah.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-ink-600 bg-ink-900 p-8 space-y-4">
        <p className="text-gold-500 text-sm tracking-wide">Panel Panitia</p>
        <h1 className="font-display text-2xl text-parchment mb-4">Masuk untuk mengelola pemilihan</h1>
        <input
          type="email"
          placeholder="Email panitia"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500"
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500"
        />
        {error && <p className="text-merah-500 text-sm">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold py-3">
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
