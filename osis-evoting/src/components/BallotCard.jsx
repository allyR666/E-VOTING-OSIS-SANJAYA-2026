export default function BallotCard({ candidate, selected, onSelect, big }) {
  return (
    <button
      onClick={() => onSelect(candidate)}
      className={`relative flex flex-col items-center rounded-3xl border-2 px-6 py-8 transition-all duration-200
        ${big ? 'min-h-[420px]' : 'min-h-[320px]'}
        ${selected
          ? 'border-gold-500 bg-ink-800 scale-[1.02] shadow-seal'
          : 'border-ink-600 bg-ink-900 hover:border-gold-500/50 active:scale-[0.98]'}`}
    >
      <span className="seal-number w-16 h-16 text-2xl mb-5">{candidate.no_urut}</span>

      <div className="flex gap-4 mb-5">
        <Photo url={candidate.foto_url} label="Ketua" />
        <Photo url={candidate.foto_url_wakil} label="Wakil" />
      </div>

      <h3 className="font-display text-2xl text-parchment text-center leading-snug">
        {candidate.nama_ketua}
      </h3>
      <p className="text-parchment/40 text-sm my-1">berpasangan dengan</p>
      <h3 className="font-display text-2xl text-parchment text-center leading-snug">
        {candidate.nama_wakil}
      </h3>

      {selected && (
        <span className="absolute top-4 right-4 rounded-full bg-gold-500 text-ink-950 text-xs font-semibold px-3 py-1">
          Dipilih
        </span>
      )}
    </button>
  )
}

function Photo({ url, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-ink-600 bg-ink-800 flex items-center justify-center">
        {url ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-parchment/25 text-xs">{label}</span>
        )}
      </div>
    </div>
  )
}
