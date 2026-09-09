import { Link } from 'react-router-dom'
import { useSettings } from './lib/useElection'
import ElegantBackground from './components/ElegantBackground'
import SiteFooter from './components/SiteFooter'

const doors = [
  {
    to: '/admin',
    label: 'Panel Admin',
    desc: 'Kelola pemilih, cetak kartu coblos, panggil nomor antrean, kendalikan jalannya pemilihan.',
    no: '01',
    ring: 'group-hover:border-azure-800'
  },
  {
    to: '/kiosk',
    label: 'Bilik Suara (Kiosk)',
    desc: 'Layar sentuh besar tempat siswa mencoblos ketua & wakil ketua setelah dipanggil.',
    no: '02',
    ring: 'group-hover:border-azure-700'
  },
  {
    to: '/dashboard',
    label: 'Layar Pemantauan',
    desc: 'Tampilan publik: jumlah pemilih, yang sudah & belum memilih, hingga hasil akhir.',
    no: '03',
    ring: 'group-hover:border-gold-600'
  }
]

export default function App() {
  const { settings } = useSettings()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative">
      <ElegantBackground />

      <div className="max-w-3xl text-center mb-14">
        <p className="text-white font-bold tracking-wide text-sm mb-4 drop-shadow">
          Pemilihan Resmi {settings?.organizer_name || 'OSIS'}
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-6xl leading-tight text-white drop-shadow-lg">
          Satu suara, satu masa depan Sekolah ini
        </h2>
        <p className="mt-5 text-white/85 max-w-xl mx-auto drop-shadow">
          Sistem pemilihan ketua dan wakil ketua OSIS SMKS Sanjaya Bajawa-Flores secara digital, jujur, dan transparan —
          dipantau langsung dari layar ini hingga hasil akhir diumumkan.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 w-full max-w-5xl">
        {doors.map((d, i) => (
          <Link
            key={d.to}
            to={d.to}
            style={{ animationDelay: `${i * 0.12}s` }}
            className={`animate-fade-up group relative rounded-3xl border-2 border-transparent bg-white/95 backdrop-blur p-7 shadow-card transition-all hover:-translate-y-1 ${d.ring}`}
          >
            <span className="seal-number w-11 h-11 text-base mb-6">{d.no}</span>
            <h2 className="font-display text-xl text-ink-900 mb-2">{d.label}</h2>
            <p className="text-sm text-ink-900/55 leading-relaxed">{d.desc}</p>
            <span className="absolute bottom-6 right-7 text-azure-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Buka →
            </span>
          </Link>
        ))}
      </div>

      <div className="w-full max-w-3xl mt-4">
        <SiteFooter settings={settings} variant="light" />
      </div>
    </div>
  )
}
