# e-Vote OSIS — Sistem Pemilihan Ketua & Wakil Ketua OSIS

Aplikasi pemilihan digital (React + Supabase) dengan tiga modul:

1. **`/admin`** — Panel panitia: kelola pemilih, cetak kartu coblos (QR code), panggil nomor antrean, kendalikan status pemilihan.
2. **`/kiosk`** — Bilik suara layar sentuh besar: siswa memasukkan kode kartu lalu mencoblos paslon.
3. **`/dashboard`** — Layar publik/proyektor: statistik partisipasi live, dan hasil akhir setelah diumumkan.

---

## 1. Instalasi

```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY dari Supabase Project Settings > API
npm run dev
```

## 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan seluruh isi `supabase/schema.sql`.
3. Buka **Authentication > Users** → tambahkan akun email/password untuk setiap panitia.
4. Salin `user_id` akun tersebut, lalu jalankan di SQL Editor:
   ```sql
   insert into admins (user_id, nama) values ('uuid-user-tadi', 'Nama Panitia');
   ```
5. Buka **Project Settings > API** → salin `Project URL` dan `anon public key` ke file `.env`.
6. (Baru) Di Panel Admin, buka tab **Identitas Sekolah** untuk mengisi nama sekolah, nama penyelenggara (mis. "OSIS SMK Negeri 1 Mataram"), alamat, serta tautan logo sekolah & logo OSIS — otomatis tampil di footer Beranda, Bilik Suara, dan Layar Pemantauan.

Catatan keamanan: tabel `votes` **tidak punya izin insert langsung** dari klien mana pun — satu-satunya jalan masuk suara adalah fungsi `cast_vote()` (SQL `security definer`), jadi siswa di kiosk tidak bisa memanipulasi data suara meski membuka DevTools sekalipun.

## 3. Alur Hari-H

1. Panitia login di `/admin` → tab **Kandidat**: masukkan seluruh paslon.
2. Tab **Data Pemilih**: tambah satu per satu atau impor CSV massal (`Nama,Kelas,NIS`).
3. Centang siswa yang kartunya mau dicetak → **Cetak Kartu** (tiap kartu punya QR + kode unik, 2 kartu per baris siap digunting).
4. Tab **Kontrol Pemilihan** → ubah status ke **Sedang Berlangsung**.
5. Tab **Panggil & Antrean**: tekan **Panggil Nomor Berikutnya** setiap kali giliran siswa — tampilkan layar ini di proyektor ruang tunggu agar siswa tahu gilirannya.
6. Siswa menuju kiosk (`/kiosk`), memasukkan/memindai kode di kartunya, memilih paslon di layar sentuh besar, konfirmasi, selesai.
7. Layar `/dashboard` ditampilkan di aula: jumlah pemilih, sudah/belum memilih, bar partisipasi — semua real-time.
8. Setelah pemilih terakhir selesai → tab **Kontrol Pemilihan** → ubah status ke **Ditutup**, lalu aktifkan **Tampilkan hasil di layar publik**. Persentase per paslon akan muncul dengan animasi di `/dashboard`.

## 4. Struktur Proyek

```
src/
  pages/AdminPanel.jsx     Panel panitia (login + tab)
  pages/VotingKiosk.jsx    Bilik suara sentuh
  pages/LiveDashboard.jsx  Layar publik/proyektor
  components/              BallotCard, PrintCard, VoterManager, CandidateManager, CallQueuePanel, ElectionControl
  lib/supabaseClient.js    Koneksi Supabase
  lib/useElection.js       Hook realtime (settings, summary, results, candidates)
supabase/schema.sql        Skema database, RLS, fungsi cast_vote(), realtime publication
```

---

## 5. Rekomendasi Implementasi

### Jaringan: online + semi-online
- **Skenario online penuh**: kiosk & admin terhubung ke internet sekolah, memakai Supabase cloud langsung — paling mudah dan cukup untuk kebanyakan sekolah.
- **Skenario semi-online (disarankan untuk hari-H)**: pasang **router/access point lokal khusus** untuk perangkat kiosk + admin + layar dashboard, terpisah dari jaringan umum sekolah, agar tidak terganggu pemakaian internet siswa lain. Selama router itu tetap tersambung ke internet (walau lewat tethering HP sebagai cadangan), Supabase cloud tetap bisa diakses dengan latensi rendah karena trafik lokal-ke-gateway cepat.
- **Jika ingin benar-benar bisa jalan tanpa internet sama sekali**: self-host Supabase (Docker) di satu laptop/mini-PC sebagai server lokal untuk hari itu, lalu setelah selesai, ekspor data (`pg_dump`) dan impor ke project Supabase cloud untuk arsip permanen. Ini didokumentasikan terpisah di [supabase.com/docs/guides/self-hosting](https://supabase.com/docs/guides/self-hosting) karena butuh sedikit konfigurasi tambahan (Docker, domain lokal).
- Siapkan **UPS/power bank** untuk router dan server selama voting berlangsung — mati listrik di tengah pemilihan adalah risiko terbesar acara seperti ini.

### Keamanan & integritas suara
- Satu kartu = satu kode unik = satu suara (dijaga lewat `unique index` di `votes.voter_ref` dan pengecekan di fungsi `cast_vote`).
- Jangan pernah menaruh `service_role key` Supabase di kode frontend — panel admin memakai Supabase Auth + RLS, bukan kunci rahasia.
- Pertimbangkan menonaktifkan clipboard/DevTools di kiosk dengan mode kios browser (Chrome `--kiosk`) agar siswa tidak iseng membuka tab lain.
- Cadangkan (backup) database sebelum dan sesudah pemilihan (`Database > Backups` di dashboard Supabase).

### Pengalaman pengguna
- Tambahkan mode **kios tanpa mouse/keyboard** — Chrome dengan flag `--kiosk --touch-events=enabled` di layar sentuh, dan auto-refresh jika idle terlalu lama supaya layar selalu kembali ke halaman "Masukkan kode kartu".
- Untuk aksesibilitas, tambahkan opsi ukuran font lebih besar / mode kontras tinggi di kiosk bagi siswa dengan gangguan penglihatan ringan.
- Jika ingin memindai kartu benar-benar dengan scanner QR fisik (bukan mengetik manual), scanner USB umumnya otomatis "mengetik" hasil pindai ke kolom input — sehingga form yang sudah ada saat ini kompatibel tanpa perubahan.

### Setelah pemilihan
- Ekspor tabel `votes` dan `voters` sebagai arsip resmi hasil pemilihan (untuk keperluan berita acara OSIS/pembina).
- Simpan tangkapan layar `/dashboard` saat hasil diumumkan sebagai dokumentasi resmi.
- Nonaktifkan akun admin sementara (atau ganti password) setelah acara selesai.

### Pengembangan lanjutan (opsional)
- Tambahkan halaman **profil visi-misi calon** yang bisa dibuka siswa sebelum hari-H (data `visi`/`misi` sudah tersedia di skema, tinggal dibuatkan halaman publik).
- Tambahkan **mode antrean otomatis** dengan panggilan suara (Web Speech API `speechSynthesis`) saat admin menekan "Panggil Nomor Berikutnya".
- Tambahkan grafik pie/donat perbandingan antar paslon di dashboard menggunakan `recharts` (sudah termasuk di `package.json`) jika ingin variasi visual selain bar.
