import { Link, useLocation } from 'react-router-dom'

// Navigasi ringan: "Beranda" & "Bilik Suara" — dipakai di halaman publik (bukan saat siswa
// sedang di tengah proses mencoblos, supaya tidak mengganggu alur pemungutan suara).
export default function TopNav({ variant = 'light' }) {
  const location = useLocation()
  const isLight = variant === 'light'
  const base = isLight
    ? 'bg-white/25 text-white hover:bg-white/40 border-white/40'
    : 'bg-white/90 text-ink-900 hover:bg-white border-ink-900/10'

  const links = [
    { to: '/', label: '⌂ Beranda' },
    { to: '/kiosk', label: '🗳 Bilik Suara' }
  ].filter((l) => l.to !== location.pathname)

  return (
    <nav className="flex gap-3 no-print">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur transition-colors ${base}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
