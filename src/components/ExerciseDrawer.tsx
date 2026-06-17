import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { fetchAllExercises, searchExercises } from '../lib/wger'
import type { WgerExercise } from '../types'
import ExerciseCard from './ExerciseCard'

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Calves']

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (ex: WgerExercise) => void
  filterCategory?: string
  title?: string
}

export default function ExerciseDrawer({ open, onClose, onSelect, filterCategory, title = 'Add Exercise' }: Props) {
  const [exercises, setExercises] = useState<WgerExercise[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(filterCategory ?? 'All')
  const [loading, setLoading] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetchAllExercises().then((data) => {
      setExercises(data)
      setLoading(false)
    })
  }, [open])

  useEffect(() => {
    if (!query.trim()) return
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      const results = await searchExercises(query)
      if (results.length > 0) setExercises(results)
    }, 400)
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [query])

  const filtered = exercises.filter((ex) => {
    const matchQuery = !query.trim() || ex.name.toLowerCase().includes(query.toLowerCase())
    const matchCat = category === 'All' || ex.category === category
    return matchQuery && matchCat
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[18px] font-bold text-[#1D1D1F]">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-[#F5F5F7] text-[#6E6E73]">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl px-3 py-2">
            <Search size={16} className="text-[#6E6E73] flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search exercises…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-[15px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#6E6E73]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                category === cat
                  ? 'bg-[#0071E3] text-white'
                  : 'bg-[#F5F5F7] text-[#6E6E73]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={28} className="animate-spin text-[#0071E3]" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#6E6E73] py-12">No exercises found</p>
          ) : (
            filtered.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                mode="library"
                onSelect={(e) => { onSelect(e); onClose() }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
