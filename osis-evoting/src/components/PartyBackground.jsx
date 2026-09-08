// Latar dekoratif meriah: gradasi warna-warni + confetti melayang + balon blur.
// Dipasang sebagai lapisan paling belakang (absolute, pointer-events-none) di tiap halaman publik.
export default function PartyBackground() {
  const confetti = [
    { l: '6%', t: '12%', c: 'bg-fiesta-amber', s: 'w-4 h-4', r: 'rotate-12', d: '0s' },
    { l: '14%', t: '68%', c: 'bg-fiesta-pink', s: 'w-3 h-3 rounded-full', r: '', d: '0.6s' },
    { l: '22%', t: '30%', c: 'bg-fiesta-lime', s: 'w-3 h-6', r: '-rotate-12', d: '1.2s' },
    { l: '32%', t: '85%', c: 'bg-fiesta-sky', s: 'w-4 h-4 rounded-full', r: '', d: '0.3s' },
    { l: '45%', t: '10%', c: 'bg-fiesta-magenta', s: 'w-3 h-3', r: 'rotate-45', d: '0.9s' },
    { l: '58%', t: '75%', c: 'bg-fiesta-amber', s: 'w-3 h-3 rounded-full', r: '', d: '1.5s' },
    { l: '68%', t: '22%', c: 'bg-fiesta-teal', s: 'w-4 h-4', r: 'rotate-12', d: '0.2s' },
    { l: '78%', t: '60%', c: 'bg-fiesta-pink', s: 'w-3 h-6', r: 'rotate-45', d: '1.1s' },
    { l: '88%', t: '15%', c: 'bg-fiesta-lime', s: 'w-3 h-3 rounded-full', r: '', d: '0.7s' },
    { l: '92%', t: '80%', c: 'bg-fiesta-sky', s: 'w-4 h-4', r: '-rotate-12', d: '0.4s' },
    { l: '50%', t: '45%', c: 'bg-fiesta-amber', s: 'w-3 h-3 rounded-full', r: '', d: '1.8s' },
    { l: '10%', t: '45%', c: 'bg-fiesta-magenta', s: 'w-3 h-3', r: 'rotate-12', d: '2.1s' }
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-fiesta">
      {/* balon blur besar */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-fiesta-sky/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-fiesta-pink/40 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-fiesta-amber/30 blur-3xl" />

      {/* confetti melayang */}
      {confetti.map((c, i) => (
        <span
          key={i}
          className={`absolute ${c.s} ${c.c} ${c.r} opacity-80 animate-float shadow-md`}
          style={{ left: c.l, top: c.t, animationDelay: c.d }}
        />
      ))}
    </div>
  )
}
