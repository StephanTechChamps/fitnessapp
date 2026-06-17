import { useNavigate } from 'react-router-dom'
import { Plus, Flame, Dumbbell, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useWorkouts } from '../hooks/useWorkouts'
import { useWorkout } from '../contexts/WorkoutContext'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const { workouts, loading } = useWorkouts()
  const { dispatch } = useWorkout()
  const navigate = useNavigate()

  const name = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'

  const thisWeek = workouts.filter((w) => {
    const diff = (Date.now() - new Date(w.date).getTime()) / 86400000
    return diff <= 7
  }).length

  function startWorkout() {
    dispatch({ type: 'START' })
    navigate('/workout')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-nav">
      <div className="px-5 pt-14 pb-6">
        <p className="text-[#6E6E73] text-[15px]">{greeting()},</p>
        <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight capitalize">{name} 👋</h1>
      </div>

      <div className="px-5 mb-5">
        <button
          onClick={startWorkout}
          className="w-full bg-[#0071E3] text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-[17px] font-semibold shadow-md active:bg-[#005BB5] transition-colors"
        >
          <Plus size={22} strokeWidth={2.5} />
          Start Workout
        </button>
      </div>

      <div className="px-5 mb-6 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
            <Flame size={20} className="text-orange-500" />
          </div>
          <p className="text-[26px] font-bold text-[#1D1D1F]">{thisWeek}</p>
          <p className="text-[13px] text-[#6E6E73]">This week</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
            <Dumbbell size={20} className="text-[#0071E3]" />
          </div>
          <p className="text-[26px] font-bold text-[#1D1D1F]">{workouts.length}</p>
          <p className="text-[13px] text-[#6E6E73]">Total sessions</p>
        </div>
      </div>

      <div className="px-5">
        <h2 className="text-[17px] font-bold text-[#1D1D1F] mb-3">Recent Workouts</h2>
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-[#6E6E73] text-[15px]">No workouts yet. Hit Start to begin!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {workouts.slice(0, 5).map((w) => (
              <div key={w.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center">
                <div className="flex-1">
                  <p className="font-semibold text-[15px] text-[#1D1D1F]">{w.name}</p>
                  <p className="text-[13px] text-[#6E6E73]">
                    {formatDate(w.date)} · {w.exercises.length} exercise{w.exercises.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[#D2D2D7]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
