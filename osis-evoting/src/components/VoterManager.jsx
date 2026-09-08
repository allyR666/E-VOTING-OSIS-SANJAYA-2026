import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import PrintCard from './PrintCard'

function genKode(noAntrean) {
  return `OSIS-${String(noAntrean).padStart(4, '0')}`
}

export default function VoterManager({ voters, refresh, settings }) {
  const [form, setForm] = useState({ nama: '', kelas: '', nis: '' })
  const [csvText, setCsvText] = useState('')
  const [search, setSearch] = useState('')
  const [selectedToPrint, setSelectedToPrint] = useState([])
  const [busy, setBusy] = useState(false)

  const nextNo = useMemo(
    () => (voters.length ? Math.max(...voters.map((v) => v.no_antrean)) + 1 : 1),
    [voters]
  )

  async function addVoter(e) {
    e.preventDefault()
    if (!form.nama || !form.kelas) return
    setBusy(true)
    const no_antrean = nextNo
    await supabase.from('voters').insert({
      nama: form.nama,
      kelas: form.kelas,
      nis: form.nis || null,
      no_antrean,
      kode_kartu: genKode(no_antrean)
    })
    setForm({ nama: '', kelas: '', nis: '' })
    setBusy(false)
    refresh()
  }

  async function importCsv() {
    // Format tiap baris: Nama,Kelas,NIS  (header opsional)
    const rows = csvText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean)
      .filter((r) => !r.toLowerCase().startsWith('nama,'))

    setBusy(true)
    let n = nextNo
    const payload = rows.map((row) => {
      const [nama, kelas, nis] = row.split(',').map((s) => s?.trim())
      const no_antrean = n++
      return { nama, kelas, nis: nis || null, no_antrean, kode_kartu: genKode(no_antrean) }
    })
    if (payload.length) await supabase.from('voters').insert(payload)
    setCsvText('')
    setBusy(false)
    refresh()
  }

  async function markPrinted(ids) {
    await supabase.from('voters').update({ kartu_dicetak: true }).in('id', ids)
    refresh()
  }

  function toggleSelect(id) {
    setSelectedToPrint((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function printSelected() {
    if (!selectedToPrint.length) return
    window.print()
    markPrinted(selectedToPrint)
  }

  const filtered = voters.filter(
    (v) =>
      v.nama.toLowerCase().includes(search.toLowerCase()) ||
      v.kelas.toLowerCase().includes(search.toLowerCase()) ||
      String(v.no_antrean).includes(search)
  )

  const printBatch = voters.filter((v) => selectedToPrint.includes(v.id))

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={addVoter} className="rounded-2xl border border-ink-600 bg-ink-900 p-6 space-y-3">
          <h3 className="font-display text-lg text-parchment mb-2">Tambah Pemilih</h3>
          <input
            placeholder="Nama lengkap"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500"
          />
          <div className="flex gap-3">
            <input
              placeholder="Kelas (mis. XI IPA 2)"
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
              className="flex-1 bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500"
            />
            <input
              placeholder="NIS (opsional)"
              value={form.nis}
              onChange={(e) => setForm({ ...form, nis: e.target.value })}
              className="flex-1 bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500"
            />
          </div>
          <button disabled={busy} className="rounded-xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold px-5 py-3 w-full">
            Tambah nomor antrean #{nextNo}
          </button>
        </form>

        <div className="rounded-2xl border border-ink-600 bg-ink-900 p-6">
          <h3 className="font-display text-lg text-parchment mb-2">Impor Massal (CSV)</h3>
          <p className="text-parchment/45 text-xs mb-3">Satu baris per siswa: Nama,Kelas,NIS</p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={5}
            placeholder={'Ahmad Fauzi,XI IPA 1,10231\nSiti Nur,XI IPA 1,10232'}
            className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment outline-none focus:border-gold-500 font-mono text-sm"
          />
          <button
            onClick={importCsv}
            disabled={busy || !csvText.trim()}
            className="mt-3 rounded-xl border-2 border-gold-500 text-gold-400 font-semibold px-5 py-3 w-full disabled:opacity-40"
          >
            Impor Daftar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-600 bg-ink-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
          <h3 className="font-display text-lg text-parchment">
            Daftar Pemilih <span className="text-parchment/40 text-sm">({voters.length})</span>
          </h3>
          <div className="flex gap-3">
            <input
              placeholder="Cari nama / kelas / nomor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-ink-800 border border-ink-600 rounded-xl px-4 py-2 text-sm text-parchment outline-none focus:border-gold-500"
            />
            <button
              onClick={printSelected}
              disabled={!selectedToPrint.length}
              className="rounded-xl bg-gold-500 hover:bg-gold-400 text-ink-950 text-sm font-semibold px-4 py-2 disabled:opacity-30"
            >
              Cetak Kartu ({selectedToPrint.length})
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto no-print">
          <table className="w-full text-sm">
            <thead className="text-parchment/40 text-left sticky top-0 bg-ink-900">
              <tr>
                <th className="py-2 w-8"></th>
                <th className="py-2">No.</th>
                <th className="py-2">Nama</th>
                <th className="py-2">Kelas</th>
                <th className="py-2">Kode Kartu</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-ink-700/60">
                  <td className="py-2">
                    <input type="checkbox" checked={selectedToPrint.includes(v.id)} onChange={() => toggleSelect(v.id)} />
                  </td>
                  <td className="py-2 text-parchment/70">{v.no_antrean}</td>
                  <td className="py-2 text-parchment">{v.nama}</td>
                  <td className="py-2 text-parchment/60">{v.kelas}</td>
                  <td className="py-2 font-mono text-parchment/50">{v.kode_kartu}</td>
                  <td className="py-2">
                    {v.sudah_memilih ? (
                      <span className="text-sage-400 text-xs">Sudah memilih</span>
                    ) : (
                      <span className="text-parchment/35 text-xs">Belum</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PrintCard voters={printBatch} electionTitle={settings?.election_title} schoolYear={settings?.school_year} />
    </div>
  )
}
