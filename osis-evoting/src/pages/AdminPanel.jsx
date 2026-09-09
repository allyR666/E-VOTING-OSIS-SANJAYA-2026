import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useSettings, useCandidates } from '../lib/useElection'
import VoterManager from '../components/VoterManager'
import CandidateManager from '../components/CandidateManager'
import CallQueuePanel from '../components/CallQueuePanel'
import ElectionControl from '../components/ElectionControl'
import SchoolSettings from '../components/SchoolSettings'

const TABS = [
  { key: 'panggil', label: 'Panggil & Antrean' },
  { key: 'pemilih', label: 'Data Pemilih' },
  { key: 'kandidat', label: 'Kandidat' },
  { key: 'kontrol', label: 'Kontrol Pemilihan' },
  { key: 'sekolah', label: 'Identitas Sekolah' }
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
    <div className="min-h-screen p-6 lg:p-10 bg-gradient-to-br from-azure-800/5 via-azure-200/5 to-gold-400/10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
        <div>
          <p className="text-azure-700 text-sm tracking-wide mb-1">Panel Panitia</p>
          <h1 className="font-display text-2xl text-ink-900">{settings?.election_title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-ink-900/50 text-sm hover:text-ink-900">⌂ Beranda</Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-ink-900/50 text-sm hover:text-ink-900"
          >
            Keluar
          </button>
        </div>
      </header>

      <nav className="flex gap-2 mb-8 no-print overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
              tab === t.key ? 'bg-azure-700 text-white' : 'bg-white text-ink-900/60 border border-gray-200'
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
      {tab === 'sekolah' && (
        <SchoolSettings settings={settings} refresh={refreshSettings} />
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-azure-800/10 via-azure-200/10 to-gold-400/10">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-azure-700 text-sm tracking-wide">Panel Panitia</p>
          <Link to="/" className="text-ink-900/40 text-xs hover:text-ink-900">⌂ Beranda</Link>
        </div>
        <h1 className="font-display text-2xl text-ink-900 mb-4">Masuk untuk mengelola pemilihan</h1>
        <input
          type="email"
          placeholder="Email panitia"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        {error && <p className="text-merah-500 text-sm">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-azure-700 hover:bg-azure-800 text-white font-semibold py-3">
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
