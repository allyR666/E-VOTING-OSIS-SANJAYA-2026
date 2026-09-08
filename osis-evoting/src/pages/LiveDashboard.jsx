import { useSettings, useSummary, useResults } from '../lib/useElection'

export default function LiveDashboard() {
  const { settings } = useSettings()
  const { summary } = useSummary()
  const { results } = useResults()

  const pct = summary.total_pemilih
    ? Math.round((summary.sudah_memilih / summary.total_pemilih) * 100)
    : 0

  const totalSuara = results.reduce((s, r) => s + Number(r.jumlah_suara), 0)
  const showResults = settings?.results_visible

  return (
    <div className="min-h-screen p-10 lg:p-14">
      <header className="flex items-center justify-between mb-12">
        <div>
          <p className="text-gold-500 text-sm tracking-wide mb-2">
            {settings?.school_year || ''} · Layar Pemantauan Langsung
          </p>
          <h1 className="font-display text-3xl lg:text-4xl text-parchment">
            {settings?.election_title || 'Pemilihan Ketua & Wakil Ketua OSIS'}
          </h1>
        </div>
        <StatusBadge status={settings?.status} />
      </header>

      {/* Statistik partisipasi */}
      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <StatCard label="Total Pemilih Terdaftar" value={summary.total_pemilih} accent="text-parchment" />
        <StatCard label="Sudah Memilih" value={summary.sudah_memilih} accent="text-sage-400" />
        <StatCard label="Belum Memilih" value={summary.belum_memilih} accent="text-merah-500" />
      </section>

      {/* Progress partisipasi */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-parchment/60 text-sm">Tingkat Partisipasi</p>
          <p className="font-display text-2xl text-gold-400">{pct}%</p>
        </div>
        <div className="h-4 rounded-full bg-ink-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 animate-fillbar"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* Hasil per calon */}
      <section>
        <h2 className="font-display text-2xl text-parchment mb-6">
          {showResults ? 'Hasil Perolehan Suara' : 'Perolehan suara akan tampil setelah pemilihan ditutup'}
        </h2>

        <div className="space-y-5">
          {results.map((r) => {
            const rpct = totalSuara ? Math.round((r.jumlah_suara / totalSuara) * 100) : 0
            return (
              <div key={r.id} className="rounded-2xl border border-ink-600 bg-ink-900 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="seal-number w-12 h-12 text-lg">{r.no_urut}</span>
                  <div className="flex-1">
                    <p className="font-display text-xl text-parchment">
                      {r.nama_ketua} &amp; {r.nama_wakil}
                    </p>
                  </div>
                  {showResults && (
                    <p className="font-display text-2xl text-gold-400">{rpct}%</p>
                  )}
                </div>
                {showResults ? (
                  <div className="h-3 rounded-full bg-ink-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-merah-600 to-merah-500 animate-fillbar"
                      style={{ width: `${rpct}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-3 rounded-full bg-ink-800 overflow-hidden">
                    <div className="h-full w-full opacity-20 bg-[repeating-linear-gradient(45deg,rgba(244,239,228,0.15)_0px,rgba(244,239,228,0.15)_10px,transparent_10px,transparent_20px)]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-900 p-8">
      <p className="text-parchment/50 text-sm mb-3">{label}</p>
      <p className={`font-display text-5xl ${accent}`}>{value ?? 0}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    draft: { label: 'Belum Dimulai', cls: 'border-parchment/30 text-parchment/60' },
    ongoing: { label: 'Sedang Berlangsung', cls: 'border-sage-400 text-sage-400' },
    ended: { label: 'Telah Ditutup', cls: 'border-merah-500 text-merah-500' }
  }
  const s = map[status] || map.draft
  return (
    <span className={`rounded-full border px-4 py-2 text-sm ${s.cls}`}>{s.label}</span>
  )
}
