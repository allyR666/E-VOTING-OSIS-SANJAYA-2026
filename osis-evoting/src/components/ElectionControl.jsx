import { supabase } from '../lib/supabaseClient'

export default function ElectionControl({ settings, refresh }) {
  async function setStatus(status) {
    if (status === 'ended' && !confirm('Tutup pemilihan sekarang? Siswa tidak akan bisa memilih lagi.')) return
    await supabase.from('election_settings').update({ status }).eq('id', 1)
    refresh()
  }

  async function toggleResults() {
    await supabase.from('election_settings').update({ results_visible: !settings.results_visible }).eq('id', 1)
    refresh()
  }

  const steps = [
    { key: 'draft', label: 'Belum Dimulai' },
    { key: 'ongoing', label: 'Sedang Berlangsung' },
    { key: 'ended', label: 'Ditutup' }
  ]

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-900 p-8 space-y-8">
      <div>
        <h3 className="font-display text-lg text-parchment mb-4">Status Pemilihan</h3>
        <div className="flex gap-3">
          {steps.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(s.key)}
              className={`flex-1 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-colors ${
                settings?.status === s.key
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                  : 'border-ink-600 text-parchment/50 hover:border-ink-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-ink-600 px-5 py-4">
        <div>
          <p className="text-parchment font-medium">Tampilkan hasil di layar publik</p>
          <p className="text-parchment/40 text-sm">Aktifkan setelah pemilihan resmi ditutup dan hasil siap diumumkan.</p>
        </div>
        <button
          onClick={toggleResults}
          className={`relative w-14 h-8 rounded-full transition-colors ${settings?.results_visible ? 'bg-gold-500' : 'bg-ink-700'}`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-ink-950 transition-transform ${
              settings?.results_visible ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>
    </div>
  )
}
