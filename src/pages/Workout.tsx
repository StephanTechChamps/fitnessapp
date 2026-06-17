import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckCircle2, Clock } from 'lucide-react'
import { useWorkout } from '../contexts/WorkoutContext'
import { useWorkouts } from '../hooks/useWorkouts'
import ExerciseCard from '../components/ExerciseCard'
import SetRow from '../components/SetRow'
import ExerciseDrawer from '../components/ExerciseDrawer'
import type { WgerExercise } from '../types'

function useTimer(startTime: number | undefined) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startTime) return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const s = (elapsed % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Workout() {
  const { workout, dispatch } = useWorkout()
  const { saveWorkout } = useWorkouts()
  const navigate = useNavigate()
  const timer = useTimer(workout?.startTime)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [swapFor, setSwapFor] = useState<number | null>(null)
  const [finishing, setFinishing] = useState(false)

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-4 px-6 pb-nav">
        <p className="text-[#6E6E73] text-[17px]">No active workout.</p>
        <button
          onClick={() => { dispatch({ type: 'START' }); }}
          className="bg-[#0071E3] text-white px-8 py-3 rounded-2xl text-[15px] font-semibold"
        >
          Start Workout
        </button>
      </div>
    )
  }

  async function finish() {
    if (!workout) return
    setFinishing(true)
    const completedSets = workout.exercises.reduce((n, ex) => n + ex.sets.filter(s => s.completed).length, 0)
    if (completedSets === 0 && workout.exercises.length === 0) {
      dispatch({ type: 'RESET' })
      navigate('/')
      return
    }
    await saveWorkout({
      name: workout.name,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Math.round((Date.now() - workout.startTime) / 60000),
      exercises: workout.exercises,
    })
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  function handleAddExercise(ex: WgerExercise) {
    dispatch({
      type: 'ADD_EXERCISE',
      exercise: { exerciseId: String(ex.id), name: ex.name, category: ex.category, imageUrl: ex.imageUrl },
    })
  }

  function handleSwap(ex: WgerExercise) {
    if (swapFor === null) return
    dispatch({
      type: 'SWAP_EXERCISE',
      index: swapFor,
      exercise: { exerciseId: String(ex.id), name: ex.name, category: ex.category, imageUrl: ex.imageUrl },
    })
    setSwapFor(null)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-nav">
      <div className="sticky top-0 z-10 bg-[#F5F5F7]/90 backdrop-blur-xl px-5 pt-14 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1D1D1F]">{workout.name}</h1>
          <div className="flex items-center gap-1 text-[#6E6E73] text-[13px]">
            <Clock size={13} />
            <span>{timer}</span>
          </div>
        </div>
        <button
          onClick={finish}
          disabled={finishing}
          className="flex items-center gap-1.5 bg-[#34C759] text-white px-4 py-2 rounded-xl text-[14px] font-semibold disabled:opacity-60"
        >
          <CheckCircle2 size={16} />
          Finish
        </button>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {workout.exercises.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm mt-2">
            <p className="text-[#6E6E73] text-[15px]">Tap + to add your first exercise</p>
          </div>
        )}

        {workout.exercises.map((ex, exIdx) => (
          <div key={`${ex.exerciseId}-${exIdx}`} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3">
              <ExerciseCard
                exercise={{ id: parseInt(ex.exerciseId) || 0, name: ex.name, category: ex.category, imageUrl: ex.imageUrl }}
                mode="workout"
                onSwap={() => { setSwapFor(exIdx); setDrawerOpen(true) }}
                onRemove={() => dispatch({ type: 'REMOVE_EXERCISE', index: exIdx })}
              />
            </div>

            <div className="px-3 pb-2 flex flex-col gap-1.5">
              {ex.sets.map((set, setIdx) => (
                <SetRow
                  key={setIdx}
                  setNumber={setIdx + 1}
                  set={set}
                  onChange={(patch) => dispatch({ type: 'UPDATE_SET', exerciseIndex: exIdx, setIndex: setIdx, patch })}
                  onToggle={() => dispatch({ type: 'TOGGLE_SET', exerciseIndex: exIdx, setIndex: setIdx })}
                />
              ))}
            </div>

            <div className="px-3 pb-3">
              <button
                onClick={() => dispatch({ type: 'ADD_SET', exerciseIndex: exIdx })}
                className="w-full py-2 rounded-xl bg-[#F5F5F7] text-[#0071E3] text-[14px] font-semibold"
              >
                + Add Set
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[5rem] right-5" style={{ bottom: 'calc(4.5rem + max(0.5rem, env(safe-area-inset-bottom)))' }}>
        <button
          onClick={() => { setSwapFor(null); setDrawerOpen(true) }}
          className="w-14 h-14 bg-[#0071E3] rounded-full flex items-center justify-center shadow-lg text-white active:bg-[#005BB5]"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      <ExerciseDrawer
        open={drawerOpen && swapFor === null}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleAddExercise}
        title="Add Exercise"
      />
      <ExerciseDrawer
        open={drawerOpen && swapFor !== null}
        onClose={() => { setDrawerOpen(false); setSwapFor(null) }}
        onSelect={handleSwap}
        filterCategory={swapFor !== null ? workout.exercises[swapFor]?.category : undefined}
        title="Swap Exercise"
      />
    </div>
  )
}
