import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCandidates, useSettings } from '../lib/useElection'
import BallotCard from '../components/BallotCard'
import PartyBackground from '../components/PartyBackground'
import SiteFooter from '../components/SiteFooter'

const STEPS = { SCAN: 'scan', CHOOSE: 'choose', CONFIRM: 'confirm', DONE: 'done', ERROR: 'error' }
const AUTO_RETURN_SECONDS = 6

export default function VotingKiosk() {
  const { candidates } = useCandidates()
  const { settings } = useSettings()
  const [step, setStep] = useState(STEPS.SCAN)
  const [kode, setKode] = useState('')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS)
  const inputRef = useRef(null)

  function handleScanSubmit(e) {
    e.preventDefault()
    if (!kode.trim()) return
    setStep(STEPS.CHOOSE)
  }

  function handleSelect(candidate) {
    setSelected(candidate)
    setStep(STEPS.CONFIRM)
  }

  async function handleConfirm() {
    setSubmitting(true)
    const { data, error } = await supabase.rpc('cast_vote', {
      p_kode_kartu: kode.trim(),
      p_candidate_id: selected.id
    })
    setSubmitting(false)

    if (error || !data?.success) {
      setMessage(data?.message || 'Terjadi kesalahan. Panggil petugas.')
      setStep(STEPS.ERROR)
      return
    }
    setStep(STEPS.DONE)
  }

  function resetKiosk() {
    setKode('')
    setSelected(null)
    setMessage('')
    setStep(STEPS.SCAN)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // Setelah memilih (atau saat error), otomatis kembali ke layar Bilik Suara (langkah "scan")
  useEffect(() => {
    if (step !== STEPS.DONE && step !== STEPS.ERROR) return
    setCountdown(AUTO_RETURN_SECONDS)
    const tick = setInterval(() => setCountdown((c) => c - 1), 1000)
    const timeout = setTimeout(resetKiosk, AUTO_RETURN_SECONDS * 1000)
    return () => { clearInterval(tick); clearTimeout(timeout) }
  }, [step])

  if (settings && settings.status !== 'ongoing') {
    return (
      <Screen>
        <TopBar settings={settings} showKioskLink={false} />
        <div className="flex-1 flex items-center justify-center text-center">
          <div className="bg-white/95 rounded-3xl shadow-card px-10 py-12 max-w-md">
            <p className="text-fiesta-magenta font-semibold text-sm mb-3 tracking-wide">Bilik Suara</p>
            <h1 className="font-display text-4xl text-ink-900 mb-4">
              {settings.status === 'draft' ? 'Pemilihan belum dibuka' : 'Pemilihan telah ditutup'}
            </h1>
            <p className="text-ink-900/50">Silakan tunggu pengumuman dari panitia.</p>
          </div>
        </div>
        <SiteFooter settings={settings} variant="light" />
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar settings={settings} showKioskLink={false} />

      <div className="flex-1 flex items-center justify-center">
        {step === STEPS.SCAN && (
          <div className="w-full max-w-md text-center bg-white/95 rounded-3xl shadow-card px-8 py-10 animate-popin">
            <p className="text-fiesta-magenta font-semibold text-sm mb-3 tracking-wide">🎉 Bilik Suara</p>
            <h1 className="font-display text-3xl text-ink-900 mb-8">Masukkan kode kartu coblos Anda</h1>
            <form onSubmit={handleScanSubmit} className="flex flex-col gap-4">
              <input
                ref={inputRef}
                autoFocus
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                placeholder="Contoh: OSIS-0042"
                className="text-center text-2xl tracking-widest bg-amber-50 border-2 border-fiesta-amber/50 focus:border-fiesta-magenta rounded-2xl py-5 px-4 outline-none text-ink-900"
              />
              <button
                type="submit"
                className="rounded-2xl bg-fiesta-magenta hover:bg-fiesta-purple text-white font-semibold text-lg py-5 transition-colors"
              >
                Lanjutkan
              </button>
            </form>
            <p className="text-ink-900/35 text-xs mt-6">Tunjukkan kartu coblos Anda ke petugas jika mengalami kendala.</p>
          </div>
        )}

        {step === STEPS.CHOOSE && (
          <div className="w-full max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-white font-semibold text-sm mb-3 tracking-wide drop-shadow">Pilih satu pasangan calon</p>
              <h1 className="font-display text-3xl text-white drop-shadow-lg">Ketua & Wakil Ketua OSIS</h1>
            </div>
            <div className={`grid gap-6 ${candidates.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {candidates.map((c, i) => (
                <BallotCard key={c.id} candidate={c} onSelect={handleSelect} big index={i} />
              ))}
            </div>
          </div>
        )}

        {step === STEPS.CONFIRM && selected && (
          <div className="w-full max-w-md text-center bg-white/95 rounded-3xl shadow-card px-8 py-10 animate-popin">
            <p className="text-fiesta-magenta font-semibold text-sm mb-3 tracking-wide">Konfirmasi pilihan</p>
            <h1 className="font-display text-3xl text-ink-900 mb-2">
              Paslon No. {selected.no_urut}
            </h1>
            <p className="text-ink-900/70 mb-8">
              {selected.nama_ketua} &amp; {selected.nama_wakil}
            </p>
            <p className="text-ink-900/40 text-sm mb-8">
              Pastikan pilihan Anda sudah benar. Suara tidak dapat diubah setelah dikirim.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(STEPS.CHOOSE)}
                disabled={submitting}
                className="flex-1 rounded-2xl border-2 border-ink-900/15 text-ink-900/70 py-5 text-lg"
              >
                Ubah pilihan
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 rounded-2xl bg-fiesta-magenta hover:bg-fiesta-purple text-white font-semibold py-5 text-lg disabled:opacity-60"
              >
                {submitting ? 'Mengirim…' : 'Kirim suara'}
              </button>
            </div>
          </div>
        )}

        {step === STEPS.DONE && (
          <div className="text-center bg-white/95 rounded-3xl shadow-card px-10 py-12 animate-popin">
            <span className="seal-number w-20 h-20 text-3xl mx-auto mb-6 border-fiesta-lime text-fiesta-teal">✓</span>
            <h1 className="font-display text-3xl text-ink-900 mb-3">🎉 Terima kasih!</h1>
            <p className="text-ink-900/60 mb-6">Suara Anda telah tercatat dengan aman.</p>
            <p className="text-ink-900/35 text-sm mb-4">Kembali ke Bilik Suara otomatis dalam {countdown} detik…</p>
            <button
              onClick={resetKiosk}
              className="rounded-2xl bg-fiesta-teal hover:bg-fiesta-purple text-white font-semibold px-8 py-3"
            >
              Kembali ke Bilik Suara Sekarang
            </button>
          </div>
        )}

        {step === STEPS.ERROR && (
          <div className="text-center max-w-md bg-white/95 rounded-3xl shadow-card px-10 py-12 animate-popin">
            <span className="seal-number w-20 h-20 text-3xl mx-auto mb-6 border-merah-500 text-merah-500">!</span>
            <h1 className="font-display text-3xl text-ink-900 mb-3">Tidak dapat melanjutkan</h1>
            <p className="text-ink-900/60 mb-4">{message}</p>
            <p className="text-ink-900/35 text-sm mb-6">Kembali ke Bilik Suara otomatis dalam {countdown} detik…</p>
            <button
              onClick={resetKiosk}
              className="rounded-2xl bg-fiesta-magenta hover:bg-fiesta-purple text-white font-semibold px-8 py-3"
            >
              Kembali Sekarang
            </button>
          </div>
        )}
      </div>

      <SiteFooter settings={settings} variant="light" />
    </Screen>
  )
}

function TopBar({ settings, showKioskLink }) {
  return (
    <div className="flex items-center justify-between mb-6 no-print">
      <div className="flex items-center gap-3">
        {settings?.school_logo_url && (
          <img src={settings.school_logo_url} className="w-9 h-9 object-contain rounded bg-white/90 p-1" alt="Logo Sekolah" />
        )}
        <p className="text-white/80 text-sm font-medium drop-shadow">{settings?.school_name}</p>
      </div>
      <Link
        to="/"
        className="rounded-full border border-white/40 bg-white/20 hover:bg-white/35 text-white text-sm font-semibold px-4 py-2 backdrop-blur transition-colors"
      >
        ⌂ Beranda
      </Link>
    </div>
  )
}

function Screen({ children }) {
  return (
    <div className="min-h-screen flex flex-col p-6 lg:p-10 select-none relative">
      <PartyBackground />
      {children}
    </div>
  )
}
