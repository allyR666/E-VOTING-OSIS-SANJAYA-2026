import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SchoolSettings({ settings, refresh }) {
  const [form, setForm] = useState({
    school_name: '',
    organizer_name: '',
    school_address: '',
    school_logo_url: '',
    osis_logo_url: ''
  })
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setForm({
        school_name: settings.school_name || '',
        organizer_name: settings.organizer_name || '',
        school_address: settings.school_address || '',
        school_logo_url: settings.school_logo_url || '',
        osis_logo_url: settings.osis_logo_url || ''
      })
    }
  }, [settings])

  async function handleSave(e) {
    e.preventDefault()
    setBusy(true)
    await supabase.from('election_settings').update(form).eq('id', 1)
    setBusy(false)
    setSaved(true)
    refresh()
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="font-display text-lg text-ink-900 mb-1">Identitas Sekolah</h3>
        <p className="text-ink-900/45 text-sm mb-3">
          Tampil di footer semua halaman publik (Beranda, Bilik Suara, Layar Pemantauan).
        </p>

        <Field label="Nama Sekolah">
          <input
            value={form.school_name}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            placeholder="Contoh: SMK Negeri 1 Mataram"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
          />
        </Field>

        <Field label="Diselenggarakan oleh">
          <input
            value={form.organizer_name}
            onChange={(e) => setForm({ ...form, organizer_name: e.target.value })}
            placeholder="Contoh: OSIS SMK Negeri 1 Mataram"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
          />
        </Field>

        <Field label="Alamat Sekolah">
          <input
            value={form.school_address}
            onChange={(e) => setForm({ ...form, school_address: e.target.value })}
            placeholder="Jl. Contoh No. 1, Mataram, NTB"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
          />
        </Field>

        <Field label="URL Logo Sekolah (opsional)">
          <input
            value={form.school_logo_url}
            onChange={(e) => setForm({ ...form, school_logo_url: e.target.value })}
            placeholder="https://…/logo-sekolah.png"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
          />
        </Field>

        <Field label="URL Logo OSIS (opsional)">
          <input
            value={form.osis_logo_url}
            onChange={(e) => setForm({ ...form, osis_logo_url: e.target.value })}
            placeholder="https://…/logo-osis.png"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-ink-900 outline-none focus:border-azure-700"
          />
        </Field>

        <button disabled={busy} className="w-full rounded-xl bg-azure-700 hover:bg-azure-800 text-white font-semibold py-3">
          {busy ? 'Menyimpan…' : saved ? 'Tersimpan ✓' : 'Simpan Pengaturan'}
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="font-display text-lg text-ink-900 mb-4">Pratinjau Footer</h3>
        <div className="rounded-2xl bg-gradient-to-br from-azure-800 via-azure-700 to-gold-600 p-6">
          <div className="flex flex-wrap items-center gap-4 justify-center bg-white/10 rounded-xl p-5 backdrop-blur">
            {form.school_logo_url && (
              <img src={form.school_logo_url} alt="Logo Sekolah" className="w-12 h-12 object-contain rounded-lg bg-white/90 p-1" />
            )}
            {form.osis_logo_url && (
              <img src={form.osis_logo_url} alt="Logo OSIS" className="w-12 h-12 object-contain rounded-lg bg-white/90 p-1" />
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{form.school_name || 'Nama Sekolah'}</p>
              <p className="text-xs text-white/70">
                Diselenggarakan oleh {form.organizer_name || 'OSIS'}
                {form.school_address ? ` · ${form.school_address}` : ''}
              </p>
            </div>
          </div>
        </div>
        <p className="text-ink-900/40 text-xs mt-4">
          Tidak punya file logo online? Unggah dulu ke Google Drive / Imgur / Supabase Storage, lalu tempel tautan gambarnya (harus berakhiran .png atau .jpg dan bisa diakses publik).
        </p>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-ink-900/60 text-xs mb-1.5">{label}</label>
      {children}
    </div>
  )
}
