import { QRCodeSVG } from 'qrcode.react'

// Kartu dicetak dalam grid, 4 kartu per halaman A4, siap dipotong.
export default function PrintCard({ voters, electionTitle, schoolYear }) {
  return (
    <div className="hidden print:block">
      <div className="grid grid-cols-2 gap-0">
        {voters.map((v) => (
          <div key={v.id} className="border border-dashed border-black p-5 flex items-center gap-4" style={{ breakInside: 'avoid' }}>
            <QRCodeSVG value={v.kode_kartu} size={72} />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-500">{electionTitle} · {schoolYear}</p>
              <p className="font-bold text-lg leading-tight">{v.nama}</p>
              <p className="text-sm text-gray-600">Kelas {v.kelas} · No. Antrean {v.no_antrean}</p>
              <p className="mt-1 font-mono text-base tracking-widest">{v.kode_kartu}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
