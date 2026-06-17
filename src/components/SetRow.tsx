import { Check } from 'lucide-react'
import type { WorkoutSet } from '../types'

interface Props {
  setNumber: number
  set: WorkoutSet
  onChange: (patch: Partial<WorkoutSet>) => void
  onToggle: () => void
}

export default function SetRow({ setNumber, set, onChange, onToggle }: Props) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
        set.completed ? 'bg-[#F0FDF4]' : 'bg-[#F5F5F7]'
      }`}
    >
      <span className="w-5 text-center text-[13px] font-semibold text-[#6E6E73] flex-shrink-0">
        {setNumber}
      </span>

      <div className="flex-1 flex gap-2">
        <label className="flex-1 flex flex-col items-center">
          <input
            type="number"
            inputMode="numeric"
            value={set.reps}
            min={1}
            onChange={(e) => onChange({ reps: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-full text-center text-[15px] font-semibold bg-white rounded-lg py-1.5 border border-[#D2D2D7] focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
          />
          <span className="text-[10px] text-[#6E6E73] mt-0.5">reps</span>
        </label>

        <label className="flex-1 flex flex-col items-center">
          <input
            type="number"
            inputMode="decimal"
            value={set.weightKg}
            min={0}
            step={2.5}
            onChange={(e) => onChange({ weightKg: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="w-full text-center text-[15px] font-semibold bg-white rounded-lg py-1.5 border border-[#D2D2D7] focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
          />
          <span className="text-[10px] text-[#6E6E73] mt-0.5">kg</span>
        </label>
      </div>

      <button
        onClick={onToggle}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
          set.completed
            ? 'bg-[#34C759] text-white'
            : 'bg-white border border-[#D2D2D7] text-[#D2D2D7]'
        }`}
      >
        <Check size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
