-- ============================================================
-- SKEMA DATABASE E-VOTING KETUA & WAKIL KETUA OSIS
-- Jalankan di Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Bersihkan (opsional, hanya untuk instalasi ulang)
-- drop table if exists votes, voters, candidates, election_settings cascade;

-- ---------- 1. Pengaturan Pemilihan (satu baris global) ----------
create table if not exists election_settings (
  id int primary key default 1,
  election_title text not null default 'Pemilihan Ketua & Wakil Ketua OSIS',
  school_year text not null default '2026/2027',
  status text not null default 'draft' check (status in ('draft','ongoing','ended')),
  results_visible boolean not null default false,
  current_call_number int, -- nomor antrean yang sedang dipanggil ke kiosk
  -- Identitas sekolah / penyelenggara, ditampilkan di footer semua halaman publik
  school_name text default 'Nama Sekolah',
  organizer_name text default 'OSIS',
  school_address text default '',
  school_logo_url text default '',
  osis_logo_url text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into election_settings (id) values (1) on conflict (id) do nothing;

-- Migrasi aman untuk instalasi lama (kolom identitas sekolah ditambahkan belakangan)
alter table election_settings add column if not exists school_name text default 'Nama Sekolah';
alter table election_settings add column if not exists organizer_name text default 'OSIS';
alter table election_settings add column if not exists school_address text default '';
alter table election_settings add column if not exists school_logo_url text default '';
alter table election_settings add column if not exists osis_logo_url text default '';

-- ---------- 2. Kandidat (Paslon) ----------
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  no_urut int not null unique,
  nama_ketua text not null,
  nama_wakil text not null,
  kelas_ketua text,
  kelas_wakil text,
  foto_url text,          -- foto ketua
  foto_url_wakil text,    -- foto wakil ketua
  visi text,
  misi text,
  created_at timestamptz not null default now()
);

-- ---------- 3. Pemilih (Daftar Siswa) ----------
create table if not exists voters (
  id uuid primary key default gen_random_uuid(),
  no_antrean int not null unique,       -- nomor urut pemilih, dipanggil admin
  nama text not null,
  kelas text not null,
  nis text unique,
  kode_kartu text not null unique,      -- kode unik dicetak di kartu (dipindai/diketik di kiosk)
  sudah_memilih boolean not null default false,
  waktu_memilih timestamptz,
  kartu_dicetak boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 4. Suara (satu baris per suara masuk, anonim terhadap kandidat) ----------
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id),
  voter_ref uuid not null references voters(id), -- dipakai HANYA untuk cegah dobel & audit, bukan untuk buka siapa pilih siapa di UI
  created_at timestamptz not null default now()
);
-- Pastikan satu pemilih hanya submit satu suara
create unique index if not exists one_vote_per_voter on votes(voter_ref);

-- ---------- Fungsi: submit suara secara atomik ----------
create or replace function cast_vote(p_kode_kartu text, p_candidate_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_voter voters;
  v_status text;
begin
  select status into v_status from election_settings where id = 1;
  if v_status <> 'ongoing' then
    return json_build_object('success', false, 'message', 'Pemilihan belum dibuka atau sudah ditutup.');
  end if;

  select * into v_voter from voters where kode_kartu = p_kode_kartu for update;

  if v_voter.id is null then
    return json_build_object('success', false, 'message', 'Kode kartu tidak ditemukan.');
  end if;

  if v_voter.sudah_memilih then
    return json_build_object('success', false, 'message', 'Kartu ini sudah digunakan untuk memilih.');
  end if;

  insert into votes (candidate_id, voter_ref) values (p_candidate_id, v_voter.id);

  update voters set sudah_memilih = true, waktu_memilih = now()
    where id = v_voter.id;

  return json_build_object('success', true, 'message', 'Suara berhasil disimpan. Terima kasih!');
end;
$$;

-- ---------- 5. Admin (akun panitia yang boleh mengelola data) ----------
-- Buat akun login di Supabase Authentication > Users terlebih dahulu,
-- lalu daftarkan uid-nya di sini agar diberi hak akses admin.
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------- Row Level Security ----------
alter table election_settings enable row level security;
alter table candidates enable row level security;
alter table voters enable row level security;
alter table votes enable row level security;
alter table admins enable row level security;

-- Baca publik (untuk dashboard live & kiosk menampilkan kandidat)
drop policy if exists "public read settings" on election_settings;
create policy "public read settings" on election_settings for select using (true);

drop policy if exists "public read candidates" on candidates;
create policy "public read candidates" on candidates for select using (true);

drop policy if exists "public read voters status" on voters;
create policy "public read voters status" on voters for select using (true);

-- Tulis hanya untuk admin terdaftar
drop policy if exists "admin write settings" on election_settings;
create policy "admin write settings" on election_settings for update using (is_admin());

drop policy if exists "admin write candidates" on candidates;
create policy "admin write candidates" on candidates for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write voters" on voters;
create policy "admin write voters" on voters for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read own row" on admins;
create policy "admin read own row" on admins for select using (auth.uid() = user_id);

-- Catatan: tabel votes TIDAK punya policy insert untuk klien mana pun.
-- Satu-satunya jalan masuk suara adalah fungsi cast_vote() (security definer) di atas,
-- sehingga siswa di kiosk tidak bisa insert baris votes secara langsung/curang.

-- ---------- View agregat untuk Live Dashboard ----------
create or replace view v_election_summary as
select
  (select count(*) from voters) as total_pemilih,
  (select count(*) from voters where sudah_memilih) as sudah_memilih,
  (select count(*) from voters where not sudah_memilih) as belum_memilih;

create or replace view v_candidate_results as
select
  c.id, c.no_urut, c.nama_ketua, c.nama_wakil, c.foto_url, c.foto_url_wakil,
  count(v.id) as jumlah_suara
from candidates c
left join votes v on v.candidate_id = c.id
group by c.id
order by c.no_urut;

-- ---------- Realtime ----------
-- Dibungkus pengecekan supaya aman dijalankan berkali-kali (tidak error jika tabel
-- sudah pernah ditambahkan ke publication sebelumnya).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'voters'
  ) then
    alter publication supabase_realtime add table voters;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'votes'
  ) then
    alter publication supabase_realtime add table votes;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'election_settings'
  ) then
    alter publication supabase_realtime add table election_settings;
  end if;
end $$;
