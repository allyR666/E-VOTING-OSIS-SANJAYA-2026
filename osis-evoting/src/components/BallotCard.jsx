const ACCENTS = [
  'group-hover:border-azure-700',
  'group-hover:border-azure-500',
  'group-hover:border-gold-600',
  'group-hover:border-azure-800'
]

export default function BallotCard({ candidate, selected, onSelect, big, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length]
  return (
    <button
      onClick={() => onSelect(candidate)}
      className={`group relative flex flex-col items-center rounded-3xl border-4 px-6 py-8 transition-all duration-200 bg-white shadow-card
        ${big ? 'min-h-[420px]' : 'min-h-[320px]'}
        ${selected
          ? 'border-azure-700 scale-[1.02]'
          : `border-transparent ${accent} active:scale-[0.98]`}`}
    >
      <span className="seal-number w-16 h-16 text-2xl mb-5">{candidate.no_urut}</span>

      <div className="flex gap-4 mb-5">
        <Photo url={candidate.foto_url} label="Ketua" />
        <Photo url={candidate.foto_url_wakil} label="Wakil" />
      </div>

      <h3 className="font-display text-2xl text-ink-900 text-center leading-snug">
        {candidate.nama_ketua}
      </h3>
      <p className="text-ink-900/40 text-sm my-1">berpasangan dengan</p>
      <h3 className="font-display text-2xl text-ink-900 text-center leading-snug">
        {candidate.nama_wakil}
      </h3>

      {selected && (
        <span className="absolute top-4 right-4 rounded-full bg-azure-700 text-white text-xs font-semibold px-3 py-1">
          Dipilih ✓
        </span>
      )}
    </button>
  )
}

function Photo({ url, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold-400/40 bg-amber-50 flex items-center justify-center">
        {url ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-ink-900/25 text-xs">{label}</span>
        )}
      </div>
    </div>
  )
}
