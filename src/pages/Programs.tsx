import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '../data/programs'
import { totalSessions, useProgramProgress } from '../hooks/useProgramProgress'

const PROGRAM_ACCENT: Record<string, string> = {
  buff_dudes:   '#F5A623',
  phul:         '#AF7AE3',
  build_muscle: '#4CD964',
}

export default function Programs() {
  const navigate = useNavigate()
  const { progress } = useProgramProgress()

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-nav apex-page">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#B5B2AA] mb-2">
          Training
        </p>
        <h1 className="text-[44px] font-extralight lowercase tracking-[0.01em] leading-[1.05] text-[#0F0F0E]">
          programs
        </h1>
      </div>

      {/* Programs list */}
      <div className="px-6 apex-stagger">
        {PROGRAMS.map((p) => {
          const total = totalSessions(p.id)
          const daysPerWeek = p.daysPerWeek ?? Math.max(...p.phases.map((ph) => ph.days.length))
          const accent = PROGRAM_ACCENT[p.id] ?? '#636158'
          const isActive = progress?.programId === p.id
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/program/${p.id}`)}
              className="w-full text-left py-5 flex items-center gap-4 border-b-[0.5px] border-[#E5E3DD]"
              style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 16 }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[20px] font-light text-[#0F0F0E] lowercase leading-snug">
                    {p.name}
                  </p>
                  {isActive && (
                    <span
                      className="text-[9px] font-medium uppercase tracking-[0.14em] px-2 py-0.5"
                      style={{ background: accent, color: '#0F0F0E' }}
                    >
                      active
                    </span>
                  )}
                </div>
                {p.fullName && p.fullName !== p.name && (
                  <p className="text-[13px] font-light text-[#636158] lowercase mt-0.5">
                    {p.fullName}
                  </p>
                )}
                <p className="text-[11px] font-light text-[#B5B2AA] tracking-[0.03em] mt-1.5">
                  {daysPerWeek} days/week
                  {total !== null ? ` · ${total} sessions` : ' · ongoing'}
                  {p.author ? ` · ${p.author}` : ''}
                </p>
              </div>
              <ArrowRight size={14} style={{ color: accent, flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
