import { supabase } from '../lib/supabaseClient'

export default function CallQueuePanel({ voters, settings, refresh }) {
  const current = settings?.current_call_number
  const currentVoter = voters.find((v) => v.no_antrean === current)
  const remaining = voters.filter((v) => !v.sudah_memilih)

  async function callNumber(no) {
    await supabase.from('election_settings').update({ current_call_number: no }).eq('id', 1)
    refresh()
  }

  function callNext() {
    const next = remaining
      .filter((v) => !current || v.no_antrean > current)
      .sort((a, b) => a.no_antrean - b.no_antrean)[0] || remaining.sort((a, b) => a.no_antrean - b.no_antrean)[0]
    if (next) callNumber(next.no_antrean)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-10 flex flex-col items-center justify-center text-center">
        <p className="text-ink-900/50 text-sm mb-3">Nomor Sedang Dipanggil</p>
        <p className="font-display text-8xl text-fiesta-magenta mb-2">{current || '—'}</p>
        {currentVoter && (
          <p className="text-ink-900/70">{currentVoter.nama} · Kelas {currentVoter.kelas}</p>
        )}
        <button
          onClick={callNext}
          className="mt-8 rounded-2xl bg-fiesta-magenta hover:bg-fiesta-purple text-white font-semibold px-10 py-4 text-lg"
        >
          Panggil Nomor Berikutnya →
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="font-display text-lg text-ink-900 mb-4">Antrean Belum Memilih</h3>
        <div className="max-h-[340px] overflow-y-auto space-y-2">
          {remaining
            .sort((a, b) => a.no_antrean - b.no_antrean)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => callNumber(v.no_antrean)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm flex justify-between ${
                  v.no_antrean === current ? 'bg-fiesta-magenta/10 text-fiesta-magenta' : 'hover:bg-gray-50 text-ink-900/70'
                }`}
              >
                <span>No. {v.no_antrean} — {v.nama}</span>
                <span className="text-ink-900/30">{v.kelas}</span>
              </button>
            ))}
          {!remaining.length && <p className="text-ink-900/35 text-sm">Semua pemilih sudah memilih 🎉</p>}
        </div>
      </div>
    </div>
  )
}
