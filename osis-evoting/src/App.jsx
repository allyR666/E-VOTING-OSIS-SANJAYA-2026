import { Link } from 'react-router-dom'

const doors = [
  {
    to: '/admin',
    label: 'Panel Admin',
    desc: 'Kelola pemilih, cetak kartu coblos, panggil nomor antrean, kendalikan jalannya pemilihan.',
    no: '01'
  },
  {
    to: '/kiosk',
    label: 'Bilik Suara (Kiosk)',
    desc: 'Layar sentuh besar tempat siswa mencoblos ketua & wakil ketua setelah dipanggil.',
    no: '02'
  },
  {
    to: '/dashboard',
    label: 'Layar Pemantauan',
    desc: 'Tampilan publik: jumlah pemilih, yang sudah & belum memilih, hingga hasil akhir.',
    no: '03'
  }
]

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center mb-16">
        <p className="text-gold-500 tracking-wide text-sm mb-4">Pemilihan Raya OSIS</p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight text-parchment">
          Satu suara, satu masa depan organisasi
        </h1>
        <p className="mt-5 text-parchment/60 max-w-xl mx-auto">
          Sistem pemilihan ketua dan wakil ketua OSIS secara digital, jujur, dan transparan —
          dipantau langsung dari layar ini hingga hasil akhir diumumkan.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 w-full max-w-5xl">
        {doors.map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="group relative rounded-2xl border border-ink-600 bg-ink-900 p-7 hover:border-gold-500/60 transition-colors"
          >
            <span className="seal-number w-11 h-11 text-base mb-6">{d.no}</span>
            <h2 className="font-display text-xl text-parchment mb-2">{d.label}</h2>
            <p className="text-sm text-parchment/55 leading-relaxed">{d.desc}</p>
            <span className="absolute bottom-6 right-7 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Buka →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-14 text-xs text-parchment/30">
        Dibangun untuk pemilihan yang adil, aman, dan dapat diaudit.
      </p>
    </div>
  )
}
