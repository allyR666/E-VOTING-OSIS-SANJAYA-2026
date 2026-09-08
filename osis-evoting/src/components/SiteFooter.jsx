// Footer identitas sekolah — logo sekolah & logo OSIS (opsional, tampil jika diisi admin),
// nama sekolah, penyelenggara, dan alamat. Dipasang di halaman publik.
export default function SiteFooter({ settings, variant = 'light' }) {
  if (!settings) return null
  const {
    school_name: schoolName,
    organizer_name: organizerName,
    school_address: address,
    school_logo_url: schoolLogo,
    osis_logo_url: osisLogo
  } = settings

  const isLight = variant === 'light'
  const textCls = isLight ? 'text-white/85' : 'text-ink-900/70'
  const subCls = isLight ? 'text-white/60' : 'text-ink-900/45'
  const borderCls = isLight ? 'border-white/25' : 'border-ink-900/10'

  return (
    <footer className={`no-print mt-16 pt-6 border-t ${borderCls} flex flex-wrap items-center justify-center gap-4 text-center`}>
      {schoolLogo && (
        <img src={schoolLogo} alt="Logo Sekolah" className="w-11 h-11 object-contain rounded-lg bg-white/90 p-1" />
      )}
      {osisLogo && (
        <img src={osisLogo} alt="Logo OSIS" className="w-11 h-11 object-contain rounded-lg bg-white/90 p-1" />
      )}
      <div className="text-left">
        <p className={`text-sm font-semibold ${textCls}`}>{schoolName || 'Nama Sekolah'}</p>
        <p className={`text-xs ${subCls}`}>
          Diselenggarakan oleh {organizerName || 'OSIS'}
          {address ? ` · ${address}` : ''}
        </p>
      </div>
    </footer>
  )
}
