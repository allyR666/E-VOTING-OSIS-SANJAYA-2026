// Latar elegan: gradasi biru pekat & berwibawa yang bergerak halus + beberapa cahaya
// blur mengambang lambat. Kesan profesional-kuat, bukan pucat/pudar.
export default function ElegantBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-elegant bg-[length:200%_200%] animate-gradient-shift">
      {/* cahaya lembut mengambang */}
      <div className="absolute -top-32 -left-20 w-[26rem] h-[26rem] rounded-full bg-azure-300/30 blur-3xl animate-drift" />
      <div className="absolute top-1/4 -right-24 w-[30rem] h-[30rem] rounded-full bg-azure-400/25 blur-3xl animate-drift" style={{ animationDelay: '2.5s' }} />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-gold-400/20 blur-3xl animate-drift" style={{ animationDelay: '5s' }} />

      {/* garis emas tipis, kesan seremonial/berwibawa */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
    </div>
  )
}
