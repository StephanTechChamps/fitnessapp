import type { WgerExercise } from '../types'

const BASE = 'https://wger.de/api/v2'
const CACHE_KEY = 'wger_exercises_v3'
const CACHE_TTL = 24 * 60 * 60 * 1000

function readCache(): { data: WgerExercise[]; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(data: WgerExercise[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

function parseExercise(ex: any): WgerExercise | null {
  const name = ex.translations?.find((t: any) => t.language === 2)?.name ?? ex.name
  if (!name) return null
  return {
    id: ex.id,
    name,
    category: ex.category?.name ?? 'Other',
    imageUrl: ex.images?.[0]?.image ?? null,
  }
}

export async function fetchAllExercises(): Promise<WgerExercise[]> {
  const cached = readCache()
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

  const exercises: WgerExercise[] = []
  let url: string | null = `${BASE}/exerciseinfo/?format=json&language=2&limit=100&offset=0`

  while (url && exercises.length < 400) {
    const res = await fetch(url)
    if (!res.ok) break
    const data = await res.json()
    for (const ex of data.results) {
      const parsed = parseExercise(ex)
      if (parsed) exercises.push(parsed)
    }
    url = data.next ?? null
  }

  writeCache(exercises)
  return exercises
}

export async function searchExercises(query: string): Promise<WgerExercise[]> {
  if (query.trim().length < 2) return []
  try {
    const res = await fetch(
      `${BASE}/exercise/search/?term=${encodeURIComponent(query)}&language=english&format=json`
    )
    const data = await res.json()
    return (data.suggestions ?? []).slice(0, 20).map((s: any) => ({
      id: s.data.id,
      name: s.value,
      category: s.data.category ?? 'Other',
      imageUrl: s.data.image ?? null,
    }))
  } catch {
    return []
  }
}
