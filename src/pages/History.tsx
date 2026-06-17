import { useState } from 'react'
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function History() {
  const { workouts, loading } = useWorkouts()
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const workoutDates = new Set(workouts.map((w) => w.date))

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null
    const day = i - firstDay + 1
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { day, dateStr, hasWorkout: workoutDates.has(dateStr) }
  })

  const today = new Date().toISOString().split('T')[0]

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-nav">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-[#1D1D1F] mb-5">History</h1>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-xl bg-[#F5F5F7] text-[#6E6E73]">
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-[16px] text-[#1D1D1F]">
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-2 rounded-xl bg-[#F5F5F7] text-[#6E6E73]">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-[#6E6E73] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              if (!cell) return <div key={i} />
              const isToday = cell.dateStr === today
              return (
                <div
                  key={cell.dateStr}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[13px] font-medium relative ${
                    isToday
                      ? 'bg-[#0071E3] text-white'
                      : cell.hasWorkout
                      ? 'bg-[#E8F4FF] text-[#0071E3]'
                      : 'text-[#1D1D1F]'
                  }`}
                >
                  {cell.day}
                  {cell.hasWorkout && !isToday && (
                    <div className="w-1 h-1 rounded-full bg-[#0071E3] absolute bottom-1" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <h2 className="text-[17px] font-bold text-[#1D1D1F] mb-3">All Workouts</h2>
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-[#6E6E73] text-[15px]">No workouts yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {workouts.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={18} className="text-[#0071E3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1D1D1F]">{w.name}</p>
                    <p className="text-[13px] text-[#6E6E73]">
                      {new Date(w.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {w.durationMinutes ? ` · ${w.durationMinutes} min` : ''}
                    </p>
                  </div>
                </div>
                {w.exercises.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 pl-12">
                    {w.exercises.slice(0, 4).map((ex, i) => (
                      <span key={i} className="text-[11px] bg-[#F5F5F7] text-[#6E6E73] px-2 py-0.5 rounded-full">
                        {ex.name}
                      </span>
                    ))}
                    {w.exercises.length > 4 && (
                      <span className="text-[11px] text-[#6E6E73]">+{w.exercises.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
