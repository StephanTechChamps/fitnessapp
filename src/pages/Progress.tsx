import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'

export default function Progress() {
  const { workouts, loading } = useWorkouts()
  const [selected, setSelected] = useState<string>('')

  const exerciseNames = useMemo(() => {
    const names = new Set<string>()
    workouts.forEach((w) => w.exercises.forEach((ex) => names.add(ex.name)))
    return Array.from(names).sort()
  }, [workouts])

  const chartData = useMemo(() => {
    if (!selected) return []
    return workouts
      .filter((w) => w.exercises.some((ex) => ex.name === selected))
      .map((w) => {
        const ex = w.exercises.find((e) => e.name === selected)!
        const maxWeight = Math.max(...ex.sets.map((s) => s.weightKg))
        const totalVolume = ex.sets.reduce((sum, s) => sum + s.reps * s.weightKg, 0)
        return {
          date: new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          weight: maxWeight,
          volume: Math.round(totalVolume),
        }
      })
      .reverse()
  }, [selected, workouts])

  const pb = chartData.length > 0 ? Math.max(...chartData.map((d) => d.weight)) : 0
  const sessions = chartData.length
  const lastWeight = chartData[chartData.length - 1]?.weight ?? 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-nav">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-[#1D1D1F] mb-5">Progress</h1>

        {exerciseNames.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <TrendingUp size={40} className="text-[#D2D2D7] mx-auto mb-3" />
            <p className="text-[#6E6E73] text-[15px]">Complete some workouts to see your progress.</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <label className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-2 block">
                Exercise
              </label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full bg-white rounded-xl px-4 py-3 text-[15px] text-[#1D1D1F] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
              >
                <option value="">Select an exercise…</option>
                {exerciseNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {selected && chartData.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Personal Best', value: `${pb} kg` },
                    { label: 'Sessions', value: sessions },
                    { label: 'Last Session', value: `${lastWeight} kg` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
                      <p className="text-[18px] font-bold text-[#1D1D1F]">{value}</p>
                      <p className="text-[11px] text-[#6E6E73]">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <p className="text-[14px] font-semibold text-[#1D1D1F] mb-3">Max Weight (kg)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6E6E73' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#0071E3"
                        strokeWidth={2.5}
                        dot={{ fill: '#0071E3', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-[14px] font-semibold text-[#1D1D1F] mb-3">Volume (reps × kg)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6E6E73' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="#34C759"
                        strokeWidth={2.5}
                        dot={{ fill: '#34C759', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {selected && chartData.length === 0 && (
              <p className="text-center text-[#6E6E73] py-10">No data for this exercise yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
