import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabaseClient'

// Pengaturan pemilihan (status, results_visible, nomor yang sedang dipanggil) — live
export function useSettings() {
  const [settings, setSettings] = useState(null)

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('election_settings').select('*').eq('id', 1).single()
    setSettings(data)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel('settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'election_settings' }, refresh)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [refresh])

  return { settings, refresh }
}

// Ringkasan jumlah pemilih (total / sudah / belum) — live
export function useSummary() {
  const [summary, setSummary] = useState({ total_pemilih: 0, sudah_memilih: 0, belum_memilih: 0 })

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('v_election_summary').select('*').single()
    if (data) setSummary(data)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel('voters-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voters' }, refresh)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [refresh])

  return { summary, refresh }
}

// Hasil per kandidat — live
export function useResults() {
  const [results, setResults] = useState([])

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('v_candidate_results').select('*').order('no_urut')
    setResults(data || [])
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel('votes-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, refresh)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [refresh])

  return { results, refresh }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState([])
  const refresh = useCallback(async () => {
    const { data } = await supabase.from('candidates').select('*').order('no_urut')
    setCandidates(data || [])
  }, [])
  useEffect(() => { refresh() }, [refresh])
  return { candidates, refresh }
}
