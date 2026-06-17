import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useWorkouts } from '../hooks/useWorkouts'
import { useWorkout } from '../contexts/WorkoutContext'
import { useProgramProgress, useCompletedSessions, totalSessions } from '../hooks/useProgramProgress'
import { PROGRAMS, getProgram } from '../data/programs'

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const SCHEDULE_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function Dashboard() {
  const { user } = useAuth()
  const { workouts } = useWorkouts()
  const { dispatch } = useWorkout()
  const { progress } = useProgramProgress()
  const { completedFor, isComplete } = useCompletedSessions()
  const navigate = useNavigate()

  const name = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'
  const activeProgram = getProgram(progress?.programId) ?? PROGRAMS[0]
  const done = completedFor(activeProgram.id)
  const total = totalSessions(activeProgram.id)
  const pct = total ? Math.round((done / total) * 100) : null

  const phase = progress?.programId === activeProgram.id
    ? activeProgram.phases.find((p) => p.id === progress.phaseId)
    : activeProgram.phases[0]
  const curWeek = progress?.programId === activeProgram.id ? progress.week : 1
  const todayIndex = new Date().getDay()

  // Build Mon–Fri schedule
  const weekRows = activeProgram.schedule
    ? SCHEDULE_KEYS.slice(1, 6).map((key, i) => {
        const dayId = activeProgram.schedule![key]
        const isRest = !dayId || dayId === 'rest'
        const day = isRest ? null : phase?.days.find(
          (d) => `day_${d.day}` === dayId || d.day.toString() === dayId.replace('day_', '')
        )
        return { dayLabel: WEEK_DAYS[i + 1], dayIndex: i + 1, dayNum: day?.day ?? null, focus: day?.focus ?? 'Rest', isRest }
      })
    : (phase?.days ?? []).slice(0, 5).map((day, i) => ({
        dayLabel: WEEK_DAYS[i + 1],
        dayIndex: i + 1,
        dayNum: day.day,
        focus: day.focus,
        isRest: false,
      }))

  function startToday() {
    if (progress) {
      navigate(`/program/${progress.programId}/${progress.phaseId}/w/${progress.week}/d/${progress.dayNum}`)
    } else if (phase) {
      navigate(`/program/${activeProgram.id}/${phase.id}/w/1/d/${phase.days[0].day}`)
    } else {
      navigate('/programs')
    }
  }

  function startFreeSession() {
    dispatch({ type: 'START' })
    navigate('/workout')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-nav">
      {/* App bar */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4 border-b-[0.5px] border-[#E5E3DD]">
        <span className="text-[11px] font-medium text-[#0F0F0E] uppercase tracking-[0.2em]">FitLog</span>
        <span className="text-[11px] font-light text-[#B5B2AA] tracking-[0.05em] capitalize">{name}</span>
      </div>

      {/* Dark hero — program + progress */}
      <div className="bg-[#111110] px-6 py-8">
        <p className="t-eyebrow mb-3" style={{ color: '#4A4844' }}>Current Program</p>
        <h1 className="t-hero text-white mb-1">{activeProgram.name}</h1>
        {activeProgram.fullName && activeProgram.fullName !== activeProgram.name && (
          <p className="text-[14px] font-extralight text-[#636158] lowercase tracking-[0.01em]">
            {activeProgram.fullName.toLowerCase()}
          </p>
        )}
        <div className="mt-6">
          <div className="h-[1px] bg-[#2A2A28] relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-[1px] bg-[#FF5500]"
              style={{ width: `${pct ?? 0}%`, transition: 'width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-light text-[#4A4844] tracking-[0.05em]">{done} sessions</span>
            {pct !== null
              ? <span className="text-[10px] font-medium text-[#B5B2AA] tracking-[0.05em]">{pct}%</span>
              : <span className="text-[10px] font-light text-[#4A4844] tracking-[0.05em]">ongoing</span>}
          </div>
        </div>
      </div>

      {/* This week */}
      <div className="px-6 pt-6 pb-2">
        <p className="t-eyebrow mb-4">This Week</p>
        <div>
          {weekRows.map((row, i) => {
            const isDone = row.dayNum !== null && phase
              ? isComplete(activeProgram.id, phase.id, curWeek, row.dayNum)
              : false
            const isToday = row.dayIndex === todayIndex

            return (
              <button
                key={i}
                onClick={() => !row.isRest && row.dayNum && phase && navigate(`/program/${activeProgram.id}/${phase.id}/w/${curWeek}/d/${row.dayNum}`)}
                disabled={row.isRest}
                className={`w-full flex items-center py-4 border-b-[0.5px] border-[#E5E3DD] last:border-b-0 text-left ${row.isRest ? 'cursor-default' : ''} ${isDone ? 'opacity-40' : ''}`}
              >
                <span className="text-[10px] font-medium text-[#B5B2AA] uppercase tracking-[0.14em] w-10 flex-shrink-0">
                  {row.dayLabel}
                </span>
                <span className={`flex-1 text-[15px] font-light lowercase tracking-[0.01em] ${
                  isToday && !isDone ? 'text-[#FF5500]' : row.isRest ? 'text-[#B5B2AA]' : 'text-[#0F0F0E]'
                }`}>
                  {row.focus.toLowerCase()}
                </span>
                <span className={`text-[13px] font-light flex-shrink-0 ${isDone ? 'text-[#B5B2AA]' : isToday ? 'text-[#FF5500]' : 'text-[#B5B2AA]'}`}>
                  {isDone ? '✓' : isToday && !row.isRest ? '·' : row.isRest ? '–' : '○'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 pt-6 pb-4 flex flex-col gap-3">
        <button
          onClick={startToday}
          className="w-full bg-[#FF5500] text-white py-[18px] t-cta active:opacity-75 transition-opacity"
        >
          Start Today's Workout
        </button>
        <button
          onClick={() => navigate('/programs')}
          className="w-full bg-transparent border-[0.5px] border-[#0F0F0E] text-[#0F0F0E] py-[18px] t-cta active:opacity-75 transition-opacity"
        >
          View Full Program
        </button>
        <button
          onClick={startFreeSession}
          className="w-full bg-transparent text-[#B5B2AA] py-3 t-cta active:opacity-75 transition-opacity"
        >
          Free Session
        </button>
      </div>

      {/* Recent */}
      {workouts.length > 0 && (
        <div className="px-6 pt-2 pb-6">
          <p className="t-eyebrow mb-4">Recent</p>
          {workouts.slice(0, 4).map((w) => (
            <div key={w.id} className="flex items-center py-4 border-b-[0.5px] border-[#E5E3DD] last:border-b-0">
              <span className="text-[11px] font-light text-[#B5B2AA] w-12 flex-shrink-0 tracking-[0.03em]">
                {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <span className="flex-1 text-[14px] font-light text-[#0F0F0E] lowercase truncate px-4 tracking-[0.01em]">
                {w.name.toLowerCase()}
              </span>
              {w.durationMinutes && (
                <span className="text-[11px] font-light text-[#B5B2AA] flex-shrink-0">{w.durationMinutes}m</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
