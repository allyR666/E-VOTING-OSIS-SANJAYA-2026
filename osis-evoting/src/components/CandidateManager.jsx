import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const empty = { no_urut: '', nama_ketua: '', nama_wakil: '', foto_url: '', foto_url_wakil: '', visi: '', misi: '' }

export default function CandidateManager({ candidates, refresh }) {
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)

  async function addCandidate(e) {
    e.preventDefault()
    if (!form.no_urut || !form.nama_ketua || !form.nama_wakil) return
    setBusy(true)
    await supabase.from('candidates').insert({ ...form, no_urut: Number(form.no_urut) })
    setForm(empty)
    setBusy(false)
    refresh()
  }

  async function removeCandidate(id) {
    if (!confirm('Hapus paslon ini?')) return
    await supabase.from('candidates').delete().eq('id', id)
    refresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={addCandidate} className="rounded-2xl border border-gray-200 bg-white p-6 grid md:grid-cols-2 gap-4">
        <h3 className="font-display text-lg text-ink-900 md:col-span-2">Tambah Pasangan Calon</h3>
        <input
          placeholder="Nomor urut"
          type="number"
          value={form.no_urut}
          onChange={(e) => setForm({ ...form, no_urut: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <div />
        <input
          placeholder="Nama calon ketua"
          value={form.nama_ketua}
          onChange={(e) => setForm({ ...form, nama_ketua: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <input
          placeholder="Nama calon wakil ketua"
          value={form.nama_wakil}
          onChange={(e) => setForm({ ...form, nama_wakil: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <input
          placeholder="URL foto ketua (opsional)"
          value={form.foto_url}
          onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <input
          placeholder="URL foto wakil (opsional)"
          value={form.foto_url_wakil}
          onChange={(e) => setForm({ ...form, foto_url_wakil: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
        />
        <textarea
          placeholder="Visi (opsional)"
          value={form.visi}
          onChange={(e) => setForm({ ...form, visi: e.target.value })}
          rows={3}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700 md:col-span-2"
        />
        <textarea
          placeholder="Misi (opsional)"
          value={form.misi}
          onChange={(e) => setForm({ ...form, misi: e.target.value })}
          rows={3}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700 md:col-span-2"
        />
        <button disabled={busy} className="md:col-span-2 rounded-xl bg-azure-700 hover:bg-azure-800 text-white font-semibold px-5 py-3">
          Simpan Paslon
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-5">
        {candidates.map((c) => (
          <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-4">
            <span className="seal-number w-12 h-12 text-lg shrink-0">{c.no_urut}</span>
            <div className="flex-1">
              <p className="font-display text-lg text-ink-900">{c.nama_ketua} &amp; {c.nama_wakil}</p>
              {c.visi && <p className="text-ink-900/45 text-sm mt-1 line-clamp-2">{c.visi}</p>}
            </div>
            <button onClick={() => removeCandidate(c.id)} className="text-merah-500 text-sm">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  )
}
