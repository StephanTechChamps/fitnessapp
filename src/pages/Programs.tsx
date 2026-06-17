import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '../data/programs'
import { totalSessions } from '../hooks/useProgramProgress'

export default function Programs() {
  const navigate = useNavigate()

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
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/program/${p.id}`)}
              className="w-full text-left py-5 flex items-center gap-4 border-b-[0.5px] border-[#E5E3DD]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[20px] font-light text-[#0F0F0E] lowercase leading-snug">
                  {p.name}
                </p>
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
              <ArrowRight size={14} className="text-[#B5B2AA] flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
