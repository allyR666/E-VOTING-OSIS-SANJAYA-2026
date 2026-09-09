import { useSettings, useSummary, useResults } from '../lib/useElection'
import ElegantBackground from '../components/ElegantBackground'
import SiteFooter from '../components/SiteFooter'
import TopNav from '../components/TopNav'

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
    <div className="min-h-screen p-8 lg:p-14 relative">
      <ElegantBackground />

      <TopNav variant="light" />

      <header className="flex items-center justify-between flex-wrap gap-4 my-8">
        <div className="flex items-center gap-4">
          {settings?.school_logo_url && (
            <img src={settings.school_logo_url} className="w-14 h-14 object-contain rounded-xl bg-white/90 p-1.5" alt="Logo Sekolah" />
          )}
          {settings?.osis_logo_url && (
            <img src={settings.osis_logo_url} className="w-14 h-14 object-contain rounded-xl bg-white/90 p-1.5" alt="Logo OSIS" />
          )}
          <div>
            <p className="text-white/85 text-sm tracking-wide mb-1 drop-shadow">
              {settings?.school_year || ''} · Layar Pemantauan Langsung
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-white drop-shadow-lg">
              {settings?.election_title || 'Pemilihan Ketua & Wakil Ketua OSIS'}
            </h1>
          </div>
        </div>
        <StatusBadge status={settings?.status} />
      </header>

      {/* Statistik partisipasi */}
      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <StatCard label="Total Pemilih Terdaftar" value={summary.total_pemilih} accent="text-azure-800" ring="border-azure-800/30" />
        <StatCard label="Sudah Memilih" value={summary.sudah_memilih} accent="text-azure-500" ring="border-azure-500/30" />
        <StatCard label="Belum Memilih" value={summary.belum_memilih} accent="text-azure-700" ring="border-azure-700/30" />
      </section>

      {/* Progress partisipasi */}
      <section className="mb-16 bg-white/95 rounded-3xl shadow-card p-8">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-ink-900/60 text-sm">Tingkat Partisipasi</p>
          <p className="font-display text-2xl text-gold-600">{pct}%</p>
        </div>
        <div className="h-5 rounded-full bg-amber-50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-azure-700 via-gold-600 to-gold-400 animate-fillbar"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* Hasil per calon */}
      <section>
        <h2 className="font-display text-2xl text-white drop-shadow mb-6">
          {showResults ? '🏆 Hasil Perolehan Suara' : 'Perolehan suara akan tampil setelah pemilihan ditutup'}
        </h2>

        <div className="space-y-5">
          {results.map((r, i) => {
            const rpct = totalSuara ? Math.round((r.jumlah_suara / totalSuara) * 100) : 0
            const bars = ['from-azure-700 to-azure-200', 'from-azure-500 to-azure-300', 'from-gold-600 to-gold-400', 'from-azure-800 to-azure-700']
            return (
              <div key={r.id} className="rounded-2xl bg-white/95 shadow-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="seal-number w-12 h-12 text-lg">{r.no_urut}</span>
                  <div className="flex-1">
                    <p className="font-display text-xl text-ink-900">
                      {r.nama_ketua} &amp; {r.nama_wakil}
                    </p>
                  </div>
                  {showResults && (
                    <p className="font-display text-2xl text-gold-600">{rpct}%</p>
                  )}
                </div>
                {showResults ? (
                  <div className="h-3 rounded-full bg-amber-50 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${bars[i % bars.length]} animate-fillbar`}
                      style={{ width: `${rpct}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-3 rounded-full bg-amber-50 overflow-hidden">
                    <div className="h-full w-full opacity-25 bg-[repeating-linear-gradient(45deg,rgba(37,99,214,0.28)_0px,rgba(37,99,214,0.28)_10px,transparent_10px,transparent_20px)]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <SiteFooter settings={settings} variant="light" />
    </div>
  )
}

function StatCard({ label, value, accent, ring }) {
  return (
    <div className={`rounded-3xl border-2 ${ring} bg-white/95 shadow-card p-8`}>
      <p className="text-ink-900/50 text-sm mb-3">{label}</p>
      <p className={`font-display text-5xl ${accent}`}>{value ?? 0}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    draft: { label: 'Belum Dimulai', cls: 'bg-white/25 text-white border-white/40' },
    ongoing: { label: '● Sedang Berlangsung', cls: 'bg-azure-500 text-white border-azure-500' },
    ended: { label: 'Telah Ditutup', cls: 'bg-azure-700 text-white border-azure-700' }
  }
  const s = map[status] || map.draft
  return (
    <span className={`rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur ${s.cls}`}>{s.label}</span>
  )
}
