import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCandidates, useSettings } from '../lib/useElection'
import BallotCard from '../components/BallotCard'

const STEPS = { SCAN: 'scan', CHOOSE: 'choose', CONFIRM: 'confirm', DONE: 'done', ERROR: 'error' }

export default function VotingKiosk() {
  const { candidates } = useCandidates()
  const { settings } = useSettings()
  const [step, setStep] = useState(STEPS.SCAN)
  const [kode, setKode] = useState('')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
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
    setTimeout(resetKiosk, 6000)
  }

  function resetKiosk() {
    setKode('')
    setSelected(null)
    setMessage('')
    setStep(STEPS.SCAN)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  if (settings && settings.status !== 'ongoing') {
    return (
      <Screen>
        <p className="text-gold-500 text-sm mb-3 tracking-wide">Bilik Suara</p>
        <h1 className="font-display text-4xl text-parchment mb-4">
          {settings.status === 'draft' ? 'Pemilihan belum dibuka' : 'Pemilihan telah ditutup'}
        </h1>
        <p className="text-parchment/50">Silakan tunggu pengumuman dari panitia.</p>
      </Screen>
    )
  }

  return (
    <Screen>
      {step === STEPS.SCAN && (
        <div className="w-full max-w-md text-center">
          <p className="text-gold-500 text-sm mb-3 tracking-wide">Bilik Suara</p>
          <h1 className="font-display text-3xl text-parchment mb-8">Masukkan kode kartu coblos Anda</h1>
          <form onSubmit={handleScanSubmit} className="flex flex-col gap-4">
            <input
              ref={inputRef}
              autoFocus
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase())}
              placeholder="Contoh: OSIS-0042"
              className="text-center text-2xl tracking-widest bg-ink-900 border-2 border-ink-600 focus:border-gold-500 rounded-2xl py-5 px-4 outline-none text-parchment"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold text-lg py-5 transition-colors"
            >
              Lanjutkan
            </button>
          </form>
          <p className="text-parchment/35 text-xs mt-6">Tunjukkan kartu coblos Anda ke petugas jika mengalami kendala.</p>
        </div>
      )}

      {step === STEPS.CHOOSE && (
        <div className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-gold-500 text-sm mb-3 tracking-wide">Pilih satu pasangan calon</p>
            <h1 className="font-display text-3xl text-parchment">Ketua & Wakil Ketua OSIS</h1>
          </div>
          <div className={`grid gap-6 ${candidates.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {candidates.map((c) => (
              <BallotCard key={c.id} candidate={c} onSelect={handleSelect} big />
            ))}
          </div>
        </div>
      )}

      {step === STEPS.CONFIRM && selected && (
        <div className="w-full max-w-md text-center">
          <p className="text-gold-500 text-sm mb-3 tracking-wide">Konfirmasi pilihan</p>
          <h1 className="font-display text-3xl text-parchment mb-2">
            Paslon No. {selected.no_urut}
          </h1>
          <p className="text-parchment/70 mb-8">
            {selected.nama_ketua} &amp; {selected.nama_wakil}
          </p>
          <p className="text-parchment/40 text-sm mb-8">
            Pastikan pilihan Anda sudah benar. Suara tidak dapat diubah setelah dikirim.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(STEPS.CHOOSE)}
              disabled={submitting}
              className="flex-1 rounded-2xl border-2 border-ink-600 text-parchment/80 py-5 text-lg"
            >
              Ubah pilihan
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 rounded-2xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold py-5 text-lg disabled:opacity-60"
            >
              {submitting ? 'Mengirim…' : 'Kirim suara'}
            </button>
          </div>
        </div>
      )}

      {step === STEPS.DONE && (
        <div className="text-center">
          <span className="seal-number w-20 h-20 text-3xl mx-auto mb-6">✓</span>
          <h1 className="font-display text-3xl text-parchment mb-3">Terima kasih!</h1>
          <p className="text-parchment/60">Suara Anda telah tercatat dengan aman.</p>
        </div>
      )}

      {step === STEPS.ERROR && (
        <div className="text-center max-w-md">
          <span className="seal-number w-20 h-20 text-3xl mx-auto mb-6 border-merah-500 text-merah-500">!</span>
          <h1 className="font-display text-3xl text-parchment mb-3">Tidak dapat melanjutkan</h1>
          <p className="text-parchment/60 mb-8">{message}</p>
          <button
            onClick={resetKiosk}
            className="rounded-2xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold px-8 py-4"
          >
            Kembali
          </button>
        </div>
      )}
    </Screen>
  )
}

function Screen({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 select-none">
      {children}
    </div>
  )
}
